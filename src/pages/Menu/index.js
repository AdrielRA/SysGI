import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  Switch,
  AsyncStorage,
  Alert,
  SafeAreaView,
  BackHandler,
} from "react-native";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { Button, Unifenas } from "../../components";
import { Auth, Credencial, Network } from "../../controllers";
import { StackActions, NavigationActions } from "react-navigation";
import { LinearGradient } from "expo-linear-gradient";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import firebase from "../../services/firebase";

function MENU({ navigation }) {
  const userData = navigation.getParam("userData");
  const [allowNotify, setAllowNotify] = useState(false);
  const [credencial, setCredencial] = useState(undefined);
  const { isLogged, user, session, validateSession } = Auth.useAuth();
  const { connected, alertOffline } = Network.useNetwork();

  useEffect(() => {
    async function _loadNotify() {
      try {
        let value = await AsyncStorage.getItem("notify");
        if (value != null) {
          setAllowNotify(value == "true");
        } else {
          await AsyncStorage.setItem("notify", allowNotify.toString());
        }
      } catch {
        console.log("Falha ao manipular variavel allowNotify...");
      }
    }
    _loadNotify();
  }, []);

  useEffect(() => {
    if (session !== null && !validateSession(session)) {
      Alert.alert("Atenção:", "Sua conta foi desconectada deste dispositivo!");
      Auth.signOut();
      return_login();
    }
  }, [session]);

  // Código quando a tela perde o foco
  /*useEffect(() => {

    navigation.addListener("didBlur", (e) => {
      if(!e.state){
        BackHandler.exitApp();
      }
    });
  }, [navigation])*/

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    async function _saveNotify() {
      try {
        if (allowNotify != undefined) {
          if (allowNotify) {
            let token = await Notifications.getExpoPushTokenAsync();
            firebase
              .database()
              .ref()
              .child("users")
              .child(firebase.auth().currentUser.uid)
              .child("Device")
              .set(token.data);
          } else {
            firebase
              .database()
              .ref()
              .child("users")
              .child(firebase.auth().currentUser.uid)
              .child("Device")
              .remove();
          }

          await AsyncStorage.setItem("notify", allowNotify.toString());
        }
      } catch (err) {
        console.log("Falha ao salvar allowNotify..." + err.message);
      }
    }
    async function _requestNotifyPermission() {
      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      if (status !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        if (status === "granted") {
          _saveNotify();
        } else {
          setAllowNotify(false);
        }
      } else {
        _saveNotify();
      }
    }

    if (allowNotify) {
      _requestNotifyPermission();
    } else {
      _saveNotify();
    }
  }, [allowNotify]);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      Credencial._getCredencial(user, setCredencial);
    } else {
      //Alert.alert("Atenção:","Seu usuário foi desconectado!");
      //return_login();
    }
  });

  logOff = () => {
    if (!firebase.auth().currentUser) {
      return_login();
    } else {
      firebase
        .database()
        .ref("users")
        .child(firebase.auth().currentUser.uid)
        .once("value")
        .then((snapshot) => {
          if (snapshot.val().Recovery != undefined) {
            snapshot.ref.child("SessionId").remove();
          }
        });
    }
  };

  const return_login = () => {
    console.log("retornou...");
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Login" })],
    });
    navigation.dispatch(resetAction);
  };

  const handleCadastrar = () => {
    if (!connected) alertOffline();
    else {
      if (
        Credencial.haveAccess(credencial, Credencial.AccessToCadastro) ||
        Credencial.isAdimin(credencial)
      )
        navigation.navigate("Cadastro");
      else Credencial.accessDenied();
    }
  };

  const handleConsultar = () => {
    if (!connected) alertOffline();
    else {
      if (
        Credencial.haveAccess(credencial, Credencial.AccessToConsulta) ||
        Credencial.isAdimin(credencial)
      )
        navigation.navigate("Consulta");
      else Credencial.accessDenied();
    }
  };

  const handleControle = () => {
    if (!connected) alertOffline();
    else {
      if (
        (credencial > 10 && credencial < 20) ||
        Credencial.isAdimin(credencial)
      )
        navigation.navigate("Controle");
      else Credencial.accessDenied();
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
          {(credencial > 10 && credencial < 20) || credencial == 30 ? (
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
            onValueChange={() => {
              setAllowNotify(!allowNotify);
            }}
            value={allowNotify}
          ></Switch>
        </View>
        <TouchableHighlight
          style={{ position: "absolute", bottom: 25, right: 15 }}
          underlayColor={"#00000000"}
          onPress={() => {
            logOff();
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
