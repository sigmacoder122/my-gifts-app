// SplashTonWave.tsx
import React, { useEffect, useRef, useState } from "react";

type Props = {
    logoUrl?: string;
    durationMs?: number;
    onComplete?: () => void;
};

export default function SplashTonWave({
                                          logoUrl = "https://ton.org/download/ton_symbol.png",
                                          durationMs = 3000,
                                          onComplete,
                                      }: Props) {
    const [opacity, setOpacity] = useState(0);
    const [scale, setScale] = useState(1);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const startTime = performance.now();

        const animate = (time: number) => {
            const elapsed = time - startTime;
            const t = Math.min(1, elapsed / durationMs);

            // Волна: плавная пульсация логотипа
            let logOpacity = 0;
            let logScale = 1;

            if (t < 0.25) {
                // Появление
                logOpacity = t / 0.25;
                logScale = 0.8 + 0.2 * logOpacity;
            } else if (t < 0.75) {
                // Пульсация
                const wavePhase = (t - 0.25) / 0.5;
                logOpacity = 0.8 + 0.2 * Math.sin(wavePhase * Math.PI * 2);
                logScale = 1 + 0.05 * Math.sin(wavePhase * Math.PI * 2);
            } else {
                // Исчезновение
                const fadeT = (t - 0.75) / 0.25;
                logOpacity = 1 - fadeT;
                logScale = 1 - 0.1 * fadeT;
            }

            setOpacity(logOpacity);
            setScale(logScale);

            if (t < 1) rafRef.current = requestAnimationFrame(animate);
            else if (onComplete) onComplete();
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
                overflow: "hidden",
            }}
        >
            <img
                src={logoUrl}
                alt="TON Logo"
                style={{
                    width: 200,
                    height: 200,
                    opacity,
                    transform: `scale(${scale})`,
                    transition: "opacity 0.05s linear, transform 0.05s linear",
                    filter: "drop-shadow(0 0 20px #00bfff)",
                }}
            />
        </div>
    );
}
