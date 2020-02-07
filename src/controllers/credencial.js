import { Alert } from 'react-native';
import firebase from '../services/firebase';




class Credencial {
  
  loggedCred = undefined;

  _getCredencial = (fire_user, callback) => {
    if(this.loggedCred){ callback(this.loggedCred); }
    else{
      firebase.database().ref('users').child(fire_user.uid).once('value')
      .then((snapshot) => {
        this.loggedCred = snapshot.val().Credencial;
        callback(snapshot.val().Credencial);
      })
      .catch((err) => { console.log(err.message)});
    }    
  }

  AccessToCadastro = [3,4,6];
  AccessToDelete = [6];
  AccessToConsulta = [1,2,3,4,5,6];
  AccessToDetalhes = [2,3,4,5,6];
  AccessToEditar = [4,6];
  AccessToInfração = [3,4,6];
  AccessToAnexar = [3,4,5,6];

  haveAccess = (credencial, access) => {
    return access.includes(credencial % 10);
  }

  isAdimin = (credencial) => {
    return credencial > 10 && credencial < 17;
  }

  accessDenied = () => { Alert.alert("Atenção:", "Você não tem permissão para acessar este recurso!"); }
}

export default new Credencial;