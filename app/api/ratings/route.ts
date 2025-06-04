import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error('API_URL environment variable is not set');
    }

    const body = await request.json();
    const response = await fetch(`${apiUrl}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to update rating');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in ratings API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 