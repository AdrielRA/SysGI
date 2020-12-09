import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Modal,
  Dimensions,
  TextInput,
} from "react-native";
import { Secondary } from "../../styles/colors";

export default (props) => {
  const [visible, setVisible] = useState(props.visible);
  const [text, setText] = useState();

  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  useEffect(() => {
    setText("");
  }, [visible]);

  const handleCancel = () => {
    setVisible(false);
    props.onClose();
  };

  const handleSubmit = () => {
    props.onSubmit(text);
    props.onClose();
  };

  return (
    <Modal animationType="fade" visible={visible} transparent={true}>
      <TouchableOpacity
        onPress={handleCancel}
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            borderRadius: 15,
            borderWidth: 1,
            borderColor: Secondary,
            width: Dimensions.get("screen").width / 1.5,
            maxHeight: Dimensions.get("screen").height / 2,
            backgroundColor: "#fff",
            alignSelf: "center",
            padding: 15,
          }}
        >
          <Text style={{ fontFamily: "CenturyGothic", color: "#800" }}>
            {props.title}
          </Text>
          <TextInput
            placeholder={props.placeholder}
            placeholderTextColor="#800"
            autoCapitalize="none"
            value={text}
            onChangeText={setText}
            onSubmitEditing={() => !!text && handleSubmit()}
            style={{
              fontFamily: "CenturyGothic",
              color: "#800",
              marginTop: 10,
              marginBottom: 15,
              borderBottomColor: "#800",
              paddingVertical: 3,
              borderBottomWidth: 1,
            }}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity onPress={handleCancel}>
              <Text style={{ fontFamily: "CenturyGothicBold", color: "#800" }}>
                {props.cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => !!text && handleSubmit()}>
              <Text
                style={{
                  fontFamily: "CenturyGothicBold",
                  color: "#800",
                  opacity: !!text ? 1 : 0.75,
                }}
              >
                {props.submitText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
