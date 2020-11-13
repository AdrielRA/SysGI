import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
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
import { Button, Itens, Picker, TextInput, Datepicker } from "../../components";
import { useContext } from "../../context";
import { FlatList } from "react-native-gesture-handler";
import { validator } from "../../utils";
import { Infração } from "../../models";

export default ({ navigation }) => {
  const [idInfrator, setIdInfrator] = useState(
    navigation.getParam("idInfrator")
  );
  const [infracoes, setInfracoes] = useState([]);
  const [infracao, setInfracao] = useState(navigation.getParam("infracao"));
  const dateState = Datepicker.useDatepickerState();
  const { accessDeniedAlert, haveAccess } = Credential;
  const { connected, alertOffline } = Network.useNetwork();
  const { credential } = useContext();
  const [refs, setRefs] = useState({
    Reds: useRef(),
  });

  useEffect(() => {
    if (!!infracao) {
      dateState.onSelect(new Date(infracao.Data_ocorrência));
    }
  }, []);

  useEffect(() => {
    if (!!dateState.date) updateInfracao({ Data_ocorrência: dateState.date });
  }, [dateState.date]);

  const updateListInfracoes = () => {
    Infracao.getInfracoesByIdInfrator(idInfrator).then(setInfracoes);
  };

  const updateInfracao = (property) =>
    setInfracao({ ...infracao, ...property });

  const handleSaveInfracao = () => {
    if (!connected) {
      alertOffline();
      return;
    }
    if (haveAccess(credential, "AccessToInfração")) {
      const emptyEntries = validator.getEmptyEntries(infracao);
      if (emptyEntries.length > 0) {
        Alert.alert("Atenção:", "Existem campos sem preencher");
      } else {
        const id = infracao.id;
        delete infracao.id;
        infracao.Data_alteracao = new Date().toISOString();
        Infracao.updateInfracao(idInfrator, id, infracao).then(() => {
          Alert.alert("Sucesso:", "Infração atualizada!");
          navigation.goBack();
        });
      }
    } else accessDeniedAlert();
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
          INFRAÇÃO
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
          Editar informações:
        </Text>
        <TextInput
          placeholder="Infração"
          type="secondary"
          returnKeyType="next"
          value={infracao.Descrição}
          onChangeText={(Descrição) => updateInfracao({ Descrição })}
          onSubmitEditing={() => refs.Reds.current.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          Ref={refs.Reds}
          placeholder="REDS"
          returnKeyType="next"
          value={infracao.Reds}
          type="secondary"
          onChangeText={(Reds) => updateInfracao({ Reds })}
        />
        <Datepicker.Element
          placeholder="Data da ocorrência"
          onStateChange={dateState}
        />
        <TextInput
          placeholder="Observações"
          type="secondary"
          multiline={true}
          value={infracao.Observações}
          onChangeText={(Observações) => updateInfracao({ Observações })}
        />
        <Button text="SALVAR" type="normal" onPress={handleSaveInfracao} />
      </View>
    </SafeAreaView>
  );
};
