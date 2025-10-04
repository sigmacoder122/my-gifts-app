import React, { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
`;

const Button = styled.button`
  margin-top: 10px;
  background-color: #00ff99;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
`;

const Modal = ({ gift, onClose, onInvest }) => {
    const [amount, setAmount] = useState(gift.price);

    return (
        <Overlay>
            <ModalBox>
                <h3>Инвестировать в {gift.name}</h3>
                <p>Сумма: {gift.price} TON</p>
                <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
                <div>
                    <Button onClick={() => onInvest(amount)}>Инвестировать</Button>
                </div>
                <Button style={{background: "#ff4d4f", marginTop: "10px"}} onClick={onClose}>Закрыть</Button>
            </ModalBox>
        </Overlay>
    );
};

export default Modal;
