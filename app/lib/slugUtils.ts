// Utility functions for SEO-friendly content

// Extract ID from slug (for backward compatibility)
export const extractIdFromSlug = (slug: string): string | null => {
    // If it's already a UUID, return as is
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(slug)) {
        return slug;
    }
    
    // For slug-based URLs, we'll need to look up the ID
    // This will be handled in the page component
    return null;
};

// Create SEO-friendly title
export const createPlaceTitle = (place: any): string => {
    const city = place.city || 'Sverige';
    return `🔥 ${place.name} | Bästa kebab i ${city} | Kebabkartan`;
};

// Create SEO-friendly description
export const createPlaceDescription = (place: any): string => {
    const city = place.city || 'Sverige';
    return `Upptäck ${place.name} på ${place.address}. Läs äkta recensioner, se betyg från lokala experter och hitta din väg hit. Gratis guide till toppkvalitet kebab i ${city}.`;
};
