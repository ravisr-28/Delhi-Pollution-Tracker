import React from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  Github,
  Twitter,
  Heart,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[#050a18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AQI Pro
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Real-time Delhi air quality monitoring with 3D visualization.
              Tracking pollution across Delhi NCR.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: "Dashboard", href: "/" },
                { name: "About", href: "/#about" },
                { name: "Contact", href: "/#contact" },
                { name: "Delhi AQI", href: "/globe" },
                { name: "Delhi Map", href: "/heatmap" },
                { name: "Analytics", href: "/analytics" },
                { name: "Health Advisory", href: "/advisory" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: "AQI Scale Guide", href: "/advisory" },
                { name: "Health Advisory", href: "/advisory" },
                { name: "API Documentation", href: "#" },
                { name: "Data Sources", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AQI Quick Reference */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
              AQI Scale
            </h3>
            <div className="space-y-2">
              {[
                { range: "0-50", label: "Good", color: "#00e400" },
                { range: "51-100", label: "Moderate", color: "#ffde33" },
                {
                  range: "101-150",
                  label: "Unhealthy (Sensitive)",
                  color: "#ff9933",
                },
                { range: "151-200", label: "Unhealthy", color: "#cc0033" },
                { range: "201-300", label: "Very Unhealthy", color: "#660099" },
                { range: "301+", label: "Hazardous", color: "#7e0023" },
              ].map((item) => (
                <div
                  key={item.range}
                  className="flex items-center gap-2 text-xs"
                >
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-400">
                    <span className="font-semibold text-gray-300">
                      {item.range}
                    </span>{" "}
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} AQI Pro. Real-time pollution monitoring
            for Delhi NCR.
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500" /> for cleaner air
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
