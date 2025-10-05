// src/ProfilePage.tsx
import React from "react";
import styled, { keyframes } from "styled-components";
import { ArrowRight } from "lucide-react";

/* ===== Анимации ===== */
const glowAnim = keyframes`
  0% { box-shadow: 0 0 5px #00aaff; }
  50% { box-shadow: 0 0 15px #00aaff; }
  100% { box-shadow: 0 0 5px #00aaff; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ===== Стили ===== */
const Page = styled.div`
  background: #0f0f10;
  min-height: 100vh;
  padding: 16px;
  color: #fff;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  display: flex;
  flex-direction: column;
  animation: ${fadeInUp} 0.5s ease;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const TonBalance = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(90deg, #083248, #0a3048);
  padding: 6px 16px;
  border-radius: 999px;
  font-weight: 700;
  color: #dff6ff;
  box-shadow: 0 6px 20px rgba(0, 170, 255, 0.08);
  font-size: 14px;
`;

const TonIcon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const CenterProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  animation: ${fadeInUp} 0.6s ease;
`;

const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 3px solid #00c2ff;
  padding: 2px;
  margin-bottom: 12px;
`;

const Nickname = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #fff;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 32px;
  gap: 12px;
`;

const StatCard = styled.div`
  background: #121214;
  padding: 20px;
  border-radius: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.05);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: default;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,170,255,0.3);
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 6px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #00c2ff;
`;

const ReferralCard = styled.div`
  background: #1a1a1f;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
  animation: ${fadeInUp} 0.7s ease;
`;

const ReferralTitle = styled.div`
  font-weight: 700;
  color: #fff;
  font-size: 18px;
`;

const ReferralText = styled.div`
  font-size: 14px;
  color: rgba(255,255,255,0.6);
`;

const ReferralRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReferralInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReferralPercent = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #00c2ff;
`;

const ReferralDescription = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.5);
`;

const CashbackRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const CashbackInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CashbackLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #fff;
`;

const CashbackDesc = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.5);
`;

const InviteButton = styled.button`
  background: linear-gradient(90deg, #00c2ff, #0077ff);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.3s;
  &:hover {
    background: linear-gradient(90deg, #00aaff, #005fcc);
  }
`;

/* ===== Заглушки ===== */
const mockAvatar = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
const tonLogo = "https://ton.org/download/ton_symbol.png";

/* ===== Компонент ===== */
const ProfilePage: React.FC = () => {
    return (
        <Page>
            <TopRow>
                <TonBalance>
                    <TonIcon src={tonLogo} alt="TON" />
                    <div>12 345 TON</div>
                </TonBalance>
            </TopRow>

            <CenterProfile>
                <Avatar src={mockAvatar} alt="Avatar" />
                <Nickname>@nickname</Nickname>
            </CenterProfile>

            <StatsRow>
                <StatCard>
                    <StatLabel>Общий объём</StatLabel>
                    <StatValue>45 678 TON</StatValue>
                </StatCard>
                <StatCard>
                    <StatLabel>Общий прирост</StatLabel>
                    <StatValue>+12 345 TON</StatValue>
                </StatCard>
                <StatCard>
                    <StatLabel>Друзья приглашено</StatLabel>
                    <StatValue>23</StatValue>
                </StatCard>
            </StatsRow>

            <ReferralCard>
                <ReferralTitle>Приглашайте друзей</ReferralTitle>
                <ReferralText>Зарабатывайте TON от их покупок</ReferralText>

                <ReferralRow>
                    <ReferralInfo>
                        <ReferralPercent>20–50%</ReferralPercent>
                        <ReferralDescription>Реферальная комиссия</ReferralDescription>
                    </ReferralInfo>
                    <ArrowRight color="#fff" size={24} />
                </ReferralRow>

                <CashbackRow>
                    <CashbackInfo>
                        <CashbackLabel>Кэшбэк</CashbackLabel>
                        <CashbackDesc>Зарабатывайте деньги с покупок друзей</CashbackDesc>
                    </CashbackInfo>
                </CashbackRow>

                <InviteButton>Пригласить друзей</InviteButton>
            </ReferralCard>
        </Page>
    );
};

export default ProfilePage;
