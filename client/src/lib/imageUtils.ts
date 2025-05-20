export const getImageUrl = (path: string): string => {
  // If the path is already a full URL, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Otherwise, prepend the base URL for local images
  return `${import.meta.env.VITE_API_URL || ''}${path}`;
};

export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const getAspectRatio = (width: number, height: number): number => {
  return width / height;
};

export const getResponsiveImageUrl = (url: string, width: number): string => {
  // If using a CDN or image service, you can append width parameters
  // Example: return `${url}?w=${width}`;
  return url;
}; 