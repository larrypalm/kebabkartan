// Utility functions for SEO-friendly content and URL slugs

/**
 * Convert a string to a URL-friendly slug
 * Example: "Pizza Nisses Stockholm" -> "pizza-nisses-stockholm"
 */
export const createSlug = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        // Replace Swedish characters
        .replace(/å/g, 'a')
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        // Remove special characters
        .replace(/[^\w\s-]/g, '')
        // Replace spaces with hyphens
        .replace(/\s+/g, '-')
        // Remove multiple hyphens
        .replace(/-+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, '');
};

/**
 * Create a restaurant slug from name and city
 * Example: "Pizza Nisses", "Stockholm" -> "restaurang/pizza-nisses-stockholm"
 */
export const createRestaurantSlug = (name: string, city?: string): string => {
    const namePart = createSlug(name);
    const cityPart = city ? `-${createSlug(city)}` : '';
    return `restaurang/${namePart}${cityPart}`;
};

/**
 * Check if a string is a valid UUID
 */
export const isUUID = (str: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

/**
 * Extract ID from slug (for backward compatibility)
 * Returns the ID if it's a UUID, otherwise returns null
 */
export const extractIdFromSlug = (slug: string): string | null => {
    // If it's already a UUID, return as is
    if (isUUID(slug)) {
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
