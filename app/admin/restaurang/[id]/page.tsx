'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface KebabPlace {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    openingHours?: string;
    priceRange?: string;
    slug?: string;
    city?: string;
    tags?: string[];
    rating: number;
    totalVotes: number;
    createdAt: string;
    updatedAt: string;
}

interface EditPlacePageProps {
    params: {
        id: string;
    };
}

export default function EditPlacePage({ params }: EditPlacePageProps) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [place, setPlace] = useState<KebabPlace | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        openingHours: '',
        priceRange: '',
        slug: '',
        city: '',
        tags: [] as string[],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Validate slug format
    const isSlugValid = (slug: string) => {
        if (!slug) return true; // Empty slug is valid (will be required by form)
        // Check if slug starts with "restaurang/" and contains only lowercase letters, numbers, and hyphens
        // and doesn't start or end with hyphens in the slug part
        if (!slug.startsWith('restaurang/')) return false;
        const slugPart = slug.replace('restaurang/', '');
        return /^[a-z0-9-]+$/.test(slugPart) && !slugPart.startsWith('-') && !slugPart.endsWith('-');
    };

    const hasInvalidSlug = Boolean(formData.slug && !isSlugValid(formData.slug));

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === process.env.NEXT_PUBLIC_LAMBDA_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
            fetchPlace();
        } else {
            setError('Ogiltigt lösenord');
        }
    };

    const fetchPlace = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/kebab-places/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setPlace(data);
                console.log('data', data);
                setFormData({
                    name: data.name,
                    address: data.address,
                    latitude: data.latitude.toString(),
                    longitude: data.longitude.toString(),
                    openingHours: data.openingHours || '',
                    priceRange: data.priceRange || '',
                    slug: data.slug || '',
                    city: data.city || '',
                    tags: data.tags || [],
                });
            } else {
                setError('Kunde inte hämta ställets detaljer');
            }
        } catch (error) {
            setError('Failed to fetch place details');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/kebab-places/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    adminPassword: process.env.NEXT_PUBLIC_LAMBDA_PASSWORD,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Kunde inte uppdatera kebabställe');
            }

            const data = await response.json();
            setSuccess('Kebabställe uppdaterat!');
            setPlace(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Kunde inte uppdatera kebabställe. Försök igen.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTagToggle = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag],
        }));
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-6">Admin-inloggning</h1>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Lösenord</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Logga in
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading && !place) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <p>Laddar ställets detaljer...</p>
                </div>
            </div>
        );
    }

    if (!place) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Ställe hittades inte</h1>
                    <Link
                        href="/admin/restaurang"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Tillbaka till ställen
                    </Link>
                </div>
            </div>
        );
    }

    // Don't render the form until we have the place data and form data is populated
    if (!place || !formData.name) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <p>Laddar ställets detaljer...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Redigera kebabställe</h1>
                    <div className="flex gap-2">
                        <Link
                            href="/admin/restaurang"
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Tillbaka till ställen
                        </Link>
                        <Link
                            href={`/${place.slug}`}
                            target="_blank"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Visa ställe
                        </Link>
                    </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded">
                    <h3 className="font-semibold mb-2">Ställets statistik</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Betyg:</span> {place.rating.toFixed(1)} ⭐
                        </div>
                        <div>
                            <span className="font-medium">Totalt antal röster:</span> {place.totalVotes}
                        </div>
                        <div>
                            <span className="font-medium">Skapad:</span> {new Date(place.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                            <span className="font-medium">Senast uppdaterad:</span> {new Date(place.updatedAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Namn</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Adress</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Latitud</label>
                            <input
                                type="number"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                step="any"
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Longitud</label>
                            <input
                                type="number"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                step="any"
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Öppettider</label>
                        <textarea
                            name="openingHours"
                            value={formData.openingHours}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows={4}
                            placeholder="Exempel: Dagligen 09:00-22:00 eller&#10;Måndag-fredag: 10:00-20:00&#10;Lördag-söndag: 11:00-21:00"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Ange öppettider i valfritt format. Exempel: "Dagligen 09:00-22:00" eller "Mån-fre: 10:00-20:00, lör-sön: 11:00-21:00"
                        </p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Prisklass</label>
                        <input
                            type="text"
                            name="priceRange"
                            value={formData.priceRange}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Exempel: 100-300"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Ange prisklass i SEK (t.ex. "100-300" för 100 till 300 SEK)
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 mb-2">URL Slug</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                placeholder={formData.slug ? "" : "restaurang/baretta-pizzeria-goteborg"}
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Ange den fullständiga URL-slugen (t.ex. "restaurang/baretta-pizzeria-goteborg")
                            </p>
                            {hasInvalidSlug && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                    <p className="text-sm text-red-800">
                                        <strong>Ogiltig slug:</strong> Måste börja med "restaurang/" och följas av endast små bokstäver, siffror och bindestreck. Kan inte börja eller sluta med bindestreck.
                                    </p>
                                </div>
                            )}
                            {formData.slug && !hasInvalidSlug && (
                                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                    <p className="text-sm text-blue-800">
                                        <strong>Full URL:</strong> kebabkartan.se/{formData.slug}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Stad</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                placeholder="Göteborg"
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Stad (t.ex. "Göteborg", "Stockholm")
                            </p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Mattypter (Taggar)</label>
                        <div className="flex flex-wrap gap-3">
                            {['Kebab', 'Pizza', 'Falafel', 'Sallad', 'Hamburgare'].map((tag) => (
                                <label
                                    key={tag}
                                    className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    style={{
                                        backgroundColor: formData.tags.includes(tag) ? '#D97706' : 'white',
                                        color: formData.tags.includes(tag) ? 'white' : '#374151',
                                        borderColor: formData.tags.includes(tag) ? '#D97706' : '#D1D5DB',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.tags.includes(tag)}
                                        onChange={() => handleTagToggle(tag)}
                                        className="w-4 h-4"
                                    />
                                    <span className="font-medium">{tag}</span>
                                </label>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Välj alla mattypter som denna restaurang serverar. Detta hjälper till med filtrering på stadssidorna.
                        </p>
                        {formData.tags.length > 0 && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                                <p className="text-sm text-green-800">
                                    <strong>Vald:</strong> {formData.tags.join(', ')}
                                </p>
                            </div>
                        )}
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && <p className="text-green-500 mb-4">{success}</p>}
                    <button
                        type="submit"
                        disabled={loading || hasInvalidSlug}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loading ? 'Uppdaterar...' : 'Uppdatera kebabställe'}
                    </button>
                </form>
            </div>
        </div>
    );
}
