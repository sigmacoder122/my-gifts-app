import React, { useEffect, useState, useMemo } from "react";
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
import { ArrowUp, ArrowDown, Wallet } from "lucide-react";
import { gifts, tonLogo } from "./data/gifts";
import {
    TonConnectUIProvider,
    useTonConnectUI,
    useTonWallet,
} from "@tonconnect/ui-react";

/* === Интерфейсы === */
interface Gift {
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

/* === Анимации === */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 6px #00c2ff; }
  50% { box-shadow: 0 0 20px #00c2ff; }
  100% { box-shadow: 0 0 6px #00c2ff; }
`;

/* === Основная структура === */
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
`;

/* === Блок статистики === */
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

const TonLogo = styled.img`
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-left: 5px;
`;

/* === График === */
const ChartContainer = styled.div`
  width: 100%;
  height: 240px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 10px;
  animation: ${fadeIn} 0.6s ease;
`;

/* === Таблица подарков === */
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
  color: #4ea3ff;
  font-weight: 600;
`;

const GiftGrowth = styled.div<{ positive: boolean }>`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: ${(p) => (p.positive ? "#4EFFA1" : "#FF4E4E")};
  font-weight: 600;
`;

/* === Кнопки сортировки === */
const SortButtonRow = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  overflow-x: auto;
  gap: 8px;
  width: 100%;
  padding-bottom: 5px;
`;

const SortButton = styled.button<{ active?: boolean }>`
  background: ${(p) => (p.active ? "#00c2ff" : "rgba(255,255,255,0.08)")};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  flex-shrink: 0;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

/* === Кнопка Connect Wallet === */
const ConnectWalletButton = styled.button`
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
  margin-bottom: 20px;

  &:hover {
    transform: scale(1.05);
  }
`;

const WalletInfo = styled.div`
  background: linear-gradient(90deg, #09202b, #0a3344);
  border-radius: 20px;
  padding: 10px 16px;
  color: #aee8ff;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

/* === Внутренний компонент страницы === */
const PortfolioPageInner: React.FC = () => {
    const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
    const [portfolio, setPortfolio] = useState<Gift[]>([]);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Gift;
        direction: "asc" | "desc";
    }>({ key: "growth", direction: "desc" });

    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        const tg = (window as any).Telegram?.WebApp;
        if (tg?.initDataUnsafe?.user) {
            setTelegramUser(tg.initDataUnsafe.user);
        } else {
            setTelegramUser({
                first_name: "Иван",
                username: "ivan_dev",
                photo_url:
                    "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
            });
        }

        const demoPortfolio = gifts.map((g) => ({
            ...g,
            invested: Math.floor(Math.random() * 5000) + 1000,
        }));
        setPortfolio(demoPortfolio);
    }, []);

    const sortedPortfolio = useMemo(() => {
        const sorted = [...portfolio];
        sorted.sort((a, b) => {
            const aVal = a[sortConfig.key] ?? 0;
            const bVal = b[sortConfig.key] ?? 0;
            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [portfolio, sortConfig]);

    const requestSort = (key: keyof Gift) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const totalInvested = portfolio.reduce(
        (acc, g) => acc + (g.invested ?? 0),
        0
    );

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

            {/* ==== TON Connect ==== */}
            {!wallet ? (
                <ConnectWalletButton onClick={() => tonConnectUI.connectWallet()}>
                    <Wallet size={18} />
                    Подключить кошелёк
                </ConnectWalletButton>
            ) : (
                <WalletInfo>
                    <img src={tonLogo} alt="TON" style={{ width: 24, height: 24 }} />
                    <div>
                        <strong>
                            {wallet.account.address.slice(0, 6)}...
                            {wallet.account.address.slice(-6)}
                        </strong>
                    </div>
                </WalletInfo>
            )}

            {/* ==== Статистика ==== */}
            <StatsContainer>
                <StatBlock>
                    <StatLabel>Всего инвестировано</StatLabel>
                    <StatValue>
                        {totalInvested.toLocaleString()} <TonLogo src={tonLogo} alt="TON" />
                    </StatValue>
                </StatBlock>
                <StatBlock>
                    <StatLabel>Рост портфеля</StatLabel>
                    <StatValue style={{ color: "#4EFFA1" }}>
                        +{(Math.random() * 20).toFixed(2)}%
                    </StatValue>
                </StatBlock>
                <StatBlock>
                    <StatLabel>Подарков</StatLabel>
                    <StatValue>{portfolio.length}</StatValue>
                </StatBlock>
            </StatsContainer>

            {/* ==== График ==== */}
            <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.1)"
                        />
                        <XAxis dataKey="day" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1b1c20",
                                border: "none",
                                color: "#fff",
                            }}
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

            {/* ==== Фильтры сортировки ==== */}
            <SortButtonRow>
                <SortButton
                    active={sortConfig.key === "name"}
                    onClick={() => requestSort("name")}
                >
                    По названию
                </SortButton>
                <SortButton
                    active={sortConfig.key === "growth"}
                    onClick={() => requestSort("growth")}
                >
                    По росту
                </SortButton>
                <SortButton
                    active={sortConfig.key === "invested"}
                    onClick={() => requestSort("invested")}
                >
                    По инвестициям
                </SortButton>
                <SortButton
                    active={sortConfig.key === "price"}
                    onClick={() => requestSort("price")}
                >
                    По цене
                </SortButton>
            </SortButtonRow>

            {/* ==== Таблица ==== */}
            <TableContainer>
                <TableHeader>
                    <div style={{ flex: 2 }}>Название</div>
                    <div style={{ flex: 1, textAlign: "right" }}>Инвестиции</div>
                    <div style={{ flex: 1, textAlign: "right" }}>Рост</div>
                </TableHeader>

                {sortedPortfolio.map((gift) => (
                    <TableRow key={gift.id}>
                        <div
                            style={{ display: "flex", alignItems: "center", flex: 2 }}
                        >
                            <GiftImage src={gift.img} alt={gift.name} />
                            <GiftName>{gift.name}</GiftName>
                        </div>
                        <GiftPrice>{gift.invested ?? 0} TON</GiftPrice>
                        <GiftGrowth positive={gift.growth >= 0}>
                            {gift.growth >= 0 ? (
                                <ArrowUp size={14} />
                            ) : (
                                <ArrowDown size={14} />
                            )}
                            &nbsp;{gift.growth}%
                        </GiftGrowth>
                    </TableRow>
                ))}
            </TableContainer>
        </PageContainer>
    );
};

/* === Обёртка с TON Connect === */
const PortfolioPage: React.FC = () => {
    return (
        <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
            <PortfolioPageInner />
        </TonConnectUIProvider>
    );
};

export default PortfolioPage;
