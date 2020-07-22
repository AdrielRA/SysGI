import React, { useState } from "react";
import styled from "styled-components/native";
import Colors from "../../../styles/colors";

const ItemControle = styled.TouchableHighlight`
  height: 100px;
  margin-bottom: 5px;
  background-color: #fff;
  padding-left: 4%;
  padding-right: 4%;
  justify-content: center;
`;
const ItemView = styled.View`
  align-self: flex-start;
`;
const ItemTextBold = styled.Text`
  font-size: 15px;
  text-align-vertical: center;
  font-weight: bold;
  align-self: flex-start;
`;
const ItemText = styled.Text`
  font-size: 15px;
  text-align-vertical: center;
  align-self: flex-start;
`;
export default (props) => {
  return (
    <ItemControle onLongPress={props.onLongPress} underlayColor="#dcdcdc">
      <ItemView>
        <ItemView style={{ flexDirection: "row" }}>
          <ItemTextBold
            style={{ color: Colors.Secondary.Normal, marginVertical: 0 }}
          >
            NOME:{" "}
          </ItemTextBold>
          <ItemText
            style={{ color: Colors.Secondary.Normal, marginVertical: 0 }}
          >
            {props.data.Nome}
          </ItemText>
        </ItemView>
        <ItemView style={{ flexDirection: "row" }}>
          <ItemTextBold
            style={{ color: Colors.Secondary.Normal, marginVertical: 0 }}
          >
            INSCRIÇÃO:{" "}
          </ItemTextBold>
          <ItemText
            style={{ color: Colors.Secondary.Normal, marginVertical: 0 }}
          >
            {props.data.Inscrição}
          </ItemText>
        </ItemView>
        <ItemView style={{ flexDirection: "row" }}>
          <ItemTextBold
            style={{ color: Colors.Secondary.Normal, marginVertical: 0 }}
          >
            TELEFONE:{" "}
          </ItemTextBold>
          <ItemText
            style={{ color: Colors.Secondary.Normal, marginVertical: 0 }}
          >
            {props.data.Telefone}
          </ItemText>
        </ItemView>
        <ItemView style={{ flexDirection: "row" }}>
          <ItemTextBold
            style={{ color: Colors.Secondary.Normal, marginVertical: 0 }}
          >
            CATEGORIA:{" "}
          </ItemTextBold>
          <ItemText
            style={{ color: Colors.Secondary.Normal, marginVertical: 0 }}
          >
            {props.data.Credencial < 0
              ? props.data.Credencial == -1
                ? "Professor"
                : props.data.Credencial == -2
                ? "Conselho Tutelar"
                : props.data.Credencial == -3
                ? "Advogado"
                : props.data.Credencial == -4
                ? "CONSEPA"
                : props.data.Credencial == -5
                ? "CREAS"
                : props.data.Credencial == -6
                ? "Policial"
                : props.data.Credencial == -7
                ? "Delegado"
                : props.data.Credencial == -8
                ? "Promotor"
                : "Juiz"
              : "Inválido"}
          </ItemText>
        </ItemView>
      </ItemView>
    </ItemControle>
  );
};
