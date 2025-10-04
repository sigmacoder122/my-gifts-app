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
import { gifts } from "./data/gifts";

// ======================= Типы =======================
type GiftType = {
    id: number;
    name: string;
    price: number;
    growth: number;
    img: string;
};

// ======================= Анимации =======================
const hoverAnim = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ======================= Стили =======================
const Container = styled.div`
  background: #121212;
  min-height: 100vh;
  padding: 30px 20px 80px;
  color: #fff;
  font-family: 'Arial', sans-serif;
`;

const SortRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const SortButton = styled.button<{ active?: boolean }>`
  background: ${({ active }) => (active ? "#00aaff" : "transparent")};
  border: 2px solid #00aaff;
  border-radius: 12px;
  padding: 8px 12px;
  cursor: pointer;
  color: ${({ active }) => (active ? "#121212" : "#fff")};
  font-weight: bold;
  transition: all 0.2s;

  &:hover {
    background: #00aaff;
    color: #121212;
  }
`;

const GiftsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const GiftCardWrapper = styled.div`
  background: #1e1e1e;
  border-radius: 20px;
  padding: 15px;
  cursor: pointer;
  animation: ${fadeIn} 0.4s ease forwards;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    animation: ${hoverAnim} 0.6s ease forwards;
    box-shadow: 0 5px 20px rgba(0, 170, 255, 0.4);
  }
`;

const GiftImage = styled.img`
  width: 100%;
  height: auto;       /* высота подстраивается под картинку */
  max-height: 300px;  /* ограничение, чтобы карточка не была слишком высокой */
  object-fit: contain; /* картинка целиком, без обрезки */
  border-radius: 15px;
  margin-bottom: 12px;
`;

const GiftInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GiftName = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const GiftPrice = styled.div`
  font-size: 14px;
  background: #000;
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  width: fit-content;
`;

const GiftGrowth = styled.div<{ positive: boolean }>`
  font-size: 14px;
  background: #000;
  color: ${(props) => (props.positive ? "#0f0" : "#f55")};
  padding: 4px 8px;
  border-radius: 6px;
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 4px;
`;

// ======================= Модалка =======================
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
`;

const ModalContent = styled.div`
  background: #1e1e1e;
  border-radius: 20px;
  padding: 20px;
  max-width: 500px;
  width: 100%;
  animation: ${fadeIn} 0.3s ease;
  color: #fff;
`;

const ModalButtons = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  gap: 15px;
`;

const InvestButton = styled.button`
  background: #00aaff;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-weight: bold;
  color: #121212;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #0077aa;
  }
`;

// ======================= Кастомный Tooltip =======================
type TooltipProps = { active?: boolean; payload?: any };

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: "#1e1e1e",
                    border: "1px solid #00aaff",
                    padding: "10px",
                    borderRadius: "10px",
                    color: "#fff",
                }}
            >
                <p><strong>{payload[0].payload.day}</strong></p>
                <p>Цена: {payload[0].value.toFixed(2)} TON</p>
            </div>
        );
    }
    return null;
};

// ======================= MarketPage =======================
const MarketPage: React.FC = () => {
    const [selectedGift, setSelectedGift] = useState<GiftType | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [percentDisplay, setPercentDisplay] = useState<string>("0");
    const [sortType, setSortType] = useState<"priceAsc" | "priceDesc" | "growthAsc" | "growthDesc">("priceAsc");

    // сортировка подарков
    const sortedGifts = [...gifts].sort((a, b) => {
        switch (sortType) {
            case "priceAsc": return a.price - b.price;
            case "priceDesc": return b.price - a.price;
            case "growthAsc": return a.growth - b.growth;
            case "growthDesc": return b.growth - a.growth;
            default: return 0;
        }
    });

    // плавное обновление процента
    useEffect(() => {
        if (!selectedGift) return;
        const targetPercent = amount ? ((parseFloat(amount) / selectedGift.price) * 100).toFixed(2) : "0";
        let start = parseFloat(percentDisplay);
        const end = parseFloat(targetPercent);

        const step = () => {
            start += (end - start) / 5;
            if (Math.abs(start - end) < 0.1) start = end;
            setPercentDisplay(start.toFixed(2));
            if (start !== end) requestAnimationFrame(step);
        };
        step();
    }, [amount, selectedGift]);

    // данные графика
    const chartData = selectedGift ? [
        { day: "Пн", value: selectedGift.price * 0.95 },
        { day: "Вт", value: selectedGift.price * 1.05 },
        { day: "Ср", value: selectedGift.price * 1.1 },
        { day: "Чт", value: selectedGift.price * 1.15 },
        { day: "Пт", value: selectedGift.price * 1.2 },
        { day: "Сб", value: selectedGift.price * 1.18 },
        { day: "Вс", value: selectedGift.price * 1.22 },
    ] : [];

    return (
        <Container>
            <h2 style={{ marginBottom: "20px" }}>🎁 Маркет подарков</h2>

            {/* Сортировка */}
            <SortRow>
                <SortButton active={sortType === "priceAsc"} onClick={() => setSortType("priceAsc")}>Цена ↑</SortButton>
                <SortButton active={sortType === "priceDesc"} onClick={() => setSortType("priceDesc")}>Цена ↓</SortButton>
                <SortButton active={sortType === "growthAsc"} onClick={() => setSortType("growthAsc")}>Рост ↑</SortButton>
                <SortButton active={sortType === "growthDesc"} onClick={() => setSortType("growthDesc")}>Рост ↓</SortButton>
            </SortRow>

            <GiftsGrid>
                {sortedGifts.map((gift: GiftType) => (
                    <GiftCardWrapper key={gift.id} onClick={() => setSelectedGift(gift)}>
                        <GiftImage src={gift.img} alt={gift.name} />
                        <GiftInfo>
                            <GiftName>{gift.name}</GiftName>
                            <GiftPrice>{gift.price} TON</GiftPrice>
                            <GiftGrowth positive={gift.growth >= 0}>
                                {gift.growth >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                {Math.abs(gift.growth)}%
                            </GiftGrowth>
                        </GiftInfo>
                    </GiftCardWrapper>
                ))}
            </GiftsGrid>

            {selectedGift && (
                <ModalOverlay onClick={() => setSelectedGift(null)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedGift.name}</h3>
                        <p>Цена: <strong>{selectedGift.price} TON</strong></p>
                        <p>
                            Рост:{" "}
                            <strong style={{ color: selectedGift.growth >= 0 ? "#0f0" : "#f55" }}>
                                {selectedGift.growth >= 0 ? "▲" : "▼"} {Math.abs(selectedGift.growth)}%
                            </strong>
                        </p>

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

                        <div style={{ marginTop: "15px" }}>
                            <label>Введите сумму инвестиций (TON): </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={{
                                    width: "100%",
                                    marginTop: "8px",
                                    padding: "10px",
                                    borderRadius: "10px",
                                    border: "1px solid #00aaff",
                                    background: "#121212",
                                    color: "#fff",
                                }}
                            />
                            <p style={{ marginTop: "10px" }}>
                                Это {percentDisplay}% от цены подарка
                            </p>
                        </div>

                        <ModalButtons>
                            <InvestButton
                                onClick={() => {
                                    alert(`Инвестировано ${amount} TON в ${selectedGift.name}`);
                                }}
                            >
                                Подтвердить
                            </InvestButton>
                            <InvestButton onClick={() => setSelectedGift(null)}>Отмена</InvestButton>
                        </ModalButtons>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default MarketPage;
