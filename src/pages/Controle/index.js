import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { Credential, Network } from "../../controllers";
import { Button } from "../../components";
import { Controle as Item } from "../../components/Itens";
import { LinearGradient } from "expo-linear-gradient";
import { SwipeListView } from "react-native-swipe-list-view";
import { useUserContext } from "../../context";

function Controle({ navigation }) {
  const { accessDeniedAlert, isAdmin } = Credential;
  const { credential } = useUserContext();
  const { connected, alertOffline } = Network.useNetwork();
  const [lista, setLista] = useState([]);

  useEffect(() => {
    if (!!credential) {
      const unsubscribe = Credential.onNewUserWithCredential(
        credential,
        isAdmin(credential),
        handleUserList
      );
      return unsubscribe();
    }
  }, [credential]);

  const handleUserList = (snap) => {
    if (!!snap) {
      let users = [];
      snap.forEach((user) => {
        users.push({ ...user.val(), key: user.key });
      });
      setLista(users);
    }
  };

  const handleAccess = (item, removed) => {
    if (!connected) {
      alertOffline();
      return;
    }
    if (isAdmin(credential)) {
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
        colors={[Colors.Primary.Normal, Colors.Terciary.Normal]}
        style={{
          width: "100%",
          height: 60,
          paddingHorizontal: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            source={require("../../assets/images/back.png")}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
        <Text
          style={[
            Styles.txtBoldWhite,
            {
              fontSize: 25,
              marginLeft: 15,
              width: Dimensions.get("screen").width - 156,
            },
          ]}
        >
          CONTROLE
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
