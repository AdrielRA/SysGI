import { StyleSheet } from "react-native";
import Colors from "./colors";

const Styles = StyleSheet.create({
  page: {
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    alignSelf: "stretch",
  },
  txtNormal: {
    fontFamily: "CenturyGothic",
  },
  txtBold: {
    fontFamily: "CenturyGothicBold",
  },
  txtCenter: { textAlign: "center" },
  txtWhite: {
    color: "#fff",
  },
  campo: {
    fontFamily: "CenturyGothic",
    backgroundColor: "transparent",
    color: Colors.Primary.White,
    alignSelf: "stretch",
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.Secondary.White,
    marginVertical: 7.5,
    marginHorizontal: 30,
    paddingVertical: 5,
  },
  campoCadastro: {
    fontFamily: "CenturyGothic",
    backgroundColor: "transparent",
    color: Colors.Secondary.Normal,
    alignSelf: "stretch",
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#DCDCDC",
    marginVertical: 5,
    height: 40,
    flex: 1,
  },
  TextAnexo: {
    fontFamily: "CenturyGothic",
    flex: 1,
    borderWidth: 1,
    borderRadius: 25,
    height: 40,
    borderColor: Colors.Secondary.Normal,
    margin: 10,
    fontSize: 17,
    textAlign: "center",
    backgroundColor: Colors.Secondary.Normal,
    color: "#fff",
    textAlignVertical: "center",
  },
  picker: {
    color: Colors.Primary.White,
    height: 40,
  },
  pickerDiv: {
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.Secondary.White,
    marginVertical: 7.5,
  },
  btnPrimary: {
    backgroundColor: Colors.Secondary.Normal,
    borderRadius: 25,
    paddingVertical: 10,
    marginVertical: 7.5,
    marginHorizontal: 15,
    alignItems: "center",
    alignSelf: "stretch",
  },
  btnTextPrimary: {
    fontFamily: "CenturyGothicBold",
    color: Colors.Secondary.White,
    fontSize: 20,
    textAlign: "center",
  },
  btnSecundary: {
    backgroundColor: Colors.Primary.White,
    borderRadius: 25,
    paddingVertical: 10,
    marginVertical: 7.5,
    paddingHorizontal: 35,
    alignSelf: "stretch",
  },
  btnTextSecundary: {
    fontFamily: "CenturyGothicBold",
    color: Colors.Secondary.Normal,
    fontSize: 20,
    textAlign: "center",
  },
  btnTransparent: {
    minHeight: 40,
    marginVertical: 7.5,
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center",
    flex: 1,
  },
  btnTextTransparent: {
    fontFamily: "CenturyGothicBold",
    color: Colors.Primary.White,
    fontSize: 15,
    textAlign: "center",
  },
  checkbox: {
    backgroundColor: "transparent",
    borderWidth: 0,
    marginVertical: 7.5,
  },
  lblTitle: {
    fontFamily: "CenturyGothicBold",
    fontSize: 80,
    color: Colors.Primary.White,
    textAlign: "center",
    textAlignVertical: "center",
  },
  DateComponent: {
    marginHorizontal: 2.5,
    marginTop: 10,
    flex: 1,
  },
  DescAnexo: {
    fontFamily: "CenturyGothic",
    borderColor: Colors.Secondary.Normal,
    borderWidth: 1,
    borderRadius: 25,
    marginHorizontal: 5,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
    fontSize: 18,
    backgroundColor: Colors.Primary.White,
  },
  lbAnexos: {
    borderColor: Colors.Secondary.Normal,
    borderWidth: 1,
    borderRadius: 25,
    marginHorizontal: 5,
    marginVertical: 10,
    paddingTop: 10,
    paddingBottom: 15,
    flex: 1,
    backgroundColor: Colors.Primary.White,
  },
  lblAnexo: {
    fontFamily: "CenturyGothicBold",
    fontSize: 20,
    color: Colors.Secondary.Normal,
    textAlign: "center",
    textAlignVertical: "center",
    paddingLeft: 15,
    paddingRight: 25,
  },
  scrollAnexos: {
    paddingHorizontal: 15,
    paddingTop: 5,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: Colors.Secondary.White,
  },
  btngroupAnexo: {
    borderColor: Colors.Secondary.Normal,
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  lblSubtitle: {
    fontFamily: "CenturyGothicBold",
    flex: 2.5,
    fontSize: 40,
    color: Colors.Primary.White,
    //textAlign:"center",
    //textAlignVertical:"center"
  },
  lblMENU: {
    fontFamily: "CenturyGothicBold",
    flex: 1,
    paddingTop: 60,
    fontSize: 40,
    color: Colors.Primary.White,
    textAlign: "center",
    textAlignVertical: "center",
  },
  lblMsg: {
    fontFamily: "CenturyGothic",
    flex: 0.5,
    fontSize: 20,
    color: Colors.Primary.White,
    textAlign: "center",
    textAlignVertical: "center",
  },
  lblRodape: {
    fontFamily: "CenturyGothic",
    flex: 0.5,
    fontSize: 12,
    color: Colors.Primary.White,
    textAlign: "center",
    textAlignVertical: "center",
  },
  lblSmallR: {
    fontFamily: "CenturyGothic",
    flex: 0.5,
    fontSize: 12,
    textAlign: "right",
    color: Colors.Primary.White,
    textAlignVertical: "center",
  },
  popup: {
    backgroundColor: Colors.Terciary.White,
    flex: 3,
    borderRadius: 15,
    alignSelf: "stretch",
    marginHorizontal: 30,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  popTitle: {
    color: Colors.Secondary.Normal,
    fontFamily: "CenturyGothicBold",
    textAlign: "center",
    fontSize: 28,
  },
  popText: {
    flex: 1,
    color: Colors.Primary.Normal,
    fontFamily: "CenturyGothic",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 20,
  },
  popSoluction: {
    flex: 1,
    color: Colors.Primary.Normal,
    fontFamily: "CenturyGothic",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 15,
  },
  searchContent: {
    position: "absolute",
    top: 108,
    right: 0,
    alignSelf: "stretch",
    marginHorizontal: 15,
    backgroundColor: Colors.Secondary.White,
    borderRadius: 30,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    padding: 0,
    paddingBottom: 1,
  },
  searchContentFull: {
    alignSelf: "stretch",
    marginHorizontal: 10,
    marginBottom: 5,
    backgroundColor: Colors.Secondary.White,
    borderRadius: 30,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    padding: 0,
    paddingBottom: 1,
  },
  searchInput: {
    color: Colors.Primary.Normal,
    backgroundColor: Colors.Secondary.White,
  },
  searchType: {
    position: "absolute",
    top: 109,
    left: 0,
    paddingHorizontal: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    marginLeft: 15,
    backgroundColor: Colors.Secondary.Normal,
  },
  searchText: {
    color: Colors.Primary.White,
    fontFamily: "CenturyGothicBold",
    textAlign: "center",
    fontSize: 28,
  },
  txtBold: {
    color: Colors.Secondary.Black,
    fontFamily: "CenturyGothicBold",
  },
  txtRegular: {
    color: Colors.Secondary.Black,
    fontFamily: "CenturyGothic",
  },
  txtBoldWhite: {
    color: Colors.Primary.White,
    fontFamily: "CenturyGothicBold",
  },
  txtRegularWhite: {
    color: Colors.Primary.White,
    fontFamily: "CenturyGothic",
  },
});

export default Styles;