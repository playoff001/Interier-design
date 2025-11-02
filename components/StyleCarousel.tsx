
import React from 'react';
import type { DesignStyle } from '../types';

interface StyleCarouselProps {
  styles: DesignStyle[];
  onStyleSelect: (style: DesignStyle) => void;
  activeStyleId?: string | null;
}

export const StyleCarousel: React.FC<StyleCarouselProps> = ({ styles, onStyleSelect, activeStyleId }) => {
  return (
    <div className="relative">
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
        {styles.map(style => (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style)}
            className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out whitespace-nowrap
              ${activeStyleId === style.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            {style.name}
          </button>
        ))}
      </div>
    </div>
  );
};
