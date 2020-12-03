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
} from "react-native";
import { Secondary } from "../../styles/colors";
import { Feather } from "@expo/vector-icons";

export default ({ value, onSelect, style, type, placeholder, data }) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState();

  useEffect(() => {
    if (!!value) {
      try {
        setSelected(data.filter((d) => d.value === value)[0].label);
      } catch {}
    } else setSelected(value);
  }, [value, data]);

  function handleVisibleList() {
    setVisible(!visible);
  }

  const handleSelect = (item) => {
    setSelected(item.label);
    handleVisibleList();
    if (!!onSelect) onSelect(item.value);
  };

  const ItemList = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleSelect(item)}>
      <Text
        key={index.value}
        numberOfLines={1}
        style={[styles.item, item.label === selected && styles.itemSelected]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[style, { flex: 1 }]}>
      <View
        style={[
          styles.pickerGlobal,
          type !== "light" && {
            backgroundColor: "#fff",
            borderColor: Secondary,
          },
          visible && Platform.OS === "android"
            ? styles.pickerListVisible
            : styles.pickerListNotVisible,
        ]}
      >
        <Text
          style={[styles.placeholder, type !== "light" && { color: Secondary }]}
          numberOfLines={1}
        >
          {!!selected ? selected : placeholder}
        </Text>
        <Feather
          name="chevron-down"
          size={24}
          color={type === "light" ? "#fff" : Secondary}
          onPress={handleVisibleList}
        />
      </View>
      {Platform.OS === "ios" ? (
        <Modal animationType="fade" visible={visible} transparent={true}>
          <TouchableOpacity
            onPress={() => setVisible(false)}
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
                paddingBottom: 15,
              }}
            >
              <Text style={styles.iosSelectLabel}>Selecione:</Text>
              <FlatList
                nestedScrollEnabled={true}
                data={data}
                renderItem={({ item, index }) => (
                  <ItemList item={item.label} index={index} />
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      ) : (
        <>
          {visible && (
            <View style={[styles.list]}>
              <FlatList
                style={{ width: "100%" }}
                nestedScrollEnabled={true}
                data={data}
                renderItem={({ item, index }) => (
                  <ItemList item={item} index={index} />
                )}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pickerGlobal: {
    height: 40,
    borderColor: "#fff",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    position: "relative",
  },
  pickerListNotVisible: {
    borderRadius: 20,
  },
  pickerListVisible: {
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  placeholder: {
    color: "#fff",
    fontFamily: "CenturyGothic",
    maxWidth: "85%",
  },
  list: {
    position: "absolute",
    width: "100%",
    top: 39,
    maxHeight: 150,
    backgroundColor: "#fff",
    borderColor: Secondary,
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 5000,
  },
  item: {
    fontFamily: "CenturyGothic",
    paddingLeft: 15,
    paddingRight: 10,
    paddingVertical: 5,
    color: Secondary,
  },
  itemSelected: {
    backgroundColor: "#f5f5f5",
    fontFamily: "CenturyGothicBold",
  },
  iosSelectLabel: {
    fontFamily: "CenturyGothicBold",
    color: Secondary,
    textAlign: "center",
    paddingVertical: 5,
  },
});
