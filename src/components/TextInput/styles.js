import { StyleSheet } from "react-native";
import { Dark, Light, Primary, Secondary } from "../../styles/colors";

const styles = StyleSheet.create({
  campo: {
    fontFamily: "CenturyGothic",
    backgroundColor: "transparent",
    alignSelf: "stretch",
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    marginVertical: 7.5,
    paddingVertical: 5,
    minHeight: 40,
    flex: 1,
  },
  justLine: {
    maxHeight: 40,
  },
  primary: {
    color: Primary,
    borderColor: Primary,
  },
  secondary: {
    color: Secondary,
    borderColor: Secondary,
  },
  light: {
    color: Light,
    borderColor: Light,
  },
  dark: {
    color: Dark,
    borderColor: Dark,
  },
});

export default styles;
