import React, { useState } from 'react';
import { Mountain } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  loading?: 'lazy' | 'eager';
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
  loading = 'lazy',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#23392E] via-[#1E3F31] to-[#141C18] text-[#FAF9F6] ${className}`}
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-15"
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
        >
          <path
            d="M0 240 Q 90 150, 180 205 T 400 175 L 400 300 L 0 300 Z"
            fill="currentColor"
          />
          <path
            d="M0 270 Q 130 210, 260 250 T 400 220 L 400 300 L 0 300 Z"
            fill="currentColor"
            opacity="0.6"
          />
        </svg>
        <Mountain className="relative z-10 h-6 w-6 opacity-70" strokeWidth={1.5} />
        {fallbackLabel && (
          <span className="relative z-10 mt-2 font-editorial text-lg tracking-tight opacity-90">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
