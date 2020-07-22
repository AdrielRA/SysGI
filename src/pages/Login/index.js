import React, { useState, useEffect } from "react";
import { StackActions, NavigationActions } from "react-navigation";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableHighlight,
  Alert,
  Image,
  AsyncStorage,
  YellowBox,
} from "react-native";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { Network } from "../../controllers";
import { LinearGradient } from "expo-linear-gradient";
import DialogInput from "react-native-dialog-input";
import { CheckBox } from "react-native-elements";
import firebase from "../../services/firebase";
import Constants from "expo-constants";

YellowBox.ignoreWarnings(["Setting a timer"]);
YellowBox.ignoreWarnings(["VirtualizedList"]);

function Login({ navigation }) {
  const [keepLogin, setLoginState] = useState();
  const [loadLogin, setLoadLogin] = useState(true);
  const [entrando, setEntrando] = useState(false);
  const [netAlert, setNetAlert] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showReSendEmail, setShowReSendEmail] = useState(false);
  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");

  useEffect(() => {
    Network.addListener();

    async function _loadKeepLogin() {
      try {
        let value = await AsyncStorage.getItem("keep");
        if (value != null) {
          setLoginState(value == "true");
        } else {
          await AsyncStorage.setItem("keep", keepLogin.toString());
        }
      } catch {
        console.log("Falha ao manipular variavel keepLogin...");
      }
    }
    _loadKeepLogin();
  }, []);

  useEffect(() => {
    async function _saveKeepLogin() {
      try {
        if (keepLogin != undefined)
          await AsyncStorage.setItem("keep", keepLogin.toString());
      } catch (err) {
        console.log("Falha ao salvar keepLogin..." + err.message);
      }
    }
    _saveKeepLogin();
    //console.log("Keep:" + keepLogin);

    if (keepLogin == false && loadLogin) {
      firebase.auth().signOut();
      //console.log("Desconectou! Keep: " + keepLogin + " | load: " + loadLogin);
      setLoadLogin(false);
    }
  }, [keepLogin]);

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      if (keepLogin && loadLogin) {
        setEntrando(true);
        if (user.emailVerified) {
          firebase
            .database()
            .ref("users")
            .child(user.uid)
            .once("value")
            .then((snapshot) => {
              entrar(snapshot);
            });
        } else setEntrando(false);
      }
    } else {
      if (!netAlert && !Network.haveInternet) {
        setNetAlert(true);
        Network.alertOffline(() => setNetAlert(false));
        /*Alert.alert("Sem internet!", "Verifique sua conexão e tente novamente!",
        [ {text: 'OK', onPress:  }, ], {cancelable: false}, );   */
      }
    }
    setLoadLogin(false);
  });

  const KeepLoginChange = () => {
    if (!entrando) setLoginState(!keepLogin);
  };

  const _logar = () => {
    if (!Network.haveInternet) {
      Network.alertOffline(() => {});
      return;
    }

    firebase.auth().signOut();
    setEntrando(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(Email, Senha)
      .then(() => {
        let fire_user = firebase.auth().currentUser;
        if (fire_user.emailVerified) {
          firebase
            .database()
            .ref("users")
            .child(fire_user.uid)
            .once("value")
            .then((snapshot) => {
              entrar(snapshot);
            });
        } else {
          setEntrando(false);
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
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Sim",
                  onPress: () => {
                    fire_user
                      .sendEmailVerification()
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
                          "Não foi possivel enviar o email de verificação, tente mais tarde!"
                        );
                      });
                  },
                },
              ],
              { cancelable: false }
            );
          }
          firebase.auth().signOut();
        }
      })
      .catch((error) => {
        setEntrando(false);
        switch (error.code) {
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
          default:
            //Alert.alert("Algo deu errado...", "Por favor tente novamente mais tarde!");
            Alert.alert("Falha: " + error.code, "Ocorreu um erro!");
            break;
        }
      });
  };

  const desconnect_all = (cod) => {
    firebase
      .database()
      .ref("users")
      .child(firebase.auth().currentUser.uid)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val().Recovery != undefined) {
          if (snapshot.val().Recovery === cod) {
            snapshot.ref
              .child("SessionId")
              .remove()
              .then(() => {
                Alert.alert(
                  "Dispositivos desconectados:",
                  "Realize seu login normalmente!"
                );
              });
          } else {
            Alert.alert("Falha:", "Código informado está incorreto!");
          }
        }
        firebase.auth().signOut();
        /*else{
            let new_recovery_cod = "afc2d258";
            snapshot.ref().child('SessionId').set(new_recovery_cod).once("value", () => {
              Alert.alert(`Seu novo código: ${new_recovery_cod}`, "Salve-o e use-o para recuperar o acesso sempre que necessário!")
            });
          }*/
      });
  };

  function entrar(snapshot) {
    if (snapshot.val().Credencial > 0 && snapshot.val().Credencial <= 30) {
      if (snapshot.val().SessionId != undefined) {
        if (Constants.sessionId != snapshot.val().SessionId) {
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

          setEntrando(false);
          return;
        }
      } else {
        snapshot.ref.child("SessionId").set(Constants.sessionId);
      }

      setEmail("");
      setSenha("");
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
      delete_user(firebase.auth().currentUser);
      firebase.auth().signOut();
      setEntrando(false);
    } else {
      Alert.alert("Não liberado! ", "Seu acesso ainda está sob análise!");
      //firebase.auth().signOut();
      setEntrando(false);
    }
  }

  function delete_user(user) {
    firebase
      .database()
      .ref()
      .child("users")
      .child(user.uid)
      .remove()
      .then(() => {
        user.delete().then(() => {
          Alert.alert("Acesso negado!", "Seu usuário não foi validado!");
        });
      });
  }

  const btn_Logar = (
    <TouchableHighlight
      style={Styles.btnSecundary}
      underlayColor={Colors.Primary.White}
      onPress={() => {
        _logar();
      }}
    >
      <Text style={Styles.btnTextSecundary}>LOGAR</Text>
    </TouchableHighlight>
  );
  const btn_Carregando = (
    <TouchableHighlight
      style={Styles.btnSecundary}
      underlayColor={Colors.Primary.White}
      onPress={() => {
        Alert.alert("Aguarde...", "Carregando login!");
      }}
    >
      <Text style={Styles.btnTextSecundary}>CARREGANDO...</Text>
    </TouchableHighlight>
  );
  const btn_Entrando = (
    <TouchableHighlight
      style={Styles.btnSecundary}
      underlayColor={Colors.Primary.White}
      onPress={() => {
        Alert.alert("Aguarde...", "Carregando MENU!");
      }}
    >
      <Text style={Styles.btnTextSecundary}>ENTRANDO...</Text>
    </TouchableHighlight>
  );

  return (
    <SafeAreaView style={Styles.page}>
      <DialogInput
        isDialogVisible={showDialog}
        title={"Desconectar dispositivos"}
        message={"Digite seu código de controle:"}
        hintInput={"Código aqui"}
        submitInput={(cod) => {
          setShowDialog(false);
          desconnect_all(cod);
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
        style={[Styles.page, { alignSelf: "stretch" }]}
      >
        <Text style={Styles.lblTitle}>SysGI</Text>
        <KeyboardAvoidingView
          style={{ flex: 3, alignSelf: "stretch" }}
          behavior="padding"
          enabled
          keyboardVerticalOffset={100}
        >
          <TextInput
            placeholder="seuemail@email.com"
            placeholderTextColor={Colors.Terciary.White}
            keyboardType={"email-address"}
            autoCapitalize="none"
            editable={!loadLogin && !entrando}
            autoCorrect={false}
            value={Email}
            autoCompleteType="email"
            style={Styles.campo}
            onChangeText={(email) => {
              setEmail(email);
            }}
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor={Colors.Terciary.White}
            autoCapitalize="none"
            editable={!loadLogin && !entrando}
            autoCorrect={false}
            value={Senha}
            autoCompleteType="password"
            secureTextEntry={true}
            style={Styles.campo}
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
            checked={keepLogin}
            onPress={KeepLoginChange}
          />
          {loadLogin ? btn_Carregando : entrando ? btn_Entrando : btn_Logar}
          <TouchableHighlight
            style={Styles.btnTransparent}
            underlayColor={"transparent"}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={Styles.btnTextTransparent}>Solicitar acesso!</Text>
          </TouchableHighlight>
        </KeyboardAvoidingView>
        <Text style={Styles.lblRodape}>
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
