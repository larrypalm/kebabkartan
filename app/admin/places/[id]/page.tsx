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
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === process.env.NEXT_PUBLIC_LAMBDA_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
            fetchPlace();
        } else {
            setError('Invalid password');
        }
    };

    const fetchPlace = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/kebab-places/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setPlace(data);
                setFormData({
                    name: data.name,
                    address: data.address,
                    latitude: data.latitude.toString(),
                    longitude: data.longitude.toString(),
                    openingHours: data.openingHours || '',
                    priceRange: data.priceRange || '',
                });
            } else {
                setError('Failed to fetch place details');
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
                throw new Error(errorData.message || 'Failed to update kebab place');
            }

            const data = await response.json();
            setSuccess('Kebab place updated successfully!');
            setPlace(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update kebab place. Please try again.');
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

    if (loading && !place) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <p>Loading place details...</p>
                </div>
            </div>
        );
    }

    if (!place) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Place Not Found</h1>
                    <Link
                        href="/admin/places"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Back to Places
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Edit Kebab Place</h1>
                    <div className="flex gap-2">
                        <Link
                            href="/admin/places"
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Back to Places
                        </Link>
                        <Link
                            href={`/place/${place.id}`}
                            target="_blank"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            View Place
                        </Link>
                    </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded">
                    <h3 className="font-semibold mb-2">Place Statistics</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Rating:</span> {place.rating.toFixed(1)} ⭐
                        </div>
                        <div>
                            <span className="font-medium">Total Votes:</span> {place.totalVotes}
                        </div>
                        <div>
                            <span className="font-medium">Created:</span> {new Date(place.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                            <span className="font-medium">Last Updated:</span> {new Date(place.updatedAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>

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
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && <p className="text-green-500 mb-4">{success}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loading ? 'Updating...' : 'Update Kebab Place'}
                    </button>
                </form>
            </div>
        </div>
    );
}
