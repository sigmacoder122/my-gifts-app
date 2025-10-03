import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background: #121212;
  min-height: 100vh;
  padding: 20px;
  color: #fff;
`;

const SeasonItem = styled.div`
  background: #1e1e1e;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
`;

const SeasonsPage: React.FC = () => {
    const seasons = [
        { name: "Весна 2025", info: "Специальные подарки и бонусы" },
        { name: "Лето 2025", info: "Сезонные розыгрыши" },
    ];

    return (
        <Container>
            <h2>Сезоны</h2>
            {seasons.map((s, idx) => (
                <SeasonItem key={idx}>
                    <div><strong>{s.name}</strong></div>
                    <div>{s.info}</div>
                </SeasonItem>
            ))}
        </Container>
    );
};

export default SeasonsPage;
