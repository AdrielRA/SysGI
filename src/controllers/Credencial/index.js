import { Alert } from "react-native";
import firebase from "../../services/firebase";

class Credencial {
  loggedCred = undefined;

  _getCredencial = (fire_user, callback) => {
    if (this.loggedCred) {
      callback(this.loggedCred);
    } else {
      firebase
        .database()
        .ref("users")
        .child(fire_user.uid)
        .once("value")
        .then((snapshot) => {
          this.loggedCred = snapshot.val().Credencial;
          callback(snapshot.val().Credencial);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  AccessToCadastro = [5, 6, 7, 8, 9];
  AccessToEditar = [5, 7, 8, 9];
  AccessToDelete = [8, 9];
  AccessToConsulta = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  AccessToDetalhes = [3, 4, 5, 6, 7, 8, 9];
  AccessToInfração = [4, 5, 6, 7, 8, 9];
  AccessToAnexar = [4, 5, 6, 7, 8, 9];

  haveAccess = (credencial, access) => {
    return access.includes(credencial % 10);
  };

  isAdimin = (credencial) => {
    return credencial === 30;
  };
  accessDenied = () => {
    Alert.alert(
      "Atenção:",
      "Você não tem permissão para acessar este recurso!"
    );
  };
}

export default new Credencial();
