import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useNetwork = () => {
  const [connected, setConnected] = useState(true);
  const [preventAlert, setPreventAlert] = useState(false);

  useEffect(() => {
    const listener = NetInfo.addEventListener((state) => {
      setConnected(
        state.isConnected && state.isInternetReachable && state.type != "vpn"
      );
    });
    return listener;
  }, []);

  useEffect(() => {
    console.log(connected);
    setPreventAlert(false);
  }, [connected]);

  const alertOffline = (callback) => {
    if (!preventAlert) {
      setPreventAlert(true);
      Alert.alert(
        "Sem internet!",
        "Verifique sua conexão e tente novamente!",
        [
          {
            text: "OK",
            onPress: () => {
              setPreventAlert(false);
              if (callback) callback();
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  return { connected, alertOffline };
};

export { useNetwork };
