import React from "react";
import { Image, TouchableHighlight, Linking } from "react-native";

export default function Unifenas(props) {
  return (
    <TouchableHighlight
      style={props.style}
      underlayColor={"#00000000"}
      onPress={() => Linking.openURL("https://digital.unifenas.br/")}
    >
      <Image
        style={{ height: 34, width: 200 }}
        source={require("../../assets/logo-unifenas.png")}
      ></Image>
    </TouchableHighlight>
  );
}
