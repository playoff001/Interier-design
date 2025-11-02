
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeftRightIcon } from './icons';

interface ImageComparatorProps {
  originalImage: string;
  generatedImage: string;
}

export const ImageComparator: React.FC<ImageComparatorProps> = ({ originalImage, generatedImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };
  
  useEffect(() => {
    // Reset slider when images change
    setSliderPosition(50);
  }, [originalImage, generatedImage]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4">
        <div ref={containerRef} className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl select-none">
            <img 
                src={originalImage} 
                alt="Original" 
                className="absolute inset-0 w-full h-full object-contain" 
            />
            <div 
                className="absolute inset-0 w-full h-full overflow-hidden" 
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="absolute inset-0 w-full h-full object-contain" 
                />
            </div>
            <div 
                className="absolute top-0 bottom-0 bg-white w-1 cursor-ew-resize"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg border-2 border-gray-300">
                    <ChevronLeftRightIcon />
                </div>
            </div>
            <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderPosition}
                onChange={handleSliderChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                aria-label="Image comparison slider"
            />
        </div>
        <div className="w-full flex justify-between px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>Původní</span>
            <span>Vytvořeno AI</span>
        </div>
    </div>
  );
};
