import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UserMenu = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex space-x-3">
        <Link
          to="/login"
          className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-gray-300"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-white/5 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
          {user.name?.charAt(0) || 'U'}
        </div>
        <div className="hidden md:block text-left">
          <div className="font-medium text-gray-200">{user.name || 'User'}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl border z-50 bg-[#0f1729] border-white/10 backdrop-blur-xl">
          <div className="py-1">
            <Link
              to="/alerts"
              className="block px-4 py-2 text-gray-300 hover:bg-white/5 transition-colors rounded-lg mx-1"
              onClick={() => setIsOpen(false)}
            >
              My Alerts
            </Link>
            <Link
              to="/profile"
              className="block px-4 py-2 text-gray-300 hover:bg-white/5 transition-colors rounded-lg mx-1"
              onClick={() => setIsOpen(false)}
            >
              Profile Settings
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="block px-4 py-2 text-gray-300 hover:bg-white/5 transition-colors rounded-lg mx-1"
                onClick={() => setIsOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            <div className="border-t border-white/5 my-1"></div>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-red-400 hover:bg-white/5 transition-colors rounded-lg mx-1"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;