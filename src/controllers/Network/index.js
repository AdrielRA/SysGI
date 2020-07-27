import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";
class Network {
  haveInternet = undefined;
  removeListener = undefined;

  addListener = () => {
    try {
      this.removeListener = NetInfo.addEventListener((state) => {
        //alert("Type: " + state.type  + ", isOK: " + state.isInternetReachable);
        this.haveInternet =
          state.isConnected && state.isInternetReachable && state.type != "vpn";
      });
    } catch (err) {
      console.log(err);
    }
  };

  alertOffline = (onPress) => {
    Alert.alert(
      "Sem internet!",
      "Verifique sua conexão e tente novamente!",
      [{ text: "OK", onPress: onPress }],
      { cancelable: false }
    );
  };
}

export default new Network();
