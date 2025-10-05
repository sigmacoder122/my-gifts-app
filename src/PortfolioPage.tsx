import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";
import { gifts, tonLogo } from "./data/gifts";

/* ====== Интерфейсы ====== */
export interface Gift {
    id: number;
    name: string;
    price: number;
    growth: number;
    img: string;
    invested?: number;
}

interface TelegramUser {
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
}

/* ====== Анимации ====== */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ====== Стили ====== */
const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(180deg, #0e0f12 0%, #1b1c20 100%);
    min-height: 100vh;
    color: white;
    padding: 20px;
    overflow-y: auto;
`;

const Header = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 10px;
    margin-bottom: 10px;
`;

const Avatar = styled.img`
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #4ea3ff;
`;

const Username = styled.h2`
    font-size: 1.4rem;
    font-weight: 600;
    color: white;
`;

const StatsContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 15px;
    margin: 15px 0;
`;

const StatBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StatLabel = styled.div`
    font-size: 0.9rem;
    color: #b4b4b4;
`;

const StatValue = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 5px;
`;

const ChartContainer = styled.div`
    width: 100%;
    height: 240px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 10px;
    animation: ${fadeIn} 0.6s ease;
`;

const TableContainer = styled.div`
    width: 100%;
    margin-top: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    overflow: hidden;
`;

const TableHeader = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    background: rgba(255, 255, 255, 0.07);
    font-weight: bold;
`;

const TableRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    align-items: center;
    &:last-child {
        border-bottom: none;
    }
`;

const GiftImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin-right: 10px;
`;

const GiftName = styled.div`
    flex: 2;
`;

const GiftPrice = styled.div`
    flex: 1;
    text-align: right;
`;

const GiftGrowth = styled.div<{ positive: boolean }>`
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: ${(p) => (p.positive ? "#4EFFA1" : "#FF4E4E")};
`;

const TonLogo = styled.img`
    width: 18px;
    height: 18px;
    vertical-align: middle;
    margin-left: 5px;
`;

const SortButton = styled.button`
    background: rgba(255, 255, 255, 0.08);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 10px;
    margin: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    &:hover {
        background: rgba(255, 255, 255, 0.15);
    }
`;

/* ====== Компонент ====== */
const PortfolioPage: React.FC = () => {
    const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
    const [portfolio, setPortfolio] = useState<Gift[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Gift; direction: "asc" | "desc" }>({
        key: "growth",
        direction: "desc",
    });

    /* ====== Telegram данные или заглушка ====== */
    useEffect(() => {
        try {
            const tg = (window as any).Telegram?.WebApp;
            if (tg && tg.initDataUnsafe?.user) {
                setTelegramUser(tg.initDataUnsafe.user);
            } else {
                setTelegramUser({
                    first_name: "Иван",
                    username: "ivan_dev",
                    photo_url:
                        "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
                });
            }
        } catch {
            setTelegramUser({
                first_name: "Иван",
                username: "ivan_dev",
                photo_url:
                    "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
            });
        }

        // Пример инвестированных подарков
        const demoPortfolio = gifts.map((g) => ({
            ...g,
            invested: Math.floor(Math.random() * 5000) + 1000,
        }));
        setPortfolio(demoPortfolio);
    }, []);

    /* ====== Сортировка ====== */
    const requestSort = (key: keyof Gift) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sorted = [...portfolio].sort((a, b) => {
            const aVal = a[key] ?? 0;
            const bVal = b[key] ?? 0;
            if (aVal < bVal) return direction === "asc" ? -1 : 1;
            if (aVal > bVal) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setPortfolio(sorted);
    };

    /* ====== Данные для графика ====== */
    const totalInvested = portfolio.reduce((acc, g) => acc + (g.invested ?? 0), 0);

    const chartData = [
        { day: "Пн", value: totalInvested * 0.95 },
        { day: "Вт", value: totalInvested * 1.05 },
        { day: "Ср", value: totalInvested * 1.1 },
        { day: "Чт", value: totalInvested * 1.15 },
        { day: "Пт", value: totalInvested * 1.2 },
        { day: "Сб", value: totalInvested * 1.25 },
        { day: "Вс", value: totalInvested * 1.3 },
    ];

    return (
        <PageContainer>
            <Header>
                <Avatar src={telegramUser?.photo_url} alt="avatar" />
                <Username>@{telegramUser?.username}</Username>
            </Header>

            <StatsContainer>
                <StatBlock>
                    <StatLabel>Всего инвестировано</StatLabel>
                    <StatValue>
                        {totalInvested.toLocaleString()} TON
                        <TonLogo src={tonLogo} alt="TON" />
                    </StatValue>
                </StatBlock>
                <StatBlock>
                    <StatLabel>Рост портфеля</StatLabel>
                    <StatValue style={{ color: "#4EFFA1" }}>+{(Math.random() * 20).toFixed(2)}%</StatValue>
                </StatBlock>
                <StatBlock>
                    <StatLabel>Подарков</StatLabel>
                    <StatValue>{portfolio.length}</StatValue>
                </StatBlock>
            </StatsContainer>

            <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1b1c20", border: "none", color: "#fff" }}
                            labelStyle={{ color: "#aaa" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#4ea3ff"
                            strokeWidth={3}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>

            <div style={{ marginTop: "15px", display: "flex", justifyContent: "center" }}>
                <SortButton onClick={() => requestSort("name")}>Сортировать по названию</SortButton>
                <SortButton onClick={() => requestSort("growth")}>По росту</SortButton>
                <SortButton onClick={() => requestSort("invested")}>По инвестициям</SortButton>
            </div>

            <TableContainer>
                <TableHeader>
                    <div style={{ flex: 2 }}>Название</div>
                    <div style={{ flex: 1, textAlign: "right" }}>Инвестиции</div>
                    <div style={{ flex: 1, textAlign: "right" }}>Рост</div>
                </TableHeader>

                {portfolio.map((gift) => (
                    <TableRow key={gift.id}>
                        <div style={{ display: "flex", alignItems: "center", flex: 2 }}>
                            <GiftImage src={gift.img} alt={gift.name} />
                            <GiftName>{gift.name}</GiftName>
                        </div>
                        <GiftPrice>{gift.invested ?? 0} TON</GiftPrice>
                        <GiftGrowth positive={gift.growth >= 0}>
                            {gift.growth >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                            &nbsp;{gift.growth}%
                        </GiftGrowth>
                    </TableRow>
                ))}
            </TableContainer>
        </PageContainer>
    );
};

export default PortfolioPage;
