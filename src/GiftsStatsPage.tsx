import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";
import { gifts } from "./data/gifts";

// --- Анимации ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const hoverLift = keyframes`
  0% { transform: translateY(0); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4); }
  50% { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0, 170, 255, 0.3); }
  100% { transform: translateY(0); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4); }
`;

// --- Стили ---
const Container = styled.div`
  padding: 20px;
  padding-bottom: 90px;
  background: #121212;
  color: #fff;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 22px;
  margin-bottom: 20px;
  text-align: center;
  color: #00aaff;
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  background: ${(props) => (props.active ? "#00aaff" : "transparent")};
  border: 2px solid #00aaff;
  color: ${(props) => (props.active ? "#121212" : "#fff")};
  font-weight: bold;
  border-radius: 20px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #00aaff;
    color: #121212;
    transform: scale(1.05);
  }
`;

const GiftRow = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1e1e1e, #242424);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.5s ease;
  transition: transform 0.3s, box-shadow 0.3s;
  &:hover {
    animation: ${hoverLift} 1.5s infinite;
  }
`;

const GiftIcon = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 12px;
  margin-right: 16px;
  border: 2px solid rgba(0,170,255,0.3);
`;

const GiftName = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  flex: 0.8;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
`;

const ChartBox = styled.div`
  flex: 2;
  height: 100px;
  margin: 0 12px;
`;

const Growth = styled.div<{ positive: boolean }>`
  font-size: 14px;
  font-weight: bold;
  margin-left: 10px;
  color: ${(props) => (props.positive ? "#00ff66" : "#ff4444")};
  min-width: 60px;
  text-align: right;
`;

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
                    color: "#fff",
                }}
            >
                {payload[0].value.toFixed(2)} TON
            </div>
        );
    }
    return null;
};

const GiftsStatsPage: React.FC = () => {
    const [filter, setFilter] = useState<"all" | "up" | "down">("all");

    const filteredGifts = gifts.filter((gift) => {
        if (filter === "up") return gift.growth > 0;
        if (filter === "down") return gift.growth < 0;
        return true;
    });

    return (
        <Container>
            <Title>📈 Динамика и рост подарков</Title>

            <FilterRow>
                <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
                    Все
                </FilterButton>
                <FilterButton active={filter === "up"} onClick={() => setFilter("up")}>
                    Растущие
                </FilterButton>
                <FilterButton active={filter === "down"} onClick={() => setFilter("down")}>
                    Падающие
                </FilterButton>
            </FilterRow>

            {filteredGifts.map((gift) => {
                const chartData = [
                    { day: "Пн", value: gift.price * 0.95 },
                    { day: "Вт", value: gift.price * 1.05 },
                    { day: "Ср", value: gift.price * 1.1 },
                    { day: "Чт", value: gift.price * (1 + gift.growth / 100) },
                    { day: "Пт", value: gift.price * (1 + gift.growth / 100 + 0.03) },
                ];

                const gradientId = `gradient-${gift.id}`;
                const strokeColor = gift.growth >= 0 ? "#00ff66" : "#ff4444";

                return (
                    <GiftRow key={gift.id}>
                        <GiftIcon src={gift.img} alt={gift.name} />
                        <GiftName>{gift.name}</GiftName>
                        <ChartBox>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <defs>
                                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.8}/>
                                            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.2}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" stroke="#444" fontSize={10} />
                                    <YAxis stroke="#444" fontSize={10} />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke={`url(#${gradientId})`}
                                        strokeWidth={3}
                                        dot={false}
                                        animationDuration={1000}
                                        animationEasing="ease-in-out"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartBox>
                        <Growth positive={gift.growth >= 0}>
                            {gift.growth >= 0 ? `+${gift.growth}%` : `${gift.growth}%`}
                        </Growth>
                    </GiftRow>
                );
            })}
        </Container>
    );
};

export default GiftsStatsPage;
