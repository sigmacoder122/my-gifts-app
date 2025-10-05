// src/MarketPage.tsx
import React, { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { ArrowUp, ArrowDown, ShoppingBag, User, Gift as GiftIcon, Grid as GridIcon } from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
} from "recharts";
import { gifts as giftsData, Gift as GiftType } from "./data/gifts";

/* ====== АНИМАЦИИ ====== */
const glow = keyframes`
  0% { box-shadow: 0 0 0px rgba(0,170,255,0.0); }
  50% { box-shadow: 0 6px 22px rgba(0,170,255,0.18); }
  100% { box-shadow: 0 0 0px rgba(0,170,255,0.0); }
`;

/* ====== СТИЛИ ====== */
const Page = styled.div`
  background: #0f0f10;
  min-height: 100vh;
  padding: 18px 18px 110px;
  color: #fff;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const PageTitle = styled.h1`
  font-size: 26px;
  margin: 0;
  font-weight: 700;
`;

const BalanceBubble = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg, #083248, #0a3048);
  border: 2px solid rgba(0, 170, 255, 0.12);
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 700;
  color: #dff6ff;
  box-shadow: 0 6px 20px rgba(0, 170, 255, 0.06);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 8px;
`;

const Card = styled.div`
  background: #121214;
  border-radius: 18px;
  padding: 14px;
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  transition: all 0.25s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(0, 170, 255, 0.08);
  }
`;

const ImgWrap = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  border: 2px solid rgba(0,170,255,0.25);
  background: radial-gradient(circle at 50% 50%, rgba(0,170,255,0.1), rgba(255,255,255,0.02));
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: ${glow} 3.2s infinite;
`;

const Img = styled.img`
  width: 85%;
  height: 85%;
  object-fit: contain;
`;

const Name = styled.div`
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  margin-top: 6px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  width: 100%;
`;

const PriceBadge = styled.div`
  background: linear-gradient(90deg, #00aaff, #00c8ff);
  color: #041016;
  font-weight: 800;
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0,170,255,0.3);
`;

const GrowthBadge = styled.div<{ positive?: boolean }>`
  background: ${(p) => (p.positive ? "rgba(0,255,130,0.1)" : "rgba(255,80,80,0.1)")};
  color: ${(p) => (p.positive ? "#2ef06a" : "#ff6b6b")};
  border: 1px solid ${(p) => (p.positive ? "rgba(0,255,130,0.3)" : "rgba(255,80,80,0.3)")};
  padding: 8px 12px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CartBtn = styled.button`
  background: rgba(255,255,255,0.03);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dbeefc;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: rgba(255,255,255,0.07);
    transform: translateY(-2px);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 80;
`;

const ModalBox = styled.div`
  width: 92%;
  max-width: 680px;
  background: #101214;
  border-radius: 16px;
  padding: 18px;
  border: 1px solid rgba(255,255,255,0.03);
  box-shadow: 0 24px 48px rgba(0,0,0,0.6);
`;

const BottomNav = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 8px;
  margin: 0 10px;
  background: linear-gradient(180deg, rgba(18,18,18,0.95), rgba(10,10,10,0.98));
  border-radius: 18px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 6px;
  z-index: 100;
  border: 1px solid rgba(255,255,255,0.03);
`;

const NavItem = styled.button<{ active?: boolean }>`
  background: ${(p) => (p.active ? "#0a2b3a" : "transparent")};
  border: none;
  color: ${(p) => (p.active ? "#00aaff" : "#e7f6ff")};
  padding: 8px 10px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    color: #00aaff;
  }
`;

/* ====== Мок графика ====== */
const sampleChart = (price: number) => [
    { day: "Пн", value: +(price * 0.95).toFixed(2) },
    { day: "Вт", value: +(price * 1.02).toFixed(2) },
    { day: "Ср", value: +(price * 1.08).toFixed(2) },
    { day: "Чт", value: +(price * 1.12).toFixed(2) },
    { day: "Пт", value: +(price * 1.15).toFixed(2) },
    { day: "Сб", value: +(price * 1.18).toFixed(2) },
    { day: "Вс", value: +(price * 1.2).toFixed(2) },
];

/* ====== КОМПОНЕНТ ====== */
const MarketPage: React.FC = () => {
    const [selected, setSelected] = useState<GiftType | null>(null);
    const [activeTab, setActiveTab] = useState<"market" | "mygifts" | "seasons" | "profile">("market");

    const gifts = useMemo(() => giftsData, []);

    return (
        <Page>
            <TitleRow>
                <PageTitle>Все подарки</PageTitle>
                <BalanceBubble>
                    <GiftIcon size={16} />
                    <div>0 TON</div>
                </BalanceBubble>
            </TitleRow>

            <Grid>
                {gifts.map((g) => (
                    <Card key={g.id} onClick={() => setSelected(g)}>
                        <ImgWrap>
                            <Img src={g.img} alt={g.name} />
                        </ImgWrap>
                        <Name>{g.name}</Name>

                        <InfoRow>
                            <PriceBadge>{g.price} TON</PriceBadge>
                            <GrowthBadge positive={g.growth >= 0}>
                                {g.growth >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                {Math.abs(g.growth)}%
                            </GrowthBadge>
                            <CartBtn
                                onClick={(e) => {
                                    e.stopPropagation();
                                    alert("Добавлено в корзину (демо)");
                                }}
                            >
                                <ShoppingBag size={16} />
                            </CartBtn>
                        </InfoRow>
                    </Card>
                ))}
            </Grid>

            {selected && (
                <ModalOverlay onClick={() => setSelected(null)}>
                    <ModalBox onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ margin: 0 }}>{selected.name}</h3>
                        <div style={{ height: 220, marginTop: 12 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sampleChart(selected.price)}>
                                    <CartesianGrid stroke="rgba(255,255,255,0.03)" />
                                    <XAxis dataKey="day" stroke="#7ed6ff" />
                                    <YAxis stroke="#7ed6ff" />
                                    <RechartsTooltip contentStyle={{ background: "#0f1720" }} />
                                    <Line type="monotone" dataKey="value" stroke="#00c2ff" strokeWidth={3} dot={{ r: 4, fill: "#00c2ff" }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </ModalBox>
                </ModalOverlay>
            )}

            <BottomNav>
                <NavItem active={activeTab === "market"} onClick={() => setActiveTab("market")}>
                    <div><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 11h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></div>
                    <div style={{ fontSize: 12 }}>Маркет</div>
                </NavItem>

                <NavItem active={activeTab === "mygifts"} onClick={() => setActiveTab("mygifts")}>
                    <GiftIcon size={18} />
                    <div style={{ fontSize: 12 }}>Мои подарки</div>
                </NavItem>

                <NavItem active={activeTab === "seasons"} onClick={() => setActiveTab("seasons")}>
                    <GridIcon size={18} />
                    <div style={{ fontSize: 12 }}>Сезоны</div>
                </NavItem>

                <NavItem active={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
                    <User size={18} />
                    <div style={{ fontSize: 12 }}>Профиль</div>
                </NavItem>
            </BottomNav>
        </Page>
    );
};

export default MarketPage;
