"use client";

import { useMemo } from "react";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";
import dynamic from "next/dynamic";

export default function App() {
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
