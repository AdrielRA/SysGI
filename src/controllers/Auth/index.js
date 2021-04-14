import AsyncStorage from "@react-native-community/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { db, auth } from "../../services/firebase";
import Constants from "expo-constants";
import * as Crypto from "expo-crypto";

const handleAuthChange = (resolve) => {
  return auth().onAuthStateChanged(resolve);
};

const handleSessionChange = (uid, resolve) => {
  return db()
    .ref("users")
    .child(uid)
    .on("value", (snapshot) => {
      try {
        resolve(snapshot.val().SessionId);
      } catch {}
    });
};

const handleAuthPersistence = (persistence, resolve) => {
  setPersistence(!persistence).then(() => getPersistence().then(resolve));
};

const handleLocalAuth = (promptMessage, cancelLabel) => {
  return new Promise((resolve) => {
    LocalAuthentication.hasHardwareAsync().then((hasHardware) => {
      if (hasHardware) {
        LocalAuthentication.isEnrolledAsync().then((isEnrolled) => {
          if (isEnrolled) {
            LocalAuthentication.authenticateAsync({
              promptMessage,
              cancelLabel,
              fallbackLabel: "",
              disableDeviceFallback: true,
            })
              .then((result) => resolve(result.success))
              .catch(() => resolve("error"));
          }
        });
      }
    });
  });
};

const setPersistence = async (persiste) => {
  await AsyncStorage.setItem("@login_persistence", JSON.stringify(persiste));
};

const getPersistence = async () => {
  const persistence = await AsyncStorage.getItem("@login_persistence");
  return JSON.parse(persistence);
};

const validateSession = (sessionId, create) => {
  if (!auth().currentUser) return false;
  if (!sessionId && create) {
    db()
      .ref("users")
      .child(auth().currentUser.uid)
      .child("SessionId")
      .set(Constants.deviceId);
    return true;
  }
  return Constants.deviceId === sessionId;
};

const clearSession = () => {
  if (!auth().currentUser) return;
  db().ref("users").child(auth().currentUser.uid).child("SessionId").remove();
};

const signIn = (email, senha) => {
  return new Promise((resolve, reject) => {
    auth()
      .signInWithEmailAndPassword(email, senha)
      .then(({ user }) => {
        if (!user.emailVerified) reject("email-verification-fail");
      })
      .catch((err) => reject(err.code));
  });
};

const signOut = () => auth().signOut();

const createUser = (email, senha) => {
  return auth().createUserWithEmailAndPassword(email, senha);
};

const updatePassword = (email, senha, newSenha) => {
  return new Promise((resolve, reject) => {
    let credential = auth.EmailAuthProvider.credential(email, senha);
    auth()
      .currentUser.reauthenticateWithCredential(credential)
      .then(() =>
        auth().currentUser.updatePassword(newSenha).then(resolve).catch(reject)
      )
      .catch(reject);
  });
};

const deleteUser = (user) => {
  return new Promise((resolve, reject) => {
    db()
      .ref()
      .child("users")
      .child(user.uid)
      .remove()
      .then(() => {
        user.delete().then(resolve).catch(reject);
      })
      .catch(reject);
  });
};

const setUserData = (uid, userData) => {
  return db().ref("users").child(uid).set(userData);
};

const updateUserData = (uid, updatedData) => {
  return db().ref("users").child(uid).update(updatedData);
};

const getUserData = async (uid) => {
  return db()
    .ref("users")
    .child(uid)
    .once("value")
    .then((snap) => snap || snap.val());
};

const listenUserData = (uid, callback) => {
  const ref = db().ref("users").child(uid);
  ref.on("value", (snap) => callback(snap.val()));
  return ref;
};

const sendEmailVerification = (user) => {
  return user.sendEmailVerification();
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

const disconnectDevices = (cod) => {
  return new Promise((resolve, reject) => {
    console.log(!auth().currentUser);
    if (!auth().currentUser) reject();
    else
      db()
        .ref("users")
        .child(auth().currentUser.uid)
        .once("value")
        .then((snapshot) => {
          if (snapshot.val().Recovery != undefined) {
            if (snapshot.val().Recovery === cod) {
              snapshot.ref
                .child("SessionId")
                .remove()
                .then(() => resolve());
            } else reject();
          }
        });
  });
};

export {
  clearSession,
  createUser,
  deleteUser,
  handleAuthChange,
  handleAuthPersistence,
  handleLocalAuth,
  handleSessionChange,
  generateRecoveryCode,
  getPersistence,
  getUserData,
  disconnectDevices,
  sendEmailVerification,
  setPersistence,
  setUserData,
  signIn,
  signOut,
  updateUserData,
  updatePassword,
  validateSession,
  listenUserData,
};
