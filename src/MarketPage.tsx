// src/MarketPage.tsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { ArrowUp, ArrowDown, Gift as GiftIcon } from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
} from "recharts";

/* ===== Данные подарков ===== */
export interface Gift {
    id: number;
    name: string;
    price: number;
    growth: number;
    img: string;
}

export const giftsData: Gift[] = [
    { id: 1, name: "Push pepe", price: 3450, growth: 5, img: "https://cdn.changes.tg/gifts/models/Plush%20Pepe/png/Original.png" },
    { id: 2, name: "Durov cap", price: 2322, growth: 10, img: "https://cdn.changes.tg/gifts/models/Durov%27s%20Cap/png/Original.png" },
    { id: 3, name: "Signet ring", price: 20, growth: 8, img: "https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/signetring/Rose%20Gold.webp" },
    { id: 4, name: "Snoop sigare", price: 25, growth: 12, img: "https://storage.beee.pro/game_items/39238/NTtmBjZ3yUxIToDTrHFLseN2YaJKWWgXPj32B1V6.webp" },
    { id: 5, name: "Genie lamp", price: 30, growth: 7, img: "https://telegifter.ru/wp-content/themes/gifts/assets/img/gifts/genielamp/Lightning.webp" },
    { id: 6, name: "Scared cat", price: 18, growth: 15, img: "https://podarki-tg.com/wp-content/uploads/2025/06/image-863.png" },
];

/* ===== Анимации ===== */
const glowAnim = keyframes`
  0% { box-shadow: 0 0 5px #00aaff; }
  50% { box-shadow: 0 0 20px #00aaff; }
  100% { box-shadow: 0 0 5px #00aaff; }
`;

const cardHoverAnim = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
`;

const modalShow = keyframes`
  0% { opacity: 0; transform: scale(0.95);}
  100% { opacity: 1; transform: scale(1);}
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
  overflow-x: hidden;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  font-weight: 700;
`;

const BalanceBubble = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(90deg, #083248, #0a3048);
  border: 2px solid rgba(0, 170, 255, 0.12);
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 700;
  color: #dff6ff;
  box-shadow: 0 6px 20px rgba(0, 170, 255, 0.06);
`;

const SortRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  align-items: center;
`;

const SortButton = styled.button<{ active?: boolean }>`
  background: ${(p) => (p.active ? "#00aaff" : "rgba(255,255,255,0.05)")};
  color: ${(p) => (p.active ? "#041016" : "#fff")};
  border: none;
  border-radius: 12px;
  padding: 6px 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  &:hover {
    background: #00c2ff;
    color: #041016;
  }
`;

const SortTypeWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const SortRadioLabel = styled.label<{ active?: boolean }>`
  background: ${(p) => (p.active ? "#00aaff" : "rgba(255,255,255,0.05)")};
  padding: 6px 10px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  color: ${(p) => (p.active ? "#041016" : "#fff")};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    background: #00c2ff;
    color: #041016;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 8px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  background: #121214;
  border-radius: 16px;
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  transition: all 0.25s ease;
  cursor: pointer;
  &:hover {
    animation: ${cardHoverAnim} 0.5s ease infinite;
    box-shadow: 0 10px 25px rgba(0, 170, 255, 0.08);
  }
`;

const ImgWrap = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 12px;
  border: 2px solid rgba(0,170,255,0.25);
  background: radial-gradient(circle at 50% 50%, rgba(0,170,255,0.1), rgba(255,255,255,0.02));
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: ${glowAnim} 3.2s infinite;
`;

