import React, { useState, useEffect } from "react";
import { View, Picker, Platform } from "react-native";
import { Light, Secondary } from "../../styles/colors";
import styles from "./styles";

export default function Picker_(props) {
  const [borderColor, setBorderColor] = useState(Secondary);
  const [color, setColor] = useState(Secondary);

  useEffect(() => {
    switch (props.type) {
      case "light":
        setBorderColor(Light);
        setColor(Light);
        break;
      default:
        break;
    }
  }, []);

  const picker = (
    <Picker
      style={[styles.picker, { color }, props.style]}
      mode={props.mode}
      textStyle={styles.font}
      itemTextStyle={styles.font}
      activeItemTextStyle={{ fontWeight: "bold" }}
      selectedValue={props.selectedValue}
      onValueChange={props.onValueChange}
    >
      {props.items.map((item) => (
        <Picker.Item key={item.label} label={item.label} value={item.value} />
      ))}
    </Picker>
  );

  return Platform.OS === "ios" ? (
    picker
  ) : (
    <View style={[styles.content, { borderColor }]}>{picker}</View>
  );
}
