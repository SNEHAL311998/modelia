/**
 * Compresses and resizes an image to ensure it's under the size limit
 */
export const compressImage = (file: File, maxWidth = 1920, maxHeight = 1920, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to data URL with compression
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validates if a file is a valid image and within size limits
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select a valid image file (PNG or JPG)' };
  }

  // Check supported formats
  const supportedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: 'Only PNG and JPG files are supported' };
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be under 10MB' };
  }

  return { valid: true };
};

/**
 * Creates a preview URL for an uploaded file
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Generates a random image URL for mock API responses
 */
export const generateMockImageUrl = (): string => {
  const width = 512;
  const height = 512;
  const seed = Math.floor(Math.random() * 10000);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
};
