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

/**
 * Send event directly to GA4
 * @param eventName - The name of the event
 * @param params - Additional parameters for the event
 */
export const trackEvent = (eventName: string, params?: EventParams) => {
    console.log('trackEvent', eventName, params);
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
    }
};

// Event names
export const EventNames = {
    PAGE_VIEW: 'page_view',
    KEBAB_PLACE_VIEW: 'kebab_place_view',
    RATING_SUBMITTED: 'rating_submitted',
    SEARCH: 'search',
    SEARCH_RESULT_SELECT: 'search_result_select',
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

export const trackSearch = (query: string) => {
    trackEvent(EventNames.SEARCH, { query });
};

export const trackSearchResultSelect = (placeId: string, placeName: string) => {
    trackEvent(EventNames.SEARCH_RESULT_SELECT, { place_id: placeId, place_name: placeName });
}; 