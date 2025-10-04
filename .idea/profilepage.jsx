import React from "react";
import styled from "styled-components";

// --- Основные стили ---
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

const GiftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
`;

const GiftCard = styled.div`
  background-color: #252525;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
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

// --- Компоненты ---
const ProfilePage = () => {
    return (
        <PageContainer>
            <Header>
                <Button>Закрыть</Button>
                <div>0 TON</div>
                <Button>...</Button>
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
                    <div>Продано ></div>
                </StatItem>
            </StatsContainer>

            <Section>
                <h3>Кэшбэк</h3>
                <div>0% / Уровень 0</div>
                <div>Доступно для получения: 0</div>
            </Section>

            <Section>
                <h3>Розыгрыши</h3>
                <div>Присоединяйся к розыгрышам и выигрывай коллекционные подарки</div>
            </Section>

            <Section>
                <h3>Приглашайте друзей и зарабатывайте TON</h3>
                <div>Реферальные комиссии</div>
                <div>Зарабатывайте от 20% до 50% в TON от их покупок</div>
            </Section>

            <Section>
                <h3>Мои подарки</h3>
                <GiftGrid>
                    <GiftCard>
                        <img src="https://via.placeholder.com/50" alt="Gift" />
                        <p>Gift Name 1</p>
                        <p>Price: 10 TON</p>
                    </GiftCard>
                    <GiftCard>
                        <img src="https://via.placeholder.com/50" alt="Gift" />
                        <p>Gift Name 2</p>
                        <p>Price: 15 TON</p>
                    </GiftCard>
                </GiftGrid>
            </Section>

            <BottomNav>
                <div>Маркет</div>
                <div>Мои подарки</div>
                <div>Сезоны</div>
                <div>Профиль</div>
            </BottomNav>
        </PageContainer>
    );
};

export default ProfilePage;
