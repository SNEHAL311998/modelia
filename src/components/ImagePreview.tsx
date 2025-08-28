'use client';

import React from 'react';
import Image from 'next/image';
import { UploadedImage, Generation } from '@/types';

interface ImagePreviewProps {
  uploadedImage?: UploadedImage | null;
  generation?: Generation | null;
  onRemove?: () => void;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  uploadedImage,
  generation,
  onRemove,
  className = '',
}) => {
  const imageUrl = generation?.imageUrl || uploadedImage?.preview;
  const isGeneration = !!generation;
  
  if (!imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 ${className}`}>
        <div className="text-center p-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {isGeneration ? 'Generated image will appear here' : 'Upload an image to preview'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}>
      <div className="aspect-square relative">
        <Image
          src={imageUrl}
          alt={isGeneration ? `Generated image: ${generation.prompt}` : 'Uploaded image preview'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Remove image"
          type="button"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      {isGeneration && generation && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-white text-sm font-medium truncate">
            {generation.prompt}
          </p>
          <p className="text-white/80 text-xs">
            {generation.style} • {new Date(generation.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};
