import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";
import { gifts, tonLogo } from "./data/gifts";

// --- Анимации ---
const glowAnim = keyframes`
  0% { box-shadow: 0 0 5px #00aaff; }
  50% { box-shadow: 0 0 20px #00aaff; }
  100% { box-shadow: 0 0 5px #00aaff; }
`;

const growNumber = keyframes`
  0% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

// --- Стили ---
const Container = styled.div`
  background: #121212;
  min-height: 100vh;
  padding: 20px 25px 30px;
  color: #fff;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const BalanceWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #1e1e1e;
  padding: 8px 15px;
  border-radius: 50px;
  border: 2px solid #00aaff;
  font-weight: bold;
`;

const TonIcon = styled.img`
  width: 24px;
  height: 24px;
  animation: ${glowAnim} 1.5s infinite;
`;

const AnimatedNumber = styled.span`
  display: inline-block;
  animation: ${growNumber} 0.5s;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 15px;
`;

const GraphWrapper = styled.div`
  background: #1e1e1e;
  border-radius: 20px;
  padding: 15px;
  margin-bottom: 25px;
`;

const TableHeader = styled.div`
  display: flex;
  gap: 15px;
  font-weight: bold;
  padding: 10px 0;
  border-bottom: 2px solid #333;
  cursor: pointer;
`;

const TableColumn = styled.div<{ flex?: number }>`
  flex: ${(props) => props.flex || 1};
  display: flex;
  align-items: center;
`;

const GiftCard = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid #292929;
  transition: all 0.2s;
  &:hover {
    background: #1a1a1a;
  }
`;

const GiftImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
`;

const GiftName = styled.div`
  font-size: 16px;
`;

const GiftPrice = styled.div`
  color: #fff;
  font-size: 14px;
`;

const GiftGrowth = styled.div<{ positive: boolean }>`
  color: ${(props) => (props.positive ? "#0f0" : "#f55")};
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
`;

// --- Компонент ---
const PortfolioPage: React.FC = () => {
    const [balance, setBalance] = useState(1250);
    const [animatedBalance, setAnimatedBalance] = useState(balance);

    const [portfolio, setPortfolio] = useState(
        gifts.map((gift) => ({
            ...gift,
            invested: Math.floor(Math.random() * 100) + 50, // пример суммы инвестиций
        }))
    );

    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    useEffect(() => {
        let start = animatedBalance;
        const end = balance;
        const step = () => {
            start += (end - start) / 5;
            if (Math.abs(start - end) < 0.01) start = end;
            setAnimatedBalance(parseFloat(start.toFixed(2)));
            if (start !== end) requestAnimationFrame(step);
        };
        step();
    }, [balance]);

    const chartData = [
        { day: "Пн", value: portfolio.reduce((acc, g) => acc + g.invested, 0) * 0.95 },
        { day: "Вт", value: portfolio.reduce((acc, g) => acc + g.invested, 0) * 1.05 },
        { day: "Ср", value: portfolio.reduce((acc, g) => acc + g.invested, 0) * 1.1 },
        { day: "Чт", value: portfolio.reduce((acc, g) => acc + g.invested, 0) * 1.15 },
        { day: "Пт", value: portfolio.reduce((acc, g) => acc + g.invested, 0) * 1.2 },
        { day: "Сб", value: portfolio.reduce((acc, g) => acc + g.invested, 0) * 1.18 },
        { day: "Вс", value: portfolio.reduce((acc, g) => acc + g.invested, 0) * 1.22 },
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: "#292929", padding: 10, borderRadius: 10 }}>
                    <p>{payload[0].payload.day}</p>
                    <p>{payload[0].value.toFixed(2)} TON</p>
                </div>
            );
        }
        return null;
    };

    const requestSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
        const sorted = [...portfolio].sort((a: any, b: any) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });
        setPortfolio(sorted);
    };

    return (
        <Container>
            <Header>
                <SectionTitle>Мой Портфель</SectionTitle>
                <BalanceWrapper>
                    <TonIcon src={tonLogo} alt="TON" />
                    <AnimatedNumber>{animatedBalance}</AnimatedNumber>
                </BalanceWrapper>
            </Header>

            <SectionTitle>График инвестиций</SectionTitle>
            <GraphWrapper>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                        <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                        <XAxis dataKey="day" stroke="#00aaff" />
                        <YAxis stroke="#00aaff" />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#00aaff"
                            strokeWidth={3}
                            dot={{ r: 5, fill: "#00aaff" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </GraphWrapper>

            <SectionTitle>Инвестированные подарки</SectionTitle>
            <TableHeader>
                <TableColumn flex={2} onClick={() => requestSort("name")}>Название</TableColumn>
                <TableColumn flex={1} onClick={() => requestSort("invested")}>Сумма</TableColumn>
                <TableColumn flex={1} onClick={() => requestSort("growth")}>Рост</TableColumn>
            </TableHeader>

            {portfolio.map((gift) => (
                <GiftCard key={gift.id}>
                    <GiftImage src={gift.img} alt={gift.name} />
                    <TableColumn flex={2}><GiftName>{gift.name}</GiftName></TableColumn>
                    <TableColumn flex={1}><GiftPrice>{gift.invested} TON</GiftPrice></TableColumn>
                    <TableColumn flex={1}>
                        <GiftGrowth positive={gift.growth >= 0}>
                            {gift.growth >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                            {Math.abs(gift.growth)}%
                        </GiftGrowth>
                    </TableColumn>
                </GiftCard>
            ))}
        </Container>
    );
};

export default PortfolioPage;
