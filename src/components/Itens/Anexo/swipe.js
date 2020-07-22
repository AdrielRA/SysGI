import React from "react";
import styled from "styled-components/native";
import { Image } from "react-native";

const ListaItemSwipe = styled.TouchableHighlight`
  width: 100%;
  height: 40px;
  margin-bottom: 5px;
  padding-top: 7.5px;
  padding-left: 7.5px;
  background-color: #fff;
  align-items: flex-start;
`;
const Icon = styled.Image`
  width: 20px;
  height: 20px;
  margin-top: 2.5px;
  margin-left: 3px;
`;
export default (props) => {
  return (
    <ListaItemSwipe underlayColor={"#ffeded"} onPress={props.onDelete}>
      <Icon
        source={require("../../../assets/images/icon_lixeira_cor.png")}
      ></Icon>
    </ListaItemSwipe>
  );
};
