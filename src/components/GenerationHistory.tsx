'use client';

import React from 'react';
import Image from 'next/image';
import { Generation } from '@/types';

interface GenerationHistoryProps {
  history: Generation[];
  onSelectGeneration: (generation: Generation) => void;
  onClearHistory: () => void;
  disabled?: boolean;
}

export const GenerationHistory: React.FC<GenerationHistoryProps> = ({
  history,
  onSelectGeneration,
  onClearHistory,
  disabled = false,
}) => {
  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            No generation history
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your recent generations will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Generations
        </h2>
        
        <button
          onClick={onClearHistory}
          disabled={disabled}
          className={`
            text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}
          `}
          aria-label="Clear generation history"
        >
          Clear All
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        {history.map((generation, index) => (
          <HistoryItem
            key={generation.id}
            generation={generation}
            onSelect={() => onSelectGeneration(generation)}
            disabled={disabled}
            isRecent={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

interface HistoryItemProps {
  generation: Generation;
  onSelect: () => void;
  disabled: boolean;
  isRecent: boolean;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  generation,
  onSelect,
  disabled,
  isRecent,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      className={`
        relative group border rounded-lg p-3 cursor-pointer transition-all duration-200
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }
        border-gray-200 dark:border-gray-700
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
      `}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`View generation: ${generation.prompt}`}
    >
      {isRecent && (
        <div className="absolute -top-2 -right-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
          Latest
        </div>
      )}
      
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={generation.imageUrl}
              alt={`Generated image for: ${generation.prompt}`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {generation.prompt}
              </p>
              
              <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {generation.style}
                </span>
                <span>•</span>
                <time dateTime={generation.createdAt}>
                  {new Date(generation.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
