import React from "react";
import styled from "styled-components/native";
import { Image } from "react-native";

const ListaItemSwipe = styled.TouchableHighlight`
  width: 100%;
  height: 24px;
`;
export default (props) => {
  return (
    <ListaItemSwipe onPress={props.onDelete}>
      <Image
        style={{ height: 15, width: 15, marginLeft: 5, marginTop: 2 }}
        source={require("../../../assets/images/icon_lixeira.png")}
      ></Image>
    </ListaItemSwipe>
  );
};
