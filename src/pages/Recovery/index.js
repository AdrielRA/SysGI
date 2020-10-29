import React from "react";
import { View, Text, SafeAreaView, Image } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Unifenas } from "../../components";

function Recovery({ navigation }) {
  const Recovery = navigation.getParam("Recovery");

  const goToLogin = () => {
    navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "Login" })],
      })
    );
  };

  return (
    <SafeAreaView style={[Styles.page, { marginTop: 0 }]}>
      <LinearGradient
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 1, y: 1.0 }}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal, Colors.Terciary.Normal]}
        style={[
          Styles.page,
          {
            alignSelf: "stretch",
            justifyContent: "center",
            paddingHorizontal: 22,
          },
        ]}
      >
        <Image
          style={{ height: 100, width: 77, marginBottom: 10 }}
          source={require("../../assets/logo_white.png")}
        ></Image>
        <Text
          style={[
            Styles.txtBold,
            {
              fontSize: 15,
              color: Colors.Primary.White,
              marginBottom: 80,
            },
          ]}
        >
          Usuário criado com sucesso!
        </Text>
        <Text
          style={[
            Styles.txtBold,
            {
              fontSize: 40,
              color: Colors.Primary.White,
              borderWidth: 1,
              borderColor: Colors.Primary.White,
              borderRadius: 40,
              textAlign: "center",
              width: "100%",
            },
          ]}
        >
          {Recovery}
        </Text>
        <View style={{ paddingHorizontal: 15 }}>
          <Text
            style={[
              Styles.txtNormal,
              Styles.txtWhite,
              { textAlign: "center", fontSize: 15, marginVertical: 30 },
            ]}
          >
            Este é seu cógido de recuperação de acesso, salve-o em local seguro!
          </Text>
          <Text
            style={[
              Styles.txtNormal,
              Styles.txtWhite,
              { textAlign: "center", fontSize: 20 },
            ]}
          >
            Em breve você receberá um e-mail de verificação!
          </Text>
        </View>
        <Button
          text="CONCLUIR"
          type="light"
          onPress={goToLogin}
          style={{ marginVertical: 30 }}
        ></Button>
        <Unifenas />
      </LinearGradient>
    </SafeAreaView>
  );
}

export default Recovery;
