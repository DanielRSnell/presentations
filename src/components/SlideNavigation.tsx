import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface SlideNavigationProps {
  totalSlides: number;
  currentSlide: number;
  baseUrl: string;
}

export default function SlideNavigation({ 
  totalSlides, 
  currentSlide,
  baseUrl = '/btcs'
}: SlideNavigationProps) {
  // Generate array of slide numbers
  const slides = Array.from({ length: totalSlides }, (_, i) => i + 1);
  
  // Calculate URL for a given slide number
  const getSlideUrl = (slideNumber: number) => {
    if (slideNumber === 1) return baseUrl + '/';
    return `${baseUrl}/page-${slideNumber}`;
  };

  return (
    <motion.div 
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="bg-background border rounded-full shadow-lg px-4 py-2 flex items-center space-x-1">
        {slides.map((slideNum) => (
          <a 
            key={slideNum}
            href={getSlideUrl(slideNum)}
            className="block"
          >
            <Button
              variant={currentSlide === slideNum ? "default" : "ghost"}
              size="sm"
              className="w-8 h-8 p-0 rounded-full"
            >
              {slideNum}
            </Button>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
