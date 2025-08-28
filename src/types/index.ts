export interface Generation {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  createdAt: string;
}

export interface GenerationRequest {
  imageDataUrl: string;
  prompt: string;
  style: string;
}

export interface APIResponse {
  success: true;
  data: Generation;
}

export interface APIError {
  success: false;
  message: string;
}

export type APIResult = APIResponse | APIError;

export interface UploadedImage {
  file: File;
  dataUrl: string;
  preview: string;
}

export type StyleOption = 'Editorial' | 'Streetwear' | 'Vintage' | 'Minimalist' | 'Abstract';

export interface AppState {
  uploadedImage: UploadedImage | null;
  prompt: string;
  style: StyleOption;
  isGenerating: boolean;
  generationHistory: Generation[];
  currentGeneration: Generation | null;
  error: string | null;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  attempt: number;
}
