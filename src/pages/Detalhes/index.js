import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  View,
  Image,
  Alert,
  Linking,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import moment from "moment";
import { Anexo, Credential, Network, Infracao } from "../../controllers";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Itens } from "../../components";
import { useContext, useUploadContext } from "../../context";
import { NavigationEvents } from "react-navigation";

export default ({ navigation }) => {
  const idInfracao = navigation.getParam("idInfracao");
  const idInfrator = navigation.getParam("idInfrator");
  const [infracao, setInfracao] = useState({});
  const [nomeAnexo, setNomeAnexo] = useState("");
  const [showDialogNovoNome, setShowDiagNomeAnexo] = useState(false);
  const { accessDeniedAlert, haveAccess } = Credential;
  const { connected, alertOffline } = Network.useNetwork();
  const { credential } = useContext();
  const { uploads } = useUploadContext();
  const [lista, setLista] = useState([]);
  const [anexos, setAnexos] = useState([]);

  useEffect(() => {
    Infracao.listenOne(idInfrator, idInfracao, handleListener);
    Anexo.listenAnexos(idInfrator, idInfracao, setAnexos);
  }, []);

  useEffect(() => {
    setLista([
      ...uploads.queue.filter((u) => u.idInfracao === idInfracao),
      ...anexos,
    ]);
  }, [uploads.queue, anexos]);

  const handleListener = (infracao) => {
    if (!infracao) {
      Alert.alert("Atenção:", "A infração foi removida!");
      navigation.goBack();
    } else setInfracao(infracao);
  };

  const handleClearListeners = () => {
    Anexo.clearListener();
    Infracao.clearListener();
  };

  const handleAddAnexo = async () => {
    if (!connected) {
      alertOffline();
      return;
    }
    if (haveAccess(credential, "AccessToAnexar")) {
      Anexo.openAnexo("application/pdf").then((file) => {
        Anexo.addAnexo(
          Anexo.formatMetadata(file),
          idInfrator,
          idInfracao,
          uploads.upload
        );
      });
    } else accessDeniedAlert();
  };

  /*const changeNomeAnexo = (anexo) => {
    let fileName = anexo.name.toString();
    setNomeAnexo(fileName);
    Alert.alert(
      "Opção:",
      "Deseja alterar o nome do anexo?",
      [
        {
          text: "Não",
          onPress: () => {
            addAnexo(fileName);
          },
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => {
            setShowDiagNomeAnexo(true);
          },
        },
      ],
      { cancelable: false }
    );
  };*/

  const handleRemoveAnexo = (key) => {
    if (!connected) {
      alertOffline();
      return;
    }

    Anexo.remAnexo(idInfrator, idInfracao, key);
  };

  const openAnexo = (url) => {
    try {
      Linking.openURL(url);
    } catch {
      Alert.alert("Falha no anexo:", "Não foi possível abri-lo no momento!");
    }
  };

  const handleRename = (key, name) => {
    Anexo.renameAnexo(name, idInfrator, idInfracao, key);
  };

  return (
    <SafeAreaView style={Styles.page}>
      <NavigationEvents
        onDidBlur={(payload) => !payload.lastState && handleClearListeners()}
      />
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
          justifyContent: "space-between",
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
          DETALHES
        </Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.push("EditeInfracao", {
                infracao,
                idInfrator,
              });
            }}
          >
            <Image
              source={require("../../assets/images/edit-icon-white.png")}
              style={{ width: 30, height: 30, marginRight: 20 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Tem certeza?",
                "Os dados desta infração serão perdidos para sempre!",
                [
                  {
                    text: "Não",
                    onPress: () => {},
                    style: "cancel",
                  },
                  {
                    text: "Sim",
                    onPress: () => {
                      Infracao.remInfracao(idInfrator, infracao.id)
                        .then(() => {
                          navigation.goBack();
                        })
                        .catch((err) => {
                          Alert.alert("Falha:", "Infração não foi removida!");
                        });
                    },
                  },
                ],
                { cancelable: false }
              );
            }}
          >
            <Image
              source={require("../../assets/images/icon_lixeira_white.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView>
        <View
          style={{
            width: Dimensions.get("screen").width - 30,
            height: Dimensions.get("screen").height - 165,
            backgroundColor: "#fff",
            margin: 10,
            marginHorizontal: 15,
            borderRadius: 10,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "CenturyGothicBold",
                marginStart: 11,
                marginTop: 10,
                color: Colors.Secondary.Normal,
                flex: 1,
              }}
            >
              Registrado:
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "CenturyGothicBold",
                marginStart: 15,
                marginTop: 10,
                color: Colors.Secondary.Normal,
                flex: 1,
              }}
            >
              Ocorrido:
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={Styles.TextAnexo}>
              {moment(new Date(infracao.Data_registro)).format("DD/MM/YYYY")}
            </Text>
            <Text style={Styles.TextAnexo}>
              {moment(new Date(infracao.Data_ocorrência)).format("DD/MM/YYYY")}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={Styles.DescAnexo}>{infracao.Descrição}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={Styles.DescAnexo}>{infracao.Reds}</Text>
          </View>
          {infracao.Observações && (
            <View style={{ flexDirection: "row" }}>
              <Text style={Styles.DescAnexo}>{infracao.Observações}</Text>
            </View>
          )}

          <View style={Styles.lbAnexos}>
            <View style={Styles.btngroupAnexo}>
              <Text style={Styles.lblAnexo}>ANEXOS</Text>
              <TouchableHighlight
                style={[Styles.btnPrimary, { flex: 1 }]}
                underlayColor={Colors.Primary.White}
                onPress={handleAddAnexo}
              >
                <Text style={[Styles.btnTextPrimary, { fontSize: 16 }]}>
                  ADICIONAR
                </Text>
              </TouchableHighlight>
            </View>
            {!!lista && lista.length > 0 ? (
              <FlatList
                data={lista}
                keyExtractor={(item) => item.value}
                renderItem={({ item, i }) => (
                  <Itens.Anexo
                    key={i}
                    anexo={item}
                    onRename={handleRename}
                    onDelete={handleRemoveAnexo}
                    onLongPress={openAnexo}
                  />
                )}
                nestedScrollEnabled={true}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    Styles.txtBold,
                    {
                      color: Colors.Secondary.Normal,
                      fontSize: 15,
                      textAlign: "center",
                    },
                  ]}
                >
                  Nenhum anexo encontrado...
                </Text>
                <Image
                  source={require("../../assets/images/no-data.png")}
                  style={{ width: 100, height: 98, marginTop: 15 }}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
