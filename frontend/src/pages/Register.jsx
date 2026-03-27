import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, User, Mail, Lock, Shield } from 'lucide-react';

const Register = () => {
  const { theme } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    acceptTerms: false,
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setRegisterError('');
    
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };
    
    const result = await register(userData);
    
    if (result.success) {
      navigate('/login?registered=true');
    } else {
      setRegisterError(result.message || 'Registration failed. Please try again.');
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join thousands of users monitoring air quality
          </p>
        </div>

        {/* Registration Form */}
        <div className={`mt-8 rounded-2xl border p-8 ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {registerError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                <div className="flex items-center">
                  <span className="text-red-600 dark:text-red-400 text-sm">
                    ⚠️ {registerError}
                  </span>
                </div>
              </div>
            )}

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm ${
                  errors.name 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : theme === 'dark'
                      ? 'border-gray-700 bg-gray-900 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : theme === 'dark'
                      ? 'border-gray-700 bg-gray-900 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm ${
                  errors.password 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : theme === 'dark'
                      ? 'border-gray-700 bg-gray-900 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="Create a strong password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.acceptTerms}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                >
                <UserPlus className="w-5 h-5 mr-2" />
                {loading ? 'Creating account...' : 'Create Account'}
               </button>
            </div>
          </form>


          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className={`mt-8 rounded-2xl border p-6 ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">What you get with a free account:</h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">Real-time pollution alerts via email</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">Personalized health recommendations</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">Save multiple locations for monitoring</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">Access 30-day historical data</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">Export data to CSV/PDF</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">Priority customer support</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;