"use client";

import { useState, useEffect } from "react";

const useGeolocation = () => {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [altitude, setAltitude] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);    

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setError("位置情報が取得できないブラウザのようです");
            return;
        }

        const success = (position: GeolocationPosition) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setAltitude(position.coords.altitude);
        };

        const failure = (error: GeolocationPositionError) => {
            setError(error.message);
        };

        navigator.geolocation.getCurrentPosition(success, failure);
    }, []);

    return { latitude, longitude, altitude, error };
};

export default useGeolocation;
