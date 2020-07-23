import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Text,
  TouchableHighlight,
  Alert,
  ScrollView,
} from "react-native";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { Primary, Tertiary } from "../../styles/colors";
import { Button, Picker, TextInput } from "../../components";
import { Network } from "../../controllers";
import { LinearGradient } from "expo-linear-gradient";
import firebase from "../../services/firebase";
import * as Crypto from "expo-crypto";

function Signup({ navigation }) {
  const [categoria, setCategoria] = useState(0);
  const CategoriaChanged = (categoria) => {
    setCategoria(categoria);
  };
  const [nome, setNome] = useState("");
  const [inscrição, setInscrição] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [confEmail, setConfEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");

  const _camposOk = () => {
    if (categoria === "0") {
      Alert.alert("Atenção:", "Selecione uma categoria!");
      return false;
    } else if (!nome || nome === "") {
      Alert.alert("Atenção:", "Nome informado é inválido!");
      return false;
    } else if (!inscrição || inscrição === "") {
      Alert.alert("Atenção:", "Informe Matricula/Inscrição que seja válida!");
      return false;
    } else if (!telefone || telefone.length < 11) {
      Alert.alert("Atenção:", "Verifique o número de telefone!");
      return false;
    } else if (email != confEmail) {
      Alert.alert("Atenção:", "Os emails divergem entre si!");
      return false;
    } else if (senha != confSenha) {
      Alert.alert("Atenção:", "Senhas estão divergentes!");
      return false;
    } else return true;
  };

  const _saveUser = (user) => {
    if (!Network.haveInternet) {
      Network.alertOffline(() => {});
      return;
    }

    firebase.auth().signOut();

    if (!_camposOk()) return;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, senha)
      .then(() => {
        if (firebase.auth().currentUser) {
          let fire_user = firebase.auth().currentUser;
          let Recovery = "";
          (async () => {
            const digest = await Crypto.digestStringAsync(
              Crypto.CryptoDigestAlgorithm.SHA256,
              user.Inscrição
            );
            Recovery = digest.toString("hex").substring(0, 8);
          })().then(() => {
            user = { ...user, Recovery };
            firebase.database().ref("users").child(fire_user.uid).set(user);
            firebase
              .database()
              .ref("users")
              .child(fire_user.uid)
              .once("value")
              .then((snapshot) => {
                if (!fire_user.emailVerified) {
                  fire_user
                    .sendEmailVerification()
                    .then(() => {
                      Alert.alert(
                        user.Recovery,
                        `Salve este cód. de recuperação em local seguro! Em breve você receberá um e-mail de verificação!`
                      );
                    })
                    .catch((err) => {
                      Alert.alert("Falha: " + err.code, err.message);
                    });
                }
              });
            navigation.goBack();
          });
        } else {
          Alert.alert("Falha!", "Não foi possivel completar seu cadastro!");
        }
        firebase.auth().signOut();
      })
      .catch((e) => {
        switch (e.code) {
          case "auth/invalid-email":
            Alert.alert("Atenção:", "Email informado é inválido!");
            break;
          case "auth/weak-password":
            Alert.alert("Atenção:", "Senha deve conter ao menos 6 caracteres!");
            break;
          case "auth/email-already-in-use":
            Alert.alert("Email inválido!", "Ele já está em uso.");
            break;
          case "auth/network-request-failed":
            Alert.alert(
              "Sem internet:",
              "Verifique sua conexão e tente novamente!"
            );
            break;
          default:
            Alert.alert(
              "Algo deu errado...",
              "Por favor tente novamente mais tarde!"
            );
            //Alert.alert(`ERROR: ${e.code}`, e.message);
            break;
        }
      });
  };

  const pickerItems = [
    { label: "Categoria", value: "0" },
    { label: "Professor", value: "1" },
    { label: "Conselho Tutelar", value: "2" },
    { label: "Advogado", value: "3" },
    { label: "CONSEPA", value: "4" },
    { label: "CREAS", value: "5" },
    { label: "Policial", value: "6" },
    { label: "Delegado", value: "7" },
    { label: "Promotor", value: "8" },
    { label: "Juiz", value: "9" },
  ];

  return (
    <SafeAreaView style={Styles.page}>
      <LinearGradient
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 1, y: 1.0 }}
        locations={[0, 1]}
        colors={[Primary, Tertiary]}
        style={Styles.page}
      >
        <Text style={[Styles.lblSubtitle, { flex: 0.75, paddingTop: 30 }]}>
          CADASTRO
        </Text>
        <KeyboardAvoidingView
          style={{ flex: 5, alignSelf: "stretch" }}
          //keyboardVerticalOffset={50}
        >
          <ScrollView style={{ marginVertical: 10, paddingHorizontal: 30 }}>
            <Picker
              items={pickerItems}
              type="light"
              selectedValue={categoria}
              onValueChange={(itemValue) => CategoriaChanged(itemValue)}
            />
            <TextInput
              placeholder="Nome de Usuário"
              autoCapitalize="words"
              textContentType="name"
              keyboardType="name-phone-pad"
              returnKeyType="next"
              autoCompleteType="name"
              maxLength={60}
              type="light"
              onChangeText={(nome_) => setNome(nome_)}
            />
            <TextInput
              placeholder="Matricula/Inscrição"
              autoCompleteType="off"
              returnKeyType="next"
              maxLength={20}
              type="light"
              onChangeText={(inscrição_) => setInscrição(inscrição_)}
            />
            <TextInput
              placeholder="Telefone"
              textContentType="telephoneNumber"
              keyboardType="phone-pad"
              autoCompleteType="tel"
              returnKeyType="next"
              maxLength={11}
              type="light"
              onChangeText={(telefone_) => setTelefone(telefone_)}
            />
            <TextInput
              placeholder="emai@email.com"
              autoCapitalize="none"
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCompleteType="email"
              returnKeyType="next"
              maxLength={50}
              type="light"
              onChangeText={(email_) => setEmail(email_)}
            />
            <TextInput
              placeholder="emai.confirma@email.com"
              autoCapitalize="none"
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCompleteType="email"
              returnKeyType="next"
              maxLength={50}
              type="light"
              onChangeText={(confEmail_) => setConfEmail(confEmail_)}
            />
            <TextInput
              placeholder="Senha"
              autoCapitalize="none"
              textContentType="password"
              autoCompleteType="password"
              returnKeyType="next"
              maxLength={20}
              secureTextEntry={true}
              type="light"
              onChangeText={(senha_) => setSenha(senha_)}
            />
            <TextInput
              placeholder="Confirma Senha"
              autoCapitalize="none"
              textContentType="password"
              autoCompleteType="password"
              returnKeyType="next"
              maxLength={20}
              secureTextEntry={true}
              type="light"
              onChangeText={(confSenha_) => setConfSenha(confSenha_)}
            />
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 30,
              alignItems: "center",
            }}
          >
            <Button
              text="VOLTAR"
              type="transparent"
              style={{ minWidth: 150 }}
              onPress={() => navigation.goBack()}
            />
            <Button
              text="SALVAR"
              type="light"
              style={{ minWidth: 150 }}
              onPress={() =>
                _saveUser({
                  Nome: nome,
                  Inscrição: inscrição,
                  Telefone: telefone,
                  Credencial: Number(categoria) * -1,
                })
              }
            />
          </View>
        </KeyboardAvoidingView>
        <Text style={Styles.lblRodape}>
          Todos os Direitos Reservados - {new Date().getFullYear()}
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
}
export default Signup;