import React from 'react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../../api';

const SocialLogin = () => {
  return (
    <div className="mt-8">
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-[#050a18] px-4 text-gray-500 font-black">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.a
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
          whileTap={{ scale: 0.98 }}
          href={`${API_BASE_URL}/auth/google`}
          className="flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 transition-all group cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.273 0 3.191 2.691 1.245 6.655l4.021 3.11z"/>
            <path fill="#4285F4" d="M24 12.273c0-.873-.073-1.709-.218-2.527H12v4.818h6.745c-.291 1.564-1.182 2.891-2.509 3.782l3.909 3.036C22.427 19.345 24 16.036 24 12.273z"/>
            <path fill="#34A853" d="M16.236 18.345c-1.227.818-2.8 1.309-4.236 1.309-2.909 0-5.382-1.964-6.264-4.636l-4.021 3.11C3.664 22.091 7.555 24.545 12 24.545c3.345 0 6.136-1.091 8.182-2.982l-3.945-3.218z"/>
            <path fill="#FBBC05" d="M5.736 15.018A7.067 7.067 0 0 1 5.318 12c0-1.055.164-2.073.418-3.036L1.715 5.854A11.97 11.97 0 0 0 0 12c0 2.255.618 4.364 1.709 6.182l4.027-3.164z"/>
          </svg>
          <span className="text-xs font-black text-gray-300 group-hover:text-white uppercase tracking-widest">Google</span>
        </motion.a>

        <motion.a
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
          whileTap={{ scale: 0.98 }}
          href={`${API_BASE_URL}/auth/github`}
          className="flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 transition-all group cursor-pointer"
        >
          <svg className="w-5 h-5 fill-gray-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          <span className="text-xs font-black text-gray-300 group-hover:text-white uppercase tracking-widest">GitHub</span>
        </motion.a>
      </div>
    </div>
  );
};

export default SocialLogin;