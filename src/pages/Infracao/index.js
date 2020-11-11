import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import {
  Credential,
  Infrator,
  Infracao,
  Network,
  Relatory,
} from "../../controllers";
import { Button, Itens, Picker, TextInput } from "../../components";
import { useContext } from "../../context";
import { FlatList } from "react-native-gesture-handler";

export default ({ navigation }) => {
  const [idInfrator, setIdInfrator] = useState(
    navigation.getParam("idInfrator")
  );

  const [infracoes, setInfracoes] = useState([]);

  useEffect(() => {
    if (!!idInfrator) {
      Infracao.getInfracoesByIdInfrator(idInfrator).then(setInfracoes);
    }
  }, [idInfrator]);

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
          paddingLeft: 15,
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
        <Text style={[Styles.txtBoldWhite, { fontSize: 25, marginLeft: 15 }]}>
          INFRAÇÕES
        </Text>
      </LinearGradient>
      <View
        style={{
          width: Dimensions.get("screen").width - 30,
          height: 320,
          backgroundColor: "#fff",
          marginVertical: 10,
          borderRadius: 10,
          padding: 10,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: "CenturyGothicBold",
            color: Colors.Secondary.Normal,
          }}
        >
          Cadastrar infração:
        </Text>
        <TextInput
          placeholder="Infração"
          type="secondary"
          autoFocus={true}
          onChangeText={(infra) => {}}
        />
        <TextInput
          placeholder="REDS"
          returnKeyType="next"
          type="secondary"
          onChangeText={(reds) => {}}
        />
        <TextInput
          placeholder="Observações"
          type="secondary"
          multiline={true}
          onChangeText={(obs) => {}}
        />
        <Button text="ADICIONAR" type="normal" onPress={() => {}} />
      </View>
      <FlatList
        style={{
          width: Dimensions.get("screen").width - 30,
          marginHorizontal: 15,
          marginBottom: 15,
        }}
        data={infracoes}
        keyExtractor={(item) => item.value}
        renderItem={({ item, i }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15,
              paddingVertical: 10,
              marginBottom: 7,
              backgroundColor: "#fff",
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <Text style={[Styles.txtBold, { color: Colors.Secondary.Normal }]}>
              {!!item.Reds ? item.Reds : item}
            </Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TouchableOpacity onPress={() => {}}>
                <Image
                  source={require("../../assets/images/edit-icon.png")}
                  style={{ width: 30, height: 30, marginRight: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Image
                  source={require("../../assets/images/goTo.png")}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        nestedScrollEnabled={true}
      />
    </SafeAreaView>
  );
};
