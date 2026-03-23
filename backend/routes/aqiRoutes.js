const express = require('express');
const router = express.Router();
const AQIData = require('../models/Aqi');
const { delhiDistricts, worldCities } = require('../config/locations');

// @route   GET /api/aqi/latest
// @desc    Get latest AQI data for all districts
// @access  Public
router.get('/latest', async (req, res) => {
  try {
    // Get the latest AQI data for each district
    const latestData = await AQIData.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$district',
          aqi: { $first: '$aqi' },
          category: { $first: '$category' },
          color: { $first: '$color' },
          pollutants: { $first: '$pollutants' },
          weather: { $first: '$weather' },
          timestamp: { $first: '$timestamp' }
        }
      },
      {
        $project: {
          _id: 1,
          district: '$_id',
          aqi: 1,
          category: 1,
          color: 1,
          pollutants: 1,
          weather: 1,
          timestamp: 1
        }
      },
      {
        $sort: { aqi: -1 }
      }
    ]);

    res.json(latestData);

  } catch (error) {
    console.error('Error fetching latest AQI:', error);
    res.status(500).json({ 
      error: 'Failed to fetch AQI data',
      details: error.message 
    });
  }
});

// @route   GET /api/aqi/district/:districtName
// @desc    Get latest AQI data for a specific district
// @access  Public
router.get('/district/:districtName', async (req, res) => {
  try {
    const { districtName } = req.params;

    const data = await AQIData.findOne({ 
      district: districtName 
    }).sort({ timestamp: -1 });

    if (!data) {
      return res.status(404).json({ 
        error: 'No data found for this district' 
      });
    }

    res.json(data);

  } catch (error) {
    console.error('Error fetching district AQI:', error);
    res.status(500).json({ 
      error: 'Failed to fetch district data',
      details: error.message 
    });
  }
});

// @route   GET /api/aqi/history
// @desc    Get historical AQI data for a district
// @access  Public
router.get('/history', async (req, res) => {
  try {
    const { district, days = 7 } = req.query;

    if (!district) {
      return res.status(400).json({ 
        error: 'District name is required' 
      });
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const historicalData = await AQIData.find({
      district: district,
      timestamp: { $gte: daysAgo }
    }).sort({ timestamp: 1 });

    res.json({
      district,
      days: parseInt(days),
      dataPoints: historicalData.length,
      data: historicalData
    });

  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch historical data',
      details: error.message 
    });
  }
});

// @route   GET /api/aqi/districts
// @desc    Get list of all districts
// @access  Public
router.get('/districts', async (req, res) => {
  try {
    const districts = await AQIData.distinct('district');
    res.json({ districts });

  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch districts',
      details: error.message 
    });
  }
});

// @route   GET /api/aqi/summary
// @desc    Get summary statistics of AQI data
// @access  Public
router.get('/summary', async (req, res) => {
  try {
    const summary = await AQIData.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$district',
          latestAQI: { $first: '$aqi' },
          category: { $first: '$category' }
        }
      },
      {
        $group: {
          _id: null,
          totalDistricts: { $sum: 1 },
          averageAQI: { $avg: '$latestAQI' },
          maxAQI: { $max: '$latestAQI' },
          minAQI: { $min: '$latestAQI' },
          categoryBreakdown: {
            $push: {
              district: '$_id',
              aqi: '$latestAQI',
              category: '$category'
            }
          }
        }
      }
    ]);

    if (summary.length === 0) {
      return res.json({
        message: 'No AQI data available yet',
        totalDistricts: 0
      });
    }

    res.json(summary[0]);

  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ 
      error: 'Failed to fetch summary',
      details: error.message 
    });
  }
});

// @route   GET /api/aqi/worst
// @desc    Get districts with worst air quality
// @access  Public
router.get('/worst', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const worstDistricts = await AQIData.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$district',
          aqi: { $first: '$aqi' },
          category: { $first: '$category' },
          color: { $first: '$color' },
          pollutants: { $first: '$pollutants' },
          timestamp: { $first: '$timestamp' }
        }
      },
      {
        $sort: { aqi: -1 }
      },
      {
        $limit: limit
      }
    ]);

    res.json(worstDistricts);

  } catch (error) {
    console.error('Error fetching worst districts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch worst districts',
      details: error.message 
    });
  }
});

module.exports = router;