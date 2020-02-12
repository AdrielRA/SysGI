import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
class Network{

  haveInternet = undefined;
  removeListener = undefined;

  addListener = () => {
    this.removeListener = NetInfo.addEventListener(state => {
      //alert("Type: " + state.type  + ", isOK: " + state.isInternetReachable);
      this.haveInternet = state.isConnected && state.isInternetReachable && state.type != 'vpn';
    });
  }

  alertOffline = (onPress) => {
    Alert.alert("Sem internet!", "Verifique sua conexão e tente novamente!",
    [ {text: 'OK', onPress: onPress }, ], {cancelable: false}, ); 
  }
}

export default new Network