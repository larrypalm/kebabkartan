'use client';

import React from 'react';
import RatingInput from './RatingInput';

export interface DualRatingInputProps {
  generalRating: number;
  sauceRating: number;
  onGeneralRatingChange: (rating: number) => void;
  onSauceRatingChange: (rating: number) => void;
  disabled?: boolean;
  required?: boolean;
  generalError?: string;
  sauceError?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'card' | 'inline';
}

const DualRatingInput: React.FC<DualRatingInputProps> = ({
  generalRating,
  sauceRating,
  onGeneralRatingChange,
  onSauceRatingChange,
  disabled = false,
  required = false,
  generalError,
  sauceError,
  size = 'md',
  variant = 'card',
}) => {
  if (variant === 'inline') {
    return (
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <RatingInput
            label="Allmänt betyg"
            value={generalRating}
            onChange={onGeneralRatingChange}
            disabled={disabled}
            required={required}
            error={generalError}
            size={size}
            helperText="Hur var helhetsupplevelsen?"
          />
        </div>
        <div className="flex-1">
          <RatingInput
            label="Såsbetyg"
            value={sauceRating}
            onChange={onSauceRatingChange}
            disabled={disabled}
            required={required}
            error={sauceError}
            size={size}
            helperText="Hur var såsen?"
            variant="heart"
          />
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-card">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Betygsätt din upplevelse
        </h3>
        <p className="text-sm text-text-muted">
          Ge betyg på både helhetsupplevelsen och såsen
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <RatingInput
            label="Allmänt betyg"
            value={generalRating}
            onChange={onGeneralRatingChange}
            disabled={disabled}
            required={required}
            error={generalError}
            size={size}
            helperText="Hur var helhetsupplevelsen?"
          />
        </div>

        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <RatingInput
            label="Såsbetyg"
            value={sauceRating}
            onChange={onSauceRatingChange}
            disabled={disabled}
            required={required}
            error={sauceError}
            size={size}
            helperText="Hur var såsen? En viktig del av upplevelsen!"
            variant="heart"
          />
        </div>
      </div>

      {(generalRating > 0 || sauceRating > 0) && (
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Ditt samlade betyg:</span>
            <div className="flex gap-4">
              <span className="font-bold text-slate-900">
                Allmänt: {generalRating}/5
              </span>
              <span className="font-bold text-primary">
                Sås: {sauceRating}/5
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DualRatingInput;
