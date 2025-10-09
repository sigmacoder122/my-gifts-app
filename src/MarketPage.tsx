import React, { useState, useMemo, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
    ArrowUp,
    ArrowDown,
    Gift as GiftIcon,
    Check,
    X,
    Wallet,
} from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
} from "recharts";
import { gifts, tonLogo } from "./data/gifts";

/* ==============================
   🎨 АНИМАЦИИ
============================== */
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
`;
const hoverGlow = keyframes`
  0% { box-shadow: 0 0 0 rgba(0,170,255,0.05); }
  50% { box-shadow: 0 0 25px rgba(0,170,255,0.08); }
  100% { box-shadow: 0 0 0 rgba(0,170,255,0.05); }
`;
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

/* ==============================
   📱 ОСНОВНОЙ КОНТЕЙНЕР
============================== */
const Page = styled.div`
  background: #0e0f11;
  color: #fff;
  min-height: 100vh;
  padding: 16px;
  font-family: "Inter", sans-serif;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  touch-action: pan-y;
  animation: ${fadeIn} 0.5s ease;
`;

/* ==============================
   🔝 ХЕДЕР
============================== */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
`;

const Balance = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 170, 255, 0.08);
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  img {
    width: 18px;
    height: 18px;
  }
`;

/* ==============================
   💳 КНОПКА ПОДКЛЮЧЕНИЯ WALLET
============================== */
const ConnectWalletButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg, #007aff, #00c2ff);
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 0 12px rgba(0, 194, 255, 0.3);
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 0 20px rgba(0, 194, 255, 0.5);
  }
`;

/* ==============================
   🔍 ФИЛЬТРЫ
============================== */
const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 16px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  scroll-behavior: smooth;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  background: ${({ active }) => (active ? "#00c2ff" : "#1c1c1e")};
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.25s;
  &:hover {
    opacity: 0.9;
  }
`;

/* ==============================
   🎁 КАРТОЧКИ ПОДАРКОВ
============================== */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  width: 100%;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background: #141416;
  border-radius: 16px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    animation: ${hoverGlow} 1.8s infinite;
  }
`;

const GiftImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
  margin-bottom: 6px;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(0, 170, 255, 0.06),
    rgba(255, 255, 255, 0.02)
  );
`;

const GiftName = styled.div`
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
  text-align: center;
`;

const Price = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  color: #00c2ff;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Growth = styled.div<{ positive?: boolean }>`
  color: ${({ positive }) => (positive ? "#00ff99" : "#ff5555")};
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 2px;
`;

/* ==============================
   🪟 МОДАЛЬНОЕ ОКНО
============================== */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(5px);
  overflow-y: auto;
  padding: 20px;
`;

const Modal = styled.div<{ offset?: number }>`
  background: #111;
  border-radius: 20px 20px 10px 10px;
  width: 100%;
  max-width: 420px;
  padding: 20px;
  animation: ${slideUp} 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 85vh;
  overflow-y: auto;
  transform: translateY(${({ offset }) => offset}px);
  transition: transform 0.25s ease;
`;

const ModalImage = styled.img`
  width: 80%;
  border-radius: 12px;
  margin: 12px 0;
`;

const ModalInput = styled.input`
  width: 100%;
  background: #1a1a1c;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 14px;
  color: #fff;
  margin: 14px 0;
  font-size: 16px;
  outline: none;
  text-align: center;
  &:focus {
    border-color: #00c2ff;
  }
`;

const ResultText = styled.div`
  font-size: 15px;
  margin-bottom: 12px;
  color: #a0a0a0;
  text-align: center;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 20px;
`;

const ModalButton = styled.button<{ primary?: boolean }>`
  flex: 1;
  background: ${({ primary }) => (primary ? "#00c2ff" : "#1c1c1e")};
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
  &:hover {
    opacity: 0.9;
  }
`;

const ChartWrap = styled.div`
  width: 100%;
  height: 140px;
  margin-bottom: 10px;
`;

/* ==============================
   📈 ФУНКЦИЯ ПОСТРОЕНИЯ ГРАФИКА
============================== */
const getChart = (price: number) => {
    return [
        { day: "Пн", value: Math.round(price * 0.95) },
        { day: "Вт", value: Math.round(price * 0.98) },
        { day: "Ср", value: Math.round(price * 1.02) },
        { day: "Чт", value: Math.round(price * 1.05) },
        { day: "Пт", value: Math.round(price * 1.07) },
        { day: "Сб", value: Math.round(price * 1.12) },
        { day: "Вс", value: Math.round(price * 1.15) },
    ];
};

