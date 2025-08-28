'use client';

import React from 'react';
import { StyleOption } from '@/types';

interface StyleSelectorProps {
  value: StyleOption;
  onChange: (style: StyleOption) => void;
  disabled?: boolean;
}

const STYLE_OPTIONS: { value: StyleOption; label: string; description: string }[] = [
  {
    value: 'Editorial',
    label: 'Editorial',
    description: 'Clean, professional magazine-style photography',
  },
  {
    value: 'Streetwear',
    label: 'Streetwear',
    description: 'Urban, contemporary fashion with bold aesthetics',
  },
  {
    value: 'Vintage',
    label: 'Vintage',
    description: 'Classic retro style with nostalgic elements',
  },
  {
    value: 'Minimalist',
    label: 'Minimalist',
    description: 'Simple, clean design with focus on essentials',
  },
  {
    value: 'Abstract',
    label: 'Abstract',
    description: 'Artistic, non-representational creative expression',
  },
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Style
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {STYLE_OPTIONS.map((option) => (
          <div key={option.value} className="relative">
            <input
              type="radio"
              id={`style-${option.value}`}
              name="style"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value as StyleOption)}
              disabled={disabled}
              className="sr-only"
            />
            
            <label
              htmlFor={`style-${option.value}`}
              className={`
                block w-full p-4 border rounded-lg cursor-pointer transition-all duration-200
                ${value === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 ring-2 ring-blue-500'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }
                ${disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }
                focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
              `}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {option.label}
                  </h3>
                  
                  <div className={`
                    w-4 h-4 border-2 rounded-full flex items-center justify-center
                    ${value === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                    }
                  `}>
                    {value === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
