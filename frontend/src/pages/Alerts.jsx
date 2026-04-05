import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Bell, AlertTriangle, Settings, History } from 'lucide-react';

const Alerts = () => {
  const { theme } = useTheme();
  const [thresholds, setThresholds] = useState({
    aqi: 150,
    pm25: 75,
    pm10: 150,
    no2: 100,
    so2: 75,
    o3: 70
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    push: true,
    sms: false
  });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    setTimeout(() => {
      setAlerts([
        { id: 1, type: 'warning', pollutant: 'PM2.5', value: 185, threshold: 75, area: 'Central Delhi', time: '2 hours ago', read: false },
        { id: 2, type: 'danger', pollutant: 'AQI', value: 312, threshold: 150, area: 'West Delhi', time: '5 hours ago', read: true },
        { id: 3, type: 'info', pollutant: 'NO₂', value: 45, threshold: 100, area: 'South Delhi', time: '1 day ago', read: true },
        { id: 4, type: 'warning', pollutant: 'PM10', value: 245, threshold: 150, area: 'East Delhi', time: '2 days ago', read: true },
        { id: 5, type: 'success', pollutant: 'O₃', value: 65, threshold: 70, area: 'New Delhi', time: '3 days ago', read: true },
      ]);
      setLoading(false);
    }, 500);
  };

  const handleThresholdChange = (pollutant, value) => {
    setThresholds(prev => ({
      ...prev,
      [pollutant]: parseInt(value)
    }));
  };

  const savePreferences = async () => {
    setLoading(true);
    setTimeout(() => {
      alert('Preferences saved successfully!');
      setLoading(false);
    }, 500);
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'danger': return '🔴';
      case 'warning': return '🟠';
      case 'info': return '🔵';
      case 'success': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
          <Bell className="w-8 h-8 mr-3" />
          Alert Subscriptions
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Configure pollution alerts and notification preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Alert Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alert Thresholds */}
          <div className={`p-6 rounded-2xl border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h2 className="text-xl font-semibold mb-6">Alert Thresholds</h2>
            <div className="space-y-6">
              {Object.entries(thresholds).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between">
                    <label className="font-medium">
                      {key.toUpperCase()} Threshold
                    </label>
                    <span className="font-bold">{value} {key === 'aqi' ? 'AQI' : key === 'pm25' || key === 'pm10' ? 'µg/m³' : 'ppb'}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={key === 'aqi' ? '500' : key === 'pm25' ? '250' : key === 'pm10' ? '400' : '200'}
                    value={value}
                    onChange={(e) => handleThresholdChange(key, e.target.value)}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0</span>
                    <span>Safe</span>
                    <span>Moderate</span>
                    <span>Unhealthy</span>
                    <span>Dangerous</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Area Selection */}
          <div className={`p-6 rounded-2xl border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h2 className="text-xl font-semibold mb-4">Alert Areas</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Select areas for which you want to receive alerts
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                'Central Delhi', 'New Delhi', 'South Delhi', 'West Delhi',
                'North Delhi', 'East Delhi', 'Dwarka', 'Rohini',
                'Karol Bagh', 'Paharganj', 'Hauz Khas', 'Saket',
                'Vasant Kunj', 'Rajouri Garden', 'Pitampura', 'Laxmi Nagar'
              ].map(area => (
                <label key={area} className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>{area}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Preferences & History */}
        <div className="space-y-6">
          {/* Notification Preferences */}
          <div className={`p-6 rounded-2xl border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              {Object.entries(notificationPrefs).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium capitalize">{key} Notifications</div>
                    <div className="text-sm text-gray-500">
                      {key === 'email' ? 'Send alerts to your email' :
                       key === 'push' ? 'Browser notifications' :
                       'SMS alerts (charges may apply)'}
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationPrefs(prev => ({
                      ...prev,
                      [key]: !prev[key]
                    }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      value 
                        ? 'bg-blue-600' 
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                      value ? 'translate-x-7' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={savePreferences}
              disabled={loading}
              className="w-full mt-6 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>

          {/* Recent Alerts */}
          <div className={`p-6 rounded-2xl border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {alerts.map(alert => (
                <div key={alert.id} className={`p-3 rounded-lg ${
                  !alert.read ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' :
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`w-5 h-5 ${
                        alert.type === 'danger' ? 'text-red-500' :
                        alert.type === 'warning' ? 'text-orange-500' :
                        alert.type === 'info' ? 'text-blue-500' :
                        'text-green-500'
                      }`} />
                      <div>
                        <div className="font-medium">
                          {alert.pollutant} Alert: {alert.value} {alert.pollutant === 'AQI' ? 'AQI' : 'µg/m³'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {alert.area} • {alert.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Summary */}
          <div className={`p-6 rounded-2xl border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h2 className="text-xl font-semibold mb-4">Alert Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Alerts Today</span>
                <span className="font-bold text-lg">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Critical Alerts</span>
                <span className="font-bold text-lg text-red-600">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Next Scheduled Check</span>
                <span className="font-bold">10 mins</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Subscription Status</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;