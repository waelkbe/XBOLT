import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LanguageToggleProps {
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
  showIcon?: boolean;
}

export function LanguageToggle({ variant = 'ghost', className = '', showIcon = true }: LanguageToggleProps) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={toggleLanguage}
      className={`gap-1.5 font-semibold text-sm transition-all ${className}`}
      title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
    >
      {showIcon && <Globe className="w-4 h-4" />}
      <span className="font-tektur tracking-wide">
        {language === 'ar' ? 'EN' : 'عربي'}
      </span>
    </Button>
  );
}
