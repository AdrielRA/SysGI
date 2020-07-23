import { Dark, Light, Primary, Secondary } from "../../styles/colors";
import React, { useState, useEffect } from "react";
import { Text, TouchableHighlight } from "react-native";
import styles from "./styles";

export default function Button(props) {
  const [style, setStyle] = useState({});
  const [txtStyle, setTxtStyle] = useState({});
  const [underlayColor, setUnderlayColor] = useState("transparent");

  useEffect(() => {
    let base = styles.btn;
    let txtBase = styles.text;

    switch (props.type) {
      case "normal":
        setStyle({ ...base, ...styles.normal });
        setTxtStyle({ ...txtBase, ...styles.txtLight });
        setUnderlayColor(Secondary);
        break;
      case "light":
        setStyle({ ...base, ...styles.light });
        setTxtStyle({ ...txtBase, ...styles.txtNormal });
        setUnderlayColor(Light);
        break;
      case "transparent":
        setStyle({ ...base, ...styles.dark });
        setTxtStyle({ ...txtBase, ...styles.txtLight });
        setUnderlayColor("transparent");
        break;
      default:
        break;
    }
  }, []);

  return (
    <TouchableHighlight
      style={[style, props.style]}
      underlayColor={underlayColor}
      onPress={props.onPress}
    >
      <Text style={[txtStyle, props.textStyle]}>{props.text}</Text>
    </TouchableHighlight>
  );
}
