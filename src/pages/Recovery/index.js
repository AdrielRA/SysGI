import React, { useState, useEffect } from "react";
import { View, Text, TouchableHighlight, SafeAreaView } from "react-native";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { LinearGradient } from "expo-linear-gradient";

function Recovery({ navigation }) {
  const user = navigation.getParam("user");
  const Recovery = navigation.getParam("Recovery");

  return (
    <SafeAreaView style={[Styles.page, { marginTop: 0 }]}>
      <LinearGradient
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 1, y: 1.0 }}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal, Colors.Terciary.Normal]}
        style={[Styles.page, { alignSelf: "stretch" }]}
      >
        <Text>{Recovery}</Text>
        <Text>
          Salve este cód. de recuperação em local seguro! Em breve você receberá
          um e-mail de verificação!
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

export default Recovery;
