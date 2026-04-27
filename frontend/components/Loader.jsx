import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullPage = false }) => {
  const MotionDiv = motion.div;
  return (
    <div className={`flex items-center justify-center ${fullPage ? 'min-h-screen fixed inset-0 bg-background/50 backdrop-blur-sm z-50' : 'p-8'}`}>
      <MotionDiv
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          borderRadius: ["20%", "50%", "20%"]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-12 h-12 bg-accent shadow-lg"
      />
    </div>
  );
};

export default Loader;
