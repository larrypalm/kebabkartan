'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { signOut, updatePassword, updateUserAttributes } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import AccountLayout from '@/app/components/AccountLayout';
import { trackAccountVoteEditAttempt, trackAccountVoteEditSuccess, trackAccountVoteEditError } from '@/app/utils/analytics';

export default function MyAccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log('MyAccountPage: user:', user, 'loading:', loading);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [userVotes, setUserVotes] = useState<any[]>([]);
  const [loadingVotes, setLoadingVotes] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<{[key: string]: any}>({});
  const [editingVote, setEditingVote] = useState<string | null>(null);

  const fetchUserVotes = async () => {
    if (!user) return;
    
    setLoadingVotes(true);
    try {
      const response = await fetch(`/api/user-votes?userId=${encodeURIComponent(user.username)}`);
      if (response.ok) {
        const data = await response.json();
        const votes = data.votes || [];
        setUserVotes(votes);
        
        // Fetch place details for each vote
        const placeDetailsMap: {[key: string]: any} = {};
        for (const vote of votes) {
          try {
            const placeResponse = await fetch(`/api/kebab-places/${vote.placeId}`);
            if (placeResponse.ok) {
              const placeData = await placeResponse.json();
              placeDetailsMap[vote.placeId] = placeData;
            }
          } catch (error) {
            console.error(`Error fetching place details for ${vote.placeId}:`, error);
          }
        }
        setPlaceDetails(placeDetailsMap);
      }
    } catch (error) {
      console.error('Error fetching user votes:', error);
    } finally {
      setLoadingVotes(false);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      setFormData(prev => ({
        ...prev,
        email: user.signInDetails?.loginId || user.username || '',
        name: (user as any).attributes?.name || '',
      }));
      fetchUserVotes();
    }
  }, [user, loading]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setMessage({ type: 'error', text: 'Utloggning misslyckades' });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const attributesToUpdate: any = {};
      
      if (formData.name && formData.name !== (user as any)?.attributes?.name) {
        attributesToUpdate.name = formData.name;
      }

      if (Object.keys(attributesToUpdate).length > 0) {
        await updateUserAttributes({
          userAttributes: attributesToUpdate
        });
        setMessage({ type: 'success', text: 'Profil uppdaterad!' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'info', text: 'Inga ändringar att spara' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Profiluppdatering misslyckades' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Nya lösenorden matchar inte' });
      setIsLoading(false);
      return;
    }

    try {
      await updatePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setMessage({ type: 'success', text: 'Lösenord uppdaterat!' });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Lösenordsuppdatering misslyckades' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditVote = async (placeId: string, newRating: number) => {
    // Find the current vote for this place
    const currentVote = userVotes.find(vote => vote.placeId === placeId);
    
    // Check if user is trying to vote the same rating they already have
    if (currentVote && currentVote.rating === newRating) {
      setEditingVote(null); // Exit edit mode
      return; // Don't submit if it's the same vote
    }

    try {
      trackAccountVoteEditAttempt(placeId, newRating);
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placeId,
          rating: newRating,
          recaptchaToken: 'bypass-for-edit', // We'll need to handle this differently
          userId: user?.username,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        trackAccountVoteEditError(placeId, newRating, errorText || 'Failed to update rating');
        throw new Error(errorText || 'Failed to update rating');
      }

      // Refresh votes after successful update
      await fetchUserVotes();
      setEditingVote(null);
      setMessage({ type: 'success', text: 'Röst uppdaterad!' });
      trackAccountVoteEditSuccess(placeId, newRating);
    } catch (error) {
      console.error('Error updating vote:', error);
      setMessage({ type: 'error', text: 'Röstuppdatering misslyckades. Försök igen.' });
    }
  };

  if (loading) {
    return (
      <AccountLayout showMap={false}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '20px' }}>Laddar...</div>
        </div>
      </AccountLayout>
    );
  }

  if (!user) {
    return (
      <AccountLayout showMap={false}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Åtkomst krävs</h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Du behöver vara inloggad för att komma åt ditt konto.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                width: '100%',
                backgroundColor: '#eab308',
                color: 'white',
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Uppdatera sida
            </button>
            <button
              onClick={() => router.push('/auth')}
              style={{
                width: '100%',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Gå till inloggning
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                width: '100%',
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Gå till hem
            </button>
          </div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div style={{ maxWidth: '100%' }}>
        {/* Navigation Tabs */}
        <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
          <nav style={{ display: 'flex' }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                padding: '16px 24px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: activeTab === 'profile' ? '#dbeafe' : 'transparent',
                color: activeTab === 'profile' ? '#2563eb' : '#6b7280',
                border: 'none',
                borderBottom: activeTab === 'profile' ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Profil
            </button>
            <button
              onClick={() => setActiveTab('security')}
              style={{
                padding: '16px 24px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: activeTab === 'security' ? '#dbeafe' : 'transparent',
                color: activeTab === 'security' ? '#2563eb' : '#6b7280',
                border: 'none',
                borderBottom: activeTab === 'security' ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Säkerhet
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              style={{
                padding: '16px 24px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: activeTab === 'preferences' ? '#dbeafe' : 'transparent',
                color: activeTab === 'preferences' ? '#2563eb' : '#6b7280',
                border: 'none',
                borderBottom: activeTab === 'preferences' ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Inställningar
            </button>
            <button
              onClick={() => setActiveTab('votes')}
              style={{
                padding: '16px 24px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: activeTab === 'votes' ? '#dbeafe' : 'transparent',
                color: activeTab === 'votes' ? '#2563eb' : '#6b7280',
                border: 'none',
                borderBottom: activeTab === 'votes' ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Mina röster
            </button>
          </nav>
        </div>

        {/* Content */}
        <div>
          {/* Message Display */}
          {message.text && (
            <div style={{
              marginBottom: '24px',
              padding: '16px',
              borderRadius: '6px',
              backgroundColor: message.type === 'success' ? '#dcfce7' : 
                              message.type === 'error' ? '#fef2f2' : '#dbeafe',
              color: message.type === 'success' ? '#166534' : 
                     message.type === 'error' ? '#dc2626' : '#1d4ed8',
              border: `1px solid ${message.type === 'success' ? '#bbf7d0' : 
                                message.type === 'error' ? '#fecaca' : '#bfdbfe'}`
            }}>
              {message.text}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Profilinformation</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {isEditing ? 'Avbryt' : 'Redigera profil'}
                </button>
              </div>

              <form onSubmit={handleUpdateProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      E-postadress
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled={true}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: '#f9fafb',
                        color: '#6b7280',
                        cursor: 'not-allowed'
                      }}
                      placeholder="E-postadress"
                    />
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      E-postadressen kan inte ändras här
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Fullständigt namn
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: isEditing ? 'white' : '#f9fafb',
                        color: isEditing ? '#111827' : '#6b7280'
                      }}
                      placeholder="Ange ditt fullständiga namn"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Säkerhetsinställningar</h2>
              
              <form onSubmit={handleUpdatePassword} style={{ maxWidth: '400px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Nuvarande lösenord
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Nytt lösenord
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px'
                      }}
                      required
                      minLength={8}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Bekräfta nytt lösenord
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px'
                      }}
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    marginTop: '24px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '8px 24px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1
                  }}
                >
                  {isLoading ? 'Uppdaterar...' : 'Uppdatera lösenord'}
                </button>
              </form>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Inställningar</h2>
            
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '12px' }}>Kontoåtgärder</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                      onClick={handleSignOut}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Logga ut
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Votes Tab */}
          {activeTab === 'votes' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Mina röster</h2>
              
              {loadingVotes ? (
                <div style={{ textAlign: 'center', padding: '32px' }}>
                  <div style={{ color: '#6b7280' }}>Laddar dina röster...</div>
                </div>
              ) : userVotes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px' }}>
                  <div style={{ color: '#6b7280', marginBottom: '16px' }}>Du har inte röstat på några kebabställen än.</div>
                  <button
                    onClick={() => router.push('/')}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Bläddra kebabställen
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {userVotes.map((vote) => (
                    <div key={vote.placeId} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontWeight: '500' }}>
                              {placeDetails[vote.placeId]?.name || `Place ID: ${vote.placeId}`}
                            </span>
                            <div style={{ display: 'flex' }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} style={{ fontSize: '18px' }}>
                                  {star <= vote.rating ? '❤️' : '🤍'}
                                </span>
                              ))}
                            </div>
                          </div>
                          {placeDetails[vote.placeId]?.address && (
                            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                              {placeDetails[vote.placeId].address}
                            </div>
                          )}
                          <div style={{ fontSize: '14px', color: '#4b5563' }}>
                            Betygsatt {vote.rating} stjärn{vote.rating > 1 ? 'or' : 'a'} den{' '}
                            {new Date(vote.createdAt).toLocaleDateString()}
                            {vote.updatedAt !== vote.createdAt && (
                              <span style={{ marginLeft: '8px' }}>
                                (Uppdaterad {new Date(vote.updatedAt).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => router.push(`/place/${vote.placeId}`)}
                            style={{
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '4px',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Visa ställe
                          </button>
                          {editingVote === vote.placeId ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ display: 'flex' }}>
                                {[1, 2, 3, 4, 5].map((star) => {
                                  const isAlreadyVoted = vote.rating === star;
                                  return (
                                    <button
                                      key={star}
                                      onClick={() => handleEditVote(vote.placeId, star)}
                                      style={{
                                        fontSize: '18px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: isAlreadyVoted ? 'not-allowed' : 'pointer',
                                        transform: 'scale(1)',
                                        transition: 'transform 0.2s'
                                      }}
                                      title={isAlreadyVoted ? 'Du har redan röstat denna betyg' : `Betygsätt ${star} stjärn${star > 1 ? 'or' : 'a'}`}
                                    >
                                      {star <= vote.rating ? '❤️' : '🤍'}
                                    </button>
                                  );
                                })}
                              </div>
                              <button
                                onClick={() => setEditingVote(null)}
                                style={{
                                  backgroundColor: '#6b7280',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                Avbryt
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingVote(vote.placeId)}
                              style={{
                                backgroundColor: '#eab308',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              Redigera röst
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AccountLayout>
  );
}
