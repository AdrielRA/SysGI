import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableHighlight,
  Text,
  View,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DialogInput from "react-native-dialog-input";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import moment from "moment";
import firebase from "../../services/firebase";
import { Credential, Network, Uploader } from "../../controllers";
import * as DocumentPicker from "expo-document-picker";
import { SwipeListView } from "react-native-swipe-list-view";
import { Anexo as Item } from "../../components/Itens";

function Anexo({ navigation }) {
  const infração = navigation.getParam("item");
  const [infraKey, setInfraKey] = useState(undefined);
  const [lista, setLista] = useState([]);
  const [nomeAnexo, setNomeAnexo] = useState("");
  const [Anexo, setAnexo] = useState(undefined);
  const [showDialogNovoNome, setShowDiagNomeAnexo] = useState(false);
  const { accessDeniedAlert, haveAccess } = Credential.useCredential();
  const { connected, alertOffline } = Network.useNetwork();

  const anexos_db = firebase.database().ref().child("anexos");
  const anexos_st = firebase.storage().ref().child("anexos");

  useEffect(() => {
    Uploader.callback = callBack_;
  });

  useEffect(() => {
    navigation.addListener("didBlur", (e) => {
      if (!e.state) {
        Uploader.callback = undefined;
      }
    });
  }, [navigation]);

  useEffect(() => {
    const infrações = firebase
      .database()
      .ref("infratores")
      .child(infração.infratorKey)
      .child("Infrações");

    let query = infrações
      .orderByChild("Data_registro")
      .equalTo(infração.Data_registro);
    query.once("value", (snapshot) => {
      if (snapshot.val()) {
        setInfraKey(Object.keys(snapshot.val())[0]);
      }
    });
  }, [infração]);

  useEffect(() => {
    if (infraKey) {
      let anexos = anexos_db.child(infração.infratorKey).child(infraKey);

      anexos.on("value", (snapshot) => {
        let results = [];
        if (snapshot.val()) {
          snapshot.forEach(function (child) {
            if (child.val()) {
              results.push({
                ...child.val(),
                key: child.key,
                uri: "",
                progress: 100,
              });
            }
          });
        }
        let listUploading = [];
        if (Uploader.uploadQueue.length > 0) {
          listUploading = Uploader.uploadQueue.filter(
            (i) => i.infraKey == infraKey
          );
          results.map((r) => {
            listUploading = listUploading.filter((i) => i.key != r.key);
          });
        }
        setLista([...results, ...listUploading]);
      });
    }
  }, [infraKey]);

  callBack_ = () => {
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
  };

  useEffect(() => {
    if (Anexo) changeNomeAnexo(Anexo);
  }, [Anexo]);

  const getAnexo = async () => {
    if (!connected) {
      alertOffline();
      return;
    }
    if (haveAccess("AccessToAnexar")) {
      let file = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
        type: "application/pdf",
      });
      if (file.type === "cancel") {
        return;
      }
      setAnexo(file);
    } else accessDeniedAlert();
  };

  function changeNomeAnexo(anexo) {
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
  }

  async function addAnexo(fileName) {
    fileName = maskFileName(fileName);
    let item = {
      key: "",
      fileName,
      uri: Anexo.uri.replace("file://", ""),
      progress: 0,
      status: "",
    };

    Uploader.upload(item, infração.infratorKey, infraKey);

    //setLista([...lista, item]);
  }

  function maskFileName(fileName) {
    fileName = fileName.replace(".pdf", "");
    if (fileName.length >= 30) {
      let str = fileName.substring(0, 25);
      fileName =
        str + "..." + fileName.substring(fileName.length - 3, fileName.length);
    }
    return fileName + ".pdf";
  }

  function removeAnexo(item) {
    if (!connected) {
      alertOffline();
      return;
    }
    const index = lista.indexOf(item);
    console.log("KEY[" + index + "]: " + item.key);
    if (index > -1) {
      let anexo = anexos_st
        .child(infração.infratorKey)
        .child(infraKey)
        .child(item.key);
      anexo
        .delete()
        .then(() => {
          anexos_db
            .child(infração.infratorKey)
            .child(infraKey)
            .child(item.key)
            .remove()
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function openAnexo(url) {
    try {
      Linking.openURL(url);
    } catch {
      Alert.alert("Falha no anexo:", "Não foi possivel abri-lo no momento!");
    }
  }

  return (
    <SafeAreaView style={Styles.page}>
      <DialogInput
        isDialogVisible={showDialogNovoNome}
        title={"Alterar Nome do Anexo"}
        message={"Digite o novo nome:"}
        hintInput={"Novo nome aqui"}
        submitInput={(nome) => {
          setShowDiagNomeAnexo(false);
          setNomeAnexo(nome);
          addAnexo(nome);
        }}
        submitText={"Concluir"}
        cancelText={"Cancelar"}
        closeDialog={() => {
          setShowDiagNomeAnexo(false);
          addAnexo(nomeAnexo);
        }}
      ></DialogInput>
      <LinearGradient
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 1, y: 1.0 }}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal, Colors.Terciary.Normal]}
        style={[Styles.page, { alignSelf: "stretch", paddingTop: 30 }]}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#fff",
            fontSize: 25,
            fontFamily: "CenturyGothicBold",
          }}
        >
          DETALHES DA INFRAÇÃO
        </Text>
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
            {moment(new Date(infração.Data_registro)).format("DD/MM/YYYY")}
          </Text>
          <Text style={Styles.TextAnexo}>
            {moment(new Date(infração.Data_ocorrência)).format("DD/MM/YYYY")}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={Styles.DescAnexo}>{infração.Descrição}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={Styles.DescAnexo}>{infração.Reds}</Text>
        </View>

        <View style={Styles.lbAnexos}>
          <View style={Styles.btngroupAnexo}>
            <Text style={Styles.lblAnexo}>ANEXOS</Text>
            <TouchableHighlight
              style={[Styles.btnPrimary, { flex: 1 }]}
              underlayColor={Colors.Primary.White}
              onPress={getAnexo}
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
                    openAnexo(item.status);
                  }}
                />
              )}
              renderHiddenItem={({ item, index }) => (
                <Item.swipe onDelete={() => removeAnexo(item)} />
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
