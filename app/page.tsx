"use client";

import { useMemo } from "react";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";
import dynamic from "next/dynamic";

export default function App() {
    const NEXT_PUBLIC_ADMIN_PASSWORD=process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    const NEXT_PUBLIC_API_URL=process.env.NEXT_PUBLIC_API_URL
    const NEXT_PUBLIC_LAMBDA_PASSWORD=process.env.NEXT_PUBLIC_LAMBDA_PASSWORD

    console.log('NEXT_PUBLIC_ADMIN_PASSWORD: ', NEXT_PUBLIC_ADMIN_PASSWORD)
    console.log('NEXT_PUBLIC_API_URL: ', NEXT_PUBLIC_API_URL)
    console.log('NEXT_PUBLIC_LAMBDA_PASSWORD: ', NEXT_PUBLIC_LAMBDA_PASSWORD)

    const Map = useMemo(() => dynamic(
        () => import('./components/Map'),
        { 
          loading: () => <p>A map is loading</p>,
          ssr: false
        }
      ), [])

    return (
        <main>
            <Map />
        </main>
    );
}
