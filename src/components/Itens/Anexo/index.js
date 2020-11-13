import React from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import Styles from "../../../styles";
import Colors from "../../../styles/colors";
import { mask } from "../../../utils";

export default ({ key, anexo, onRename, onDelete, onLongPress }) => {
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
          <Text
            style={[
              Styles.txtBold,
              { color: Colors.Secondary.Normal, fontSize: 14 },
            ]}
          >
            {anexo.name
              ? mask.FileName(anexo.name, anexo.ext ? anexo.ext : "", 30)
              : "Anexo Sem Nome"}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ padding: 10, paddingRight: 0 }}
              onPress={() => onRename(anexo.key)}
            >
              <Image
                source={require("../../../assets/images/edit-icon.png")}
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
