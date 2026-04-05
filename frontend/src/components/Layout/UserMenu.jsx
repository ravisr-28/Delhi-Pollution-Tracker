import React from 'react';
import { Link } from 'react-router-dom';

const UserMenu = () => {
  return (
    <div className="flex items-center gap-2">
      <Link
        to="/alerts"
        className="px-3 py-2 rounded-xl text-[13px] font-semibold text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
      >
        Alerts
      </Link>
      <Link
        to="/dashboard"
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[13px] font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
      >
        Dashboard
      </Link>
    </div>
  );
};

export default UserMenu;