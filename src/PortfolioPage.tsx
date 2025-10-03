import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";

const hoverAnim = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const Container = styled.div`
  background: #121212;
  min-height: 100vh;
  padding: 30px 20px;
  color: #fff;
  font-family: 'Arial', sans-serif;
`;

const PortfolioHeader = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const AssetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
`;

const AssetCard = styled.div`
  background: #1e1e1e;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.3s;
  &:hover { 
    animation: ${hoverAnim} 1s infinite;
    box-shadow: 0 8px 20px rgba(0,170,255,0.3);
  }
`;

const AssetImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
`;

const AssetInfo = styled.div`
  padding: 10px;
`;

const AssetName = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const AssetPrice = styled.div`
  color: #000;
  background: #fff;
  padding: 5px 10px;
  border-radius: 8px;
  margin-bottom: 5px;
`;

const AssetGrowth = styled.div`
  color: #000;
  background: #fff;
  padding: 5px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const PortfolioGraphWrapper = styled.div`
  margin-bottom: 30px;
  background: #1e1e1e;
  border-radius: 20px;
  padding: 15px;
`;

const MyPortfolioPage: React.FC = () => {
    const [assets] = useState([
        { id: 1, name: "Asset A", price: 1200, growth: 5, img: "https://picsum.photos/1500/1500?random=1" },
        { id: 2, name: "Asset B", price: 950, growth: -3, img: "https://picsum.photos/1500/1500?random=2" },
        { id: 3, name: "Asset C", price: 780, growth: 8, img: "https://picsum.photos/1500/1500?random=3" },
        { id: 4, name: "Asset D", price: 1020, growth: 2, img: "https://picsum.photos/1500/1500?random=4" },
        { id: 5, name: "Asset E", price: 1150, growth: 10, img: "https://picsum.photos/1500/1500?random=5" },
        { id: 6, name: "Asset F", price: 670, growth: -5, img: "https://picsum.photos/1500/1500?random=6" },
    ]);

    const totalPortfolioData = assets.map((asset, i) => ({
        day: `Day ${i+1}`,
        value: asset.price
    }));

    return (
        <Container>
            <PortfolioHeader>Мой портфель</PortfolioHeader>

            <PortfolioGraphWrapper>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={totalPortfolioData}>
                        <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                        <XAxis dataKey="day" stroke="#00aaff" />
                        <YAxis stroke="#00aaff" />
                        <RechartsTooltip
                            contentStyle={{ background: "#292929", borderRadius: "10px", border: "none", color: "#fff" }}
                        />
                        <Line type="monotone" dataKey="value" stroke="#00aaff" strokeWidth={3} dot={{ r: 5, fill: "#00aaff" }} />
                    </LineChart>
                </ResponsiveContainer>
            </PortfolioGraphWrapper>

            <AssetsGrid>
                {assets.map(asset => (
                    <AssetCard key={asset.id}>
                        <AssetImage src={asset.img} alt={asset.name} />
                        <AssetInfo>
                            <AssetName>{asset.name}</AssetName>
                            <AssetPrice>Цена: {asset.price} TON</AssetPrice>
                            <AssetGrowth>
                                {asset.growth >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                {Math.abs(asset.growth)}%
                            </AssetGrowth>
                        </AssetInfo>
                    </AssetCard>
                ))}
            </AssetsGrid>
        </Container>
    );
};

export default MyPortfolioPage;
