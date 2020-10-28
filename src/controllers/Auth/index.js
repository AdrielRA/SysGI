import { db, auth } from "../../services/firebase";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import * as Crypto from "expo-crypto";

const useAuth = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState();
  const [credential, setCredential] = useState();
  const [persistence, setPersiste] = useState();

  useEffect(() => {
    getPersistence().then((persistence) => {
      setPersiste(persistence);
      if (!persistence) signOut();
    });
    handleAuthChange;
    return handleAuthChange();
  }, []);

  useEffect(() => setIsLogged(!!user), [user]);

  useEffect(() => {
    if (isLogged) getCredencial(user.uid);
  }, [isLogged]);

  const handleAuthChange = () => {
    return auth().onAuthStateChanged((user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
        });
      } else setUser(undefined);
    });
  };

  const handlePersistence = () => {
    setPersistence(!persistence).then(() => getPersistence().then(setPersiste));
  };

  const setPersistence = async (persiste) => {
    await AsyncStorage.setItem("@login_persistence", JSON.stringify(persiste));
  };

  const getPersistence = async () => {
    const persistence = await AsyncStorage.getItem("@login_persistence");
    return JSON.parse(persistence);
  };

  getCredencial = (uid) => {
    if (!!credential) return;
    else {
      db()
        .ref("users")
        .child(uid)
        .once("value")
        .then((snapshot) => setCredential(snapshot.val().Credencial));
    }
  };

  return { handlePersistence, isLogged, credential, persistence, user };
};

const signIn = (email, senha) => {
  return new Promise((resolve, reject) => {
    auth()
      .signInWithEmailAndPassword(email, senha)
      .then(({ user }) => {
        if (user.emailVerified) {
          resolve(getUserData(user.uid));
        } else reject("email-verification-fail");
      })
      .catch((err) => reject(err.code));
  });
};

const signOut = () => {
  return auth().signOut();
};

const createUser = (email, senha, callback) => {
  return auth().createUserWithEmailAndPassword(email, senha);
};

const setUserData = (uid, userData) => {
  return db().ref("users").child(uid).set(userData);
};

const getUserData = (uid) => {
  return db().ref("users").child(uid).once("value");
};

const sendEmailVerification = (user) => {
  user.sendEmailVerification();
};

const generateRecoveryCode = (baseToCreate) => {
  return new Promise((resolve, reject) => {
    try {
      Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        baseToCreate
      ).then((digest) => resolve(digest.toString("hex").substring(0, 8)));
    } catch {
      reject();
    }
  });
};

export {
  createUser,
  generateRecoveryCode,
  getUserData,
  sendEmailVerification,
  setUserData,
  signIn,
  signOut,
  useAuth,
};
