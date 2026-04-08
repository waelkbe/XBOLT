import React from 'react';

// ─── الشعارات الرسمية من Brand Guideline 2026 ───────────────────────────────
// الألوان الرسمية:
//   Deep Navy  #0C273C  — اللون الأساسي (خلفيات، هيدر)
//   Orange-Red #F14E23  — لون التمييز والأكشن
//   Sky Blue   #ABCEE1  — لون ثانوي خفيف
//   Light Gray #F2F2F2  — خلفيات فاتحة

// CDN URLs للشعارات الرسمية
const LOGO_ORANGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-orange-cropped_8655df36.png";   // برتقالي كامل بدون خلفية (لون واحد)
const LOGO_NAVY   = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-9_bed8cf3b.png";    // كحلي كامل
const LOGO_SKY    = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-9c2_f8d60c1b.png";  // Sky Blue
const LOGO_WHITE  = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-orange-cropped_8655df36.png";  // برتقالي كامل بدون خلفية

interface XBoltLogoProps {
  variant?: 'orange' | 'navy' | 'sky' | 'white';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs:  { height: 20, width: 80  },
  sm:  { height: 28, width: 112 },
  md:  { height: 36, width: 144 },
  lg:  { height: 48, width: 192 },
  xl:  { height: 64, width: 256 },
};

/**
 * XBoltLogo — الشعار الرسمي PNG
 * variant:
 *   'orange' — برتقالي على خلفية فاتحة أو كحلية (الأساسي)
 *   'navy'   — كحلي على خلفية فاتحة
 *   'sky'    — Sky Blue على خلفية داكنة
 *   'white'  — أبيض على خلفية داكنة
 */
export const XBoltLogo: React.FC<XBoltLogoProps> = ({
  variant = 'orange',
  size = 'md',
  className = '',
}) => {
  const dims = sizeMap[size];
  const src = variant === 'orange' ? LOGO_ORANGE
            : variant === 'navy'   ? LOGO_NAVY
            : variant === 'sky'    ? LOGO_SKY
            : LOGO_WHITE;

  return (
    <img
      src={src}
      alt="XBOLT"
      width={dims.width}
      height={dims.height}
      style={{ height: dims.height, width: 'auto', objectFit: 'contain' }}
      className={`flex-shrink-0 ${className}`}
    />
  );
};

/**
 * XBoltNavbarLogo — للـ Navbar على خلفية كحلية
 * يستخدم الشعار البرتقالي (لون واحد، احترافي)
 */
export const XBoltNavbarLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'sm',
}) => {
  const dims = sizeMap[size];
  return (
    <img
      src={LOGO_ORANGE}
      alt="XBOLT"
      style={{ height: dims.height, width: 'auto', objectFit: 'contain' }}
      className="flex-shrink-0"
    />
  );
};

/**
 * XBoltFooterLogo — للـ Footer على خلفية كحلية
 * يستخدم الشعار البرتقالي
 */
export const XBoltFooterLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
}) => {
  const dims = sizeMap[size];
  return (
    <img
      src={LOGO_ORANGE}
      alt="XBOLT"
      style={{ height: dims.height, width: 'auto', objectFit: 'contain' }}
      className="flex-shrink-0"
    />
  );
};

export default XBoltLogo;
