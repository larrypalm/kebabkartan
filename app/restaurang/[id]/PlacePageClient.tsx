'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { trackKebabPlaceView } from '@/app/utils/analytics';
import Header from '@/app/components/layout/Header';
import BottomNavigation from '@/app/components/layout/BottomNavigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { MaterialIcon } from '@/app/components/Icons';
import { Card, Button, Modal } from '@/app/components/ui';
import ReviewList from '@/app/components/ui/ReviewList';
import ReviewForm from '@/app/components/ui/ReviewForm';
import type { Restaurant, Review } from '@/app/types';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

// Dynamically import Map component
const RestaurantMap = dynamic(
    () => import('@/app/components/Map'),
    {
        loading: () => (
            <div className="w-full h-64 bg-slate-200 animate-pulse rounded-lg"></div>
        ),
        ssr: false
    }
);

export default function PlacePageClient({ id }: { id: string }) {
    const router = useRouter();
    const { user } = useAuth();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(false);

    // Fetch restaurant data
    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await fetch('/api/kebab-places');
                const places = await response.json();

                // The id from URL is like "jungfruplatsens-pizzeria"
                // The slug in database is like "restaurang/jungfruplatsens-pizzeria"
                const place = places.find((p: any) => p.slug === `restaurang/${id}` || p.slug === id);

                if (!place) {
                    console.warn('Place not found:', id);
                    router.push('/');
                    return;
                }

                setRestaurant(place);
                trackKebabPlaceView(place.id, place.name, place.city);
                document.title = `${place.name} | Betygsätt och recensera | Kebabkartan`;
            } catch (error) {
                console.error('Error fetching restaurant:', error);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [id, router]);

    // Fetch reviews for this restaurant
    useEffect(() => {
        if (!restaurant) return;

        const fetchReviews = async () => {
            setLoadingReviews(true);
            try {
                const response = await fetch(`/api/reviews?restaurantId=${restaurant.id}`);
                const data = await response.json();
                setReviews(data.reviews || []);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoadingReviews(false);
            }
        };

        fetchReviews();
    }, [restaurant]);

    const handleReviewSubmitted = () => {
        setShowReviewModal(false);
        // Refresh reviews
        if (restaurant) {
            fetch(`/api/reviews?restaurantId=${restaurant.id}`)
                .then(res => res.json())
                .then(data => setReviews(data.reviews || []))
                .catch(err => console.error('Error refreshing reviews:', err));
        }
    };

    if (loading) {
        return (
            <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
                <Header
                    isLoggedIn={!!user}
                    userName={user?.username}
                    onSearch={(query) => console.log('Search:', query)}
                    onLoginClick={() => window.location.href = '/login'}
                    onProfileClick={() => window.location.href = '/profil'}
                    onLogoutClick={() => window.location.href = '/logout'}
                />
                <div className="flex items-center justify-center min-h-screen bg-background-light">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
                        <p className="text-slate-700 font-medium">Laddar restaurang...</p>
                    </div>
                </div>
            </GoogleReCaptchaProvider>
        );
    }

    if (!restaurant) {
        return null;
    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
            {/* Header Navigation */}
            <Header
                isLoggedIn={!!user}
                userName={user?.username}
                onSearch={(query) => console.log('Search:', query)}
                onLoginClick={() => window.location.href = '/login'}
                onProfileClick={() => window.location.href = '/profil'}
                onLogoutClick={() => window.location.href = '/logout'}
            />

            <main role="main" className="min-h-screen bg-background-light pb-20 md:pb-8">
                {/* Back Button - Fixed at top */}
                <div className="bg-white border-b border-slate-200 sticky top-0 z-10 md:relative">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <MaterialIcon name="arrow_back" size="sm" />
                            <span className="hidden md:inline text-sm font-medium">Tillbaka</span>
                        </button>
                    </div>
                </div>

                {/* Map Section */}
                {restaurant && (
                    <div className="w-full h-64 md:h-80 relative place-page-map-container">
                        <RestaurantMap
                            initialPlaceSlug={id}
                            initialCenter={[restaurant.latitude, restaurant.longitude]}
                            initialZoom={15}
                        />
                    </div>
                )}

                {/* Restaurant Info Section */}
                <div className="bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {/* Restaurant Name */}
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-2">
                            {restaurant.name}
                        </h1>

                        {/* Tags/Categories */}
                        {restaurant.tags && restaurant.tags.length > 0 && (
                            <div className="flex justify-center gap-2 mb-6">
                                {restaurant.tags.map((tag, index) => (
                                    <span key={index} className="text-slate-600">
                                        {tag}{index < restaurant.tags!.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Dual Ratings */}
                        <div className="grid grid-cols-2 gap-4 mb-6 max-w-2xl mx-auto">
                            {/* General Rating Card */}
                            <Card className="text-center py-6">
                                <MaterialIcon name="star" fill className="text-primary text-3xl mx-auto mb-2" />
                                <div className="text-4xl font-bold text-slate-900 mb-1">
                                    {restaurant.rating.toFixed(1)}
                                </div>
                                <div className="text-slate-600">Totalt</div>
                            </Card>

                            {/* Sauce Rating Card */}
                            <Card className="text-center py-6">
                                <MaterialIcon name="emoji_events" fill className="text-secondary text-3xl mx-auto mb-2" />
                                <div className="text-4xl font-bold text-slate-900 mb-1">
                                    {restaurant.sauceRating?.toFixed(1) || restaurant.rating.toFixed(1)}
                                </div>
                                <div className="text-slate-600">Sås</div>
                            </Card>
                        </div>

                        {/* Address with Get Directions */}
                        <div className="flex items-center justify-between py-4 border-t border-b border-slate-200 mb-2">
                            <div className="flex items-center gap-3">
                                <MaterialIcon name="map" className="text-slate-600" />
                                <span className="text-slate-900">{restaurant.address}</span>
                            </div>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary font-medium hover:text-secondary transition-colors"
                            >
                                Get Directions
                            </a>
                        </div>

                        {/* Phone with Call */}
                        {restaurant.phone && (
                            <div className="flex items-center justify-between py-4 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <MaterialIcon name="phone" className="text-slate-600" />
                                    <span className="text-slate-900">{restaurant.phone}</span>
                                </div>
                                <a
                                    href={`tel:${restaurant.phone}`}
                                    className="text-primary font-medium hover:text-secondary transition-colors"
                                >
                                    Call
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                Recensioner
                            </h2>
                        </div>

                        {loadingReviews ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                            </div>
                        ) : reviews.length > 0 ? (
                            <ReviewList
                                reviews={reviews}
                                restaurantId={restaurant.id}
                                currentUserId={user?.userId}
                                onReviewUpdated={() => {
                                    // Refresh reviews
                                    fetch(`/api/reviews?restaurantId=${restaurant.id}`)
                                        .then(res => res.json())
                                        .then(data => setReviews(data.reviews || []))
                                        .catch(err => console.error('Error refreshing reviews:', err));
                                }}
                            />
                        ) : null}

                        {/* Write Review Button - Always at bottom */}
                        <div className="mt-8 flex justify-center">
                            <Button
                                onClick={() => setShowReviewModal(true)}
                                variant="primary"
                                size="lg"
                                disabled={!user}
                                className="w-full md:w-auto md:min-w-[300px]"
                            >
                                Skriv recension
                            </Button>
                        </div>
                        {!user && (
                            <p className="text-sm text-slate-600 text-center mt-3">
                                Logga in för att skriva recension
                            </p>
                        )}
                    </div>
                </div>

                {/* Review Modal */}
                {showReviewModal && (
                    <Modal
                        isOpen={showReviewModal}
                        onClose={() => setShowReviewModal(false)}
                        title="Skriv en recension"
                    >
                        <ReviewForm
                            restaurantId={restaurant.id}
                            restaurantName={restaurant.name}
                            userId={user?.userId || ''}
                            username={user?.username || ''}
                            onSuccess={handleReviewSubmitted}
                            onCancel={() => setShowReviewModal(false)}
                        />
                    </Modal>
                )}
            </main>

            {/* Bottom Navigation for Mobile */}
            <BottomNavigation />
        </GoogleReCaptchaProvider>
    );
} 