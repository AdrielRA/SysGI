import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableHighlight,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { Network, Credential, Relatory } from "../../controllers";
import { Button, Itens, Picker, TextInput } from "../../components";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { SwipeListView } from "react-native-swipe-list-view";
import firebase from "../../services/firebase";
import { DropDownPicker } from "../../components";
import axios from "axios";

import { Infrator } from '../../controllers'

function Cadastro({ navigation }) {
  const { connected, alertOffline } = Network.useNetwork();
  const infrator_ = navigation.getParam("Infrator");
  
  const [infratorKey, setInfratorKey] = useState(undefined);
  const [isNew, setIsNew] = useState(true);
  const [fireInfrações, setFireInfrações] = useState({});
  const [favorito, setFavorito] = useState(undefined);
  const [dateNasc, setDateNas] = useState(new Date());
  const [dateInfra, setDateInfra] = useState(new Date());
  const [isSaved, setIsSaved] = useState(false);
  const [estado, setEstado] = useState("");
  const [cidades, setCidades] = useState([]);
  const [ufs, setUfs] = useState([]);
  const [loadRelatorio, setLoadRelatorio] = useState(false);
  const { accessDeniedAlert, haveAccess } = Credential.useCredential();

  useEffect(() => {
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((response) => {
        let responseUfs = response.data.map((uf) => {
          return {
            label: uf.sigla,
            value: uf.sigla,
          };
        });
        setUfs(responseUfs);
      });
  }, []);

  useEffect(() => {
    if (estado != "" || infrator_) {
      axios
        .get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado != "" ? estado : infrator_.Uf}/municipios`
        )
        .then((response) => {
          let responseCities = response.data.map((city) => {
            return {
              label: city.nome,
              value: city.nome,
            };
          });
          setCidades(responseCities);
        });
    }
  }, [estado, infrator_]);

  const [infrator, setInfrator] = useState({
    Nome: "",
    Cpf: "",
    Rg: "",
    Mãe: "",
    MedidaSE: "",
    Logradouro: "",
    Num_residência: "",
    Bairro: "",
    Cidade: "",
    Uf: "",
    Sexo: "",
    Data_nascimento: "",
    Data_registro: moment(new Date()).toISOString(),
    Infrações: [],
  });

  const [infração, setInfração] = useState({
    Descrição: "",
    Reds: "",
    Data_ocorrência: moment(new Date()).toISOString(),
    Data_registro: moment(new Date()).toISOString(),
  });

  useEffect(() => {
    if (infrator_) {
      setInfrator(infrator_);
      setIsNew(false);
      setIsSaved(true);
      setDateNas(
        moment(new Date(infrator_.Data_nascimento)).format("DD/MM/YYYY")
      );

      Infrator.setDataEdit(infrator_.Rg, (key) => {
        setInfratorKey(key);
      })
    }

  }, []);

  useEffect(() => {
    if (infratorKey) {
      Infrator.setDataInfracoes(infratorKey, setFireInfrações, setInfrator, setFavorito);
    }
  }, [infratorKey]);

  const camposOk = (infrator) => {
    let msg = "";
    if (!infrator.Nome || infrator.Nome == "")
      msg = "Nome fornecido é inválido!";
    else if (!infrator.Rg || infrator.Rg == "")
      msg = "RG fornecido é inválido!";
    else if (!infrator.Cpf || infrator.Cpf == "")
      msg = "CPF fornecido é inválido!";
    else if (!infrator.Data_nascimento || infrator.Data_nascimento == "")
      msg = "Data de nascimento fornecida é inválida!";
    else if (!infrator.Sexo || infrator.Sexo == "")
      msg = "Sexo fornecido é inválido!";
    else if (!infrator.Mãe || infrator.Mãe == "")
      msg = "Nome da mãe fornecido é inválido!";
    else if (infrator.MedidaSE === undefined || infrator.MedidaSE === "")
      msg = "Medida socioeducativa não foi definida!";
    else if (!infrator.Logradouro || infrator.Logradouro == "")
      msg = "Logradouro fornecido é inválido!";
    else if (!infrator.Bairro || infrator.Bairro == "")
      msg = "Bairro fornecido é inválido!";
    else if (!infrator.Cidade || infrator.Cidade == "")
      msg = "Cidade fornecida é inválida!";
    else if (!infrator.Uf || infrator.Uf == "")
      msg = "Estado fornecido é inválido!";
    else if (!infrator.Num_residência || infrator.Num_residência == "")
      msg = "Nº de residência fornecido é inválido!";

    if (msg != "") Alert.alert("Verifique os dados:", msg);
    return msg == "";
  };

  const dadosOk = async (infrator) => {
    let res = false;

    let snapshot = await Infrator.getRGInfratorWithKey(infrator.Rg)

    if (snapshot.exists()) {
      Alert.alert(
        "Verifique os dados:",
        "RG fornecido já foi cadastrado em outro infrator!"
      );
      res = false;
    }
    else {
      snapshot = await Infrator.getCPFInfratorWithKey(infrator.Cpf);

      if (snapshot.exists())
        Alert.alert(
          "Verifique os dados:",
          "CPF fornecido já foi cadastrado em outro infrator!"
        );
      res = !snapshot.exists();
    }

    return res;
  };

  const saveInfrator = (infrator) => {
    if (!connected) {
      alertOffline();
      return;
    }

    if (!camposOk(infrator)) {
      return;
    }

    if (isNew) {
      dadosOk(infrator)
        .then((ok) => {
          if (!ok) return;
          else {
            if (haveAccess("AccessToCadastro")) {
              if (!infrator.Data_registro) {
                setInfrator({
                  ...infrator,
                  Data_registro: new Date().toISOString(),
                });
              }

              Infrator
                .saveInfrator(infrator)
                .then((key) => {
                  console.log(key);
                  Alert.alert("Sucesso:", "Infrator salvo!");
                  setInfratorKey(key);
                  setIsNew(false);
                  setIsSaved(true);
                })
                .catch((err) => {
                  Alert.alert("Falha:", "Não foi possivel salvar o infrator!");
                });

            } else accessDeniedAlert();
          }
        });
    }
    else {
      if (haveAccess("AccessToEditar")) {
        Infrator
          .saveDataToEdit(infratorKey, infrator, fireInfrações)
          .then(() => {
            Alert.alert("Sucesso:", "Infrator atualizado!");
          })
          .catch((err) => {
            Alert.alert("Falha:", "Infrator não foi atualizado!");
          });
      } else accessDeniedAlert();
    }
  };

  const saveInfração = () => {
    if (!connected) {
      alertOffline();
      return;
    }

    if (haveAccess("AccessToInfração")) {
      if (infração.Descrição == "") {
        Alert.alert("Atenção:", "Adicione uma descrição primeiro!");
        return;
      }
      if (infração.Reds == "") {
        Alert.alert("Atenção:", "Adicione o Nº REDS primeiro!");
        return;
      }

      Infrator
        .saveInfracao(infratorKey, infração)
        .then(() => {
          setInfração({ ...infração, Descrição: "", Reds: "" });
          Alert.alert("Sucesso:", "Infração adicionada!");
        })
        .catch((err) => {
          Alert.alert("Falha:", "Infração não foi adicionada!");
        });
    } else accessDeniedAlert();
  };

  const excluirInfrator = () => {
    if (!connected) {
      alertOffline();
      return;
    }

    if (haveAccess("AccessToDelete")) {
      Alert.alert(
        "Tem certeza?",
        "Os dados deste infrator serão perdidos para sempre!",
        [
          {
            text: "Não",
            onPress: () => { },
            style: "cancel",
          },
          {
            text: "Sim",
            onPress: () => {
              Infrator
                .deleteInfrator(infratorKey)
                .then(async () => {
                  await removeAnexos("Sucesso:", "Infrator removido!", "", true);
                  setFavorito(false);
                  await removeAllFavorites(infratorKey);
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

  const favoritar = () => {
    if (!connected) {
      alertOffline();
      return;
    }
    setFavorito(!favorito);
  };

  const removeAllFavorites = async (key) => {
    await Infrator.removeAllFavorites(key);
  };

  useEffect(() => {
    if (favorito === undefined) return;

    const favoritos = Infrator.getDataUser();

    if (favorito === null) {
      Infrator.setFavorites(favoritos, setFavorito, infratorKey);
      return;
    }

    if (favorito) {
      Infrator.setBDFavorites(favoritos, infratorKey);
    }
    else {
      Infrator.verificUserToFavoriteInfrator(favoritos, infratorKey);
    }
  }, [favorito]);

  const deleteItem = (item, index) => {
    if (!connected) {
      alertOffline();
      return;
    }
    if (haveAccess("AccessToInfração")) {
      const infracoes = Infrator.getRefInfracoes(infratorKey);

      let query = Infrator.filterInfracaoToUser(infracoes, item.Data_registro);

      Infrator
      .deleteInfracoes(query, infracoes)
      .then(async (infra_key) => {
        await removeAnexos("Sucesso:", "Infração removida!", infra_key, false);
      })
      .catch((err) => {
        Alert.alert("Falha:", "Infração não foi removida!");
      });

    } else accessDeniedAlert();
  };

  const removeAnexos = async (title, msg, infra_key, del_all) => {
    if (del_all) {
      await Infrator
      .removeAllAnexosToInfrator(infratorKey)
      .then(() => {
        deleteRecursiveFiles(infratorKey + "/");
      });
    } else {
        Infrator
        .removeOneAnexoToInfrator(infratorKey, infra_key)
        .then(() => {
          deleteRecursiveFiles(infratorKey + "/" + infra_key);
        });
    }
  };

  const deleteRecursiveFiles = (path) => {
      Infrator
      .createRefFiles(path)
      .then((dir) => {
        dir.items.forEach((fileRef) => {
          deleteFile(ref.fullPath, fileRef.name);
        });
        dir.prefixes.forEach((folderRef) => {
          deleteRecursiveFiles(folderRef.fullPath.replace("anexos/", ""));
        });
      })
      .catch((error) => { });
  };

  const deleteFile = (pathToFile, fileName) => {
     Infrator.deleteOneFile(pathToFile, fileName);
  };

  const NavigationToAttachment = (infração_) => {
    if (isSaved) {
      if (!connected) {
        alertOffline();
        return;
      }
      if (haveAccess("AccessToAnexar"))
        navigation.navigate("Anexo", { item: { ...infração_, infratorKey } });
      else accessDeniedAlert();
    } else {
      Alert.alert("Atenção:", "Salve suas alterações primeiro!");
    }
  };

  const CreatePDF = async () => {
    setLoadRelatorio(true);
    await Print.printToFileAsync({
      html: Relatory.htmlRelatorio(infrator),
      width: 612,
      height: 792,
      base64: false,
    })
      .then(({ uri }) => {
        setLoadRelatorio(false);
        Sharing.shareAsync(uri, {
          dialogTitle: "Abrir seu relatório?",
          mimeType: "application/pdf",
        });
      })
      .catch(() => {
        setLoadRelatorio(false);
        Alert.alert("Falha:", "Não foi possivel gerar o relatório no momento!");
      });
  };

  const medidaItems = [
    { label: "Med.Socioed.", value: "" },
    { label: "SIM", value: true },
    { label: "NÃO", value: false },
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
          height: "100%",
          padding: 20,
        }}
      >
        <ScrollView>
          <View
            style={{
              width: "100%",
              height: 45,
              backgroundColor: "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={[Styles.lblSubtitle, { fontSize: 25, flex: 0.75 }]}>
              CADASTRO DE INFRATOR
            </Text>
          </View>

          <KeyboardAvoidingView style={{ height: "100%" }} behavior={"padding"}>
            <>
              <View
                style={{
                  marginTop: 16,
                  backgroundColor: "#fff",
                  height: 425,
                  marginBottom: 5,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  paddingTop: 5,
                }}
              >
                <Text
                  style={{
                    color: "#800000",
                    fontSize: 18,
                    marginStart: 10,
                    fontFamily: "CenturyGothicBold",
                  }}
                >
                  Informações pessoais
                </Text>

                <TextInput
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
                  onChangeText={(nome) =>
                    setInfrator({ ...infrator, Nome: nome })
                  }
                />

                <View style={{ flexDirection: "row" }}>
                  <TextInput
                    placeholder="RG"
                    returnKeyType="next"
                    type="secondary"
                    style={{ marginEnd: 3 }}
                    value={infrator.Rg}
                    maxLength={13}
                    editable={isNew}
                    keyboardType="number-pad"
                    onChangeText={(rg) => setInfrator({ ...infrator, Rg: rg })}
                    onEndEditing={() => { }}
                  />
                  <TextInput
                    placeholder="CPF"
                    returnKeyType="next"
                    type="secondary"
                    value={infrator.Cpf}
                    maxLength={11}
                    keyboardType="number-pad"
                    onChangeText={(cpf) =>
                      setInfrator({ ...infrator, Cpf: cpf })
                    }
                  />
                </View>

                <View style={{ flexDirection: "row" }}>
                  <DatePicker
                    style={{ marginEnd: 3, marginTop: 8 }}
                    format="DD/MM/YYYY"
                    date={dateNasc}
                    onDateChange={(dateNasc) => {
                      setDateNas(dateNasc);
                      var dt = dateNasc.split("/");
                      setInfrator({
                        ...infrator,
                        Data_nascimento: new Date(
                          `${dt[2]}-${dt[1]}-${dt[0]}T10:00:00`
                        ).toISOString(),
                      });
                    }}
                    customStyles={{
                      dateIcon: {
                        width: 0,
                        height: 0,
                      },
                      dateInput: {
                        borderWidth: 0,
                      },
                      dateTouchBody: {
                        borderRadius: 25,
                        borderColor: "#800000",
                        borderWidth: 1,
                        height: 40,
                      },
                    }}
                  />
                  <TextInput
                    placeholder="Sexo"
                    returnKeyType="next"
                    type="secondary"
                    style={{ flex: 1.5 }}
                    value={infrator.Sexo}
                    maxLength={1}
                    onChangeText={(sexo) => {
                      sexo = sexo.toUpperCase();
                      if (sexo != "M" && sexo != "F" && sexo != "O") {
                        sexo = "";
                      }
                      setInfrator({ ...infrator, Sexo: sexo });
                    }}
                  />
                </View>

                <View style={{ flexDirection: "row", width: "100%" }}>
                  <TextInput
                    placeholder="Nome da Mãe"
                    returnKeyType="next"
                    autoCapitalize="words"
                    autoCompleteType="name"
                    type="secondary"
                    style={{ marginTop: 8, marginEnd: 3.5 }}
                    value={infrator.Mãe}
                    maxLength={60}
                    onChangeText={(mãe) =>
                      setInfrator({ ...infrator, Mãe: mãe })
                    }
                  />
                  <Picker
                    width={120}
                    heigth={40}
                    color={Colors.Secondary.Normal}
                    name="MedidaSE"
                    data={medidaItems}
                    auxData={infrator}
                    setSelected={setInfrator}
                  />
                </View>

                <View style={{ flexDirection: "row" }}>
                  <TextInput
                    placeholder="Logradouro"
                    returnKeyType="next"
                    textContentType="fullStreetAddress"
                    autoCompleteType="street-address"
                    type="secondary"
                    style={{ marginEnd: 3 }}
                    value={infrator.Logradouro}
                    maxLength={120}
                    onChangeText={(logradouro) =>
                      setInfrator({ ...infrator, Logradouro: logradouro })
                    }
                  />
                  <TextInput
                    placeholder="Bairro"
                    returnKeyType="next"
                    autoCapitalize="words"
                    textContentType="sublocality"
                    type="secondary"
                    value={infrator.Bairro}
                    maxLength={60}
                    onChangeText={(bairro) =>
                      setInfrator({ ...infrator, Bairro: bairro })
                    }
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    width: Dimensions.get("window").width - 30,
                  }}
                >
                  <DropDownPicker
                    items={ufs ? ufs : [{}]}
                    placeholder={infrator.Uf != "" ? infrator.Uf : "Uf"}
                    placeholderStyle={{ color: Colors.Secondary.Normal }}
                    onChangeItem={(item) => {
                      setInfrator({ ...infrator, Uf: item.value });
                      setEstado(item.value);
                    }}
                    style={{
                      width: (Dimensions.get("window").width - 30) * 0.25,
                      maxHeight: 40,
                      marginTop: 5,
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
                    placeholder={
                      infrator.Cidade != "" ? infrator.Cidade : "Cidade"
                    }
                    placeholderStyle={{ color: Colors.Secondary.Normal }}
                    onChangeItem={(item, index) => {
                      setInfrator({ ...infrator, Cidade: item.value });
                    }}
                    style={{
                      width: (Dimensions.get("window").width - 30) * 0.45,
                      maxHeight: 40,
                      marginTop: 5,
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

                  <TextInput
                    placeholder="N°"
                    style={{ flex: 0.5, marginTop: 5, width: "20%" }}
                    type="secondary"
                    value={infrator.Num_residência}
                    keyboardType="number-pad"
                    maxLength={10}
                    onChangeText={(numero) =>
                      setInfrator({ ...infrator, Num_residência: numero })
                    }
                  />
                </View>

                <View style={{ flexDirection: "row", alignSelf: "stretch" }}>
                  <Button
                    text="SALVAR"
                    type="normal"
                    style={{
                      paddingHorizontal: isSaved ? "7%" : "36%",
                      marginHorizontal: 0,
                    }}
                    onPress={() => saveInfrator(infrator)}
                  />
                  {isSaved ? (
                    <View style={{ flexDirection: "row" }}>
                      <TouchableHighlight
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
                        onPress={() => favoritar()}
                      >
                        {favorito ? (
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
                      </TouchableHighlight>
                      <TouchableHighlight
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
                        onPress={() => {
                          if (!loadRelatorio) CreatePDF();
                        }}
                      >
                        {loadRelatorio ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Image
                              style={{ height: 20, width: 20 }}
                              source={require("../../assets/images/icon_relatory.png")}
                            ></Image>
                          )}
                      </TouchableHighlight>
                      <TouchableHighlight
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
                        onPress={() => excluirInfrator()}
                      >
                        <Image
                          style={{ height: 20, width: 20 }}
                          source={require("../../assets/images/icon_lixeira_white.png")}
                        ></Image>
                      </TouchableHighlight>
                    </View>
                  ) : (
                      <></>
                    )}
                </View>
              </View>

              {isSaved ? (
                <View
                  style={{
                    width: "100%",
                    height: 220,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    padding: 10,
                    marginTop: 8,
                  }}
                >
                  <View style={{ height: 40 }}>
                    <TextInput
                      placeholder="Infração"
                      type="secondary"
                      style={{ borderRadius: 25, paddingTop: 8, marginTop: 0 }}
                      multiline={true}
                      value={infração.Descrição}
                      textAlignVertical="top"
                      onChangeText={(descrição) =>
                        setInfração({ ...infração, Descrição: descrição })
                      }
                    />
                  </View>
                  <View style={{ height: 40, marginTop: 5 }}>
                    <TextInput
                      placeholder="REDS"
                      style={{ borderRadius: 25, paddingTop: 8, marginTop: 0 }}
                      type="secondary"
                      value={infração.Reds}
                      onChangeText={(reds) =>
                        setInfração({ ...infração, Reds: reds })
                      }
                    />
                  </View>
                  <View
                    style={{ flexDirection: "row", justifyContent: "center" }}
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      style={{ flex: 1, marginEnd: 3, marginTop: 7 }}
                      date={dateInfra}
                      onDateChange={(dataOcorrencia) => {
                        setDateInfra(dataOcorrencia);
                        var dt = dataOcorrencia.split("/");
                        setInfração({
                          ...infração,
                          Data_ocorrência: new Date(
                            `${dt[2]}-${dt[1]}-${dt[0]}T10:00:00`
                          ).toISOString(),
                        });
                      }}
                      customStyles={{
                        dateIcon: {
                          width: 0,
                          height: 0,
                        },
                        dateInput: {
                          borderWidth: 0,
                        },
                        dateTouchBody: {
                          borderRadius: 25,
                          borderColor: "#DCDCDC",
                          borderWidth: 1,
                          height: 39,
                        },
                      }}
                    />
                    <Button
                      text="ADICIONAR"
                      type="normal"
                      style={{
                        marginHorizontal: 0,
                        maxHeight: 40,
                        minWidth: 100,
                      }}
                      textStyle={{ fontSize: 13 }}
                      onPress={() => {
                        let infra = infração;
                        infra.Data_registro = new Date().toISOString();
                        setInfração(infra);
                        saveInfração();
                      }}
                    />
                  </View>
                  <View
                    style={{
                      alignSelf: "stretch",
                      borderWidth: 1,
                      borderRadius: 25,
                      borderColor: "#DCDCDC",
                      height: 60,
                      padding: 10,
                    }}
                  >
                    <ScrollView style={{ height: 60, borderRadius: 15 }}>
                      <SwipeListView
                        data={infrator.Infrações}
                        renderItem={({ item }) => (
                          <Itens.Infração.idle
                            data={item}
                            onLongPress={() => {
                              NavigationToAttachment(item);
                            }}
                          />
                        )}
                        renderHiddenItem={({ item, index }) => (
                          <Itens.Infração.swipe
                            onDelete={() => {
                              deleteItem(item, index);
                            }}
                          />
                        )}
                        leftOpenValue={30}
                        disableLeftSwipe={true}
                      />
                    </ScrollView>
                  </View>
                </View>
              ) : (
                  <></>
                )}
            </>
          </KeyboardAvoidingView>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
export default Cadastro;
