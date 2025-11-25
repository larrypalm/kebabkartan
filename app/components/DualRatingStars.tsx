'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { trackRatingSubmitted, trackRatingSubmitAttempt, trackRatingSubmitError } from '@/app/utils/analytics';
import DualRatingInput from './ui/DualRatingInput';
import { Button } from './ui';

interface DualRatingStarsProps {
    placeId: string;
    currentGeneralRating: number;
    currentSauceRating: number;
    totalVotes: number;
}

const DualRatingStars: React.FC<DualRatingStarsProps> = ({
    placeId,
    currentGeneralRating,
    currentSauceRating,
    totalVotes
}) => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const { user, loading } = useAuth();
    const router = useRouter();

    const [generalRating, setGeneralRating] = useState<number>(0);
    const [sauceRating, setSauceRating] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [userVote, setUserVote] = useState<{ generalRating: number; sauceRating: number } | null>(null);
    const [loadingVote, setLoadingVote] = useState<boolean>(false);
    const [showRatingInput, setShowRatingInput] = useState<boolean>(false);
    const fetchingRef = useRef<boolean>(false);

    const username = useMemo(() => user?.username, [user?.username]);

    // Fetch user's vote for this place
    useEffect(() => {
        const fetchUserVote = async () => {
            if (!username) {
                setUserVote(null);
                return;
            }

            if (fetchingRef.current) {
                return;
            }

            fetchingRef.current = true;
            setLoadingVote(true);
            try {
                const response = await fetch(`/api/user-votes/${placeId}?userId=${encodeURIComponent(username)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.vote) {
                        const vote = {
                            generalRating: data.vote.generalRating || data.vote.rating || 0,
                            sauceRating: data.vote.sauceRating || data.vote.rating || 0,
                        };
                        setUserVote(vote);
                        setGeneralRating(vote.generalRating);
                        setSauceRating(vote.sauceRating);
                    } else {
                        setUserVote(null);
                    }
                }
            } catch (error) {
                console.error('Error fetching user vote:', error);
            } finally {
                setLoadingVote(false);
                fetchingRef.current = false;
            }
        };

        if (username) {
            fetchUserVote();
        } else {
            setUserVote(null);
        }
    }, [username, placeId]);

    const handleSubmit = async () => {
        if (isSubmitting) return;

        // Check if user is authenticated
        if (!user) {
            const shouldSignIn = confirm('Du behöver logga in för att rösta på kebabställen. Vill du logga in nu?');
            if (shouldSignIn) {
                router.push('/auth');
            }
            return;
        }

        // Validate ratings
        if (generalRating === 0 || sauceRating === 0) {
            alert('Vänligen betygsätt både allmänt och sås innan du skickar.');
            return;
        }

        // Check if vote hasn't changed
        if (userVote && userVote.generalRating === generalRating && userVote.sauceRating === sauceRating) {
            return;
        }

        if (!executeRecaptcha) {
            alert("reCAPTCHA är inte redo. Försök igen om en stund.");
            return;
        }

        setIsSubmitting(true);
        trackRatingSubmitAttempt(placeId, generalRating);

        try {
            const token = await executeRecaptcha('submit_rating');

            const response = await fetch('/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    placeId,
                    generalRating,
                    sauceRating,
                    recaptchaToken: token,
                    userId: user.username,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                trackRatingSubmitError(placeId, generalRating, errorText || 'Misslyckades att uppdatera betyg');
                throw new Error(errorText || 'Misslyckades att uppdatera betyg');
            }

            // Track the rating submission
            trackRatingSubmitted(placeId, 'Kebab Place', generalRating);

            // Update user vote state
            setUserVote({ generalRating, sauceRating });
            setShowRatingInput(false);

            window.location.reload();
        } catch (error) {
            console.error('Error updating rating:', error);
            alert('Misslyckades att uppdatera betyg. Försök igen.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingVote) {
        return (
            <div className="p-4 text-center text-sm text-text-muted">
                Laddar ditt betyg...
            </div>
        );
    }

    return (
        <div className="space-y-4 p-4">
            {/* Current ratings display */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Genomsnittsbetyg:</span>
                    <div className="flex gap-3">
                        <span className="font-medium">
                            ⭐ {currentGeneralRating.toFixed(1)}
                        </span>
                        <span className="font-medium text-primary">
                            ❤️ {currentSauceRating.toFixed(1)}
                        </span>
                    </div>
                </div>
                <div className="text-xs text-text-muted text-right">
                    {totalVotes} röst{totalVotes !== 1 ? 'er' : ''}
                </div>
            </div>

            {/* User's vote or rating input */}
            {!user ? (
                <div className="text-center">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push('/auth')}
                    >
                        Logga in för att betygsätta
                    </Button>
                </div>
            ) : userVote && !showRatingInput ? (
                <div className="space-y-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <div className="text-sm font-medium text-slate-900">
                        Ditt betyg:
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">Allmänt:</span>
                        <span className="font-bold">⭐ {userVote.generalRating}/5</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">Sås:</span>
                        <span className="font-bold text-primary">❤️ {userVote.sauceRating}/5</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setShowRatingInput(true)}
                    >
                        Ändra betyg
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    <DualRatingInput
                        generalRating={generalRating}
                        sauceRating={sauceRating}
                        onGeneralRatingChange={setGeneralRating}
                        onSauceRatingChange={setSauceRating}
                        disabled={isSubmitting}
                        size="sm"
                        variant="inline"
                    />
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSubmit}
                            disabled={isSubmitting || generalRating === 0 || sauceRating === 0}
                            className="flex-1"
                        >
                            {isSubmitting ? 'Skickar...' : userVote ? 'Uppdatera betyg' : 'Skicka betyg'}
                        </Button>
                        {userVote && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setShowRatingInput(false);
                                    setGeneralRating(userVote.generalRating);
                                    setSauceRating(userVote.sauceRating);
                                }}
                                disabled={isSubmitting}
                            >
                                Avbryt
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DualRatingStars;
