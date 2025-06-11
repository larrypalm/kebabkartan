"use client";

import { useMemo } from "react";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";
import dynamic from "next/dynamic";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export default function App() {
    const Map = useMemo(() => dynamic(
        () => import('./components/Map'),
        {
            loading: () => <p>Kebabkartan is loading</p>,
            ssr: false
        }
    ), [])

    return (
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
            <main>
                <Map />
            </main>
        </GoogleReCaptchaProvider>
    );
}
