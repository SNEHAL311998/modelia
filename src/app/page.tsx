'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ImagePreview } from '@/components/ImagePreview';
import { PromptInput } from '@/components/PromptInput';
import { StyleSelector } from '@/components/StyleSelector';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { GenerationHistory } from '@/components/GenerationHistory';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { generateImageWithRetry } from '@/utils/api';
import { getGenerationHistory, saveGeneration, clearGenerationHistory } from '@/utils/localStorage';
import { UploadedImage, Generation, StyleOption, AppState } from '@/types';

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    uploadedImage: null,
    prompt: '',
    style: 'Editorial' as StyleOption,
    isGenerating: false,
    generationHistory: [],
    currentGeneration: null,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load generation history on mount
  useEffect(() => {
    const history = getGenerationHistory();
    setAppState(prev => ({ ...prev, generationHistory: history }));
  }, []);

  const handleImageUpload = useCallback((image: UploadedImage) => {
    setAppState(prev => ({
      ...prev,
      uploadedImage: image,
      error: null,
    }));
  }, []);

  const handleImageError = useCallback((error: string) => {
    setAppState(prev => ({ ...prev, error }));
  }, []);

  const handlePromptChange = useCallback((prompt: string) => {
    setAppState(prev => ({ ...prev, prompt }));
  }, []);

  const handleStyleChange = useCallback((style: StyleOption) => {
    setAppState(prev => ({ ...prev, style }));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!appState.uploadedImage || !appState.prompt.trim()) {
      setAppState(prev => ({ 
        ...prev, 
        error: 'Please upload an image and enter a prompt before generating.' 
      }));
      return;
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setAppState(prev => ({
      ...prev,
      isGenerating: true,
      error: null,
    }));

    try {
      const result = await generateImageWithRetry(
        {
          imageDataUrl: appState.uploadedImage.dataUrl,
          prompt: appState.prompt,
          style: appState.style,
        },
        undefined,
        abortControllerRef.current.signal
      );

      if (result.success) {
        const generation = result.data;
        
        // Save to localStorage
        saveGeneration(generation);
        
        // Update state - clear form after successful generation
        setAppState(prev => ({
          ...prev,
          currentGeneration: generation,
          generationHistory: [generation, ...prev.generationHistory.slice(0, 4)],
          isGenerating: false,
          // Clear form fields after successful generation
          uploadedImage: null,
          prompt: '',
          style: 'Editorial' as StyleOption,
        }));
      } else {
        setAppState(prev => ({
          ...prev,
          error: result.message,
          isGenerating: false,
        }));
      }
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to generate image',
        isGenerating: false,
      }));
    }
  }, [appState.uploadedImage, appState.prompt, appState.style]);

  const handleAbort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setAppState(prev => ({
        ...prev,
        isGenerating: false,
        error: 'Generation cancelled',
      }));
    }
  }, []);

  const handleSelectGeneration = useCallback((generation: Generation) => {
    setAppState(prev => ({
      ...prev,
      currentGeneration: generation,
      error: null,
    }));
  }, []);

  const handleClearHistory = useCallback(() => {
    clearGenerationHistory();
    setAppState(prev => ({
      ...prev,
      generationHistory: [],
    }));
  }, []);

  const handleRemoveImage = useCallback(() => {
    setAppState(prev => ({
      ...prev,
      uploadedImage: null,
    }));
  }, []);

  const canGenerate = appState.uploadedImage && appState.prompt.trim() && !appState.isGenerating;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Studio
                </h1>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Powered by Modelia
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upload Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                
                {!appState.uploadedImage ? (
                  <ImageUpload
                    onImageUpload={handleImageUpload}
                    onError={handleImageError}
                    disabled={appState.isGenerating}
                  />
                ) : (
                  <div className="space-y-4">
                    <ImagePreview
                      uploadedImage={appState.uploadedImage}
                      generation={null}
                      onRemove={handleRemoveImage}
                      className="h-80 w-full max-w-md mx-auto"
                    />
                    
                    <div className="text-center">
                      <button
                        onClick={() => setAppState(prev => ({ ...prev, uploadedImage: null }))}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Upload a different image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Configuration Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                
                <div className="space-y-6">
                  <PromptInput
                    value={appState.prompt}
                    onChange={handlePromptChange}
                    disabled={appState.isGenerating}
                  />
                  
                  <StyleSelector
                    value={appState.style}
                    onChange={handleStyleChange}
                    disabled={appState.isGenerating}
                  />

                  {/* Live Summary */}
                  {(appState.uploadedImage || appState.prompt || appState.currentGeneration) && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Summary
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <div>
                          <span className="font-medium">Image:</span>{' '}
                          {appState.uploadedImage ? 'Uploaded' : 'None'}
                        </div>
                        <div>
                          <span className="font-medium">Prompt:</span>{' '}
                          <span className="break-words whitespace-pre-wrap">
                            {appState.prompt || 'Not entered'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Style:</span> {appState.style}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generate Button */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    {appState.error && (
                      <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex">
                          <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="ml-3">
                            <p className="text-sm text-red-700 dark:text-red-300">
                              {appState.error}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleGenerate}
                        disabled={!canGenerate}
                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          canGenerate
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                        aria-label="Generate AI image"
                      >
                        {appState.isGenerating ? (
                          <div className="flex items-center justify-center">
                            <LoadingSpinner size="sm" />
                            <span className="ml-2">Generating...</span>
                          </div>
                        ) : (
                          'Generate Image'
                        )}
                      </button>
                      
                      {appState.isGenerating && (
                        <button
                          onClick={handleAbort}
                          className="px-4 py-3 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Abort
                        </button>
                      )}
                    </div>

                    {!canGenerate && !appState.isGenerating && (
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Upload an image and enter a prompt to generate
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Generated Image Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Generated Image
                </h3>
                <ImagePreview
                  uploadedImage={null}
                  generation={appState.currentGeneration}
                  onRemove={undefined}
                  className="h-64 w-full"
                />
              </div>

              {/* Generation History */}
              <GenerationHistory
                history={appState.generationHistory}
                onSelectGeneration={handleSelectGeneration}
                onClearHistory={handleClearHistory}
                disabled={appState.isGenerating}
              />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
