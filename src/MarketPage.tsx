import React, { useState, useMemo, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
    ArrowUp,
    ArrowDown,
    Gift as GiftIcon,
    ChevronDown,
    Check,
    X,
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
import { gifts } from "./data/gifts";
import { tonLogo } from "./data/gifts";

/* === АНИМАЦИИ === */
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
`;

const hoverGlow = keyframes`
  0% { box-shadow: 0 0 0 rgba(0,170,255,0.05); }
  50% { box-shadow: 0 0 25px rgba(0,170,255,0.08); }
  100% { box-shadow: 0 0 0 rgba(0,170,255,0.05); }
`;

/* === КОНТЕЙНЕР СТРАНИЦЫ === */
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
`;

/* === ЗАГОЛОВОК === */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
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

/* === ФИЛЬТРЫ === */
const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 16px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  position: relative;
  z-index: 10;
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

const DropdownWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  z-index: 50;
`;

const DropdownButton = styled(FilterButton)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  background: #16171a;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
`;

const DropdownItem = styled.button`
  background: none;
  border: none;
  color: #fff;
  text-align: left;
  padding: 10px 14px;
  width: 100%;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: rgba(0, 170, 255, 0.1);
  }
`;

/* === КАРТОЧКИ === */
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

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Price = styled.div`
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 3px;
`;

const Growth = styled.div<{ positive?: boolean }>`
  color: ${({ positive }) => (positive ? "#00ff99" : "#ff5555")};
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 2px;
`;

/* === МОДАЛКА === */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(5px);
  overflow-y: auto;
  padding: 20px;
`;

const Modal = styled.div`
  background: #111;
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 85vh;
  overflow-y: auto;
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
  margin-top: 8px;
`;

const ModalButton = styled.button<{ primary?: boolean }>`
  flex: 1;
  background: ${({ primary }) => (primary ? "#00c2ff" : "#1c1c1e")};
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
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

/* === ФУНКЦИЯ ДАННЫХ ГРАФИКА === */
const getChart = (price: number) => {
    return [
        { day: "Пн", value: price * 0.95 },
        { day: "Вт", value: price * 0.98 },
        { day: "Ср", value: price * 1.02 },
        { day: "Чт", value: price * 1.05 },
        { day: "Пт", value: price * 1.07 },
        { day: "Сб", value: price * 1.12 },
        { day: "Вс", value: price * 1.15 },
    ];
};

/* === MARKET PAGE === */
export default function MarketPage() {
    const [sortField, setSortField] = useState<"price" | "growth">("price");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedGift, setSelectedGift] = useState<any>(null);
    const [investment, setInvestment] = useState<number | "">("");
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
            ? ((selectedGift.growth / 100) * Number(investment)).toFixed(2)
            : 0;

    const confirm = () => {
        if (!investment || Number(investment) <= 0) return;
        alert(
            `✅ Инвестировано ${investment} TON в ${selectedGift.name}. Прирост: ${calcGrowth} TON`
        );
        setSelectedGift(null);
        setInvestment("");
    };

    useEffect(() => {
        if (selectedGift && inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedGift]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-dropdown]")) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const toggleOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    return (
        <Page>
            <Header>
                <Title>Магазин подарков</Title>
                <Balance>
                    <img src={tonLogo} alt="TON" />
                    0 TON
                </Balance>
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

                <DropdownWrapper data-dropdown>
                    <DropdownButton onClick={() => setDropdownOpen(!dropdownOpen)}>
                        {sortOrder === "asc" ? "По возрастанию" : "По убыванию"}
                        <ChevronDown size={16} />
                    </DropdownButton>
                    {dropdownOpen && (
                        <DropdownMenu>
                            <DropdownItem onClick={toggleOrder}>
                                {sortOrder === "asc" ? "Сделать по убыванию" : "Сделать по возрастанию"}
                            </DropdownItem>
                        </DropdownMenu>
                    )}
                </DropdownWrapper>
            </FilterRow>

            <Grid>
                {sortedGifts.map((gift) => (
                    <Card key={gift.id} onClick={() => setSelectedGift(gift)}>
                        <GiftImage src={gift.img} alt={gift.name} />
                        <GiftName>{gift.name}</GiftName>
                        <InfoRow>
                            <Price>
                                <GiftIcon size={14} /> {gift.price}
                            </Price>
                            <Growth positive={gift.growth >= 0}>
                                {gift.growth >= 0 ? (
                                    <ArrowUp size={12} />
                                ) : (
                                    <ArrowDown size={12} />
                                )}
                                {gift.growth}%
                            </Growth>
                        </InfoRow>
                    </Card>
                ))}
            </Grid>

            {selectedGift && (
                <Overlay onClick={() => setSelectedGift(null)}>
                    <Modal onClick={(e) => e.stopPropagation()}>
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
                            onChange={(e) => {
                                const val = e.target.value;
                                setInvestment(val === "" ? "" : Number(val));
                            }}
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
