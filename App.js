import React, { useEffect, useState } from "react";
import { StatusBar, ActivityIndicator, Alert, Platform } from "react-native";
import { AppearanceProvider } from "react-native-appearance";
import * as Updates from "expo-updates";
import Routes from "./src/routes";
import * as Font from "expo-font";
import Colors from "./src/styles/colors";
import ContextProvider from "./src/context";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { default as theme } from "./src/assets/theme.json";
import { default as mapping } from "./src/assets/mapping.json";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  const getUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert(
          "Nova versão disponível:",
          "Deseja instalar ela agora?",
          [
            {
              text: "Não",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Sim",
              onPress: async () => await Updates.reloadAsync(),
            },
          ],
          { cancelable: false }
        );
      }
    } catch {}
  };

  const loadFont = async () => {
    await Font.loadAsync({
      CenturyGothicBold: require("./src/assets/fonts/CenturyGothicBold.ttf"),
      CenturyGothic: require("./src/assets/fonts/CenturyGothicRegular.ttf"),
    });
  };

  useEffect(() => {
    getUpdate();

    loadFont().then(() => {
      setFontLoaded(true);
    });
  }, []);

  return (
    <ContextProvider>
      <AppearanceProvider>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider
          {...eva}
          customMapping={mapping}
          theme={{ ...eva.light, ...theme }}
        >
          <StatusBar
            barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
            backgroundColor="#800000"
          />
          {fontLoaded ? (
            <Routes />
          ) : (
            <ActivityIndicator
              size="large"
              color={Colors.Primary.White}
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: Colors.Secondary.Normal,
              }}
            />
          )}
        </ApplicationProvider>
      </AppearanceProvider>
    </ContextProvider>
  );
}
