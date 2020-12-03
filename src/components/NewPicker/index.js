import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Secondary } from "../../styles/colors";
import { Feather } from "@expo/vector-icons";

export default (props) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(props.value);

  function handleVisibleList() {
    setVisible(!visible);
  }

  const handleSelect = (item) => {
    setSelected(item);
    handleVisibleList();
    if (!!props.onSelect) props.onSelect(item);
  };

  const ItemList = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleSelect(item)}>
      <Text
        key={index}
        numberOfLines={1}
        style={[styles.item, item === selected && styles.itemSelected]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[props.style, { flex: 1 }]}>
      <View
        style={[
          styles.pickerGlobal,
          props.type !== "light" && {
            backgroundColor: "#fff",
            borderColor: Secondary,
          },
          visible ? styles.pickerListVisible : styles.pickerListNotVisible,
        ]}
      >
        <Text
          style={[
            styles.placeholder,
            props.type !== "light" && { color: Secondary },
          ]}
          numberOfLines={1}
        >
          {!!selected ? selected : props.placeholder}
        </Text>
        <Feather
          name="chevron-down"
          size={24}
          color={props.type === "light" ? "#fff" : Secondary}
          onPress={handleVisibleList}
        />
      </View>
      {visible && (
        <View style={[styles.list]}>
          <FlatList
            style={{ width: "100%" }}
            nestedScrollEnabled={true}
            data={props.data}
            renderItem={({ item, index }) => (
              <ItemList item={item.label} index={index} />
            )}
          />
        </View>
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
    borderRadius: 25,
  },
  pickerListVisible: {
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
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
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
});
