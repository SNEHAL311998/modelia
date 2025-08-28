import { Generation } from '@/types';

const STORAGE_KEYS = {
  GENERATION_HISTORY: 'modelia_generation_history',
} as const;

const MAX_HISTORY_ITEMS = 5;

/**
 * Saves a generation to localStorage history
 */
export const saveGeneration = (generation: Generation): void => {
  try {
    const existingHistory = getGenerationHistory();
    
    // Add new generation to the beginning
    const updatedHistory = [generation, ...existingHistory];
    
    // Keep only the last 5 items
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEYS.GENERATION_HISTORY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save generation to localStorage:', error);
  }
};

/**
 * Retrieves generation history from localStorage
 */
export const getGenerationHistory = (): Generation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GENERATION_HISTORY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Validate the stored data
    if (!Array.isArray(parsed)) return [];
    
    return parsed.filter((item): item is Generation => {
      return (
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.imageUrl === 'string' &&
        typeof item.prompt === 'string' &&
        typeof item.style === 'string' &&
        typeof item.createdAt === 'string'
      );
    });
  } catch (error) {
    console.error('Failed to retrieve generation history from localStorage:', error);
    return [];
  }
};

/**
 * Clears all generation history from localStorage
 */
export const clearGenerationHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.GENERATION_HISTORY);
  } catch (error) {
    console.error('Failed to clear generation history:', error);
  }
};
