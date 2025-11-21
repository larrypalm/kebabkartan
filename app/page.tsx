"use client";

import { useMemo } from "react";
import "./app.css";
import "@aws-amplify/ui-react/styles.css";
import dynamic from "next/dynamic";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export default function App() {
    const Map = useMemo(() => dynamic(
        () => import('./components/Map'),
        {
            loading: () => <p>Kebabkartan laddar</p>,
            ssr: false
        }
    ), [])

    return (
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
            <main role="main">
                <h1 className="sr-only">Kebabkartan - Hitta och betygsätt din favorit kebab i Sverige</h1>
                <p className="sr-only">Utforska kebabställen nära dig, läs recensioner och dela dina erfarenheter med andra kebabälskare.</p>
                {/* <AuthDebug /> */}
                <Map initialPlaceId={null} />
            </main>
        </GoogleReCaptchaProvider>
    );
}
