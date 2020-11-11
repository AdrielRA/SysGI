import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  LogBox,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { Credential, Infrator, Network, Relatory } from "../../controllers";
import {
  Button,
  Itens,
  Picker,
  TextInput,
  DropDownPicker,
  Datepicker,
} from "../../components";
import { useContext } from "../../context";
import { ScrollView } from "react-native-gesture-handler";
import { getCidades, getEstados } from "../../services/ibge";

LogBox.ignoreLogs(["YellowBox"]);

export default ({ navigation }) => {
  const [infrator, setInfrator] = useState({});
  const [infratorFromRoute, setinfratorFromRoute] = useState(
    navigation.getParam("Infrator")
  );
  const [status, setStatus] = useState("new");
  const [loadRelatorio, setLoadRelatorio] = useState(false);
  const [cidades, setCidades] = useState([]);
  const [estado, setEstado] = useState("");
  const [ufs, setUfs] = useState([]);
  const dateState = Datepicker.useDatepickerState();
  const { accessDeniedAlert, haveAccess } = Credential;
  const { connected, alertOffline } = Network.useNetwork();
  const { credential, user } = useContext();
  const [isFavorite, setIsFavorite] = useState();
  const [refs, setRefs] = useState({
    Nome: useRef(),
    Processo: useRef(),
    Rg: useRef(),
    Cpf: useRef(),
    Logradouro: useRef(),
    Num: useRef(),
    Bairro: useRef(),
  });

  //setFavorito(favs.includes(infratorKey.toString()));

  useEffect(() => {
    getEstados().then(setUfs);
  }, []);
  useEffect(() => {
    getCidades(estado).then(setCidades);
  }, [estado]);
  useEffect(() => {
    if (!!dateState.date) updateInfrator({ Data_nascimento: dateState.date });
  }, [dateState.date]);

  useEffect(() => {
    if (!!infratorFromRoute) {
      setInfrator(infratorFromRoute);
      dateState.onSelect(new Date(infratorFromRoute.Data_nascimento));
      setEstado(infratorFromRoute.Uf);
      Infrator.isFavorite(user.uid, infratorFromRoute.id).then(setIsFavorite);
      setStatus("saved");
    }
  }, [infratorFromRoute]);

  const updateInfrator = (property) =>
    setInfrator({ ...infrator, ...property });

  const handleSave = () => {
    if (!connected) {
      alertOffline();
      return;
    }

    switch (status) {
      case "new":
        if (haveAccess(credential, "AccessToCadastro")) {
          Infrator.validate(infrator)
            .then(() => {
              addInfrator(infrator);
            })
            .catch((err) => Alert.alert("Falha:", err));
        } else accessDeniedAlert();
        break;
      case "saved":
        if (haveAccess(credential, "AccessToEditar")) {
          if (haveAccess(credential, "AccessToCadastro")) saveChanges(infrator);
        } else accessDeniedAlert();
        break;

      default:
        break;
    }
  };

  const addInfrator = (infrator) => {
    updateInfrator({ Data_registro: new Date().toISOString() });
    Infrator.addInfrator(infrator)
      .then((id) => {
        updateInfrator({ id });
        Alert.alert("Sucesso:", "Infrator salvo!");
        setStatus("saved");
      })
      .catch(() => {
        Alert.alert("Falha:", "Não foi possivel salvar o infrator!");
      });
  };

  const saveChanges = (infrator) => {
    updateInfrator({ Data_alteracao: new Date().toISOString() });
    let id = infrator.id;
    delete infrator.id;
    Infrator.updateInfrator(id, infrator)
      .then(() => {
        Alert.alert("Sucesso:", "Infrator atualizado!");
        setStatus("saved");
      })
      .catch(() => {
        Alert.alert("Falha:", "Não foi possível atualizar o infrator!");
      });
  };

  const handleFavorite = () => {
    Infrator.isFavorite(user.uid, infrator.id).then((isFav) => {
      if (!isFav)
        Infrator.addFavorite(user.uid, infrator.id).then(() =>
          setIsFavorite(true)
        );
      else
        Infrator.remFavorite(user.uid, infrator.id).then(() =>
          setIsFavorite(false)
        );
    });
  };

  const handleRelatorio = () => {
    if (!loadRelatorio) {
      setLoadRelatorio(true);
      Relatory.createRelatorio(infrator).then(setLoadRelatorio);
    }
  };

  const handleDelete = () => {
    if (!connected) {
      alertOffline();
      return;
    }
    if (haveAccess(credential, "AccessToDelete")) {
      Alert.alert(
        "Tem certeza?",
        "Os dados deste infrator serão perdidos para sempre!",
        [
          {
            text: "Não",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Sim",
            onPress: () => {
              Infrator.remInfrator(infrator.id)
                .then(() => {
                  /*
                  await removeAnexos(
                    "Sucesso:",
                    "Infrator removido!",
                    "",
                    true
                  );
                  setFavorito(false);
                  await removeAllFavorites(infratorKey);*/
                })
                .catch((err) => {
                  Alert.alert("Falha:", "Infrator não foi removido!");
                });
            },
          },
        ],
        { cancelable: false }
      );
    } else accessDeniedAlert();
  };

  const sexoItens = [
    { label: "Masculino", value: "M" },
    { label: "Feminino", value: "F" },
    { label: "Outro", value: "O" },
  ];

  const medidaItens = [
    { label: "Cumpre Medida Socioeducativa", value: true },
    { label: "Não Cumpre M. Socioeducativa", value: false },
  ];

  return (
    <SafeAreaView style={Styles.page}>
      <LinearGradient
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 1, y: 1.0 }}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal, Colors.Terciary.Normal]}
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            height: 60,
            paddingLeft: 15,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => {}}>
            <Image
              source={require("../../assets/images/back.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <Text style={[Styles.txtBoldWhite, { fontSize: 25, marginLeft: 15 }]}>
            CADASTRO
          </Text>
        </View>
        <View
          style={{
            width: Dimensions.get("screen").width - 30,
            flex: 1,
            backgroundColor: "#fff",
            marginBottom: 15,
            borderRadius: 10,
            padding: 10,
          }}
        >
          <ScrollView>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "CenturyGothicBold",
                color: Colors.Secondary.Normal,
              }}
            >
              Dados do infrator:
            </Text>
            <TextInput
              Ref={refs.Nome}
              style={{ marginBottom: 0 }}
              placeholder="Nome"
              autoCapitalize="words"
              textContentType="name"
              keyboardType="name-phone-pad"
              returnKeyType="next"
              autoCompleteType="name"
              type="secondary"
              value={infrator.Nome}
              autoFocus={true}
              maxLength={60}
              onChangeText={(Nome) => updateInfrator({ Nome })}
              onSubmitEditing={() => refs.Processo.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              Ref={refs.Processo}
              style={{ marginBottom: 0 }}
              placeholder="Nº Processo"
              keyboardType="number-pad"
              returnKeyType="next"
              autoCompleteType="name"
              type="secondary"
              value={infrator.Processo}
              onChangeText={(Processo) => updateInfrator({ Processo })}
              onSubmitEditing={() => refs.Rg.current.focus()}
              blurOnSubmit={false}
            />
            <View style={{ flexDirection: "row" }}>
              <TextInput
                Ref={refs.Rg}
                placeholder="RG"
                returnKeyType="next"
                type="secondary"
                style={{ marginEnd: 3 }}
                value={infrator.Rg}
                maxLength={13}
                keyboardType="number-pad"
                onChangeText={(Rg) => updateInfrator({ Rg })}
                onSubmitEditing={() => refs.Cpf.current.focus()}
                blurOnSubmit={false}
              />
              <TextInput
                placeholder="CPF"
                returnKeyType="next"
                type="secondary"
                value={infrator.Cpf}
                maxLength={11}
                keyboardType="number-pad"
                onChangeText={(Cpf) => updateInfrator({ Cpf })}
                Ref={refs.Cpf}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Datepicker.Element onStateChange={dateState} />
              <Picker
                width={152}
                heigth={40}
                color={Colors.Secondary.Normal}
                name="Sexo"
                defaultValue={infrator.Sexo}
                data={sexoItens}
                setSelected={({ value }) => updateInfrator({ Sexo: value })}
              />
            </View>

            <TextInput
              placeholder="Nome da Mãe"
              returnKeyType="next"
              autoCapitalize="words"
              autoCompleteType="name"
              type="secondary"
              style={{ marginTop: 8, marginEnd: 3.5 }}
              value={infrator.Mãe}
              maxLength={60}
              onChangeText={(Mãe) => updateInfrator({ Mãe })}
            />
            <View style={{ flexDirection: "row", height: 40 }}>
              <Picker
                width={307}
                heigth={40}
                color={Colors.Secondary.Normal}
                name="Medida Socioeducativa"
                data={medidaItens}
                defaultValue={infrator.MedidaSE}
                setSelected={({ value }) => updateInfrator({ MedidaSE: value })}
              />
            </View>
            <TextInput
              style={{
                marginBottom: 0,
              }}
              placeholder="Logradouro"
              returnKeyType="next"
              textContentType="fullStreetAddress"
              autoCompleteType="street-address"
              type="secondary"
              value={infrator.Logradouro}
              maxLength={120}
              onChangeText={(Logradouro) => updateInfrator({ Logradouro })}
              Ref={refs.Logradouro}
              onSubmitEditing={() => refs.Num.current.focus()}
              blurOnSubmit={false}
            />
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TextInput
                placeholder="N°"
                style={{ maxWidth: 99, marginEnd: 3 }}
                type="secondary"
                value={infrator.Num_residência}
                keyboardType="number-pad"
                maxLength={10}
                onChangeText={(Num_residência) =>
                  updateInfrator({ Num_residência })
                }
                Ref={refs.Num}
                returnKeyType="next"
                onSubmitEditing={() => refs.Bairro.current.focus()}
                blurOnSubmit={false}
              />
              <TextInput
                placeholder="Bairro"
                returnKeyType="next"
                autoCapitalize="words"
                textContentType="sublocality"
                type="secondary"
                value={infrator.Bairro}
                maxLength={60}
                onChangeText={(Bairro) => updateInfrator({ Bairro })}
                Ref={refs.Bairro}
                returnKeyType="next"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
              }}
            >
              <DropDownPicker
                items={ufs ? ufs : [{}]}
                placeholder={!!infrator.Uf ? infrator.Uf : "Uf"}
                placeholderStyle={{ color: Colors.Secondary.Normal }}
                onChangeItem={(item) => {
                  updateInfrator({ Uf: item.value });
                  setEstado(item.value);
                }}
                style={{
                  width: 100,
                  maxHeight: 40,
                  marginRight: 3,
                  borderColor: Colors.Secondary.Normal,
                  backgroundColor: "transparent",
                  borderTopLeftRadius: 25,
                  borderTopRightRadius: 25,
                  borderBottomLeftRadius: 25,
                  borderBottomRightRadius: 25,
                }}
                labelStyle={{
                  fontFamily: "CenturyGothic",
                  color: Colors.Secondary.Normal,
                }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{ borderColor: Colors.Secondary.Normal }}
                arrowColor={Colors.Secondary.Normal}
              />

              <DropDownPicker
                items={cidades ? cidades : [{}]}
                placeholder={!!infrator.Cidade ? infrator.Cidade : "Cidade"}
                placeholderStyle={{ color: Colors.Secondary.Normal }}
                onChangeItem={(item) => {
                  updateInfrator({ Cidade: item.value });
                }}
                style={{
                  width: (Dimensions.get("window").width - 35) * 0.63,
                  maxHeight: 40,
                  borderColor: Colors.Secondary.Normal,
                  backgroundColor: "transparent",
                  borderTopLeftRadius: 25,
                  borderTopRightRadius: 25,
                  borderBottomLeftRadius: 25,
                  borderBottomRightRadius: 25,
                }}
                labelStyle={{
                  fontFamily: "CenturyGothic",
                  color: Colors.Secondary.Normal,
                }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{ borderColor: Colors.Secondary.Normal }}
                arrowColor={Colors.Secondary.Normal}
              />
            </View>
            <Button
              style={{ marginTop: 15 }}
              text="SALVAR"
              type="normal"
              onPress={handleSave}
            />
            {status === "saved" && (
              <View style={{ flexDirection: "row" }}>
                <Button
                  style={{ width: status === "saved" ? "46%" : "100%" }}
                  text="INFRAÇÕES"
                  type="normal"
                  onPress={() => {
                    navigation.push("Infracao", { idInfrator: infrator.id });
                  }}
                />
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={[
                      Styles.btnSecundary,
                      {
                        backgroundColor: "#800",
                        marginHorizontal: 5,
                        justifyContent: "center",
                        paddingHorizontal: 15,
                      },
                    ]}
                    underlayColor={Colors.Primary.Normal}
                    onPress={handleFavorite}
                  >
                    {isFavorite ? (
                      <Image
                        style={{ height: 20, width: 20 }}
                        source={require("../../assets/images/icon_favorite_on.png")}
                      ></Image>
                    ) : (
                      <Image
                        style={{ height: 20, width: 20 }}
                        source={require("../../assets/images/icon_favorite_off.png")}
                      ></Image>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      Styles.btnSecundary,
                      {
                        backgroundColor: "#800",
                        marginHorizontal: 0,
                        justifyContent: "center",
                        paddingHorizontal: 15,
                      },
                    ]}
                    underlayColor={Colors.Primary.Normal}
                    onPress={handleRelatorio}
                  >
                    {loadRelatorio ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Image
                        style={{ height: 20, width: 20 }}
                        source={require("../../assets/images/icon_relatory.png")}
                      ></Image>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      Styles.btnSecundary,
                      {
                        backgroundColor: "#800",
                        marginHorizontal: 5,
                        justifyContent: "center",
                        paddingHorizontal: 15,
                      },
                    ]}
                    underlayColor={Colors.Primary.Normal}
                    onPress={handleDelete}
                  >
                    <Image
                      style={{ height: 20, width: 20 }}
                      source={require("../../assets/images/icon_lixeira_white.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};
