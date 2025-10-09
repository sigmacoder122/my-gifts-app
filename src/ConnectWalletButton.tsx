// components/WalletControlButton.tsx
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Wallet, Plus, Minus } from "lucide-react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

const glow = keyframes`
  0% { box-shadow: 0 0 6px #00c2ff; }
  50% { box-shadow: 0 0 20px #00c2ff; }
  100% { box-shadow: 0 0 6px #00c2ff; }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #00aaff, #0077ff);
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  animation: ${glow} 2.5s infinite ease-in-out;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  padding: 10px 16px;
`;

const BalanceControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 10px;
`;

const SmallButton = styled.button`
  background: rgba(0,194,255,0.2);
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  &:hover {
    background: rgba(0,194,255,0.4);
  }
`;

export const WalletControlButton: React.FC = () => {
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const [balance, setBalance] = useState<number>(0);

    const handleConnect = () => {
        tonConnectUI.connectWallet();
    };

    const increment = () => setBalance(prev => prev + 100); // например +100 TON
    const decrement = () => setBalance(prev => (prev - 100 >= 0 ? prev - 100 : 0));

    if (!wallet) {
        return (
            <Button onClick={handleConnect}>
                <Wallet size={18} /> Подключить кошелёк
            </Button>
        );
    }

    return (
        <WalletInfo>
            <div>
                <strong>
                    {wallet.account.address.slice(0,6)}...{wallet.account.address.slice(-6)}
                </strong>
            </div>
            <BalanceControl>
                <SmallButton onClick={decrement}><Minus size={12} /></SmallButton>
                <div>{balance} TON</div>
                <SmallButton onClick={increment}><Plus size={12} /></SmallButton>
            </BalanceControl>
        </WalletInfo>
    );
};
