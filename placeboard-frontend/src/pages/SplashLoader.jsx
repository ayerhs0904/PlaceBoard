import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashLoader = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2300);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[9999] bg-[#050510] flex flex-col items-center justify-center overflow-hidden"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center flex-grow">
          <motion.div
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] tracking-tight mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            PlaceBoard
          </motion.div>
          
          <motion.div
            className="text-xl md:text-2xl text-gray-400 font-medium tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Built for students, by a student
          </motion.div>
        </div>

        <div className="w-full h-1 bg-[#050510] absolute bottom-0 left-0">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#7C3AED] to-[#4F46E5]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashLoader;
