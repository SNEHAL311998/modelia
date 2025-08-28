import { GenerationRequest, APIResult, Generation, RetryConfig } from '@/types';
import { generateMockImageUrl } from './imageUtils';

/**
 * Simulates API delay
 */
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Mock API that simulates image generation
 * Returns error 20% of the time to test retry logic
 */
export const generateImage = async (request: GenerationRequest): Promise<APIResult> => {
  // Simulate network delay
  await delay(1000 + Math.random() * 1000); // 1-2 seconds
  
  // 20% chance of error
  if (Math.random() < 0.2) {
    return {
      success: false,
      message: 'Model overloaded',
    };
  }
  
  // Successful response
  const generation: Generation = {
    id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    imageUrl: generateMockImageUrl(),
    prompt: request.prompt,
    style: request.style,
    createdAt: new Date().toISOString(),
  };
  
  return {
    success: true,
    data: generation,
  };
};

/**
 * Implements exponential backoff retry logic
 */
export const generateImageWithRetry = async (
  request: GenerationRequest,
  config: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 8000,
    attempt: 0,
  },
  abortSignal?: AbortSignal
): Promise<APIResult> => {
  let lastError: string = '';
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    // Check if request was aborted
    if (abortSignal?.aborted) {
      return {
        success: false,
        message: 'Request aborted',
      };
    }
    
    try {
      const result = await generateImage(request);
      
      if (result.success) {
        return result;
      }
      
      lastError = result.message;
      
      // If this wasn't the last attempt, wait before retrying
      if (attempt < config.maxAttempts) {
        const delayMs = Math.min(
          config.baseDelay * Math.pow(2, attempt - 1),
          config.maxDelay
        );
        
        console.log(`Attempt ${attempt} failed. Retrying in ${delayMs}ms...`);
        await delay(delayMs);
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      
      if (attempt < config.maxAttempts) {
        const delayMs = Math.min(
          config.baseDelay * Math.pow(2, attempt - 1),
          config.maxDelay
        );
        await delay(delayMs);
      }
    }
  }
  
  return {
    success: false,
    message: `Failed after ${config.maxAttempts} attempts. Last error: ${lastError}`,
  };
};
