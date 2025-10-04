import React, { useState } from "react";
import styled from "styled-components";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import GiftCard from "./GiftCard";
import Modal from "./Modal";

// --- Стили ---
const PageContainer = styled.div`
  background-color: #121212;
  color: #fff;
  font-family: sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #292929;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const Section = styled.div`
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  margin-bottom: 20px;
  box-sizing: border-box;
`;

const ProgressBarContainer = styled.div`
  background-color: #292929;
  border-radius: 10px;
  overflow: hidden;
  height: 15px;
  margin-top: 10px;
`;

const ProgressBar = styled.div`
  background-color: #00ff99;
  height: 100%;
  width: ${props => props.width || "0%"};
  transition: width 0.5s ease-in-out;
`;

const BottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #1e1e1e;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
`;

// --- Данные ---
const giftsData = [
    { name: "Gift 1", price: 10, img: "https://via.placeholder.com/50" },
    { name: "Gift 2", price: 15, img: "https://via.placeholder.com/50" },
    { name: "Gift 3", price: 20, img: "https://via.placeholder.com/50" },
    { name: "Gift 4", price: 25, img: "https://via.placeholder.com/50" }
];

const chartData = [
    { day: "Пн", value: 10 },
    { day: "Вт", value: 15 },
    { day: "Ср", value: 25 },
    { day: "Чт", value: 40 },
    { day: "Пт", value: 55 },
    { day: "Сб", value: 70 },
    { day: "Вс", value: 80 }
];

// --- Главный компонент ---
const InvestmentPage = () => {
    const [balance, setBalance] = useState(120);
    const [progress, setProgress] = useState(65);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedGift, setSelectedGift] = useState(null);

    const openModal = (gift) => {
        setSelectedGift(gift);
        setModalOpen(true);
    };

    const investTON = (amount) => {
        if (balance >= amount) {
            setBalance(balance - amount);
            setProgress(Math.min(progress + amount, 100));
            setModalOpen(false);
        } else {
            alert("Недостаточно TON");
        }
    };

    return (
        <PageContainer>
            <Header>
                <Button>Закрыть</Button>
                <div>Баланс: {balance} TON</div>
                <Button>Профиль</Button>
            </Header>

            <Avatar src="https://via.placeholder.com/80" alt="Аватар" />
            <h2>qvvor</h2>

            <StatsContainer>
                <StatItem>
                    <div>20.4K</div>
                    <div>Общий объем</div>
                </StatItem>
                <StatItem>
                    <div>101</div>
                    <div>Куплено ></div>
                </StatItem>
                <StatItem>
                    <div>146</div>
                    <div>Продано</div>
                </StatItem>
            </StatsContainer>

            <Section>
                <h3>Инвестиции</h3>
                <div>Ваш прогресс:</div>
                <ProgressBarContainer>
                    <ProgressBar width={`${progress}%`} />
                </ProgressBarContainer>
                <div>{progress}% выполнено</div>
            </Section>

            <Section>
                <h3>График инвестиций</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                        <XAxis dataKey="day" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip contentStyle={{ backgroundColor: "#292929", border: "none", color: "#fff" }} />
                        <Line type="monotone" dataKey="value" stroke="#00ff99" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </Section>

            <Section>
                <h3>Розыгрыши</h3>
                <div>Доступные подарки для инвестирования:</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
                    {giftsData.map((gift, idx) => (
                        <GiftCard key={idx} gift={gift} onClick={() => openModal(gift)} />
                    ))}
                </div>
            </Section>

            <Section>
                <h3>Приглашайте друзей</h3>
                <div>Зарабатывайте 20-50% в TON с их инвестиций</div>
            </Section>

            <BottomNav>
                <div>Маркет</div>
                <div>Мои подарки</div>
                <div>Сезоны</div>
                <div>Профиль</div>
            </BottomNav>

            {modalOpen && (
                <Modal
                    gift={selectedGift}
                    onClose={() => setModalOpen(false)}
                    onInvest={investTON}
                />
            )}
        </PageContainer>
    );
};

export default InvestmentPage;
