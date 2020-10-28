import { db, auth } from "../../services/firebase";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import * as Crypto from "expo-crypto";

const useAuth = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    handleAuthChange;
    return handleAuthChange();
  }, []);

  useEffect(() => setIsLogged(!!user), [user]);

  const handleAuthChange = () => {
    return auth().onAuthStateChanged((user) => {
      if (user)
        setUser({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
        });
      else setUser(undefined);
    });
  };

  return { isLogged, user };
};

const setPersistence = async (persiste) => {
  await AsyncStorage.setItem("@login_persistence", JSON.stringify(persiste));
};

const getPersistence = async () => {
  const persistence = await AsyncStorage.getItem("@login_persistence");
  return JSON.parse(persistence);
};

const signOut = () => {
  auth().signOut();
};

const createUser = (email, senha, callback) => {
  return auth().createUserWithEmailAndPassword(email, senha);
};

const setUserData = (uid, userData) => {
  return db().ref("users").child(uid).set(userData);
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
  getPersistence,
  sendEmailVerification,
  setPersistence,
  setUserData,
  signOut,
  useAuth,
};
