// SplashTonFade.tsx
import React, { useEffect, useState } from "react";

type Props = {
    logoUrl?: string;
    durationMs?: number;
    onComplete?: () => void;
};

export default function SplashTonFade({
                                          logoUrl = "https://ton.org/download/ton_symbol.png",
                                          durationMs = 3000,
                                          onComplete,
                                      }: Props) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const fadeTime = durationMs / 2;

        const fadeOutTimer = setTimeout(() => setVisible(false), fadeTime);
        const completeTimer = setTimeout(() => onComplete && onComplete(), durationMs);

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(completeTimer);
        };
    }, [durationMs, onComplete]);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "#000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <img
                src={logoUrl}
                alt="TON Logo"
                style={{
                    width: 200,
                    height: 200,
                    opacity: visible ? 1 : 0,
                    transition: `opacity ${durationMs / 2}ms ease-in-out`,
                    filter: "drop-shadow(0 0 25px #00bfff)",
                }}
            />
        </div>
    );
}
