import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { tonLogo } from "./data/gifts";
import { mainLogo } from "./data/gifts";

/* === АНИМАЦИИ === */
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const floatOut = (x: number, y: number) => keyframes`
  0% { transform: translate(0, 0) scale(0.5); opacity: 1; }
  100% { transform: translate(${x}px, ${y}px) scale(0.1); opacity: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

/* === СТИЛИ === */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #0e0f11;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
`;

const Logo = styled.img`
  width: 120px;
  height: 120px;
  animation: ${rotate} 2s linear infinite;
  z-index: 10;
`;

const ParticlesWrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
`;

const Particle = styled.img<{ x: number; y: number; size: number; delay: number; duration: number }>`
  position: absolute;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.5);
  ${({ x, y, delay, duration }) => css`
    animation: ${floatOut(x, y)} ${duration}s ease-out ${delay}s forwards;
  `}
`;

const ProgressBarWrapper = styled.div`
  width: 70%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-top: 20px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background: #00c2ff;
  border-radius: 4px;
  transition: width 0.2s ease;
`;

const LoadingText = styled.div`
  color: #fff;
  margin-top: 12px;
  font-weight: 600;
  animation: ${fadeIn} 0.5s ease;
`;

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        const temp: any[] = [];
        for (let i = 0; i < 25; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const distance = 80 + Math.random() * 120;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            temp.push({
                x,
                y,
                size: 15 + Math.random() * 15,
                delay: Math.random() * 0.5,
                duration: 1 + Math.random() * 1.5,
            });
        }
        setParticles(temp);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onComplete(), 300);
                    return 100;
                }
                return prev + Math.random() * 5;
            });
        }, 150);
        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <Overlay>
            <ParticlesWrapper>
                {particles.map((p, i) => (
                    <Particle
                        key={i}
                        x={p.x}
                        y={p.y}
                        size={p.size}
                        delay={p.delay}
                        duration={p.duration}
                        src={tonLogo}
                    />
                ))}
            </ParticlesWrapper>
            <Logo src={mainLogo} alt="Logo" />
            <ProgressBarWrapper>
                <ProgressBar progress={progress} />
            </ProgressBarWrapper>
            <LoadingText>Загрузка...</LoadingText>
        </Overlay>
    );
}
