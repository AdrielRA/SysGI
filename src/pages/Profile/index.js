import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  AppState,
  ScrollView,
} from "react-native";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { Button, Unifenas, TextInput } from "../../components";
import { Auth, Credential, Network, Notifications } from "../../controllers";
import { StackActions, NavigationActions } from "react-navigation";
import { LinearGradient } from "expo-linear-gradient";
import { useContext } from "../../context";
import * as LocalAuthentication from "expo-local-authentication";
import { FontAwesome5 } from "@expo/vector-icons";
import { mask } from "../../utils";

export default ({ navigation }) => {
  const { connected, alertOffline } = Network.useNetwork();
  const { credential, session, user, isLogged } = useContext();
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [userData, setUserData] = useState({});

  const [refs, setRefs] = useState({
    Nome: useRef(),
    Telefone: useRef(),
    Senha: useRef(),
    NovaSenha: useRef(),
    ConNovaSenha: useRef(),
  });

  useEffect(() => {
    Auth.getUserData(user.uid).then((snap) => setUserData(snap.val()));
  }, [isLogged]);

  const handleUpdateAccountData = () => {};

  const handleDeleteAccount = () => {};

  const credentials = {
    0: "Credencial",
    1: "Professor",
    2: "Conselho Tutelar",
    3: "Advogado",
    4: "CONSEPA",
    5: "CREAS",
    6: "Policial",
    7: "Delegado",
    8: "Promotor",
    9: "Juiz",
    30: "Administrador",
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
        <ScrollView style={{ height: "100%", width: "100%" }}>
          <View
            style={{
              alignItems: "center",
              padding: 15,
            }}
          >
            <Text
              style={[
                Styles.txtBold,
                {
                  color: Colors.Primary.Normal,
                  borderRadius: 80,
                  backgroundColor: "#fff",
                  width: 80,
                  height: 80,
                  textAlign: "center",
                  textAlignVertical: "center",
                  lineHeight: 52,
                  fontSize: 50,
                  marginTop: 15,
                  marginBottom: 30,
                },
              ]}
            >
              {!!userData.Nome ? userData.Nome[0].toUpperCase() : "U"}
            </Text>

            <Text style={[Styles.txtBold, { color: "#fff", fontSize: 16 }]}>
              Informações de Perfil
            </Text>
            <TextInput
              placeholder="Nome de Usuário"
              autoCapitalize="words"
              textContentType="name"
              keyboardType="name-phone-pad"
              returnKeyType="next"
              autoCompleteType="name"
              maxLength={60}
              type="light"
              value={userData.Nome}
              //onChangeText={(nome_) => setNome(nome_)}
              Ref={refs.Nome}
              onSubmitEditing={() => refs.Telefone.current.focus()}
            />
            <TextInput
              placeholder="Telefone"
              textContentType="telephoneNumber"
              keyboardType="phone-pad"
              autoCompleteType="tel"
              returnKeyType="next"
              maxLength={16}
              type="light"
              value={mask.Phone(userData.Telefone)}
              //onChangeText={(Telefone) => setTelefone(mask.Numeric(Telefone))}
              Ref={refs.Telefone}
              onSubmitEditing={() => refs.Senha.current.focus()}
            />
            <TextInput
              editable={false}
              value={"email@email.com"}
              type="light"
              value={user.email}
            />
            <TextInput
              editable={false}
              value={
                !!credentials[userData.Credencial]
                  ? "Credencial: " + credentials[userData.Credencial]
                  : "Credencial desconhecida"
              }
              type="light"
            />
            <TextInput
              editable={false}
              value={"Matricula"}
              type="light"
              value={
                !!userData.Inscrição
                  ? "Inscrição: " + userData.Inscrição.toString()
                  : ""
              }
            />
            <Text
              style={[
                Styles.txtBold,
                { color: "#fff", fontSize: 16, paddingTop: 15 },
              ]}
            >
              Atualizar Senha
            </Text>
            <TextInput
              placeholder="Senha Antiga"
              autoCapitalize="none"
              textContentType="password"
              autoCompleteType="password"
              returnKeyType="next"
              maxLength={20}
              secureTextEntry={true}
              type="light"
              //onChangeText={(senha_) => setSenha(senha_)}
              Ref={refs.Senha}
              onSubmitEditing={() => refs.NovaSenha.current.focus()}
            />
            <TextInput
              placeholder="Nova Senha"
              autoCapitalize="none"
              textContentType="password"
              autoCompleteType="password"
              returnKeyType="next"
              maxLength={20}
              secureTextEntry={true}
              type="light"
              //onChangeText={(senha_) => setSenha(senha_)}
              Ref={refs.NovaSenha}
              onSubmitEditing={() => refs.ConNovaSenha.current.focus()}
            />
            <TextInput
              placeholder="Confirmar Nova Senha"
              autoCapitalize="none"
              textContentType="password"
              autoCompleteType="password"
              returnKeyType="done"
              maxLength={20}
              secureTextEntry={true}
              type="light"
              //onChangeText={(senha_) => setSenha(senha_)}
              Ref={refs.ConNovaSenha}
            />
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
                onPress={() => !loading && handleUpdateAccountData}
              >
                {loading && (
                  <ActivityIndicator
                    style={{ marginLeft: 10 }}
                    color={Colors.Secondary.Normal}
                  />
                )}
              </Button>
            </View>
            <Text
              style={[
                Styles.txtBold,
                { color: "#fff", fontSize: 16, marginTop: 15, marginBottom: 5 },
              ]}
            >
              Código de Acesso
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                borderRadius: 50,
                height: 50,
                width: "60%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setShowCode(!showCode)}
            >
              {showCode ? (
                <Text
                  style={[
                    Styles.txtBold,
                    { color: Colors.Secondary.Normal, fontSize: 30 },
                  ]}
                >
                  {userData.Recovery}
                </Text>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={[
                      Styles.txtBold,
                      {
                        color: Colors.Secondary.Normal,
                        fontSize: 30,
                        marginRight: 15,
                      },
                    ]}
                  >
                    Ver
                  </Text>
                  <FontAwesome5
                    name="eye"
                    size={30}
                    color={Colors.Secondary.Normal}
                  />
                </View>
              )}
            </TouchableOpacity>
            <Text
              style={[
                Styles.txtBold,
                { color: "#fff", fontSize: 16, marginTop: 15, marginBottom: 5 },
              ]}
            >
              Controle da Conta
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                borderRadius: 50,
                height: 50,
                width: "60%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                Alert.alert(
                  "Tem certeza?",
                  "Sua conta não poderá ser recuperada!",
                  [
                    {
                      text: "Não",
                      onPress: () => {},
                      style: "cancel",
                    },
                    {
                      text: "Sim",
                      onPress: handleDeleteAccount,
                    },
                  ],
                  { cancelable: false }
                );
              }}
            >
              <Text
                style={[
                  Styles.txtBold,
                  { color: Colors.Secondary.Normal, fontSize: 20 },
                ]}
              >
                EXCLUIR CONTA
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
