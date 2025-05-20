import React from 'react';
import { Image } from './ui/Image';
import { getImageUrl } from '@/lib/imageUtils';
import '../styles/images.css';

interface GalleryImageProps {
  src: string;
  alt: string;
  caption?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GalleryImage: React.FC<GalleryImageProps> = ({
  src,
  alt,
  caption,
  size = 'md'
}) => {
  const imageUrl = getImageUrl(src);
  
  return (
    <div className={`image-container image-${size}`}>
      <Image
        src={imageUrl}
        alt={alt}
        className="w-full h-full"
      />
      {caption && (
        <>
          <div className="image-overlay" />
          <div className="image-caption">
            <p className="text-sm font-medium">{caption}</p>
          </div>
        </>
      )}
    </div>
  );
}; 