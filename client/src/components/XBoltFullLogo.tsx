import React from 'react';

// الشعار الرسمي البرتقالي من Brand Guideline 2026
// logo-orange-nobg = XBOLT برتقالي كامل بدون خلفية (لون واحد) — من Artboard 1
const LOGO_ORANGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-orange-cropped_8655df36.png";
const LOGO_WHITE  = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-orange-cropped_8655df36.png"; // نفس البرتقالي بدون خلفية

interface XBoltFullLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'orange' | 'white';
  className?: string;
}

const sizeMap = {
  sm:  { height: 32, width: 128 },
  md:  { height: 44, width: 176 },
  lg:  { height: 56, width: 224 },
  xl:  { height: 72, width: 288 },
};

/**
 * XBoltFullLogo — الشعار الكامل الرسمي
 * variant 'orange': برتقالي (للخلفيات الكحلية والداكنة) — الأساسي
 * variant 'white':  أبيض (للخلفيات الداكنة جداً)
 */
export const XBoltFullLogo: React.FC<XBoltFullLogoProps> = ({
  size = 'md',
  variant = 'orange',
  className = '',
}) => {
  const dims = sizeMap[size];
  const src = variant === 'white' ? LOGO_WHITE : LOGO_ORANGE;

  return (
    <img
      src={src}
      alt="XBOLT"
      style={{ height: dims.height, width: 'auto', objectFit: 'contain' }}
      className={`flex-shrink-0 ${className}`}
    />
  );
};

export default XBoltFullLogo;
