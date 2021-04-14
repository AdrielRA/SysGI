import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  SafeAreaView,
  AppState,
} from "react-native";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { Button, Unifenas } from "../../components";
import { Auth, Credential, Network, Notifications } from "../../controllers";
import { StackActions, NavigationActions } from "react-navigation";
import { LinearGradient } from "expo-linear-gradient";
import { useContext } from "../../context";

import { FontAwesome5 } from "@expo/vector-icons";
import { NavigationEvents } from "react-navigation";

function MENU({ navigation }) {
  const [userData, setUserData] = useState(navigation.getParam("userData"));
  
  const { clearSession, validateSession } = Auth;
  const {
    haveAccess,
    haveAccessToUserControl,
    isAdmin,
    accessDeniedAlert,
  } = Credential;
  const { connected, alertOffline } = Network.useNetwork();
  const { enabled, handleNotification } = Notifications.useNotifications();
  const { credential, session, user, isLogged } = useContext();
  const [appState, setAppState] = useState();

  useEffect(() => {
    if (session !== null && !validateSession(session)) {
      Alert.alert("Atenção:", "Sua conta foi desconectada deste dispositivo!");
      Auth.signOut();
    }
  }, [session]);

  useEffect(() => {
    if (!isLogged) goOut();
  }, [isLogged]);

  useEffect(() => {
    const timer = setTimeout(() => {
      AppState.addEventListener("change", setAppState);
    }, 1000);
    return () => {
      clearTimeout(timer);
      AppState.removeEventListener("change", setAppState);
    };
  }, []);

  useEffect(() => {
    if (appState === "active")
      Auth.handleLocalAuth("Confirme sua identidade", "Sair").then(
        (success) => {
          if (!success) {
            AppState.removeEventListener("change", setAppState);
            handleSignOut();
          }
        }
      );
  }, [appState]);

  const handleSignOut = () => {
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
      if (haveAccess(credential, "AccessToCadastro"))
        navigation.navigate("Infrator");
      else accessDeniedAlert();
    }
  };

  const handleConsultar = () => {
    if (!connected) alertOffline();
    else {
      if (haveAccess(credential, "AccessToConsulta"))
        navigation.navigate("Consulta");
      else accessDeniedAlert();
    }
  };

  const handleControle = () => {
    if (!connected) alertOffline();
    else {
      if (accessToControl) navigation.navigate("Controle");
      else accessDeniedAlert();
    }
  };

  const handleProfile = () => {
    Auth.handleLocalAuth("Confirme sua identidade", "Cancelar").then(
      (success) => {
        if (success) navigation.push("Profile");
      }
    );
  };

  const accessToControl =
    haveAccessToUserControl(credential) || isAdmin(credential);

  return (
    <SafeAreaView style={[Styles.page, { marginTop: 0 }]}>
      {/* <NavigationEvents
        onWillFocus={() =>
          Auth.getUserData(user.uid).then((snap) => setUserData(snap.val()))
        }
      /> */}
      <LinearGradient
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 1, y: 1.0 }}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal, Colors.Terciary.Normal]}
        style={[Styles.page, { alignSelf: "stretch" }]}
      >
        <Text style={[Styles.lblMENU, { paddingTop: 40 }]}>MENU</Text>
        <Text style={Styles.lblMsg}>
          Bem-vindo,{" "}
          {userData.Nome.split(" ")[0]
            ? userData.Nome.split(" ")[0]
            : "Usuário"}
        </Text>
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
          {accessToControl ? (
            <Button text="CONTROLE" type="light" onPress={handleControle} />
          ) : (
            <></>
          )}
          {/*<Button text="Teste" type="light" onPress={() => navigation.navigate("Teste")} />*/}
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
        <TouchableOpacity
          style={{ position: "absolute", bottom: 25, right: 15 }}
          underlayColor={"#00000000"}
          onPress={handleSignOut}
        >
          <FontAwesome5 name="power-off" color="#fff" size={25} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: "absolute", bottom: 25, left: 15 }}
          onPress={handleProfile}
        >
          <FontAwesome5 name="user-cog" color="#fff" size={25} />
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

export default MENU;
