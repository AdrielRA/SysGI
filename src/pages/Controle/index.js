import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  Alert,
} from "react-native";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { Credential, Credencial, Network } from "../../controllers";
import { Button } from "../../components";
import { Controle as Item } from "../../components/Itens";
import { LinearGradient } from "expo-linear-gradient";
import { SwipeListView } from "react-native-swipe-list-view";
import firebase from "../../services/firebase";

function Controle({ navigation }) {
  const { accessDeniedAlert, credential, isAdmin } = Credential.useCredential();
  const { connected, alertOffline } = Network.useNetwork();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    if (!!credential) {
      const unsubscribe = Credential.onNewUserWithCredential(
        credential,
        isAdmin(),
        handleUserList
      );
      return unsubscribe();
    }
  }, [credential]);

  handleUserList = (snap) => {
    if (!!snap) {
      let users = [];
      snap.forEach((user) => {
        users.push({ ...user.val(), key: user.key });
      });
      setLista(users);
    }
  };

  /*firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      Alert.alert("Atenção:", "Seu usuário foi desconectado!");
      navigation.navigate("Login");
    }
  });*/

  handleAccess = (item, removed) => {
    if (!connected) {
      alertOffline();
      return;
    }
    if (isAdmin()) {
      Credential.setCredential(
        item.key,
        removed ? 99 : Math.abs(item.Credencial)
      )
        .then(() => {
          if (removed) Alert.alert("Sucesso:", "Usuário removido!");
          else Alert.alert("Sucesso:", "Usuário confirmado!");
        })
        .catch(() =>
          Alert.alert(
            "Falha:",
            "Não foi possível atualizar a credencial deste usuário!"
          )
        );
    } else {
      accessDeniedAlert();
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={Styles.page}>
      <LinearGradient
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 1, y: 1.0 }}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal, Colors.Secondary.Normal]}
        style={{
          flex: 1,
          alignSelf: "stretch",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            Styles.lblSubtitle,
            { fontSize: 24, textAlignVertical: "center" },
          ]}
        >
          CONTROLE DE ACESSO
        </Text>
      </LinearGradient>
      <View style={{ flex: 6, alignSelf: "stretch", paddingHorizontal: 15 }}>
        <View style={[Styles.lbAnexos, { paddingBottom: 22 }]}>
          <View style={Styles.btngroupAnexo}>
            <Text style={Styles.lblAnexo}>
              Libere ou não o acesso para estes usuários:
            </Text>
          </View>
          <ScrollView style={[Styles.scrollAnexos, { paddingHorizontal: 0 }]}>
            <SwipeListView
              data={lista}
              renderItem={({ item }) => <Item.idle data={item} />}
              renderHiddenItem={({ item, index }) => (
                <Item.swipe
                  onDelete={() => {
                    handleAccess(item, true);
                  }}
                  onConfirm={() => {
                    handleAccess(item);
                  }}
                />
              )}
              leftOpenValue={65}
              rightOpenValue={-65}
            />
          </ScrollView>
        </View>
        <Button
          text="VOLTAR"
          type="normal"
          onPress={() => navigation.goBack()}
        />
      </View>
    </SafeAreaView>
  );
}

export default Controle;
