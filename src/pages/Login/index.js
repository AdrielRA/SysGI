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
import { Auth, Network, Credential } from "../../controllers";
import { LinearGradient } from "expo-linear-gradient";
import DialogInput from "react-native-dialog-input";
import { CheckBox } from "react-native-elements";
import { Strings } from "../../utils";
import { useContext } from "../../context";

LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["VirtualizedList"]);

function Login({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showReSendEmail, setShowReSendEmail] = useState(false);
  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");
  const { validateSession } = Auth;
  const { blockedAccess, isValidCredential } = Credential;
  const { connected, alertOffline } = Network.useNetwork();
  const { handlePersistence, isLogged, persistence, user } = useContext();

  useEffect(() => {
    setLoading(isLogged !== false);
    if (isLogged) {
      if (user.emailVerified) Auth.getUserData(user.uid).then(entrar);
      else setLoading(false);
    }
  }, [isLogged]);

  const handleLogin = () => {
    if (!connected) {
      alertOffline();
      return;
    }
    setLoading(true);
    Auth.signIn(Email, Senha)
      .then(entrar)
      .catch((error) => {
        setLoading(false);
        console.log(error);
        switch (error) {
          case "email-verification-fail":
            alertEmailVerificationError(user);
            break;
          case undefined:
            break;
          default:
            if (!error.includes("undefined")) {
              let msg = Strings["ptBr"]["signInError"][error];
              let errorMsg = !!msg ? msg : "Tente novamente mais tarde";
              Alert.alert("Falha:", errorMsg);
            }
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

  function entrar(snap) {
    if (isValidCredential(snap.val().Credencial)) {
      if (!validateSession(snap.val().SessionId, true)) {
        Alert.alert(
          "Conta em uso:",
          "Outro dispositivo conectado! Desconectar de todos?",
          [
            {
              text: "Não",
              onPress: () => Auth.signOut(),
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
        return;
      }

      setEmail("");
      setSenha("");
      setLoading(false);

      navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: "MENU",
              params: {
                userData: snap.val(),
              },
            }),
          ],
        })
      );
    } else {
      if (blockedAccess(snap.val().Credencial)) handleDelete(user);
      else Alert.alert("Não liberado! ", "Seu acesso ainda está sob análise!");
      setLoading(false);
    }
  }

  const handleDelete = (user) => {
    Auth.deleteUser(user).then(() => {
      Alert.alert("Acesso negado!", "Seu usuário não foi validado!");
      Auth.signOut();
    });
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
        >
          <TextInput
            placeholder="seuemail@email.com"
            keyboardType={"email-address"}
            autoCapitalize="none"
            editable={!loading}
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
            editable={!loading}
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
