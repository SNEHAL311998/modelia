'use client';

import React, { useRef, useState } from 'react';
import { UploadedImage } from '@/types';
import { validateImageFile, createImagePreview, compressImage } from '@/utils/imageUtils';

interface ImageUploadProps {
  onImageUpload: (image: UploadedImage) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onError,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        onError(validation.error || 'Invalid file');
        return;
      }

      // Create preview
      const preview = createImagePreview(file);
      
      // Compress image if needed
      const dataUrl = await compressImage(file);
      
      const uploadedImage: UploadedImage = {
        file,
        dataUrl,
        preview,
      };
      
      onImageUpload(uploadedImage);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled || isProcessing) return;
    
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isProcessing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (disabled || isProcessing) return;
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${disabled || isProcessing 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Upload image file"
        aria-describedby="upload-description"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="sr-only"
          disabled={disabled || isProcessing}
          aria-label="Choose image file"
        />
        
        <div className="space-y-4">
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Processing image...</span>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <svg
                  className="h-12 w-12 text-gray-400"
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
              </div>
              
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                  Drop your image here, or{' '}
                  <span className="text-blue-600 dark:text-blue-400 underline">
                    browse
                  </span>
                </p>
                <p id="upload-description" className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  PNG or JPG up to 10MB. Images larger than 1920px will be automatically resized.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
