import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  Linking,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DialogInput from "react-native-dialog-input";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import moment from "moment";
import {
  Anexo as AnexoController,
  Credential,
  Network,
  Uploader,
  Infracao,
} from "../../controllers";
import * as DocumentPicker from "expo-document-picker";
import { SwipeListView } from "react-native-swipe-list-view";
import { Anexo as Item } from "../../components/Itens";
import { useContext } from "../../context";

function Anexo({ navigation }) {
  const idInfracao = navigation.getParam("idInfracao");
  const idInfrator = navigation.getParam("idInfrator");
  const [infracao, setInfracao] = useState({});
  const [infraKey, setInfraKey] = useState(undefined);
  const [lista, setLista] = useState([]);
  const [nomeAnexo, setNomeAnexo] = useState("");
  const [Anexo, setAnexo] = useState(undefined);
  const [showDialogNovoNome, setShowDiagNomeAnexo] = useState(false);
  const { accessDeniedAlert, haveAccess } = Credential;
  const { connected, alertOffline } = Network.useNetwork();
  const { credential } = useContext();

  useEffect(() => {
    Infracao.listenOne(idInfrator, idInfracao, handleListener);

    //Uploader.callback = callBack_;
  }, []);

  const handleListener = (infracao) => {
    if (!infracao) {
      Alert.alert("Atenção:", "A infração foi removida!");
      navigation.goBack();
    } else setInfracao(infracao);
  };
  useEffect(() => {
    /*navigation.addListener("didBlur", (e) => {
      if (!e.state) {
        Uploader.callback = undefined;
      }
    });*/
  }, [navigation]);

  useEffect(() => {
    /*let query = AnexoController.getRefInfracao(
      infração.infratorKey,
      infração.Data_registro
    );

    query.once("value", (snapshot) => {
      if (snapshot.val()) {
        setInfraKey(Object.keys(snapshot.val())[0]);
      }
    });*/
  }, [infracao]);

  useEffect(() => {
    /*if (infraKey) {
      let anexos = AnexoController.getRefAnexo(infração.infratorKey, infraKey);

      anexos.on("value", (snapshot) => {
        AnexoController.setAnexosFromInfracao(
          snapshot,
          Uploader,
          infraKey,
          setLista
        );
      });
    }*/
  }, [infraKey]);

  /*useEffect(() => {
    if (Anexo) changeNomeAnexo(Anexo);
  }, [Anexo]);*/

  /*const callBack_ = () => {
    let listProntos = [];
    let listUploading = [];

    try {
      listProntos = lista.filter((i) => i.status != "" && i.status != "up");
      listUploading = Uploader.uploadQueue.filter(
        (i) => i.infraKey == infraKey
      );
    } catch {}

    try {
      setLista([...listProntos, ...listUploading]);
    } catch {}
  };*/

  /*const getAnexo = async () => {
    if (!connected) {
      alertOffline();
      return;
    }
    if (haveAccess(credential, "AccessToAnexar")) {
      let file = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
        type: "application/pdf",
      });
      if (file.type === "cancel") {
        return;
      }
      setAnexo(file);
    } else accessDeniedAlert();
  };*/

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

  /*const addAnexo = async (fileName) => {
    fileName = maskFileName(fileName);
    let item = {
      key: "",
      fileName,
      uri: Anexo.uri.replace("file://", ""),
      progress: 0,
      status: "",
    };

    Uploader.upload(item, infração.infratorKey, infraKey);
  };*/

  /*const maskFileName = (fileName) => {
    fileName = fileName.replace(".pdf", "");
    if (fileName.length >= 30) {
      let str = fileName.substring(0, 25);
      fileName =
        str + "..." + fileName.substring(fileName.length - 3, fileName.length);
    }
    return fileName + ".pdf";
  };*/

  /*const removeAnexo = (item) => {
    if (!connected) {
      alertOffline();
      return;
    }

    const index = lista.indexOf(item);

    if (index > -1) {
      AnexoController.deleteAnexo(infração.infratorKey, infraKey, item.key)
        .then(() => {
          AnexoController.removeAnexoBD(
            infração.infratorKey,
            infraKey,
            item.key
          ).catch((err) => {
            alert("Ocorreu um erro!");
          });
        })
        .catch((err) => {
          alert("Ocorreu um erro!");
        });
    }
  };

  const openAnexo = (url) => {
    try {
      Linking.openURL(url);
    } catch {
      Alert.alert("Falha no anexo:", "Não foi possivel abri-lo no momento!");
    }
  };*/

  return (
    <SafeAreaView style={Styles.page}>
      <DialogInput
        isDialogVisible={showDialogNovoNome}
        title={"Alterar Nome do Anexo"}
        message={"Digite o novo nome:"}
        hintInput={"Novo nome aqui"}
        submitInput={(nome) => {
          /*setShowDiagNomeAnexo(false);
          setNomeAnexo(nome);
          addAnexo(nome);*/
        }}
        submitText={"Concluir"}
        cancelText={"Cancelar"}
        closeDialog={() => {
          /*setShowDiagNomeAnexo(false);
          addAnexo(nomeAnexo);*/
        }}
      ></DialogInput>
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
      <View
        style={{
          flex: 5,
          alignSelf: "stretch",
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
              /*onPress={getAnexo}*/
            >
              <Text style={[Styles.btnTextPrimary, { fontSize: 16 }]}>
                ADICIONAR
              </Text>
            </TouchableHighlight>
          </View>
          <ScrollView style={Styles.scrollAnexos}>
            <SwipeListView
              data={lista}
              renderItem={({ item }) => (
                <Item.idle
                  data={{
                    fileName: item.fileName,
                    progress: `${item.progress}%`,
                  }}
                  onLongPress={() => {
                    /* openAnexo(item.status);*/
                  }}
                />
              )}
              renderHiddenItem={({ item, index }) => (
                <Item.swipe /*onDelete={() => removeAnexo(item)}*/ />
              )}
              leftOpenValue={40}
              disableLeftSwipe={true}
            />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
export default Anexo;
