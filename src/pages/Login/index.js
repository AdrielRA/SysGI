import React, { useState, useEffect } from "react";
import { StackActions, NavigationActions } from "react-navigation";
import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Text,
  TouchableHighlight,
  Alert,
  Image,
  LogBox,
  ActivityIndicator,
} from "react-native";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { Button, TextInput, Unifenas } from "../../components";
import { Auth, Network } from "../../controllers";
import { LinearGradient } from "expo-linear-gradient";
import DialogInput from "react-native-dialog-input";
import { CheckBox } from "react-native-elements";
import firebase from "../../services/firebase";
import Constants from "expo-constants";

LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["VirtualizedList"]);

function Login({ navigation }) {
  const [loadLogin, setLoadLogin] = useState(true);
  const [entrando, setEntrando] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showReSendEmail, setShowReSendEmail] = useState(false);
  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");
  const { handlePersistence, isLogged, persistence, user } = Auth.useAuth();
  const { connected, alertOffline } = Network.useNetwork();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(isLogged !== false);
    if (isLogged) {
      setEntrando(true);
      if (user.emailVerified) Auth.getUserData(user.uid).then(entrar);
      else {
        setEntrando(false);
        setLoading(false);
      }
    }
    setLoadLogin(false);
  }, [isLogged]);

  const handleLogin = () => {
    if (!connected) {
      alertOffline();
      return;
    }
    setLoading(true);
    Auth.signIn(Email, Senha)
      .then((user) => entrar(user))
      .catch((error) => {
        setLoading(false);
        setEntrando(false);
        switch (error) {
          case "auth/invalid-email":
            Alert.alert("Atenção:", "Email informado é inválido!");
            break;
          case "auth/user-not-found":
            Alert.alert("Atenção:", "Usuário não cadastrado!");
            break;
          case "auth/wrong-password":
            Alert.alert("Atenção:", "Senha incorreta!");
            break;
          case "auth/network-request-failed":
            Alert.alert(
              "Sem internet:",
              "Verifique sua conexão e tente novamente!"
            );
            break;
          case "email-verification-fail":
            alertEmailVerificationError(user);
            break;
          default:
            Alert.alert("Falha: " + error, "Ocorreu um erro!");
            break;
        }
        Auth.signOut();
      });
  };

  const alertEmailVerificationError = (user) => {
    if (!showReSendEmail) {
      Alert.alert("Atenção: ", "Verifique seu e-mail primeiro!");
      setShowReSendEmail(true);
    } else {
      Alert.alert(
        "Atenção: ",
        "Verifique sua conta! Deseja receber um novo email verificação?",
        [
          {
            text: "Não",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Sim",
            onPress: () => {
              Auth.sendEmailVerification(user)
                .then(() => {
                  Alert.alert(
                    "Email enviado!",
                    "Verifique sua caixa de entrada!"
                  );
                  setShowReSendEmail(false);
                })
                .catch(() => {
                  Alert.alert(
                    "Falha de Verificação!",
                    "Não foi possível enviar o email de verificação, tente mais tarde!"
                  );
                });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handleDisconnect = (cod) => {
    Auth.disconnectDevices(cod)
      .then(() => {
        Alert.alert(
          "Dispositivos desconectados:",
          "Realize seu login normalmente!"
        );
      })
      .catch(() => {
        Alert.alert("Falha:", "Código informado está incorreto!");
      })
      .finally(() => {
        Auth.signOut();
      });
  };

  function entrar(snapshot) {
    if (snapshot.val().Credencial > 0 && snapshot.val().Credencial <= 30) {
      if (snapshot.val().SessionId != undefined) {
        if (Constants.deviceId != snapshot.val().SessionId) {
          Alert.alert(
            "Conta em uso:",
            "Outro dispositivo conectado! Desconectar de todos?",
            [
              {
                text: "Não",
                onPress: () => {
                  firebase.auth().signOut();
                },
                style: "cancel",
              },
              {
                text: "Sim",
                onPress: () => {
                  setShowDialog(true);
                },
              },
            ],
            { cancelable: false }
          );
          setLoading(false);
          setEntrando(false);
          return;
        }
      } else {
        snapshot.ref.child("SessionId").set(Constants.deviceId);
      }

      setEmail("");
      setSenha("");
      setLoading(false);
      setEntrando(false);
      let userName = snapshot.val().Nome;
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: "MENU",
            params: {
              userLogged: userName,
              userLoggedId: firebase.auth().currentUser.uid,
            },
          }),
        ],
      });
      navigation.dispatch(resetAction);
      //navigation.navigate('MENU', { userLogged: userName});
    } else if (snapshot.val().Credencial == 99) {
      handleDelete(user);
      firebase.auth().signOut();
      setLoading(false);
      setEntrando(false);
    } else {
      Alert.alert("Não liberado! ", "Seu acesso ainda está sob análise!");
      //firebase.auth().signOut();
      setLoading(false);
      setEntrando(false);
    }
  }

  const handleDelete = (user) => {
    Auth.deleteUser(user).then(() =>
      Alert.alert("Acesso negado!", "Seu usuário não foi validado!")
    );
  };

  return (
    <SafeAreaView style={Styles.page}>
      <DialogInput
        isDialogVisible={showDialog}
        title={"Desconectar dispositivos"}
        message={"Digite seu código de controle:"}
        hintInput={"Código aqui"}
        submitInput={(cod) => {
          setShowDialog(false);
          handleDisconnect(cod);
        }}
        submitText={"Confirmar"}
        cancelText={"Cancelar"}
        closeDialog={() => {
          setShowDialog(false);
        }}
      ></DialogInput>
      <LinearGradient
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 1, y: 1.0 }}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal, Colors.Terciary.Normal]}
        style={[Styles.page, { alignSelf: "stretch", flex: 3 }]}
      >
        <View
          style={{
            flex: 0.9,
            justifyContent: "center",
            marginTop: 30,
          }}
        >
          <Text style={Styles.lblTitle}>SysGI</Text>
        </View>

        <KeyboardAvoidingView
          style={{
            alignSelf: "stretch",
            flex: 1.2,
            paddingHorizontal: 30,
            paddingBottom: 75,
          }}
          //behavior="height"
          //enabled
          //keyboardVerticalOffset={100}
        >
          <TextInput
            placeholder="seuemail@email.com"
            keyboardType={"email-address"}
            autoCapitalize="none"
            editable={!loadLogin && !entrando}
            autoCorrect={false}
            value={Email}
            autoCompleteType="email"
            type="light"
            onChangeText={(email) => {
              setEmail(email);
            }}
          />
          <TextInput
            placeholder="Senha"
            autoCapitalize="none"
            editable={!loadLogin && !entrando}
            autoCorrect={false}
            value={Senha}
            autoCompleteType="password"
            secureTextEntry={true}
            type="light"
            onChangeText={(senha) => {
              setSenha(senha);
            }}
          />
          <CheckBox
            center
            title="Manter-se conectado!"
            checkedIcon="check-square"
            uncheckedIcon="square"
            uncheckedColor={Colors.Primary.White}
            checkedColor={Colors.Primary.White}
            containerStyle={Styles.checkbox}
            textStyle={{ color: Colors.Primary.White }}
            checked={persistence}
            onPress={handlePersistence}
          />
          <Button
            text="LOGAR"
            type="light"
            onPress={() => !loading && handleLogin()}
          >
            {loading && (
              <ActivityIndicator
                style={{ marginLeft: 10 }}
                color={Colors.Secondary.Normal}
              />
            )}
          </Button>
          <Button
            text="Solicitar acesso!"
            type="transparent"
            textStyle={{ fontSize: 15 }}
            onPress={() => navigation.navigate("Signup")}
          ></Button>
        </KeyboardAvoidingView>
        <Unifenas
          style={{
            flex: 0.9,
            justifyContent: "center",
            marginBottom: 30,
          }}
        />
        <Text style={[Styles.lblRodape, { position: "absolute", bottom: 22 }]}>
          Todos os Direitos Reservados - {new Date().getFullYear()}
        </Text>
        <TouchableHighlight
          style={{ position: "absolute", bottom: 20, right: 15 }}
          underlayColor={"#00000000"}
          onPress={() => {
            navigation.navigate("Sobre");
          }}
        >
          <Image
            style={{ height: 25, width: 25 }}
            source={require("../../assets/images/icon_info.png")}
          ></Image>
        </TouchableHighlight>
      </LinearGradient>
    </SafeAreaView>
  );
}

export default Login;
