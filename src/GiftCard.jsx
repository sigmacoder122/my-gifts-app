import React from "react";
import styled from "styled-components";

const Card = styled.div`
  background-color: #252525;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const GiftCard = ({ gift, onClick }) => {
    return (
        <Card onClick={onClick}>
            <img src={gift.img} alt={gift.name} />
            <p>{gift.name}</p>
            <p>{gift.price} TON</p>
        </Card>
    );
};

export default GiftCard;
