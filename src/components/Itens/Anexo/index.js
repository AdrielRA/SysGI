import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import Styles from "../../../styles";
import Colors from "../../../styles/colors";

export default ({ key, anexo, onRename, onDelete, onLongPress }) => {
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(anexo.name);

  useEffect(() => {
    if (!editMode && newName !== anexo.name) handleEdit();
  }, [editMode]);

  const handleEdit = () => {
    if (!!newName) {
      Alert.alert(
        "Atenção:",
        "Confirma alteração do nome do anexo?",
        [
          {
            text: "Não",
            onPress: () => {
              setNewName(anexo.name);
            },
            style: "cancel",
          },
          {
            text: "Sim",
            onPress: () => {
              onRename(anexo.key, newName);
            },
          },
        ],
        { cancelable: false }
      );
    } else Alert.alert("Falha:", "Nome informado é inválido!");
  };

  return (
    <View key={key} style={{ padding: 5 }}>
      <TouchableOpacity onLongPress={() => onLongPress(anexo.uri)}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {editMode ? (
            <TextInput
              style={[
                Styles.txtBold,
                {
                  color: Colors.Secondary.Normal,
                  fontSize: 14,
                  maxWidth: "74%",
                  minWidth: "74%",
                },
              ]}
              value={newName}
              onChangeText={setNewName}
            />
          ) : (
            <Text
              style={[
                Styles.txtBold,
                {
                  color: Colors.Secondary.Normal,
                  fontSize: 14,
                  maxWidth: "74%",
                },
              ]}
              numberOfLines={1}
            >
              {anexo.name
                ? /*mask.FileName(anexo.name, anexo.ext ? anexo.ext : "", 30)*/ anexo.name
                : "Anexo Sem Nome"}
            </Text>
          )}
          {!anexo.progress && (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ padding: 10, paddingRight: 0 }}
                onPress={() => setEditMode(!editMode)}
              >
                <Image
                  source={
                    editMode
                      ? require("../../../assets/images/confirm.png")
                      : require("../../../assets/images/edit-icon.png")
                  }
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => onDelete(anexo.key)}
              >
                <Image
                  source={require("../../../assets/images/icon_lixeira_primary.png")}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
      {anexo.progress !== undefined && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={[
              Styles.txtNormal,
              {
                width: 50,
                marginRight: 5,
                textAlign: "center",
                color: Colors.Secondary.Normal,
              },
            ]}
          >
            {anexo.progress}%
          </Text>
          <View
            style={{
              width:
                ((Dimensions.get("screen").width - 120) * anexo.progress) / 100,
              height: 5,
              borderRadius: 3,
              backgroundColor: Colors.Primary.Normal,
            }}
          ></View>
        </View>
      )}
    </View>
  );
};
