import { useState, useEffect } from "react";
import * as Permissions from "expo-permissions";
import { db, auth } from "../../services/firebase";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useNotifications = () => {
  const [enabled, setEnabled] = useState();

  useEffect(() => {
    getNotify().then((notifyStatus) => setEnabled(notifyStatus));
  }, []);

  useEffect(() => {
    if (enabled) {
      requestNotifyPermission().then((status) => {
        if (status !== "granted") setEnabled(false);
        else Notifications.getExpoPushTokenAsync().then(handleToken);
      });
    } else if (enabled !== undefined) handleToken();
  }, [enabled]);

  const handleToken = (token) => {
    if (!auth().currentUser) return;
    const userRef = db()
      .ref()
      .child("users")
      .child(auth().currentUser.uid)
      .child("Device");
    if (!!token) userRef.set(token.data);
    else userRef.remove();
  };

  const requestNotifyPermission = () => {
    return new Promise((resolve) => {
      Permissions.getAsync(Permissions.NOTIFICATIONS).then((status) => {
        if (status !== "granted") {
          Permissions.askAsync(Permissions.NOTIFICATIONS).then(({ status }) =>
            resolve(status)
          );
        } else {
          resolve(status);
        }
      });
    });
  };

  const handleNotification = () => {
    setNotify(!enabled).then(() => getNotify().then(setEnabled));
  };

  const setNotify = async (notifyStatus) => {
    await AsyncStorage.setItem("@notify_status", JSON.stringify(notifyStatus));
  };

  const getNotify = async () => {
    const notifyStatus = await AsyncStorage.getItem("@notify_status");
    return JSON.parse(notifyStatus);
  };

  return {
    enabled,
    handleNotification,
  };
};

export { useNotifications };
