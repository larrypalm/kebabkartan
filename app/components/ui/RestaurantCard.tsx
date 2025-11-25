'use client';

import React from 'react';
import { MaterialIcon } from '@/app/components/Icons';
import Card from './Card';
import Link from 'next/link';

export interface RestaurantCardProps {
  id: string;
  name: string;
  address: string;
  city?: string;
  rating: number;
  sauceRating: number;
  reviewCount: number;
  distance?: number; // in kilometers
  priceRange?: string;
  openingHours?: string;
  isOpen?: boolean;
  imageUrl?: string;
  slug?: string;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  address,
  city,
  rating,
  sauceRating,
  reviewCount,
  distance,
  priceRange,
  openingHours,
  isOpen,
  imageUrl,
  slug,
  onClick,
  variant = 'default',
  className = '',
}) => {
  const href = slug ? `/${slug}` : `/restaurang/${id}`;

  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
  };

  const renderStars = (ratingValue: number, variant: 'star' | 'heart' = 'star') => {
    const iconName = variant === 'heart' ? 'favorite' : 'star';
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <MaterialIcon
            key={index}
            name={iconName}
            fill={index < Math.round(ratingValue)}
            className={`text-sm ${
              index < Math.round(ratingValue) ? 'text-primary' : 'text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = ((rating + sauceRating) / 2).toFixed(1);

  // Compact variant
  if (variant === 'compact') {
    return (
      <Link href={href} onClick={onClick}>
        <Card
          className={`${className} hover:border-primary transition-all cursor-pointer`}
          padding="md"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 truncate">{name}</h3>
              <p className="text-sm text-text-muted truncate">{address}</p>
            </div>
            <div className="flex items-center gap-2 ml-3">
              <div className="flex items-center gap-1">
                <MaterialIcon name="star" fill className="text-primary text-sm" />
                <span className="font-bold text-slate-900">{averageRating}</span>
              </div>
              {distance !== undefined && (
                <span className="text-sm text-text-muted">
                  {formatDistance(distance)}
                </span>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <Link href={href} onClick={onClick}>
        <Card
          className={`${className} hover:shadow-card-lg transition-all cursor-pointer overflow-hidden`}
          padding="none"
        >
          {/* Image */}
          {imageUrl && (
            <div className="relative h-48 bg-gradient-to-br from-primary to-secondary">
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
              {distance !== undefined && (
                <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-lg">
                  <span className="text-sm font-bold text-slate-900">
                    {formatDistance(distance)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="p-5">
            {/* Header */}
            <div className="mb-3">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{name}</h3>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <MaterialIcon name="location_on" size="sm" />
                <span>{address}</span>
                {city && <span>• {city}</span>}
              </div>
            </div>

            {/* Ratings */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <MaterialIcon name="star" fill className="text-primary text-xs" />
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    Allmänt
                  </span>
                </div>
                {renderStars(rating, 'star')}
                <span className="text-xs text-slate-600 mt-1 block">
                  {rating.toFixed(1)}/5
                </span>
              </div>

              <div className="bg-orange-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <MaterialIcon name="favorite" fill className="text-primary text-xs" />
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    Sås
                  </span>
                </div>
                {renderStars(sauceRating, 'heart')}
                <span className="text-xs text-slate-600 mt-1 block">
                  {sauceRating.toFixed(1)}/5
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">
                {reviewCount} {reviewCount === 1 ? 'recension' : 'recensioner'}
              </span>
              {priceRange && (
                <span className="font-medium text-slate-700">{priceRange} kr</span>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={href} onClick={onClick}>
      <Card
        className={`${className} hover:border-primary transition-all cursor-pointer`}
        padding="lg"
      >
        <div className="flex gap-4">
          {/* Left side - Image/Icon */}
          <div className="flex-shrink-0">
            {imageUrl ? (
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-primary to-secondary">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <MaterialIcon name="restaurant" className="text-white text-4xl" />
              </div>
            )}
          </div>

          {/* Right side - Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 truncate">{name}</h3>
                <div className="flex items-center gap-1 text-sm text-text-muted">
                  <MaterialIcon name="location_on" size="sm" />
                  <span className="truncate">{address}</span>
                </div>
              </div>

              {distance !== undefined && (
                <div className="ml-3 flex-shrink-0 text-right">
                  <span className="text-sm font-bold text-slate-900">
                    {formatDistance(distance)}
                  </span>
                </div>
              )}
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-4 mb-2">
              {/* General Rating */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {renderStars(rating, 'star')}
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {rating.toFixed(1)}
                </span>
              </div>

              {/* Sauce Rating */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {renderStars(sauceRating, 'heart')}
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {sauceRating.toFixed(1)}
                </span>
              </div>

              {/* Average */}
              <div className="flex items-center gap-1 text-sm text-text-muted">
                <span>Snitt:</span>
                <span className="font-bold text-slate-900">{averageRating}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <span>
                  {reviewCount} {reviewCount === 1 ? 'recension' : 'recensioner'}
                </span>
                {priceRange && <span>• {priceRange} kr</span>}
              </div>

              {isOpen !== undefined && (
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isOpen ? 'bg-success' : 'bg-error'
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isOpen ? 'text-success' : 'text-error'
                    }`}
                  >
                    {isOpen ? 'Öppet' : 'Stängt'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
