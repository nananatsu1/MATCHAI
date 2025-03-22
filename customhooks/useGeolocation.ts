"use client";

import { useState, useEffect, useRef } from "react";

const useGeolocation = () => {
    const latitude = useRef<number | null>(null);
    const longitude = useRef<number | null>(null);
    const altitude = useRef<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [, setTrigger] = useState(0); // State to force re-render

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setError("位置情報が取得できないブラウザのようです");
            return;
        }

        const success = (position: GeolocationPosition) => {
            latitude.current = position.coords.latitude;
            longitude.current = position.coords.longitude;
            altitude.current = position.coords.altitude;
            setTrigger((prev) => prev + 1); // Trigger re-render
        };

        const failure = (error: GeolocationPositionError) => {
            setError(error.message);
        };

        const watcher = navigator.geolocation.watchPosition(success, failure);

        return () => {
            navigator.geolocation.clearWatch(watcher);
        };
    }, []);

    return { latitude: latitude.current, longitude: longitude.current, altitude: altitude.current, error };
};

export default useGeolocation;
