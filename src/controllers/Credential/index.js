import { db } from "../../services/firebase";
import Credentials from "../../utils/Credentials.json";
import { Alert } from "react-native";

const getCredencial = (uid, resolve) => {
  db()
    .ref("users")
    .child(uid)
    .once("value")
    .then((snapshot) => resolve(snapshot.val().Credencial));
};

const setCredential = (uid, credential) => {
  return db()
    .ref()
    .child("users")
    .child(uid)
    .child("Credencial")
    .set(credential);
};

const blockedAccess = (credential) => {
  return credential === 99;
};

const haveAccess = (credential, access) => {
  const allowed = Credentials[access];
  return (
    isAdmin(credential) || (!!allowed && allowed.includes(credential % 10))
  );
};

const haveAccessToUserControl = (credential) => {
  return credential % 10 === 8;
};

const isAdmin = (credential) => {
  return credential === 30;
};

const isValidCredential = (credential) => {
  return credential > 0 && credential <= 30;
};

const accessDeniedAlert = () => {
  Alert.alert("Atenção:", "Você não tem permissão para acessar este recurso!");
};

const onNewUserWithCredential = (/*credential, isAdmin,*/ callback) => {
  const usersRef = db().ref().child("users");
  //if (isAdmin)
  return usersRef.orderByChild("Credencial").endAt(0).on("value", callback);
  /*else
    return usersRef
      .orderByChild("Credencial")
      .equalTo((credential % 10) * -1)
      .on("value", callback);*/
};

export {
  accessDeniedAlert,
  getCredencial,
  blockedAccess,
  haveAccess,
  haveAccessToUserControl,
  isAdmin,
  isValidCredential,
  onNewUserWithCredential,
  setCredential,
};
