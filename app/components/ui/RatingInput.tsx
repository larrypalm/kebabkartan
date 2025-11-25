'use client';

import React, { useState } from 'react';
import { MaterialIcon } from '@/app/components/Icons';

export interface RatingInputProps {
  label?: string;
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  error?: string;
  showValue?: boolean;
  variant?: 'star' | 'heart';
}

const RatingInput: React.FC<RatingInputProps> = ({
  label,
  value,
  onChange,
  maxRating = 5,
  size = 'md',
  disabled = false,
  required = false,
  helperText,
  error,
  showValue = true,
  variant = 'star',
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const iconName = variant === 'heart' ? 'favorite' : 'star';

  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!disabled) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-slate-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <div className="flex items-center gap-3">
        <div
          className="flex gap-1"
          onMouseLeave={handleMouseLeave}
          role="radiogroup"
          aria-label={label || 'Rating'}
        >
          {Array.from({ length: maxRating }, (_, index) => {
            const rating = index + 1;
            const isFilled = rating <= displayValue;

            return (
              <button
                key={rating}
                type="button"
                onClick={() => handleClick(rating)}
                onMouseEnter={() => handleMouseEnter(rating)}
                disabled={disabled}
                className={`${sizes[size]} transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded ${
                  disabled
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer hover:scale-110 active:scale-95'
                } ${
                  isFilled ? 'text-primary' : 'text-slate-300'
                }`}
                aria-label={`Rate ${rating} out of ${maxRating}`}
                role="radio"
                aria-checked={value === rating}
              >
                <MaterialIcon
                  name={iconName}
                  fill={isFilled}
                  className={sizes[size]}
                />
              </button>
            );
          })}
        </div>

        {showValue && (
          <span className="text-sm font-bold text-slate-700 min-w-[60px]">
            {displayValue > 0 ? `${displayValue}/${maxRating}` : 'Ej satt'}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-error font-medium">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-sm text-text-muted">{helperText}</p>
      )}
    </div>
  );
};

export default RatingInput;
