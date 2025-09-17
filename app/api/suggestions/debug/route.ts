import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Check for admin password in query parameters
    const { searchParams } = new URL(request.url);
    const adminPassword = searchParams.get('password');
    
    // Verify admin password
    if (!adminPassword || adminPassword !== process.env.NEXT_PUBLIC_LAMBDA_PASSWORD) {
        return NextResponse.json(
            { message: 'Unauthorized access. Admin password required.' },
            { status: 401 }
        );
    }

    const envCheck = {
        hasAccessKeyId: !!process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
        hasSecretAccessKey: !!process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
        hasAwsRegion: !!process.env.NEXT_PUBLIC_AWS_REGION,
        hasRecaptchaSecretKey: !!process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY,
        suggestionsTableName: process.env.NEXT_PUBLIC_SUGGESTIONS_TABLE_NAME || 'kebab-suggestions',
        awsRegion: process.env.NEXT_PUBLIC_AWS_REGION,
    };

    return NextResponse.json(envCheck, { status: 200 });
}
