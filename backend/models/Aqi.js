const mongoose = require('mongoose');

const aqiDataSchema = new mongoose.Schema({
  district: {
    type: String,
    required: true
  },
  aqi: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  pollutants: {
    pm25: Number,
    pm10: Number,
    no2: Number,
    o3: Number,
    so2: Number,
    co: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
aqiDataSchema.index({ district: 1, timestamp: -1 });

module.exports = mongoose.model('Aqi', aqiDataSchema);