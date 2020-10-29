import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  Switch,
  Alert,
  SafeAreaView,
} from "react-native";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { Button, Unifenas } from "../../components";
import { Auth, Credential, Network, Notifications } from "../../controllers";
import { StackActions, NavigationActions } from "react-navigation";
import { LinearGradient } from "expo-linear-gradient";

function MENU({ navigation }) {
  const userData = navigation.getParam("userData");
  const { clearSession, session, user, validateSession } = Auth.useAuth();
  const {
    haveAccess,
    haveAccessToUserControl,
    isAdmin,
    accessDeniedAlert,
  } = Credential.useCredential();
  const { connected, alertOffline } = Network.useNetwork();
  const { enabled, handleNotification } = Notifications.useNotifications();

  useEffect(() => {
    if (session !== null && !validateSession(session)) {
      Alert.alert("Atenção:", "Sua conta foi desconectada deste dispositivo!");
      Auth.signOut();
      goOut();
    }
  }, [session]);

  handleSignOut = () => {
    if (!user) goOut();
    else clearSession();
  };

  const goOut = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Login" })],
    });
    navigation.dispatch(resetAction);
  };

  const handleCadastrar = () => {
    if (!connected) alertOffline();
    else {
      if (haveAccess("AccessToCadastro")) navigation.navigate("Cadastro");
      else accessDeniedAlert();
    }
  };

  const handleConsultar = () => {
    if (!connected) alertOffline();
    else {
      if (haveAccess("AccessToConsulta")) navigation.navigate("Consulta");
      else accessDeniedAlert();
    }
  };

  const handleControle = () => {
    if (!connected) alertOffline();
    else {
      if (haveAccessToUserControl() || isAdmin())
        navigation.navigate("Controle");
      else accessDeniedAlert();
    }
  };

  return (
    <SafeAreaView style={[Styles.page, { marginTop: 0 }]}>
      <LinearGradient
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 1, y: 1.0 }}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal, Colors.Terciary.Normal]}
        style={[Styles.page, { alignSelf: "stretch" }]}
      >
        <Text style={[Styles.lblMENU, { paddingTop: 40 }]}>MENU</Text>
        <Text style={Styles.lblMsg}>Bem-vindo, {userData.Nome}</Text>
        <View
          style={{
            flex: 6,
            width: 300,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{ width: 200, height: 200 }}
            source={require("../../assets/images/balanca.png")}
          />
          <Button text="CADASTRAR" type="light" onPress={handleCadastrar} />
          <Button text="CONSULTAR" type="light" onPress={handleConsultar} />
          {haveAccessToUserControl() || isAdmin() ? (
            <Button text="CONTROLE" type="light" onPress={handleControle} />
          ) : (
            <></>
          )}
          <Unifenas style={{ marginVertical: 10 }} />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: 210,
          }}
        >
          <Text style={Styles.lblSmallR}>Notificações:</Text>
          <Switch
            trackColor={{ true: Colors.Primary.Normal, false: "grey" }}
            thumbColor={Colors.Primary.White}
            onValueChange={handleNotification}
            value={enabled}
          ></Switch>
        </View>
        <TouchableHighlight
          style={{ position: "absolute", bottom: 25, right: 15 }}
          underlayColor={"#00000000"}
          onPress={() => {
            handleSignOut();
          }}
        >
          <Image
            style={{ height: 30, width: 30 }}
            source={require("../../assets/images/logoff.png")}
          ></Image>
        </TouchableHighlight>
      </LinearGradient>
    </SafeAreaView>
  );
}

export default MENU;
