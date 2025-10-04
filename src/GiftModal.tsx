import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Gift } from "./data/gifts";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

// --- Стили (без keyframes) ---
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
`;

const ModalContainer = styled.div`
  background: #0f1113;
  border-radius: 16px;
  padding: 20px;
  width: 92%;
  max-width: 520px;
  color: #e6eef7;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.6);
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
`;

const Title = styled.h2`
  text-align: center;
  margin: 0;
  font-size: 20px;
  letter-spacing: 0.2px;
  color: #fff;
`;

const PriceInfo = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 18px;
  color: #66c2ff;
`;

const InvestButton = styled.button<{ primary?: boolean }>`
  background-color: ${(p) => (p.primary ? "#1e90ff" : "#0b74c9")};
  border: none;
  border-radius: 999px;
  color: #fff;
  padding: 10px 18px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s;
  box-shadow: 0 6px 18px rgba(14, 110, 190, 0.15);
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 28px rgba(14, 110, 190, 0.22);
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  width: 140px;
  text-align: center;
  background: #0b0d0f;
  color: #e6eef7;
  font-weight: 600;
  font-size: 14px;
  outline: 2px solid transparent;
  transition: outline-color 0.12s;
  &:focus {
    outline-color: rgba(30,144,255,0.25);
  }
`;

const Hint = styled.div`
  text-align: center;
  color: #bcdfff;
  font-size: 13px;
`;

const Result = styled.div`
  text-align: center;
  color: #9be3ff;
  font-weight: 700;
`;

// --- Нормализация ввода: убираем ведущие нули (0134 -> 134), но сохраняем 0.5 ---
function normalizeAmountInput(raw: string): string {
    // Разрешаем только цифры и точку
    let s = raw.replace(/[^\d.]/g, "");
    // Удаляем лишние точки (оставляем только первую)
    const firstDotIndex = s.indexOf(".");
    if (firstDotIndex >= 0) {
        // сохраняем часть до точки и после (обрезаем дополнительные точки)
        const intPart = s.slice(0, firstDotIndex);
        const fracPart = s.slice(firstDotIndex + 1).replace(/\./g, "");
        // Нормализуем целую часть: если пустая (например ввёл ".5") — считаем как "0"
        const intNormalized = intPart === "" ? "0" : intPart.replace(/^0+(?=\d)/, "");
        // ограничим дробную часть длиной, например 6 символов
        const fracTrimmed = fracPart.slice(0, 6);
        return fracTrimmed.length > 0 ? `${intNormalized}.${fracTrimmed}` : `${intNormalized}.`;
    } else {
        // Без точки — убираем ведущие нули (оставляем "0" если пусто)
        const normalized = s.replace(/^0+(?=\d)/, "");
        return normalized === "" ? "0" : normalized;
    }
}

// --- GiftModal компонент ---
const GiftModal: React.FC<{ gift: Gift; onClose: () => void }> = ({ gift, onClose }) => {
    const [showInvest, setShowInvest] = useState(false);
    const [amount, setAmount] = useState<string>("0");
    const [percentDisplay, setPercentDisplay] = useState<string>("0.00");

    // Данные графика (мок)
    const data = [
        { day: "Пн", price: +(gift.price * 0.95).toFixed(2) },
        { day: "Вт", price: +(gift.price * 1.05).toFixed(2) },
        { day: "Ср", price: +(gift.price * 1.1).toFixed(2) },
        { day: "Чт", price: +(gift.price * 1.15).toFixed(2) },
        { day: "Пт", price: +(gift.price * 1.2).toFixed(2) },
        { day: "Сб", price: +(gift.price * 1.18).toFixed(2) },
        { day: "Вс", price: +(gift.price * 1.22).toFixed(2) },
    ];

    // Плавное обновление процента при вводе суммы
    useEffect(() => {
        const parsed = parseFloat(amount || "0");
        const target = isNaN(parsed) ? 0 : (parsed / gift.price) * 100;
        let start = parseFloat(percentDisplay) || 0;
        let rafId = 0;

        const step = () => {
            start += (target - start) / 6;
            if (Math.abs(start - target) < 0.01) start = target;
            setPercentDisplay(start.toFixed(2));
            if (Math.abs(start - target) >= 0.01) rafId = requestAnimationFrame(step);
        };
        step();

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount, gift.price]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const normalized = normalizeAmountInput(raw);
        setAmount(normalized);
    };

    const confirmInvest = () => {
        const numeric = parseFloat(amount || "0");
        if (isNaN(numeric) || numeric <= 0) {
            alert("Введите корректную сумму (больше 0).");
            return;
        }
        alert(`Вы инвестировали ${numeric} TON (~${parseFloat(percentDisplay).toFixed(2)}% подарка)`);
        // тут можно добавить логику отправки на бэкенд
        setShowInvest(false);
        setAmount("0");
    };

    return (
        <Overlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <Title>{gift.name}</Title>
                <PriceInfo>{gift.price} TON</PriceInfo>

                <div style={{ width: "100%", height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                            <XAxis dataKey="day" stroke="#76bffb" />
                            <YAxis stroke="#76bffb" />
                            <RechartsTooltip />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#76bffb"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#76bffb" }}
                                isAnimationActive={true}
                                animationDuration={900}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {!showInvest ? (
                    <InvestButton primary onClick={() => setShowInvest(true)}>
                        Инвестировать
                    </InvestButton>
                ) : (
                    <>
                        <InputContainer>
                            <Input
                                inputMode="decimal"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="Сумма TON"
                            />
                            <InvestButton primary onClick={confirmInvest}>
                                Подтвердить
                            </InvestButton>
                        </InputContainer>

                        <Result>Вы получите ~{percentDisplay}% акции подарка</Result>
                        <Hint>Введите сумму в TON (дробные значения допускаются, например 0.5)</Hint>
                    </>
                )}
            </ModalContainer>
        </Overlay>
    );
};

export default GiftModal;
