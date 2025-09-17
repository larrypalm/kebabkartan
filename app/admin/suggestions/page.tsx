'use client';

import { useState, useEffect } from 'react';
import AccountLayout from '@/app/components/AccountLayout';

interface Suggestion {
  id: string;
  restaurantName: string;
  address: string;
  city: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/suggestions');
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        setError('Kunde inte hämta förslag');
      }
    } catch (err) {
      setError('Ett fel uppstod');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AccountLayout>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ color: '#6b7280' }}>Laddar förslag...</div>
        </div>
      </AccountLayout>
    );
  }

  if (error) {
    return (
      <AccountLayout>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ color: '#dc2626' }}>{error}</div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div style={{ maxWidth: '100%' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>
          Administrera Förslag
        </h1>

        {suggestions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Inga förslag ännu
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#f9fafb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    {suggestion.restaurantName}
                  </h3>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: suggestion.status === 'pending' ? '#fef3c7' : suggestion.status === 'approved' ? '#dcfce7' : '#fef2f2',
                    color: suggestion.status === 'pending' ? '#92400e' : suggestion.status === 'approved' ? '#166534' : '#dc2626'
                  }}>
                    {suggestion.status === 'pending' ? 'Väntar' : suggestion.status === 'approved' ? 'Godkänd' : 'Avvisad'}
                  </span>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <strong>Adress:</strong> {suggestion.address}, {suggestion.city}
                </div>
                
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Inlämnad: {new Date(suggestion.createdAt).toLocaleDateString('sv-SE')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
