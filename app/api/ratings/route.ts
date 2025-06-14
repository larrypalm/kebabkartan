import { NextResponse } from 'next/server';
import { queueRatingRequest } from '@/app/lib/redis';

export async function POST(request: Request) {
    try {
        // Get client IP
        const forwardedFor = request.headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

        const body = await request.json();

        if (!body.placeId || typeof body.rating !== 'number') {
            return NextResponse.json(
                { message: 'Missing or invalid request body' },
                { status: 400 }
            );
        }

        if (body.rating < 1 || body.rating > 5) {
            return NextResponse.json(
                { message: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        const token = body.recaptchaToken;
        if (!token) {
            return NextResponse.json({ message: 'Missing reCAPTCHA token' }, { status: 400 });
        }

        // Queue the rating request
        await queueRatingRequest({
            placeId: body.placeId,
            rating: body.rating,
            recaptchaToken: token,
            ip,
        });

        return NextResponse.json({
            message: 'Rating request queued successfully',
            placeId: body.placeId,
        });
    } catch (error) {
        console.error('Error queueing rating request:', error);
        return NextResponse.json(
            { message: 'Error queueing rating request' },
            { status: 500 }
        );
    }
}