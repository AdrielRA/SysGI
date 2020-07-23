import { StyleSheet } from "react-native";
import { Dark, Light, Primary, Secondary } from "../../styles/colors";

const styles = StyleSheet.create({
  btn: {
    borderRadius: 25,
    paddingVertical: 10,
    marginVertical: 7.5,
    alignSelf: "stretch",
  },
  text: {
    fontFamily: "CenturyGothicBold",
    fontSize: 20,
    textAlign: "center",
  },
  normal: {
    backgroundColor: Secondary,
  },
  light: {
    backgroundColor: Light,
  },
  transparent: {
    backgroundColor: "transparent",
  },
  txtNormal: {
    color: Secondary,
  },
  txtLight: {
    color: Light,
  },
});

export default styles;
