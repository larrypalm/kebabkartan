// Type for custom event parameters
interface EventParams {
    [key: string]: any;
}

// Declare gtag as a global variable
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

// Determine if analytics tracking should be enabled
export const isTrackingEnabled = (): boolean => {
    if (typeof window === 'undefined') return false;

    // Allow manual override via env flag
    if (process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === 'true') return false;

    // In development mode, allow analytics without consent for testing
    if (process.env.NODE_ENV === 'development') {
        console.log('Analytics: Development mode - tracking enabled for testing');
        return true;
    }

    // Check cookie consent for analytics
    const consent = localStorage.getItem('kebabkartan-cookie-consent');
    if (consent) {
        try {
            const preferences = JSON.parse(consent);
            return preferences.analytics === true;
        } catch (error) {
            console.warn('Failed to parse cookie consent preferences:', error);
            return false;
        }
    }

    // If no consent given yet, don't track
    return false;
};

/**
 * Send event directly to GA4
 * @param eventName - The name of the event
 * @param params - Additional parameters for the event
 */
export const trackEvent = (eventName: string, params?: EventParams) => {
    if (!isTrackingEnabled()) return;
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
    }
};

// Event names
export const EventNames = {
    PAGE_VIEW: 'page_view',
    KEBAB_PLACE_VIEW: 'kebab_place_view',
    RATING_SUBMITTED: 'rating_submitted',
    RATING_SUBMIT_ATTEMPT: 'rating_submit_attempt',
    RATING_SUBMIT_ERROR: 'rating_submit_error',
    SEARCH: 'search',
    SEARCH_RESULT_SELECT: 'search_result_select',
    SEARCH_OPEN: 'search_open',
    SEARCH_CLEAR: 'search_clear',
    MARKER_CLICK: 'marker_click',
    MARKER_SHARE: 'marker_share',
    MARKER_EXPAND: 'marker_expand',
    MAP_LOADED: 'map_loaded',
    SHOW_ALL_PLACES: 'show_all_places',
    IP_LOCATION_SUCCESS: 'ip_location_success',
    IP_LOCATION_ERROR: 'ip_location_error',
    GEOLOCATION_PERMISSION: 'geolocation_permission',
    AUTH_NAV_CLICK: 'auth_nav_click',
    NAV_CLICK: 'nav_click',
    AUTH_SIGNIN_ATTEMPT: 'auth_signin_attempt',
    AUTH_SIGNIN_SUCCESS: 'auth_signin_success',
    AUTH_SIGNIN_ERROR: 'auth_signin_error',
    AUTH_SIGNUP_ATTEMPT: 'auth_signup_attempt',
    AUTH_SIGNUP_SUCCESS: 'auth_signup_success',
    AUTH_SIGNUP_ERROR: 'auth_signup_error',
    AUTH_CONFIRM_ATTEMPT: 'auth_confirm_attempt',
    AUTH_CONFIRM_SUCCESS: 'auth_confirm_success',
    AUTH_CONFIRM_ERROR: 'auth_confirm_error',
    AUTH_RESEND_CODE: 'auth_resend_code',
    AUTH_FORGOT_PASSWORD_CLICK: 'auth_forgot_password_click',
    SUGGESTION_SUBMIT_ATTEMPT: 'suggestion_submit_attempt',
    SUGGESTION_SUBMIT_SUCCESS: 'suggestion_submit_success',
    SUGGESTION_SUBMIT_ERROR: 'suggestion_submit_error',
    ACCOUNT_VOTE_EDIT_ATTEMPT: 'account_vote_edit_attempt',
    ACCOUNT_VOTE_EDIT_SUCCESS: 'account_vote_edit_success',
    ACCOUNT_VOTE_EDIT_ERROR: 'account_vote_edit_error',
} as const;

// Helper functions for specific events
export const trackPageView = (url: string) => {
    trackEvent(EventNames.PAGE_VIEW, { page_path: url });
};

export const trackKebabPlaceView = (placeId: string, placeName: string) => {
    trackEvent(EventNames.KEBAB_PLACE_VIEW, {
        place_id: placeId,
        place_name: placeName
    });
};

export const trackRatingSubmitted = (placeId: string, placeName: string, rating: number) => {
    trackEvent(EventNames.RATING_SUBMITTED, {
        place_id: placeId,
        place_name: placeName,
        rating: rating
    });
};

export const trackRatingSubmitAttempt = (placeId: string, rating: number) => {
    trackEvent(EventNames.RATING_SUBMIT_ATTEMPT, {
        place_id: placeId,
        rating
    });
};

