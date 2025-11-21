// Cookie utility functions
export const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

export const setCookie = (
    name: string,
    value: string,
    ttlDays: number,
) => {
    const maxAge = ttlDays * 24 * 60 * 60; // days -> seconds
    const isSecure = window.location.protocol === 'https:';

    let cookie = `${name}=${value}; path=/; SameSite=Lax; max-age=${maxAge}`;

    if (isSecure) {
        cookie += '; Secure';
    }

    document.cookie = cookie;
};

export const deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export interface ConsentPreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

export const CONSENT_COOKIE_NAME = 'kebabkartan-cookie-consent';

export const getConsentPreferences = (): ConsentPreferences | null => {
    const consentCookie = getCookie(CONSENT_COOKIE_NAME);

    if (!consentCookie) return null;

    try {
        const parsed = JSON.parse(consentCookie);

        return parsed;
    } catch (error) {
        console.error('Error parsing consent cookie:', error);
        return null;
    }
};

export const saveConsentPreferences = (
    preferences: ConsentPreferences,
    ttlDays: number = 180 // e.g. 6 months; change to 30 if you prefer
) => {
    setCookie(CONSENT_COOKIE_NAME, JSON.stringify(preferences), ttlDays);

    window.dispatchEvent(
        new CustomEvent('consent-updated', { detail: preferences })
    );
};