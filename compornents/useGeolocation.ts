"use client";

import { useState, useEffect } from "react";

const useGeolocation = () => {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setError("Geolocation is not supported by this browser.");
            return;
        }

        const success = (position: GeolocationPosition) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        };

        const failure = (error: GeolocationPositionError) => {
            setError(error.message);
        };

        navigator.geolocation.getCurrentPosition(success, failure);
    }, []);

    return { latitude, longitude, error };
};

export default useGeolocation;
