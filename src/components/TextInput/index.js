import React, { useState, useEffect } from "react";
import { TextInput } from "react-native";

import styles from "./styles";
import { Dark, Light, Primary, Secondary } from "../../styles/colors";

export default function Input(props) {
  const [style, setStyle] = useState({});
  const [placeholderColor, setPlaceholderColor] = useState(Primary);

  useEffect(() => {
    let base = styles.campo;
    if (!props.multiline) base = { ...base, ...styles.justLine };

    switch (props.type) {
      case "primary":
        setStyle({ ...base, ...styles.primary });
        setPlaceholderColor(Primary);
        break;
      case "secondary":
        setStyle({ ...base, ...styles.secondary });
        setPlaceholderColor(Secondary);
        break;
      case "light":
        setStyle({ ...base, ...styles.light });
        setPlaceholderColor(Light);
        break;
      case "dark":
        setStyle({ ...base, ...styles.dark });
        setPlaceholderColor(Dark);
        break;
      default:
        break;
    }
  }, []);

  return (
    <TextInput
      placeholder={props.placeholder}
      placeholderTextColor={placeholderColor}
      keyboardType={props.keyboardType}
      autoCapitalize={props.autoCapitalize}
      editable={props.editable}
      autoCorrect={props.autoCorrect}
      value={props.value}
      autoCompleteType={props.autoCompleteType}
      style={[style, props.style]}
      onChangeText={props.onChangeText}
      onEndEditing={props.onEndEditing}
      textContentType={props.textContentType}
      returnKeyType={props.returnKeyType}
      autoFocus={props.autoFocus}
      maxLength={props.maxLength}
      multiline={props.multiline}
      textAlignVertical={props.textAlignVertical}
      secureTextEntry={props.secureTextEntry}
    />
  );
}
