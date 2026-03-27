import axios from 'axios';
import Aqi from '../models/Aqi.js';
import { delhiDistricts } from '../config/locations.js';

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
const fetchAQIFromIQAir = async (lat, lon) => {
  try {
    const response = await axios.get('https://api.airvisual.com/v2/nearest_city', {
      params: {
        lat,
        lon,
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
    throw new Error(`Failed to fetch AQI data: ${error.message}`);
  }
};

// Fetch and store AQI for all districts
const fetchAndStoreAQI = async () => {
  console.log('Fetching AQI data for all districts...');
  
  try {
    for (const district of delhiDistricts) {
      const aqiData = await fetchAQIFromIQAir(district.lat, district.lon);
      
      const newAQIData = new Aqi({
        district: district.name,
        aqi: aqiData.aqi,
        category: getAQICategory(aqiData.aqi),
        pollutants: aqiData.pollutants,
        coordinates: {
          lat: district.lat,
          lon: district.lon
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

export { fetchAndStoreAQI, getAQICategory };