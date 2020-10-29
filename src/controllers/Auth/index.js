import { db, auth } from "../../services/firebase";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import * as Crypto from "expo-crypto";
import Constants from "expo-constants";

const useAuth = () => {
  const [isLogged, setIsLogged] = useState();
  const [user, setUser] = useState();
  const [persistence, setPersiste] = useState();
  const [session, setSession] = useState(null);

  useEffect(() => {
    getPersistence().then((persistence) => {
      setPersiste(persistence);
      if (!persistence) signOut();

      const timer = setTimeout(() => {
        handleAuthChange;
        return handleAuthChange();
      }, 1000);

      return clearTimeout(() => timer());
    });
  }, []);

  useEffect(() => setIsLogged(!!user), [user]);

  useEffect(() => {
    if (!!user) return handleSessionChange(user.uid);
  }, [user]);

  const handleAuthChange = () => {
    return auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else setUser(undefined);
    });
  };

  const handleSessionChange = (uid) => {
    return db()
      .ref("users")
      .child(uid)
      .on("value", (snapshot) => {
        try {
          setSession(snapshot.val().SessionId);
        } catch {}
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

  const validateSession = (sessionId, create) => {
    if (!sessionId && create) {
      db()
        .ref("users")
        .child(user.uid)
        .child("SessionId")
        .set(Constants.deviceId);
      return true;
    }
    return Constants.deviceId === sessionId;
  };

  const clearSession = () => {
    db().ref("users").child(user.uid).child("SessionId").remove();
  };

  return {
    clearSession,
    handlePersistence,
    isLogged,
    persistence,
    session,
    user,
    validateSession,
  };
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

const getUserData = (uid) => {
  return db().ref("users").child(uid).once("value");
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
  createUser,
  deleteUser,
  generateRecoveryCode,
  getUserData,
  disconnectDevices,
  sendEmailVerification,
  setUserData,
  signIn,
  signOut,
  useAuth,
};
