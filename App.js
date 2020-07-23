import React, { useEffect, useState } from "react";
import { StatusBar, ActivityIndicator } from "react-native";
import { AppearanceProvider } from "react-native-appearance";
import Routes from "./src/routes";
import * as Font from "expo-font";
import Colors from "./src/styles/colors";

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  const loadFont = async () => {
    await Font.loadAsync({
      CenturyGothicBold: require("./src/assets/fonts/CenturyGothicBold.ttf"),
      CenturyGothic: require("./src/assets/fonts/CenturyGothicRegular.ttf"),
    });
  };

  useEffect(() => {
    loadFont().then(() => {
      setFontLoaded(true);
    });
  }, []);

  return (
    <AppearanceProvider>
      <StatusBar barStyle="light-content" backgroundColor="#800000" />
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
    </AppearanceProvider>
  );
}
