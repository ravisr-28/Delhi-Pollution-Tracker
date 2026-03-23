const cron = require('node-cron');
const axios = require('axios');
const Aqi = require('../models/Aqi');
const { delhiDistricts, worldCities } = require('../config/locations');

// Function to get AQI category and color
const getAQICategory = (aqi) => {
  if (aqi <= 50) return { category: 'Good', color: '#00e400' };
  if (aqi <= 100) return { category: 'Moderate', color: '#ffff00' };
  if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', color: '#ff7e00' };
  if (aqi <= 200) return { category: 'Unhealthy', color: '#ff0000' };
  if (aqi <= 300) return { category: 'Very Unhealthy', color: '#8f3f97' };
  return { category: 'Hazardous', color: '#7e0023' };
};

// Convert OpenWeatherMap AQI (1-5) to US AQI (0-500)
const convertToUSAQI = (components) => {
  const pm25 = components.pm2_5;
  const breakpoints = [
    { cLow: 0, cHigh: 12.0, aqiLow: 0, aqiHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, aqiLow: 51, aqiHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, aqiLow: 101, aqiHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, aqiLow: 151, aqiHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, aqiLow: 201, aqiHigh: 300 },
    { cLow: 250.5, cHigh: 500.4, aqiLow: 301, aqiHigh: 500 }
  ];

  let aqi = 0;
  for (let bp of breakpoints) {
    if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
      aqi = ((bp.aqiHigh - bp.aqiLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.aqiLow;
      break;
    }
  }
  return Math.round(aqi);
};

// Fetch AQI data for a location
const fetchLocationAQI = async (loc) => {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
      params: {
        lat: loc.lat,
        lon: loc.lon,
        appid: process.env.OPENWEATHER_API_KEY
      },
      timeout: 10000
    });

    const data = response.data.list[0];
    const components = data.components;
    const aqi = convertToUSAQI(components);
    const { category, color } = getAQICategory(aqi);

    return {
      district: loc.name,
      aqi: aqi,
      category: category,
      color: color,
      pollutants: {
        pm25: components.pm2_5,
        pm10: components.pm10,
        no2: components.no2,
        o3: components.o3,
        so2: components.so2,
        co: components.co
      },
      timestamp: new Date()
    };
  } catch (error) {
    console.error(`Error fetching AQI for ${loc.name}:`, error.message);
    return null;
  }
};

// Main function to fetch and store AQI data
const fetchAndStoreAQI = async () => {
  try {
    const allLocations = [...delhiDistricts];
    console.log(`Starting Delhi AQI sync for ${allLocations.length} locations...`);
    
    // Batch processing to respect API limits
    const batchSize = 5;
    const allResults = [];
    
    for (let i = 0; i < allLocations.length; i += batchSize) {
      const batch = allLocations.slice(i, i + batchSize);
      const promises = batch.map(loc => fetchLocationAQI(loc));
      const results = await Promise.all(promises);
      allResults.push(...results.filter(r => r !== null));
      
      // Minor throttle between batches
      if (i + batchSize < allLocations.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    if (allResults.length > 0) {
      await Aqi.insertMany(allResults);
      console.log(`✅ Successfully stored AQI snapshots for ${allResults.length} locations`);
    }
  } catch (error) {
    console.error('Error during Delhi AQI sync:', error);
  }
};

// Schedule to run every hour
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled Delhi AQI fetch...');
  fetchAndStoreAQI();
});

// Run immediately on startup
fetchAndStoreAQI();

console.log('Delhi AQI fetch scheduler active (hourly)');

module.exports = { fetchAndStoreAQI };
