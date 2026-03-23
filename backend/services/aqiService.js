const axios = require('axios');
const Aqi = require('../models/Aqi');

// Delhi district coordinates (approximate central points)
const delhiDistricts = [
  { name: 'Central Delhi', lat: 28.6304, lng: 77.2177 },
  { name: 'East Delhi', lat: 28.6273, lng: 77.3024 },
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'North Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'North East Delhi', lat: 28.7233, lng: 77.2904 },
  { name: 'North West Delhi', lat: 28.7196, lng: 77.1391 },
  { name: 'Shahdara', lat: 28.6842, lng: 77.2847 },
  { name: 'South Delhi', lat: 28.5244, lng: 77.1855 },
  { name: 'South East Delhi', lat: 28.5562, lng: 77.2761 },
  { name: 'South West Delhi', lat: 28.5921, lng: 77.0460 },
  { name: 'West Delhi', lat: 28.6517, lng: 77.1015 }
];

// Get AQI category based on value
const getAQICategory = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

// Fetch AQI from IQAir API
const fetchAQIFromIQAir = async (lat, lng) => {
  try {
    const response = await axios.get('https://api.airvisual.com/v2/nearest_city', {
      params: {
        lat,
        lon: lng,
        key: process.env.IQAIR_API_KEY
      }
    });

    const data = response.data.data;
    return {
      aqi: data.current.pollution.aqius,
      pollutants: {
        pm25: data.current.pollution.p2 || null,
        pm10: null,
        o3: null,
        no2: null,
        so2: null,
        co: null
      }
    };
  } catch (error) {
    console.error('IQAir API error:', error.message);
    // Return mock data if API fails
    return {
      aqi: Math.floor(Math.random() * 300) + 50,
      pollutants: {
        pm25: Math.floor(Math.random() * 200) + 20,
        pm10: Math.floor(Math.random() * 300) + 30,
        o3: Math.floor(Math.random() * 100) + 10,
        no2: Math.floor(Math.random() * 150) + 15,
        so2: Math.floor(Math.random() * 80) + 5,
        co: Math.floor(Math.random() * 50) + 2
      }
    };
  }
};

// Fetch and store AQI for all districts
const fetchAndStoreAQI = async () => {
  console.log('Fetching AQI data for all districts...');
  
  try {
    for (const district of delhiDistricts) {
      const aqiData = await fetchAQIFromIQAir(district.lat, district.lng);
      
      const newAQIData = new Aqi({
        district: district.name,
        aqi: aqiData.aqi,
        category: getAQICategory(aqiData.aqi),
        pollutants: aqiData.pollutants,
        coordinates: {
          lat: district.lat,
          lng: district.lng
        },
        timestamp: new Date()
      });

      await newAQIData.save();
      console.log(`AQI saved for ${district.name}: ${aqiData.aqi}`);
    }
    
    console.log('AQI data fetch completed');
  } catch (error) {
    console.error('Error fetching AQI data:', error);
  }
};

module.exports = {
  fetchAndStoreAQI,
  getAQICategory
};