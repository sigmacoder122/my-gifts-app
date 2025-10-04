import React from "react";
import styled, { keyframes } from "styled-components";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";
import { gifts } from "./data/gifts"; // реальные подарки 🎁
import tonLogo from "./assets/ton.png"; // логотип TON (положи в assets)

// --- Анимации ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Стили ---
const Container = styled.div`
  padding: 20px;
  padding-bottom: 90px;
  background: #121212;
  color: #fff;
  min-height: 100vh;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 22px;
  margin-bottom: 20px;
  color: #00aaff;
`;

const BalanceWidget = styled.div`
  display: flex;
  align-items: center;
  background: #0a3d62;
  color: #00aaff;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 50px;
  border: 2px solid #00aaff;
  font-size: 14px;
  box-shadow: 0 0 12px rgba(0, 170, 255, 0.5);
`;

const TonIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 6px;
`;

const ChartBox = styled.div`
  width: 100%;
  height: 220px;
  background: #1e1e1e;
  border-radius: 16px;
  padding: 12px;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
`;

const GiftRow = styled.div`
  display: flex;
  align-items: center;
  background: #1e1e1e;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  animation: ${fadeIn} 0.5s ease;
`;

const GiftIcon = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 10px;
  margin-right: 14px;
`;

const GiftName = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  flex: 1;
`;

const Invested = styled.div`
  font-size: 14px;
  color: #bbb;
  margin-right: 14px;
`;

const Growth = styled.div<{ positive: boolean }>`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => (props.positive ? "#00ff66" : "#ff4444")};
`;

// --- Кастомный тултип для графика ---
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: "#222",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #00aaff",
                    fontSize: "12px",
                }}
            >
                {payload[0].value.toFixed(2)} TON
            </div>
        );
    }
    return null;
};

// --- Компонент ---
const PortfolioPage: React.FC = () => {
    // Пример данных для графика всего портфеля
    const portfolioData = [
        { day: "Пн", value: 500 },
        { day: "Вт", value: 700 },
        { day: "Ср", value: 650 },
        { day: "Чт", value: 800 },
        { day: "Пт", value: 1200 },
    ];

    return (
        <Container>
            <HeaderRow>
                <Title>📂 Мой портфель</Title>
                <BalanceWidget>
                    <TonIcon src={tonLogo} alt="TON" />
                    12,450 TON
                </BalanceWidget>
            </HeaderRow>

            {/* --- График портфеля --- */}
            <ChartBox>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={portfolioData}>
                        <XAxis dataKey="day" stroke="#444" fontSize={10} />
                        <YAxis stroke="#444" fontSize={10} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#00aaff"
                            strokeWidth={3}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartBox>

            {/* --- Список вложений --- */}
            {gifts.slice(0, 5).map((gift) => (
                <GiftRow key={gift.id}>
                    <GiftIcon src={gift.img} alt={gift.name} />
                    <GiftName>{gift.name}</GiftName>
                    <Invested>Инвестировано: {gift.price} TON</Invested>
                    <Growth positive={gift.growth >= 0}>
                        {gift.growth >= 0 ? `+${gift.growth}%` : `${gift.growth}%`}
                    </Growth>
                </GiftRow>
            ))}
        </Container>
    );
};

export default PortfolioPage;
