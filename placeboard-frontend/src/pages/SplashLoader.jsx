import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const SplashLoader = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const text = "PlaceBoard";

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-white text-5xl md:text-7xl font-bold tracking-wider mb-4 flex">
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {char}
          </motion.span>
        ))}
      </div>
      <motion.div
        className="text-indigo-200 text-xl md:text-2xl font-light mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        Your Smart Placement Tracker
      </motion.div>
      <div className="w-64 md:w-80 h-1.5 bg-indigo-950 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-indigo-400"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

export default SplashLoader;
