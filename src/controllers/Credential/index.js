import { db } from "../../services/firebase";
import { useEffect, useState } from "react";
import Credentials from "../../utils/Credentials.json";
import * as Auth from "../Auth";

const useCredential = () => {
  const [credential, setCredential] = useState();
  const { user, isLogged } = Auth.useAuth();

  useEffect(() => {
    if (isLogged) getCredencial(user.uid);
  }, [isLogged]);

  const getCredencial = (uid) => {
    if (!!credential) return;
    else {
      db()
        .ref("users")
        .child(uid)
        .once("value")
        .then((snapshot) => setCredential(snapshot.val().Credencial));
    }
  };

  const blockedAccess = (Credential) => {
    return Credential === 99;
  };

  const haveAccess = (access) => {
    const allowed = Credentials[access];
    return isAdmin() || (!!allowed && allowed.includes(credential % 10));
  };

  const haveAccessToUserControl = () => {
    return credential > 10 && credential < 20;
  };

  const isAdmin = () => {
    return credential === 30;
  };

  const isValidCredential = (Credential) => {
    return Credential > 0 && Credential <= 30;
  };

  accessDeniedAlert = () => {
    Alert.alert(
      "Atenção:",
      "Você não tem permissão para acessar este recurso!"
    );
  };

  return {
    accessDeniedAlert,
    blockedAccess,
    credential,
    haveAccess,
    haveAccessToUserControl,
    isAdmin,
    isValidCredential,
  };
};

const onNewUserWithCredential = (credential, isAdmin, callback) => {
  const usersRef = db().ref().child("users");
  if (isAdmin)
    return usersRef.orderByChild("Credencial").endAt(0).on("value", callback);
  else
    return usersRef
      .orderByChild("Credencial")
      .equalTo((credential % 10) * -1)
      .on("value", callback);
};

const setCredential = (uid, credential) => {
  return db()
    .ref()
    .child("users")
    .child(uid)
    .child("Credencial")
    .set(credential);
};

export { onNewUserWithCredential, setCredential, useCredential };
