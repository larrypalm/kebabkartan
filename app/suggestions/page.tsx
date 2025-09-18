'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AccountLayout from '@/app/components/AccountLayout';
import { useAuth } from '@/app/contexts/AuthContext';
import { useGoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { trackSuggestionSubmitAttempt, trackSuggestionSubmitSuccess, trackSuggestionSubmitError, trackNavClick } from '@/app/utils/analytics';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

function SuggestionsForm() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    restaurantName: '',
    address: '',
    city: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    trackSuggestionSubmitAttempt();

    try {
      // Get reCAPTCHA token
      if (!executeRecaptcha) {
        setMessage({ type: 'error', text: 'reCAPTCHA is not available. Please refresh the page and try again.' });
        setIsLoading(false);
        return;
      }
      
      const recaptchaToken = await executeRecaptcha('suggestion_submit');
      
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Tack för ditt förslag! Vi kommer att granska det och lägga till restaurangen om den passar in på vår karta.' });
        setFormData({
          restaurantName: '',
          address: '',
          city: ''
        });
        trackSuggestionSubmitSuccess();
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Ett fel uppstod när förslaget skickades.' });
        trackSuggestionSubmitError(errorData?.message || 'suggestion submit error');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Ett fel uppstod när förslaget skickades. Försök igen senare.' });
      trackSuggestionSubmitError(error?.message || 'suggestion submit error');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <AccountLayout isAuthPage={true}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ color: '#6b7280' }}>Laddar...</div>
        </div>
      </AccountLayout>
    );
  }

  if (!user) {
    return (
      <AccountLayout isAuthPage={true}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ color: '#6b7280' }}>Omdirigerar till inloggning...</div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout isAuthPage={true}>
      <div style={{ maxWidth: '100%' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>
          Föreslå en Kebabrestaurang
        </h1>

        <p style={{ 
          color: '#6b7280', 
          marginBottom: '24px', 
          textAlign: 'center',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          Känner du till en bra kebabrestaurang som saknas på vår karta? Fyll i formuläret nedan så lägger vi till den!
        </p>

        {/* Message Display */}
        {message.text && (
          <div style={{
            marginBottom: '24px',
            padding: '16px',
            borderRadius: '6px',
            backgroundColor: message.type === 'success' ? '#dcfce7' : '#fef2f2',
            color: message.type === 'success' ? '#166534' : '#dc2626',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
          }}>
            {message.text}
          </div>
        )}

        {/* Restaurant Suggestion Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Restaurant Name */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Restaurangens namn *
              </label>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="T.ex. Kebab Palace"
              />
            </div>

            {/* Address */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Adress *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="T.ex. Storgatan 123"
              />
            </div>

            {/* City */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Stad *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="T.ex. Stockholm"
              />
            </div>

            {/* Divider */}
            <div style={{ 
              height: '1px', 
              backgroundColor: '#e5e7eb', 
              margin: '8px 0' 
            }} />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Skickar förslag...' : 'Skicka förslag'}
            </button>
          </div>
        </form>

        {/* Back to Home Link */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            type="button"
            onClick={() => { trackNavClick('back_to_home_from_suggestions'); router.push('/'); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            ← Tillbaka till kartan
          </button>
        </div>
      </div>
    </AccountLayout>
  );
}

export default function SuggestionsPage() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      <SuggestionsForm />
    </GoogleReCaptchaProvider>
  );
}
