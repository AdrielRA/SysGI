import React from "react";
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  SafeAreaView,
  Linking,
} from "react-native";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import { expo } from "../../../app.json";
import { Unifenas } from "../../components";

function Sobre({ navigation }) {
  return (
    <SafeAreaView style={Styles.page}>
      <LinearGradient
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 1, y: 1.0 }}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal, Colors.Terciary.Normal]}
        style={[Styles.page, { alignSelf: "stretch" }]}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            alignSelf: "stretch",
            justifyContent: "center",
            marginBottom: 50,
          }}
        >
          <Image
            style={{ height: 200, width: 155, marginBottom: 10 }}
            source={require("../../assets/logo_white.png")}
          ></Image>
          <Text style={[Styles.txtNormal, Styles.txtWhite]}>
            SysGI - Sistema de
          </Text>
          <Text style={[Styles.txtNormal, Styles.txtWhite]}>
            Gerenciamento de Infratores
          </Text>
          <Text style={[Styles.txtNormal, Styles.txtWhite]}>
            Versão {expo.version}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={[
              Styles.txtBold,
              Styles.txtWhite,
              { marginBottom: 5, fontSize: 18 },
            ]}
          >
            CONHEÇA NOSSOS:
          </Text>
          <TouchableHighlight
            style={[Styles.campo, { marginVertical: 10 }]}
            underlayColor={"#00000000"}
            onPress={() => {
              Linking.openURL("https://sysgi-210bd.firebaseapp.com/");
            }}
          >
            <Text style={[Styles.txtNormal, Styles.txtCenter, Styles.txtWhite]}>
              {"Termos & Condições"}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[Styles.campo, { marginVertical: 10 }]}
            underlayColor={"#00000000"}
            onPress={() => {
              Linking.openURL("https://www.google.com");
            }}
          >
            <Text style={[Styles.txtNormal, Styles.txtCenter, Styles.txtWhite]}>
              Guia de Utilização
            </Text>
          </TouchableHighlight>
          <Text
            style={[
              Styles.txtBold,
              Styles.txtWhite,
              { marginTop: 40, marginBottom: 15, fontSize: 18 },
            ]}
          >
            REALIZAÇÃO:
          </Text>
          <Unifenas />
        </View>
        <Text
          style={[
            Styles.txtNormal,
            Styles.txtWhite,
            { fontSize: 12, paddingBottom: 20 },
          ]}
        >
          Todos os Direitos Reservados - {new Date().getFullYear()}
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

export default Sobre;
