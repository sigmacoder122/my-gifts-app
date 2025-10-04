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

// --- Анимации ---
const glowAnim = keyframes`
  0% { box-shadow: 0 0 5px #00aaff; }
  50% { box-shadow: 0 0 20px #00aaff; }
  100% { box-shadow: 0 0 5px #00aaff; }
`;

const pulseAnim = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
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
  padding: 30px 20px 30px;
  color: #fff;
  font-family: 'Arial', sans-serif;
`;

const TopStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
`;

const StatBox = styled.div`
  flex: 1;
  min-width: 100px;
  background: #1f1f1f;
  border-radius: 20px;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: center;
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: #aaa;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.color || "#fff"};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
`;

const AvatarWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #000; // чёрная аватарка
  border: 2px solid #00aaff;
  animation: ${pulseAnim} 2s infinite;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const Balance = styled.div`
  font-size: 18px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const TonIcon = styled.img`
  width: 22px;
  height: 22px;
  animation: ${glowAnim} 1.5s infinite;
`;

const AnimatedNumber = styled.span`
  display: inline-block;
  animation: ${growNumber} 0.5s;
`;

const PortfolioSection = styled.div`
  margin-top: 30px;
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
`;

const StatsCards = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  flex: 1 1 120px;
  background: #1e1e1e;
  border-radius: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 170, 255, 0.3);
  }
`;

const StatValueCard = styled.div`
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${props => (props.positive ? "#0f0" : "#f55")};
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const ActionButton = styled.button`
  flex: 1;
  background: none;
  border: 2px solid #00aaff;
  border-radius: 25px;
  padding: 14px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  &:hover {
    background-color: #00aaff;
    color: #121212;
    transform: scale(1.05);
  }
`;

// --- Referral Block ---
const ReferralContainer = styled.div`
  background: #1f1f1f;
  border-radius: 20px;
  padding: 20px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ReferralHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #aaa;
`;

const ReferralText = styled.div`
  font-size: 14px;
  color: #ddd;
  line-height: 1.5;
`;

const ReferralButton = styled.button`
  background: #00aaff;
  border: none;
  border-radius: 25px;
  padding: 12px 20px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  align-self: flex-start;
  transition: all 0.2s;

  &:hover {
    background: #0090dd;
    transform: scale(1.05);
  }
`;

// --- Компонент ---
const ProfilePage = () => {
    const [balance, setBalance] = useState(1250);
    const [animatedBalance, setAnimatedBalance] = useState(balance);

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

    const portfolioData = [
        { day: "Пн", value: balance * 0.95 },
        { day: "Вт", value: balance * 1.05 },
        { day: "Ср", value: balance * 1.1 },
        { day: "Чт", value: balance * 1.15 },
        { day: "Пт", value: balance * 1.2 },
        { day: "Сб", value: balance * 1.18 },
        { day: "Вс", value: balance * 1.22 },
    ];

    const stats = [
        { name: "Рост портфеля", value: 12, positive: true },
        { name: "ТОП подарок", value: -5, positive: false },
        { name: "Средний рост", value: 8, positive: true },
    ];

    return (
        <Container>
            {/* Верхняя панель с балансом и общим объемом */}
            <TopStats>
                <StatBox>
                    <StatTitle>Общий объём инвестиций</StatTitle>
                    <StatValue>{5000} TON</StatValue>
                </StatBox>
                <StatBox>
                    <StatTitle>Общий заработок</StatTitle>
                    <StatValue color="#0f0">{320} TON</StatValue>
                </StatBox>
                <StatBox>
                    <StatTitle>Баланс</StatTitle>
                    <StatValue>
                        <TonIcon src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Toncoin_logo.svg/512px-Toncoin_logo.svg.png" />
                        {animatedBalance}
                    </StatValue>
                </StatBox>
            </TopStats>

            {/* Профиль */}
            <Header>
                <AvatarWrapper />
                <UserInfo>
                    <UserName>Пользователь</UserName>
                    <Balance>
                        <AnimatedNumber>{animatedBalance}</AnimatedNumber>
                        <TonIcon src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Toncoin_logo.svg/512px-Toncoin_logo.svg.png" />
                    </Balance>
                </UserInfo>
            </Header>

            {/* График портфеля */}
            <PortfolioSection>
                <SectionTitle>График портфеля</SectionTitle>
                <GraphWrapper>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={portfolioData}>
                            <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                            <XAxis dataKey="day" stroke="#00aaff" />
                            <YAxis stroke="#00aaff" />
                            <RechartsTooltip
                                contentStyle={{ background: "#292929", border: "none", borderRadius: "10px", color: "#fff" }}
                            />
                            <Line type="monotone" dataKey="value" stroke="#00aaff" strokeWidth={3} dot={{ r: 5, fill: "#00aaff" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </GraphWrapper>
            </PortfolioSection>

            {/* Статистика */}
            <StatsCards>
                {stats.map((s, idx) => (
                    <StatCard key={idx}>
                        <div>{s.name}</div>
                        <StatValueCard positive={s.positive}>
                            {s.value > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                            {Math.abs(s.value)}%
                        </StatValueCard>
                    </StatCard>
                ))}
            </StatsCards>

            {/* Кнопки действий (без "Инвестировать") */}
            <ButtonsRow>
                <ActionButton>Вывести TON</ActionButton>
                <ActionButton>История транзакций</ActionButton>
            </ButtonsRow>

            {/* Реферальный блок */}
            <ReferralContainer>
                <ReferralHeader>Приглашайте друзей, зарабатывайте TON</ReferralHeader>
                <ReferralText>• Реферальные комиссии, зарабатывайте 20-50% в TON их покупок</ReferralText>
                <ReferralText>• 10% очков сезона из очков, заработанных вашими рефералами</ReferralText>
                <ReferralText>• Кэшбэк, зарабатывайте деньги с покупок</ReferralText>
                <ReferralButton>Пригласи друзей</ReferralButton>
            </ReferralContainer>
        </Container>
    );
};

export default ProfilePage;
