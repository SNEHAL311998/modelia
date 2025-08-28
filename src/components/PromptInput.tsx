'use client';

import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Describe what you want to generate...",
}) => {
  const maxLength = 500;
  const remaining = maxLength - value.length;

  return (
    <div className="space-y-2">
      <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Prompt
      </label>
      
      <div className="relative">
        <textarea
          id="prompt-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={4}
          className={`
            w-full px-3 py-3 border rounded-lg resize-none transition-colors duration-200
            ${disabled 
              ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50' 
              : 'bg-white dark:bg-gray-900'
            }
            border-gray-300 dark:border-gray-600
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            dark:text-white dark:placeholder-gray-400
            placeholder-gray-500
          `}
          aria-describedby="prompt-description"
        />
        
        <div className="absolute bottom-2 right-3 text-xs text-gray-400">
          {remaining} remaining
        </div>
      </div>
      
      <p id="prompt-description" className="text-xs text-gray-500 dark:text-gray-400">
        Be descriptive! Include details about style, mood, colors, and composition for better results.
      </p>
    </div>
  );
};
