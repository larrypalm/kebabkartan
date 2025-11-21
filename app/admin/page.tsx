'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        openingHours: '',
        priceRange: '',
        slug: '',
        city: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [places, setPlaces] = useState<any[]>([]);
    const [loadingPlaces, setLoadingPlaces] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (process.env.NEXT_PUBLIC_LAMBDA_PASSWORD === undefined) {
            setError('Environment variable not configured');
            return;
        }
        
        if (password === process.env.NEXT_PUBLIC_LAMBDA_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
            fetchPlaces();
        } else {
            setError('Ogiltigt lösenord');
        }
    };

    const fetchPlaces = async () => {
        setLoadingPlaces(true);
        try {
            const response = await fetch('/api/kebab-places');
            if (response.ok) {
                const data = await response.json();
                setPlaces(data);
            } else {
                setError('Misslyckades att hämta platser');
            }
        } catch (error) {
            setError('Misslyckades att hämta platser');
        } finally {
            setLoadingPlaces(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/kebab-places', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    adminPassword: process.env.NEXT_PUBLIC_LAMBDA_PASSWORD,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add kebab place');
            }

            const data = await response.json();
            setSuccess('Kebab place added successfully!');
            setFormData({
                name: '',
                address: '',
                latitude: '',
                longitude: '',
                openingHours: '',
                priceRange: '',
                slug: '',
                city: '',
            });
            // Refresh the places list
            fetchPlaces();
        } catch (error) {
            setError('Failed to add kebab place. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

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

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Password</label>
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
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">

                {/* Existing Places List */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Existing Places</h2>
                        <button
                            onClick={fetchPlaces}
                            disabled={loadingPlaces}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
                        >
                            {loadingPlaces ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>

                    {loadingPlaces ? (
                        <div className="text-center py-8">
                            <p>Loading places...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Address
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rating
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Votes
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {places.map((place) => (
                                        <tr key={place.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {place.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {place.address}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {place.rating.toFixed(1)} ⭐
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {place.totalVotes}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(place.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => router.push(`/admin/${place.id}`)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <a
                                                        href={`/${place.slug}`}
                                                        target="_blank"
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        View
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {places.length === 0 && !loadingPlaces && (
                        <div className="text-center py-8 text-gray-500">
                            No places found.
                        </div>
                    )}
                </div>
                
                <div id="add-place-form" className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold mb-6">Add New Kebab Place</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Name</label>
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
                        <label className="block text-gray-700 mb-2">Address</label>
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
                            <label className="block text-gray-700 mb-2">Latitude</label>
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
                            <label className="block text-gray-700 mb-2">Longitude</label>
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
                        <label className="block text-gray-700 mb-2">Opening Hours</label>
                        <textarea
                            name="openingHours"
                            value={formData.openingHours}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows={4}
                            placeholder="Example: Daily 09:00-22:00 or&#10;Monday-Friday: 10:00-20:00&#10;Saturday-Sunday: 11:00-21:00"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Enter opening hours in any format. Examples: "Daily 09:00-22:00" or "Mon-Fri: 10:00-20:00, Sat-Sun: 11:00-21:00"
                        </p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Price Range</label>
                        <input
                            type="text"
                            name="priceRange"
                            value={formData.priceRange}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Example: 100-300"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Enter the price range in SEK (e.g., "100-300" for 100 to 300 SEK)
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
                                placeholder="restaurang/baretta-pizzeria-goteborg"
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Enter the full URL slug (e.g., "restaurang/baretta-pizzeria-goteborg")
                            </p>
                            {hasInvalidSlug && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                    <p className="text-sm text-red-800">
                                        <strong>Invalid slug:</strong> Must start with "restaurang/" followed by only lowercase letters, numbers, and hyphens. Cannot start or end with hyphens.
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
                            <label className="block text-gray-700 mb-2">City</label>
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
                                City name (e.g., "Göteborg", "Stockholm")
                            </p>
                        </div>
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && <p className="text-green-500 mb-4">{success}</p>}
                    <button
                        type="submit"
                        disabled={isLoading || hasInvalidSlug}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {isLoading ? 'Adding...' : 'Add Kebab Place'}
                    </button>
                </form>
                </div>
            </div>
        </div>
    );
} 