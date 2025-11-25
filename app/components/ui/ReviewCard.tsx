'use client';

import React from 'react';
import { MaterialIcon } from '@/app/components/Icons';
import Card from './Card';

export interface ReviewCardProps {
  userName: string;
  userAvatar?: string;
  generalRating: number;
  sauceRating: number;
  generalText?: string;
  sauceText?: string;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
  isEdited?: boolean;
  onLike?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  userName,
  userAvatar,
  generalRating,
  sauceRating,
  generalText,
  sauceText,
  likes,
  isLiked = false,
  createdAt,
  isEdited = false,
  onLike,
  onEdit,
  onDelete,
  isOwner = false,
  className = '',
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Idag';
    } else if (diffInDays === 1) {
      return 'Igår';
    } else if (diffInDays < 7) {
      return `${diffInDays} dagar sedan`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${weeks === 1 ? 'vecka' : 'veckor'} sedan`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${months === 1 ? 'månad' : 'månader'} sedan`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} ${years === 1 ? 'år' : 'år'} sedan`;
    }
  };

  const renderStars = (rating: number, variant: 'star' | 'heart' = 'star') => {
    const iconName = variant === 'heart' ? 'favorite' : 'star';
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <MaterialIcon
            key={index}
            name={iconName}
            fill={index < rating}
            className={`text-base ${
              index < rating ? 'text-primary' : 'text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className={`${className}`} padding="lg" hover={false}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>

          {/* User Info */}
          <div>
            <h4 className="font-bold text-slate-900">{userName}</h4>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>{formatDate(createdAt)}</span>
              {isEdited && (
                <>
                  <span>•</span>
                  <span className="italic">Redigerad</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        {isOwner && (onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Redigera recension"
              >
                <MaterialIcon name="edit" size="sm" className="text-slate-600" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Ta bort recension"
              >
                <MaterialIcon name="delete" size="sm" className="text-red-600" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Ratings */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* General Rating */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <MaterialIcon name="star" fill className="text-primary text-sm" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Allmänt
            </span>
          </div>
          {renderStars(generalRating, 'star')}
          <span className="text-xs text-slate-600 mt-1 block">
            {generalRating}/5
          </span>
        </div>

        {/* Sauce Rating */}
        <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
          <div className="flex items-center gap-2 mb-1">
            <MaterialIcon name="favorite" fill className="text-primary text-sm" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Sås
            </span>
          </div>
          {renderStars(sauceRating, 'heart')}
          <span className="text-xs text-slate-600 mt-1 block">
            {sauceRating}/5
          </span>
        </div>
      </div>

      {/* Review Text */}
      {(generalText || sauceText) && (
        <div className="space-y-3 mb-4">
          {generalText && (
            <div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {generalText}
              </p>
            </div>
          )}
          {sauceText && (
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
              <div className="flex items-center gap-2 mb-1">
                <MaterialIcon name="format_quote" className="text-primary text-sm" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Om såsen
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {sauceText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer - Like Button */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <button
          onClick={onLike}
          disabled={!onLike}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
            isLiked
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          } ${!onLike ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
          aria-label={isLiked ? 'Ta bort gilla-markering' : 'Gilla recension'}
        >
          <MaterialIcon
            name="favorite"
            fill={isLiked}
            size="sm"
            className={isLiked ? 'text-red-600' : 'text-slate-400'}
          />
          <span className="text-sm font-medium">
            {likes > 0 ? likes : ''}
            {likes === 0 && 'Gilla'}
          </span>
        </button>

        {/* Average Rating Display */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-muted">Snitt:</span>
          <span className="font-bold text-slate-900">
            {((generalRating + sauceRating) / 2).toFixed(1)}
          </span>
          <MaterialIcon name="star" fill className="text-primary text-sm" />
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard;
