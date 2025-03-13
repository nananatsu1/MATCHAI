"use client";

import { useEffect, useState } from "react";

const GyroCompass = () => {
    /*const [os, setOs] = useState<string>("");
    const [direction, setDirection] = useState<string>("");
    const [absolute, setAbsolute] = useState<string>("");
    const [alpha, setAlpha] = useState<string>("");
    const [beta, setBeta] = useState<string>("");
    const [gamma, setGamma] = useState<string>("");

    useEffect(() => {
        const userOs = detectOSSimply();
        setOs(userOs);

        if (userOs === "iphone") {
            window.addEventListener("deviceorientation", orientation, true);
        } else if (userOs === "android") {
            window.addEventListener("deviceorientationabsolute", orientation, true);
        } else {
            alert("PC未対応サンプル");
        }
    }, []);

    const orientation = (event: DeviceOrientationEvent) => {
        let degrees: number;

        if (os === "iphone" && event.webkitCompassHeading !== undefined) {
            degrees = event.webkitCompassHeading;
        } else {
            degrees = compassHeading(event.alpha!, event.beta!, event.gamma!);
        }

        setAbsolute(event.absolute?.toString() || "N/A");
        setAlpha(event.alpha?.toFixed(2) || "N/A");
        setBeta(event.beta?.toFixed(2) || "N/A");
        setGamma(event.gamma?.toFixed(2) || "N/A");
        setDirection(getDirection(degrees) + ` : ${degrees.toFixed(2)}`);
    };

    const compassHeading = (alpha: number, beta: number, gamma: number) => {
        const degtorad = Math.PI / 180;
        const _x = beta * degtorad;
        const _y = gamma * degtorad;
        const _z = alpha * degtorad;

        const cX = Math.cos(_x);
        const cY = Math.cos(_y);
        const cZ = Math.cos(_z);
        const sX = Math.sin(_x);
        const sY = Math.sin(_y);
        const sZ = Math.sin(_z);

        const Vx = -cZ * sY - sZ * sX * cY;
        const Vy = -sZ * sY + cZ * sX * cY;

        let compassHeading = Math.atan(Vx / Vy);

        if (Vy < 0) compassHeading += Math.PI;
        else if (Vx < 0) compassHeading += 2 * Math.PI;

        return compassHeading * (180 / Math.PI);
    };

    const getDirection = (degrees: number) => {
        if ((degrees > 337.5 && degrees < 360) || degrees < 22.5) return "北";
        if (degrees < 67.5) return "北東";
        if (degrees < 112.5) return "東";
        if (degrees < 157.5) return "東南";
        if (degrees < 202.5) return "南";
        if (degrees < 247.5) return "南西";
        if (degrees < 292.5) return "西";
        return "北西";
    };

    const detectOSSimply = () => {
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) return "iphone";
        if (/Android/.test(navigator.userAgent)) return "android";
        return "pc";
    }; */

    return (
        <div>
            {/* <button onClick={() => DeviceOrientationEvent.requestPermission().then(() => console.log("許可"))}>
                SafariでDeviceOrientationを許可
            </button>
            <ul>
                <li>【方角】<span>{direction}</span></li>
                <li>【absolute】<span>{absolute}</span></li>
                <li>【alpha】<span>{alpha}</span></li>
                <li>【beta】<span>{beta}</span></li>
                <li>【gamma】<span>{gamma}</span></li>
            </ul> */}
            <p>compass</p>
        </div>
    );
};

export default GyroCompass;