const Img = styled.img`
  width: 80%;
  height: 80%;
  object-fit: contain;
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 700;
  text-align: center;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const PriceBadge = styled.div`
  background: linear-gradient(90deg, #00aaff, #00c8ff);
  color: #041016;
  font-weight: 800;
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(0,170,255,0.3);
`;

const GrowthBadge = styled.div<{ positive?: boolean }>`
  background: ${(p) => (p.positive ? "rgba(0,255,130,0.1)" : "rgba(255,80,80,0.1)")};
  color: ${(p) => (p.positive ? "#2ef06a" : "#ff6b6b")};
  border: 1px solid ${(p) => (p.positive ? "rgba(0,255,130,0.3)" : "rgba(255,80,80,0.3)")};
  padding: 6px 8px;
  border-radius: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 80;
  padding: 12px;
`;

const ModalBox = styled.div`
  width: 100%;
  max-width: 480px;
  background: #101214;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255,255,255,0.03);
  box-shadow: 0 24px 48px rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${modalShow} 0.3s ease forwards;
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  background: #121214;
  color: #fff;
  font-size: 16px;
  outline: none;
  &::placeholder { color: rgba(255,255,255,0.4); }
`;

const Result = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #00c2ff;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const ModalButton = styled.button<{ confirm?: boolean }>`
  flex: 1;
  padding: 10px 0;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  background: ${(p) => (p.confirm ? "#00c2ff" : "rgba(255,255,255,0.05)")};
  color: ${(p) => (p.confirm ? "#041016" : "#fff")};
  transition: all 0.2s;
  &:hover {
    background: ${(p) => (p.confirm ? "#00aaff" : "rgba(255,255,255,0.1)")};
  }
`;

/* ===== Mock графика ===== */
const sampleChart = (price:number) => [
    { day: "Пн", value: +(price*0.95).toFixed(2)},
    { day: "Вт", value: +(price*1.02).toFixed(2)},
    { day: "Ср", value: +(price*1.08).toFixed(2)},
    { day: "Чт", value: +(price*1.12).toFixed(2)},
    { day: "Пт", value: +(price*1.15).toFixed(2)},
    { day: "Сб", value: +(price*1.18).toFixed(2)},
    { day: "Вс", value: +(price*1.2).toFixed(2)},
];

/* ===== Компонент ===== */
const MarketPage: React.FC = () => {
    const [selected, setSelected] = useState<Gift | null>(null);
    const [investment,setInvestment] = useState<number>(0);
    const [sortType,setSortType] = useState<"price"|"growth">("price");
    const [sortOrder,setSortOrder] = useState<"asc"|"desc">("asc");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        document.body.style.overflow = selected ? "hidden" : "auto";
    },[selected]);

    const sortedGifts = useMemo(()=>{
        const arr=[...giftsData];
        if(sortType==="price") return arr.sort((a,b)=>sortOrder==="asc"?a.price-b.price:b.price-a.price);
        if(sortType==="growth") return arr.sort((a,b)=>sortOrder==="asc"?a.growth-b.growth:b.growth-a.growth);
        return arr;
    },[sortType, sortOrder]);

    const calculatedGrowth = selected ? +(investment*selected.growth/100).toFixed(2):0;

    const handleConfirm = () => {
        alert(`Вы инвестировали ${investment} TON в ${selected?.name}, прирост: ${calculatedGrowth} TON`);
        setSelected(null);
        setInvestment(0);
    };

    return (
        <Page>
            <TitleRow>
                <PageTitle>Все подарки</PageTitle>
                <BalanceBubble><GiftIcon size={16}/><div>0 TON</div></BalanceBubble>
            </TitleRow>

            <SortRow>
                <SortButton active={sortType==="price"} onClick={()=>setSortType("price")}>Сортировать по цене</SortButton>
                <SortButton active={sortType==="growth"} onClick={()=>setSortType("growth")}>Сортировать по росту</SortButton>
                <SortTypeWrapper>
                    <SortRadioLabel active={sortOrder==="asc"}>
                        <input type="radio" name="order" value="asc" style={{display:"none"}} onChange={()=>setSortOrder("asc")} checked={sortOrder==="asc"} />
                        По возрастанию
                    </SortRadioLabel>
                    <SortRadioLabel active={sortOrder==="desc"}>
                        <input type="radio" name="order" value="desc" style={{display:"none"}} onChange={()=>setSortOrder("desc")} checked={sortOrder==="desc"} />
                        По убыванию
                    </SortRadioLabel>
                </SortTypeWrapper>
            </SortRow>

            <Grid>
                {sortedGifts.map(g=>(
                    <Card key={g.id} onClick={()=>{setSelected(g); setInvestment(0)}}>
                        <ImgWrap><Img src={g.img} /></ImgWrap>
                        <Name>{g.name}</Name>
                        <InfoRow>
                            <PriceBadge>{g.price} TON</PriceBadge>
                            <GrowthBadge positive={g.growth>=0}>
                                {g.growth>=0?<ArrowUp size={12}/>:<ArrowDown size={12}/>} {Math.abs(g.growth)}%
                            </GrowthBadge>
                        </InfoRow>
                    </Card>
                ))}
            </Grid>

            {selected && (
                <ModalOverlay onClick={()=>setSelected(null)}>
                    <ModalBox onClick={e=>e.stopPropagation()}>
                        <h3 style={{margin:0}}>{selected.name}</h3>
                        <ImgWrap style={{width:"60%", margin:"12px auto"}}><Img src={selected.img}/></ImgWrap>
                        <div style={{height:200}}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sampleChart(selected.price)}>
                                    <CartesianGrid stroke="rgba(255,255,255,0.03)"/>
                                    <XAxis dataKey="day" stroke="#7ed6ff"/>
                                    <YAxis stroke="#7ed6ff"/>
                                    <RechartsTooltip contentStyle={{background:"#0f1720"}}/>
                                    <Line type="monotone" dataKey="value" stroke="#00c2ff" strokeWidth={3} dot={{r:4, fill:"#00c2ff"}}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <InputRow>
                            <Input
                                ref={inputRef}
                                type="number"
                                min={0}
                                placeholder="Введите сумму инвестиций (TON)"
                                value={investment}
                                onChange={e=>{
                                    const val = e.target.value.replace(/^0+/, '');
                                    setInvestment(Number(val));
                                }}
                            />
                            <Result>Прирост: {calculatedGrowth} TON ({selected.growth}%)</Result>
                        </InputRow>

                        <ButtonRow>
                            <ModalButton onClick={()=>setSelected(null)}>Отмена</ModalButton>
                            <ModalButton confirm onClick={handleConfirm}>Подтвердить</ModalButton>
                        </ButtonRow>
                    </ModalBox>
                </ModalOverlay>
            )}
        </Page>
    );
};

export default MarketPage;
