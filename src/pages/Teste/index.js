import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";

import { Feather } from "@expo/vector-icons";
import { NewPicker } from "../../components";

export default function Teste() {
  const [itens, setItens] = useState([
    {
      label: "Teste1sdfsdfsdfsdfsfsdfsfsdfasasdasdasdasdasd",
      value: "Teste1",
    },
    {
      label: "Teste2",
      value: "Teste2",
    },
    {
      label: "Teste3",
      value: "Teste3",
    },
    {
      label: "Teste4",
      value: "Teste4",
    },
    {
      label: "Teste5",
      value: "Teste5",
    },
    {
      label: "Teste6",
      value: "Teste6",
    },
  ]);
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 15,
        }}
      >
        <Text style={{ marginRight: 10 }}>Teste</Text>
        <NewPicker
          placeholder="Teste"
          data={itens}
          //value={itens[3].value}
          onSelect={alert}
        />
      </View>
      <Text style={{ marginRight: 10 }}>Teste</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("screen").height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dcdcdc",
  },
});