/* ==============================
   ⚙️ КОМПОНЕНТ MARKET PAGE
============================== */
export default function MarketPage() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [sortField, setSortField] = useState<"price" | "growth">("price");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [selectedGift, setSelectedGift] = useState<any>(null);
    const [investment, setInvestment] = useState<number | "">("");
    const [modalOffset, setModalOffset] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const sortedGifts = useMemo(() => {
        const arr = [...gifts];
        arr.sort((a, b) => {
            const valA = sortField === "price" ? a.price : a.growth;
            const valB = sortField === "price" ? b.price : b.growth;
            return sortOrder === "asc" ? valA - valB : valB - valA;
        });
        return arr;
    }, [sortField, sortOrder]);

    const calcGrowth =
        selectedGift && investment
            ? Math.round((selectedGift.growth / 100) * Number(investment))
            : 0;

    const confirm = () => {
        if (!investment || Number(investment) <= 0) return;
        alert(
            `✅ Инвестировано ${investment} TON в ${selectedGift.name}. Прирост: ${calcGrowth} TON`
        );
        setSelectedGift(null);
        setInvestment("");
        setModalOffset(0);
    };

    // Обработка адаптации под клавиатуру
    useEffect(() => {
        const handler = () => {
            if (inputRef.current && window.visualViewport) {
                const viewportHeight = window.visualViewport.height;
                const elementBottom = inputRef.current.getBoundingClientRect().bottom;
                const diff = elementBottom - viewportHeight + 20;
                setModalOffset(diff > 0 ? -diff : 0);
            }
        };
        window.visualViewport?.addEventListener("resize", handler);
        return () => window.visualViewport?.removeEventListener("resize", handler);
    }, []);

    useEffect(() => {
        if (selectedGift && inputRef.current) {
            inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            setModalOffset(0);
        }
    }, [selectedGift]);

    return (
        <Page>
            <Header>
                <Title>Магазин подарков</Title>
                {walletConnected ? (
                    <Balance>
                        <img src={tonLogo} alt="TON" />
                        12,540 TON
                    </Balance>
                ) : (
                    <ConnectWalletButton onClick={() => setWalletConnected(true)}>
                        <Wallet size={16} /> Connect Wallet
                    </ConnectWalletButton>
                )}
            </Header>

            <FilterRow>
                <FilterButton
                    active={sortField === "price"}
                    onClick={() => setSortField("price")}
                >
                    По цене
                </FilterButton>
                <FilterButton
                    active={sortField === "growth"}
                    onClick={() => setSortField("growth")}
                >
                    По росту
                </FilterButton>
                <FilterButton
                    active={sortOrder === "asc"}
                    onClick={() => setSortOrder("asc")}
                >
                    По возрастанию
                </FilterButton>
                <FilterButton
                    active={sortOrder === "desc"}
                    onClick={() => setSortOrder("desc")}
                >
                    По убыванию
                </FilterButton>
            </FilterRow>

            <Grid>
                {sortedGifts.map((gift) => (
                    <Card key={gift.id} onClick={() => setSelectedGift(gift)}>
                        <GiftImage src={gift.img} alt={gift.name} />
                        <GiftName>{gift.name}</GiftName>
                        <Price>
                            <GiftIcon size={14} /> {gift.price} TON
                        </Price>
                        <InfoRow>
                            <Growth positive={gift.growth >= 0}>
                                {gift.growth >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                {gift.growth}%
                            </Growth>
                        </InfoRow>
                    </Card>
                ))}
            </Grid>

            {selectedGift && (
                <Overlay onClick={() => setSelectedGift(null)}>
                    <Modal offset={modalOffset} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ textAlign: "center", margin: 0 }}>{selectedGift.name}</h2>
                        <ModalImage src={selectedGift.img} alt={selectedGift.name} />

                        <ChartWrap>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={getChart(selectedGift.price)}>
                                    <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="day" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <RechartsTooltip
                                        contentStyle={{
                                            background: "#0f0f0f",
                                            borderRadius: "8px",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#00c2ff"
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartWrap>

                        <ModalInput
                            ref={inputRef}
                            type="number"
                            inputMode="decimal"
                            placeholder="Введите сумму TON"
                            value={investment}
                            onChange={(e) =>
                                setInvestment(e.target.value === "" ? "" : Number(e.target.value))
                            }
                        />

                        <ResultText>
                            Прирост: <b>{calcGrowth}</b> TON ({selectedGift.growth}%)
                        </ResultText>

                        <ModalButtons>
                            <ModalButton onClick={() => setSelectedGift(null)}>
                                <X size={16} /> Отмена
                            </ModalButton>
                            <ModalButton primary onClick={confirm}>
                                <Check size={16} /> Подтвердить
                            </ModalButton>
                        </ModalButtons>
                    </Modal>
                </Overlay>
            )}
        </Page>
    );
}
