import React, { useState, useEffect, useRef } from "react";
import { StackActions, NavigationActions } from "react-navigation";
import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  LogBox,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { Button, TextInput, Unifenas, DialogInput } from "../../components";
import { Auth, Network, Credential } from "../../controllers";
import { LinearGradient } from "expo-linear-gradient";
import { CheckBox } from "react-native-elements";
import { Strings } from "../../utils";
import { useUserContext } from "../../context";
import { Feather } from "@expo/vector-icons";

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
  const {
    handlePersistence,
    isLogged,
    persistence,
    user,
    userData,
  } = useUserContext();
  const [showUnifenas, setShowUnifenas] = useState(true);

  const [refs, setRefs] = useState({
    Email: useRef(),
    Senha: useRef(),
  });

  useEffect(() => {
    const keyboardOpenListener = Keyboard.addListener("keyboardDidShow", () =>
      setShowUnifenas(false)
    );

    const keyboardCloseListener = Keyboard.addListener("keyboardDidHide", () =>
      setShowUnifenas(true)
    );

    return () => {
      keyboardOpenListener.remove();
      keyboardCloseListener.remove();
    };
  }, []);

  useEffect(() => {
    if (!!userData) {
      setLoading(isLogged !== false);
      if (isLogged) {
        if (user.emailVerified) entrar();
        else setLoading(false);
      }
    }
  }, [isLogged, userData]);

  const handleLogin = () => {
    if (!connected) {
      alertOffline();
      return;
    }
    setLoading(true);
    Auth.signIn(Email, Senha).catch((error) => {
      setLoading(false);
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

  const entrar = () => {
    if (isValidCredential(userData.Credencial)) {
      if (!validateSession(userData.SessionId, true)) {
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
              onPress: () => setShowDialog(true),
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
            }),
          ],
        })
      );
    } else {
      if (blockedAccess(userData.Credencial)) handleDelete(user);
      else {
        Alert.alert("Não liberado! ", "Seu acesso ainda está sob análise!");
        Auth.signOut();
      }
      setLoading(false);
    }
  };

  const handleDelete = (user) => {
    Auth.deleteUser(user).then(() => {
      Alert.alert("Acesso negado!", "Seu usuário não foi validado!");
      Auth.signOut();
    });
  };

  return (
    <SafeAreaView style={Styles.page}>
      <DialogInput
        visible={showDialog}
        title="Desconectar dispositivos"
        msg="Digite seu código de controle:"
        placeholder="Código aqui"
        onSubmit={handleDisconnect}
        submitText={"Confirmar"}
        cancelText={"Cancelar"}
        onClose={() => {
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
            returnKeyType="next"
            autoCompleteType="email"
            type="light"
            onChangeText={(email) => {
              setEmail(email);
            }}
            Ref={refs.Email}
            onSubmitEditing={() => refs.Senha.current.focus()}
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
            returnKeyType="done"
            onChangeText={(senha) => {
              setSenha(senha);
            }}
            Ref={refs.Senha}
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
        {showUnifenas && (
          <Unifenas
            style={{
              flex: 0.9,
              justifyContent: "center",
              marginBottom: 30,
            }}
          />
        )}
        <Text style={[Styles.lblRodape, { position: "absolute", bottom: 22 }]}>
          Todos os Direitos Reservados - {new Date().getFullYear()}
        </Text>
        <TouchableOpacity
          style={{ position: "absolute", bottom: 20, right: 15 }}
          onPress={() => navigation.navigate("Sobre")}
        >
          <Feather name="info" color="#fff" size={25} />
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

export default Login;
