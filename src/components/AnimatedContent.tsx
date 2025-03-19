import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedContentProps {
  children: React.ReactNode;
  delay?: number;
}

export default function AnimatedContent({ children, delay = 0 }: AnimatedContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
