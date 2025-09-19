// Cookie utility functions
export const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

export const setCookie = (name: string, value: string) => {
    // Session cookie (no expires/max-age = session cookie)
    document.cookie = `${name}=${value}; path=/; SameSite=Lax`;
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
    console.log('getConsentPreferences: Looking for cookie:', CONSENT_COOKIE_NAME);
    console.log('getConsentPreferences: Found cookie value:', consentCookie);
    
    if (!consentCookie) return null;
    
    try {
        const parsed = JSON.parse(consentCookie);
        console.log('getConsentPreferences: Parsed preferences:', parsed);
        return parsed;
    } catch (error) {
        console.error('Error parsing consent cookie:', error);
        return null;
    }
};

export const saveConsentPreferences = (preferences: ConsentPreferences) => {
    setCookie(CONSENT_COOKIE_NAME, JSON.stringify(preferences));
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('consent-updated', { 
        detail: preferences 
    }));
};
