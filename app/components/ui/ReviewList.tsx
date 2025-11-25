'use client';

import React, { useState, useEffect } from 'react';
import { MaterialIcon } from '@/app/components/Icons';
import ReviewCard from './ReviewCard';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import type { Review } from '@/app/types';

export interface ReviewListProps {
  restaurantId: string;
  currentUserId?: string;
  onReviewEdit?: (review: Review) => void;
  onReviewDelete?: (reviewId: string) => Promise<void>;
  onReviewLike?: (reviewId: string) => Promise<void>;
  initialReviews?: Review[];
  showLoadMore?: boolean;
  className?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  restaurantId,
  currentUserId,
  onReviewEdit,
  onReviewDelete,
  onReviewLike,
  initialReviews,
  showLoadMore = true,
  className = '',
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialReviews);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // Fetch reviews
  useEffect(() => {
    if (!initialReviews) {
      fetchReviews();
    }
  }, [restaurantId, initialReviews]);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/reviews?restaurantId=${restaurantId}`
      );

      if (!response.ok) {
        throw new Error('Misslyckades att hämta recensioner');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
      setHasMore(false); // For now, load all at once
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Kunde inte ladda recensioner');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (reviewId: string) => {
    if (!currentUserId) {
      alert('Du måste vara inloggad för att gilla recensioner');
      return;
    }

    try {
      if (onReviewLike) {
        await onReviewLike(reviewId);
      }

      // Optimistically update UI
      setReviews((prevReviews) =>
        prevReviews.map((review) => {
          if (review.id === reviewId) {
            const isLiked = review.likedBy?.includes(currentUserId);
            return {
              ...review,
              likes: isLiked ? review.likes - 1 : review.likes + 1,
              likedBy: isLiked
                ? review.likedBy.filter((id) => id !== currentUserId)
                : [...(review.likedBy || []), currentUserId],
            };
          }
          return review;
        })
      );

      // Also call the API
      await fetch(`/api/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });
    } catch (err) {
      console.error('Error liking review:', err);
      // Revert optimistic update on error
      fetchReviews();
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Är du säker på att du vill ta bort din recension?')) {
      return;
    }

    try {
      if (onReviewDelete) {
        await onReviewDelete(reviewId);
      } else {
        const response = await fetch(
          `/api/reviews?id=${reviewId}&userId=${currentUserId}`,
          { method: 'DELETE' }
        );

        if (!response.ok) {
          throw new Error('Misslyckades att ta bort recension');
        }
      }

      // Remove from UI
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Kunde inte ta bort recensionen. Försök igen.');
    }
  };

  // Sort reviews
  const sortedReviews = React.useMemo(() => {
    const sorted = [...reviews];

    switch (sortBy) {
      case 'newest':
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'highest':
        return sorted.sort((a, b) => {
          const avgA = (a.generalRating + a.sauceRating) / 2;
          const avgB = (b.generalRating + b.sauceRating) / 2;
          return avgB - avgA;
        });
      case 'lowest':
        return sorted.sort((a, b) => {
          const avgA = (a.generalRating + a.sauceRating) / 2;
          const avgB = (b.generalRating + b.sauceRating) / 2;
          return avgA - avgB;
        });
      default:
        return sorted;
    }
  }, [reviews, sortBy]);

  if (isLoading) {
    return (
      <div className={`flex justify-center py-12 ${className}`}>
        <LoadingSpinner size="lg" text="Laddar recensioner..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <MaterialIcon name="error" className="text-error text-4xl mb-4" />
        <p className="text-slate-700 font-medium mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchReviews}>
          Försök igen
        </Button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <MaterialIcon name="rate_review" className="text-slate-400 text-4xl" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Inga recensioner än
        </h3>
        <p className="text-text-muted">
          Bli den första att skriva en recension!
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header with sort options */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">
          {reviews.length} {reviews.length === 1 ? 'recension' : 'recensioner'}
        </h3>

        {/* Sort dropdown */}
        <div className="relative">
          <label htmlFor="review-sort" className="sr-only">
            Sortera recensioner
          </label>
          <select
            id="review-sort"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as 'newest' | 'highest' | 'lowest')
            }
            className="px-4 py-2 pr-8 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:border-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer appearance-none"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
            }}
          >
            <option value="newest">Nyaste först</option>
            <option value="highest">Högsta betyg</option>
            <option value="lowest">Lägsta betyg</option>
          </select>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            userName={review.username}
            userAvatar={review.userAvatar}
            generalRating={review.generalRating}
            sauceRating={review.sauceRating}
            generalText={review.generalText}
            sauceText={review.sauceText}
            likes={review.likes}
            isLiked={review.likedBy?.includes(currentUserId || '')}
            createdAt={review.createdAt}
            isEdited={review.isEdited}
            onLike={onReviewLike ? () => handleLike(review.id) : undefined}
            onEdit={
              review.userId === currentUserId && onReviewEdit
                ? () => onReviewEdit(review)
                : undefined
            }
            onDelete={
              review.userId === currentUserId
                ? () => handleDelete(review.id)
                : undefined
            }
            isOwner={review.userId === currentUserId}
          />
        ))}
      </div>

      {/* Load more button */}
      {showLoadMore && hasMore && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              // Implement pagination if needed
              setPage(page + 1);
            }}
          >
            Ladda fler recensioner
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