export const trackRatingSubmitError = (placeId: string, rating: number, message: string) => {
    trackEvent(EventNames.RATING_SUBMIT_ERROR, {
        place_id: placeId,
        rating,
        message
    });
};

export const trackSearch = (query: string) => {
    trackEvent(EventNames.SEARCH, { query });
};

export const trackSearchResultSelect = (placeId: string, placeName: string) => {
    trackEvent(EventNames.SEARCH_RESULT_SELECT, { place_id: placeId, place_name: placeName });
}; 

export const trackSearchOpen = () => {
    trackEvent(EventNames.SEARCH_OPEN);
};

export const trackSearchClear = () => {
    trackEvent(EventNames.SEARCH_CLEAR);
};

export const trackMarkerClick = (placeId: string, placeName: string) => {
    trackEvent(EventNames.MARKER_CLICK, { place_id: placeId, place_name: placeName });
};

export const trackMarkerShare = (placeId: string, placeName: string, method: 'webshare' | 'clipboard') => {
    trackEvent(EventNames.MARKER_SHARE, { place_id: placeId, place_name: placeName, method });
};

export const trackMarkerExpand = (placeId: string, placeName: string, expanded: boolean) => {
    trackEvent(EventNames.MARKER_EXPAND, { place_id: placeId, place_name: placeName, expanded });
};

export const trackMapLoaded = () => {
    trackEvent(EventNames.MAP_LOADED);
};

export const trackShowAllPlaces = () => {
    trackEvent(EventNames.SHOW_ALL_PLACES);
};

export const trackIpLocationSuccess = (latitude: number, longitude: number) => {
    trackEvent(EventNames.IP_LOCATION_SUCCESS, { latitude, longitude });
};

export const trackIpLocationError = (message: string) => {
    trackEvent(EventNames.IP_LOCATION_ERROR, { message });
};

export const trackGeolocationPermission = (state: PermissionState) => {
    trackEvent(EventNames.GEOLOCATION_PERMISSION, { state });
};

export const trackAuthNavClick = (target: 'auth' | 'my-account') => {
    trackEvent(EventNames.AUTH_NAV_CLICK, { target });
};

export const trackNavClick = (target: string) => {
    trackEvent(EventNames.NAV_CLICK, { target });
};

export const trackAuthSigninAttempt = () => trackEvent(EventNames.AUTH_SIGNIN_ATTEMPT);
export const trackAuthSigninSuccess = () => trackEvent(EventNames.AUTH_SIGNIN_SUCCESS);
export const trackAuthSigninError = (message: string) => trackEvent(EventNames.AUTH_SIGNIN_ERROR, { message });

export const trackAuthSignupAttempt = () => trackEvent(EventNames.AUTH_SIGNUP_ATTEMPT);
export const trackAuthSignupSuccess = () => trackEvent(EventNames.AUTH_SIGNUP_SUCCESS);
export const trackAuthSignupError = (message: string) => trackEvent(EventNames.AUTH_SIGNUP_ERROR, { message });

export const trackAuthConfirmAttempt = () => trackEvent(EventNames.AUTH_CONFIRM_ATTEMPT);
export const trackAuthConfirmSuccess = () => trackEvent(EventNames.AUTH_CONFIRM_SUCCESS);
export const trackAuthConfirmError = (message: string) => trackEvent(EventNames.AUTH_CONFIRM_ERROR, { message });

export const trackAuthResendCode = () => trackEvent(EventNames.AUTH_RESEND_CODE);
export const trackAuthForgotPasswordClick = () => trackEvent(EventNames.AUTH_FORGOT_PASSWORD_CLICK);

export const trackSuggestionSubmitAttempt = () => trackEvent(EventNames.SUGGESTION_SUBMIT_ATTEMPT);
export const trackSuggestionSubmitSuccess = () => trackEvent(EventNames.SUGGESTION_SUBMIT_SUCCESS);
export const trackSuggestionSubmitError = (message: string) => trackEvent(EventNames.SUGGESTION_SUBMIT_ERROR, { message });

export const trackAccountVoteEditAttempt = (placeId: string, newRating: number) =>
    trackEvent(EventNames.ACCOUNT_VOTE_EDIT_ATTEMPT, { place_id: placeId, rating: newRating });
export const trackAccountVoteEditSuccess = (placeId: string, newRating: number) =>
    trackEvent(EventNames.ACCOUNT_VOTE_EDIT_SUCCESS, { place_id: placeId, rating: newRating });
export const trackAccountVoteEditError = (placeId: string, newRating: number, message: string) =>
    trackEvent(EventNames.ACCOUNT_VOTE_EDIT_ERROR, { place_id: placeId, rating: newRating, message });