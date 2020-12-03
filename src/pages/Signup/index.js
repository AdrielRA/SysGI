import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import Styles from "../../styles";
import { Primary, Tertiary } from "../../styles/colors";
import { Button, TextInput, Picker, NewPicker } from "../../components";
import { LinearGradient } from "expo-linear-gradient";
import { Auth, Network } from "../../controllers";
import { Strings } from "../../utils";
import { useContext } from "../../context";

function Signup({ navigation }) {
  const [nome, setNome] = useState("");
  const [inscrição, setInscrição] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [confEmail, setConfEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");
  const [categoria, setCategoria] = useState("");

  const { connected, alertOffline } = Network.useNetwork();
  const { isLogged } = useContext();

  useEffect(() => {
    if (isLogged) Auth.signOut();
  }, [isLogged]);

  const validateInputs = () => {
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

  const handleSignup = (userData) => {
    if (!connected) {
      alertOffline();
      return;
    }

    if (!validateInputs()) return;

    Auth.createUser(email, senha)
      .then(({ user }) => {
        if (user) {
          Auth.generateRecoveryCode(userData.Inscrição).then((Recovery) => {
            userData = { ...userData, Recovery };
            Auth.setUserData(user.uid, userData).then(() => {
              if (!user.emailVerified) {
                Auth.sendEmailVerification(user)
                  .then(() => {
                    navigation.push("Recovery", { user, Recovery });
                  })
                  .catch((err) => {
                    Alert.alert(
                      "Falha:",
                      Strings["ptBr"]["signInError"][
                        "auth/verification-email-fail"
                      ]
                    );
                  });
              }
            });
          });
        } else {
          Alert.alert(
            "Falha:",
            Strings["ptBr"]["signInError"]["auth/signup-fail"]
          );
        }
      })
      .catch((e) => {
        let msg = Strings["ptBr"]["signInError"][e.code];
        let errorMsg = !!msg ? msg : "Tente novamente mais tarde";
        Alert.alert("Falha:", errorMsg);
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
            <NewPicker
              type="light"
              placeholder="Categoria"
              data={pickerItems}
              value={categoria}
              onSelect={(Categoria) => setCategoria(Categoria)}
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
                handleSignup({
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
