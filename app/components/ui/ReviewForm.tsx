'use client';

import React, { useState, useEffect } from 'react';
import { MaterialIcon } from '@/app/components/Icons';
import Button from './Button';
import DualRatingInput from './DualRatingInput';
import Card from './Card';
import type { Review, ReviewFormData } from '@/app/types';

export interface ReviewFormProps {
  restaurantId: string;
  restaurantName: string;
  existingReview?: Review;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  variant?: 'card' | 'modal';
  className?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  restaurantId,
  restaurantName,
  existingReview,
  onSubmit,
  onCancel,
  isLoading = false,
  variant = 'card',
  className = '',
}) => {
  const [generalRating, setGeneralRating] = useState<number>(
    existingReview?.generalRating || 0
  );
  const [sauceRating, setSauceRating] = useState<number>(
    existingReview?.sauceRating || 0
  );
  const [generalText, setGeneralText] = useState<string>(
    existingReview?.generalText || ''
  );
  const [sauceText, setSauceText] = useState<string>(
    existingReview?.sauceText || ''
  );
  const [errors, setErrors] = useState<{
    generalRating?: string;
    sauceRating?: string;
  }>({});

  // Update form when existingReview changes
  useEffect(() => {
    if (existingReview) {
      setGeneralRating(existingReview.generalRating);
      setSauceRating(existingReview.sauceRating);
      setGeneralText(existingReview.generalText || '');
      setSauceText(existingReview.sauceText || '');
    }
  }, [existingReview]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (generalRating === 0) {
      newErrors.generalRating = 'Vänligen betygsätt helhetsupplevelsen';
    }

    if (sauceRating === 0) {
      newErrors.sauceRating = 'Vänligen betygsätt såsen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData: ReviewFormData = {
      generalRating,
      sauceRating,
      generalText: generalText.trim() || undefined,
      sauceText: sauceText.trim() || undefined,
    };

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const isFormValid = generalRating > 0 && sauceRating > 0;

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {existingReview ? 'Redigera din recension' : 'Skriv en recension'}
        </h3>
        <p className="text-sm text-text-muted">
          Betygsätt {restaurantName} och dela din upplevelse
        </p>
      </div>

      {/* Dual Rating Input */}
      <DualRatingInput
        generalRating={generalRating}
        sauceRating={sauceRating}
        onGeneralRatingChange={setGeneralRating}
        onSauceRatingChange={setSauceRating}
        disabled={isLoading}
        required
        generalError={errors.generalRating}
        sauceError={errors.sauceRating}
        size="md"
        variant="card"
      />

      {/* General Review Text */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Din upplevelse
          <span className="text-text-muted font-normal ml-2">(valfritt)</span>
        </label>
        <div className="relative">
          <textarea
            value={generalText}
            onChange={(e) => setGeneralText(e.target.value)}
            placeholder="Berätta om din upplevelse... Mat, service, atmosfär?"
            disabled={isLoading}
            maxLength={500}
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-slate-900 placeholder-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
          <div className="absolute bottom-3 right-3 text-xs text-text-muted">
            {generalText.length}/500
          </div>
        </div>
        <p className="mt-1.5 text-xs text-text-muted">
          Dela vad som gjorde din upplevelse speciell
        </p>
      </div>

      {/* Sauce Review Text */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
          <MaterialIcon name="favorite" fill className="text-primary text-sm" />
          Om såsen
          <span className="text-text-muted font-normal">(valfritt)</span>
        </label>
        <div className="relative">
          <textarea
            value={sauceText}
            onChange={(e) => setSauceText(e.target.value)}
            placeholder="Berätta specifikt om såsen... Smak, konsistens, originalitet?"
            disabled={isLoading}
            maxLength={300}
            rows={3}
            className="w-full px-4 py-3 border border-orange-300 bg-orange-50/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-slate-900 placeholder-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
          <div className="absolute bottom-3 right-3 text-xs text-text-muted">
            {sauceText.length}/300
          </div>
        </div>
        <p className="mt-1.5 text-xs text-text-muted">
          Såsen är viktig! Dela dina tankar om den
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Avbryt
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isFormValid || isLoading}
          isLoading={isLoading}
          icon={existingReview ? 'check' : 'send'}
          className="flex-1"
        >
          {existingReview ? 'Uppdatera recension' : 'Publicera recension'}
        </Button>
      </div>

      {/* Helper Info */}
      {!existingReview && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <MaterialIcon name="info" className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Tips för en bra recension</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Var ärlig och konstruktiv</li>
              <li>Beskriv både positiva och negativa aspekter</li>
              <li>Fokusera på mat, service och atmosfär</li>
              <li>Glöm inte att berätta om såsen!</li>
            </ul>
          </div>
        </div>
      )}
    </form>
  );

  if (variant === 'modal') {
    return <div className={className}>{formContent}</div>;
  }

  // Card variant (default)
  return (
    <Card padding="lg" className={className}>
      {formContent}
    </Card>
  );
};

export default ReviewForm;
