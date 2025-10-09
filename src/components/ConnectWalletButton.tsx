// components/ConnectWalletButton.tsx
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Wallet } from "lucide-react";

const hoverGlow = keyframes`
  0% { box-shadow: 0 0 0 rgba(0,170,255,0.05); }
  50% { box-shadow: 0 0 25px rgba(0,170,255,0.08); }
  100% { box-shadow: 0 0 0 rgba(0,170,255,0.05); }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg, #007aff, #00c2ff);
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 0 12px rgba(0, 194, 255, 0.3);
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 0 20px rgba(0, 194, 255, 0.5);
  }
`;

interface ConnectWalletButtonProps {
    onConnect?: () => void;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ onConnect }) => {
    const [connected, setConnected] = useState(false);

    const handleConnect = () => {
        const tg = (window as any).Telegram?.WebApp;
        if (tg) {
            // Открываем Telegram wallet (WebApp)
            tg.MainButton.setText("Connected");
            tg.MainButton.show();
            setConnected(true);
            if (onConnect) onConnect();
        } else {
            alert("Telegram WebApp not detected!");
        }
    };

    if (connected) {
        return (
            <Button disabled>
                <Wallet size={16} /> Wallet Connected
            </Button>
        );
    }

    return (
        <Button onClick={handleConnect}>
            <Wallet size={16} /> Connect Wallet
        </Button>
    );
};
