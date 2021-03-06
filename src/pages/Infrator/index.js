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
  NewPicker,
  TextInput,
  Datepicker,
} from "../../components";
import { useUserContext } from "../../context";
import { ScrollView } from "react-native-gesture-handler";
import { getCidades, getEstados } from "../../services/ibge";
import { validator, getComarcas } from "../../utils";
import { Infrator as Model } from "../../models";
import { NavigationEvents } from "react-navigation";
import { mask } from "../../utils";

LogBox.ignoreLogs(["YellowBox"]);

export default ({ navigation }) => {
  const [infrator, setInfrator] = useState(new Model());
  const [infratorFromFirebase, setInfratorFromFirebase] = useState({});
  const [infratorFromRoute, setinfratorFromRoute] = useState(
    navigation.getParam("Infrator")
  );
  const [status, setStatus] = useState("new");
  const [loadRelatorio, setLoadRelatorio] = useState(false);
  const [cidades, setCidades] = useState([]);
  const [estado, setEstado] = useState("");
  const [processo, setProcesso] = useState("");
  const [ufs, setUfs] = useState([]);
  const dateState = Datepicker.useDatepickerState();
  const { accessDeniedAlert, haveAccess } = Credential;
  const { connected, alertOffline } = Network.useNetwork();
  const { userData, user } = useUserContext();
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
  const [comarcas, setComarcas] = useState([]);

  useEffect(() => {
    getEstados().then(setUfs);
  }, []);
  useEffect(() => {
    updateInfrator({ Cidade: undefined });
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

  useEffect(() => {
    if (!!infrator.id) Infrator.listenInfrator(infrator.id, handleListener);
    else Infrator.clearListener();
  }, [infrator.id]);

  useEffect(() => {
    if (!!infratorFromFirebase) {
      if (!!infratorFromFirebase.id) {
        let changedDate = dateIsChanged(
          infratorFromFirebase.Data_nascimento,
          infrator.Data_nascimento
        );

        const changes = validator.haveChanges(infratorFromFirebase, infrator, [
          "Infrações",
          "Data_nascimento",
        ]);

        if (changedDate || changes.length > 0) {
          Alert.alert(
            "Atenção:",
            "Os dados foram atualizados!\nDeseja recarregar?",
            [
              {
                text: "Não",
                onPress: () => {
                  navigation.goBack();
                },
                style: "cancel",
              },
              {
                text: "Sim",
                onPress: () => {
                  setInfrator(infratorFromFirebase);
                  if (!!infratorFromFirebase.Data_nascimento)
                    dateState.onSelect(
                      new Date(infratorFromFirebase.Data_nascimento)
                    );
                },
              },
            ],
            { cancelable: false }
          );
        }
      }
    } else {
      Alert.alert(
        "Atenção:",
        "Os dados deste infrator foram removidos!",
        [
          {
            text: "Ok",
            onPress: () => navigation.goBack(),
          },
        ],
        { cancelable: false }
      );
    }
  }, [infratorFromFirebase]);

  useEffect(() => {
    getComarcas().then((comarcas) => setComarcas(comarcas));
  }, []);

  const dateIsChanged = (date1, date2) => {
    const dt1 = new Date(date1);
    const dt2 = new Date(date2);
    return (
      dt1.getFullYear() !== dt2.getFullYear() ||
      dt1.getMonth() !== dt2.getMonth() ||
      dt1.getDay() !== dt2.getDay()
    );
  };

  const handleAddProcesso = () => {
    if (!!processo) {
      const Processos = infrator.Processos || [];
      if (!Processos.includes(processo)) Processos.push(processo);
      updateInfrator({ Processos });
      setProcesso("");
    }
  };

  const handleRemProcesso = (index) => {
    const Processos = infrator.Processos.filter((_, i) => i !== index);
    updateInfrator({ Processos });
  };

  const handleListener = (snap) => {
    setInfratorFromFirebase(snap);
  };

  const updateInfrator = (property) =>
    setInfrator({ ...infrator, ...property });

  const handleSave = () => {
    if (!connected) {
      alertOffline();
      return;
    }
    const emptyEntries = validator.getEmptyEntries(infrator, [
      "Rg",
      "Cpf",
      "Logradouro",
      "Num_residência",
      "Bairro",
      "Cidade",
      "Comarca",
      "Uf",
      "Processos",
    ]);

    switch (status) {
      case "new":
        if (haveAccess(userData.Credencial, "AccessToCadastro")) {
          if (emptyEntries.length > 0) {
            Alert.alert("Atenção:", "Existem campos sem preencher");
          } else {
            Infrator.validate(infrator)
              .then(() => {
                addInfrator(infrator);
              })
              .catch((err) => Alert.alert("Falha:", err));
          }
        } else accessDeniedAlert();
        break;
      case "saved":
        if (haveAccess(userData.Credencial, "AccessToEditar")) {
          if (emptyEntries.length > 0) {
            Alert.alert("Atenção:", "Existem campos sem preencher");
          } else {
            saveChanges(infrator);
          }
        } else accessDeniedAlert();
        break;

      default:
        break;
    }
  };

  const addInfrator = (infrator) => {
    let Data_registro = new Date().toISOString();
    updateInfrator({ Data_registro });
    Infrator.addInfrator({
      ...infrator,
      Data_registro,
    })
      .then((id) => {
        updateInfrator({ id });
        Alert.alert("Sucesso:", "Infrator salvo!");
        setStatus("saved");
      })
      .catch(() => {
        Alert.alert("Falha:", "Não foi possível salvar o infrator!");
      });
  };

  const saveChanges = (changes) => {
    let changedDate = dateIsChanged(
      infratorFromFirebase.Data_nascimento,
      changes.Data_nascimento
    );

    const changed = validator.haveChanges(infratorFromFirebase, changes, [
      "Infrações",
      "Data_nascimento",
    ]);

    if (!changedDate && changed.length === 0) {
      Alert.alert(
        "Atenção:",
        "Infrator já esta atualizado!",
        [
          {
            text: "Ok",
            onPress: () => setStatus("saved"),
          },
        ],
        { cancelable: false }
      );
    } else {
      let Data_alteracao = new Date().toISOString();
      updateInfrator({ Data_alteracao });
      let id = changes.id;
      delete changes.id;
      delete changes.Infrações;
      Infrator.updateInfrator(id, {
        ...changes,
        Data_alteracao,
      })
        .then(() => {
          Alert.alert("Sucesso:", "Infrator atualizado!");
          setStatus("saved");
        })
        .catch(() => {
          Alert.alert("Falha:", "Não foi possível atualizar o infrator!");
        });
    }
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
    if (haveAccess(userData.Credencial, "AccessToDelete")) {
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
              Infrator.remInfrator(infrator.id, user.uid)
                .then(() => {
                  setInfrator(new Model());
                  dateState.onSelect(null);
                  setStatus("new");
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
      <NavigationEvents
        onDidBlur={(payload) => !payload.lastState && Infrator.clearListener()}
      />
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
            paddingTop: 5,
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
                value={mask.RG(infrator.Rg)}
                maxLength={13}
                keyboardType="number-pad"
                onChangeText={(Rg) => updateInfrator({ Rg: mask.Numeric(Rg) })}
                onSubmitEditing={() => refs.Cpf.current.focus()}
                blurOnSubmit={false}
              />
              <TextInput
                placeholder="CPF"
                returnKeyType="next"
                type="secondary"
                value={mask.CPF(infrator.Cpf)}
                maxLength={14}
                keyboardType="number-pad"
                onChangeText={(Cpf) =>
                  updateInfrator({ Cpf: mask.Numeric(Cpf) })
                }
                Ref={refs.Cpf}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Datepicker.Element
                placeholder="Nascimento"
                onStateChange={dateState}
              />
              <NewPicker
                placeholder="Sexo"
                data={sexoItens}
                value={infrator.Sexo}
                onSelect={(Sexo) => updateInfrator({ Sexo })}
              />
            </View>

            <TextInput
              placeholder="Nome da Mãe"
              returnKeyType="next"
              autoCapitalize="words"
              autoCompleteType="name"
              type="secondary"
              style={{ marginTop: 8, marginBottom: 0 }}
              value={infrator.Mãe}
              maxLength={60}
              onSubmitEditing={() => refs.Logradouro.current.focus()}
              onChangeText={(Mãe) => updateInfrator({ Mãe })}
            />
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
              <NewPicker
                style={{ marginRight: 3, maxWidth: 100 }}
                placeholder="UF"
                data={ufs ? ufs : [{}]}
                value={infrator.Uf}
                onSelect={(Uf) => {
                  updateInfrator({ Uf });
                  setEstado(Uf);
                }}
              />
              <NewPicker
                placeholder="Cidade"
                data={cidades ? cidades : [{}]}
                value={infrator.Cidade}
                onSelect={(Cidade) => updateInfrator({ Cidade })}
              />
            </View>
            <NewPicker
              placeholder="Medida Socioeducativa"
              style={{ marginTop: 7.5 }}
              data={medidaItens}
              value={infrator.MedidaSE}
              onSelect={(MedidaSE) => updateInfrator({ MedidaSE })}
            />
            <NewPicker
              placeholder="Comarca"
              style={{ marginTop: 7.5 }}
              data={comarcas}
              value={infrator?.Comarca}
              onSelect={(Comarca) => updateInfrator({ Comarca })}
            />
            <Text
              style={{
                fontSize: 18,
                fontFamily: "CenturyGothicBold",
                color: Colors.Secondary.Normal,
              }}
            >
              Processos:
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextInput
                Ref={refs.Processo}
                placeholder="Nº Processo"
                keyboardType="number-pad"
                returnKeyType="next"
                autoCompleteType="name"
                type="secondary"
                value={processo}
                onChangeText={(processo) => setProcesso(processo)}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: Colors.Secondary.Normal,
                  borderRadius: 20,
                  marginHorizontal: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 3,
                }}
                underlayColor={Colors.Primary.Normal}
                onPress={handleAddProcesso}
              >
                <Text
                  style={{
                    fontSize: 30,
                    fontFamily: "CenturyGothicBold",
                    color: "#fff",
                    textAlign: "center",
                  }}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
            {infrator.Processos &&
              infrator.Processos.map((proc, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderStyle: "solid",
                    borderBottomColor: "#f1f1f1",
                    borderBottomWidth: 1,
                    justifyContent: "space-between",
                    paddingLeft: 15,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "CenturyGothic",
                      color: Colors.Secondary.Normal,
                      maxWidth: "80%",
                    }}
                    numberOfLines={1}
                  >
                    {proc}
                  </Text>
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginHorizontal: 5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => handleRemProcesso(i)}
                  >
                    <Image
                      style={{ height: 15, width: 15 }}
                      source={require("../../assets/images/icon_lixeira_cor.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
          <View
            style={{
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 5,
              paddingTop: 5,
              backgroundColor: "#fff",
              justifyContent: "center",
            }}
          >
            <Button text="SALVAR" type="normal" onPress={handleSave} />
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
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};
