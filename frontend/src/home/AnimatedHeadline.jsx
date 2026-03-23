import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Typing animation hook
function useTypingAnimation(texts, typingSpeed = 70, deletingSpeed = 35, pause = 2500) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    let timeout;

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
    } else {
      timeout = setTimeout(() => {
        setText(
          isDeleting
            ? current.substring(0, text.length - 1)
            : current.substring(0, text.length + 1)
        );
      }, isDeleting ? deletingSpeed : typingSpeed);
    }
    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, texts, typingSpeed, deletingSpeed, pause]);

  return text;
}

export default function AnimatedHeadline() {
  const typedText = useTypingAnimation([
    'Monitoring the Planet\'s Air in Real Time',
    'Breathe Smarter, Live Better',
    'Track Air Quality Across Delhi NCR',
    'Protect Your Health Today',
  ]);

  return (
    <div className="text-center relative z-10">
      {/* Main headline with fade-in + float */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
      >
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.85] tracking-tighter"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="block bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
            Delhi Air
          </span>
          <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mt-1 md:mt-3">
            Quality
          </span>
        </motion.h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        Real-time pollution monitoring across{' '}
        <span className="text-white font-bold">Delhi NCR Regions</span>
      </motion.p>

      {/* Typing text line */}
      <motion.div
        className="mt-4 md:mt-6 h-8 md:h-10 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <span className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          {typedText}
        </span>
        <span className="inline-block w-[2px] h-5 md:h-6 bg-blue-400 ml-1 animate-pulse rounded-full" />
      </motion.div>
    </div>
  );
}