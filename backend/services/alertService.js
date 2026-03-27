import nodemailer from 'nodemailer';
import User from '../models/User.js';
import Aqi from '../models/Aqi.js';

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email alert
const sendEmailAlert = async (user, district, aqi, category) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `⚠️ Air Quality Alert: ${district} - AQI ${aqi}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">Air Quality Alert</h2>
          <p>Dear ${user.name},</p>
          <p>The air quality in <strong>${district}</strong> has exceeded your alert threshold.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Current Air Quality</h3>
            <p style="font-size: 24px; margin: 10px 0;"><strong>AQI: ${aqi}</strong></p>
            <p style="color: #e74c3c; font-size: 18px;"><strong>${category}</strong></p>
          </div>
          
          <h4>Health Recommendations:</h4>
          <ul>
            ${getHealthRecommendations(aqi)}
          </ul>
          
          <p style="margin-top: 30px; color: #666;">
            Stay safe and take necessary precautions.<br>
            Delhi Pollution Tracker
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email alert sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Get health recommendations based on AQI
const getHealthRecommendations = (aqi) => {
  if (aqi <= 50) {
    return '<li>Air quality is satisfactory. Enjoy outdoor activities!</li>';
  } else if (aqi <= 100) {
    return '<li>Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.</li>';
  } else if (aqi <= 150) {
    return `
      <li>Reduce prolonged or heavy outdoor exertion</li>
      <li>Wear a mask if going outside</li>
      <li>Keep windows closed</li>
    `;
  } else if (aqi <= 200) {
    return `
      <li>Avoid prolonged outdoor activities</li>
      <li>Wear N95 masks when outside</li>
      <li>Use air purifiers indoors</li>
      <li>Keep windows and doors closed</li>
    `;
  } else if (aqi <= 300) {
    return `
      <li>Avoid all outdoor activities</li>
      <li>Keep children and elderly indoors</li>
      <li>Use air purifiers continuously</li>
      <li>Wear N95/N99 masks if you must go outside</li>
    `;
  } else {
    return `
      <li>Stay indoors at all times</li>
      <li>Avoid all physical activity</li>
      <li>Keep air purifiers running</li>
      <li>Consult a doctor if you experience respiratory issues</li>
    `;
  }
};

// Check and send alerts
const checkAndSendAlerts = async () => {
  try {
    console.log('Checking for alert triggers...');
    
    // Get all users with alerts enabled
    const users = await User.find({ 'alertPreferences.enabled': true });
    
    for (const user of users) {
      const { threshold, areas } = user.alertPreferences;
      const shouldEmailAlert = user.alertPreferences.email;
      const shouldPushAlert = user.alertPreferences.push;
      
      // If no specific areas, check all
      const districtsToCheck = areas && areas.length > 0 ? areas : [
        'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi',
        'North East Delhi', 'North West Delhi', 'Shahdara',
        'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'
      ];
      
      for (const district of districtsToCheck) {
        const latestAQI = await Aqi.findOne({ district })
          .sort({ timestamp: -1 })
          .limit(1);
        
        if (latestAQI && latestAQI.aqi >= threshold) {
          if (shouldEmailAlert) {
            await sendEmailAlert(user, district, latestAQI.aqi, latestAQI.category);
          }
          
          if (shouldPushAlert) {
            console.log(`Push notification would be sent to ${user.name}`);
          }
        }
      }
    }
    
    console.log('Alert check completed');
  } catch (error) {
    console.error('Error checking alerts:', error);
  }
};

export { checkAndSendAlerts, sendEmailAlert };