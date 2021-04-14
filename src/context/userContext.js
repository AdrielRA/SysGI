import React, { createContext, useContext, useState, useEffect } from "react";
import { Auth, Credential } from "../controllers";

const UserContext = createContext({
  handlePersistence: Function,
  isLogged: Boolean,
  persistence: Boolean,
  user: Object,
  userData: Object,
});

export default ({ children }) => {
  const {
    handleAuthChange,
    handleAuthPersistence,
    handleSessionChange,
    getPersistence,
    getUserData,
    signOut,
  } = Auth;

  const [isLogged, setIsLogged] = useState();
  const [user, setUser] = useState();
  const [userData, setUserData] = useState();
  const [persistence, setPersiste] = useState();

  const handlePersistence = () =>
    handleAuthPersistence(persistence, setPersiste);

  useEffect(() => {
    getPersistence().then(async (persistence) => {
      setPersiste(persistence);
      if (!persistence) await signOut();

      handleAuthChange((user) => {
        if (user) setUser(user);
        else setUser(undefined);
        setIsLogged(!!user);
      });
    });
  }, []);

  useEffect(() => {
    let listener;
    if (!!user) Auth.listenUserData(user.uid, setUserData);
    else setUserData(undefined);
    return () => listener && listener.off("value");
  }, [user]);

  /*useEffect(() => {
    if (isLogged) Credential.getCredencial(user.uid, setCredential);
    else setCredential(undefined);
  }, [isLogged]);*/

  return (
    <UserContext.Provider
      value={{
        handlePersistence,
        isLogged,
        persistence,
        user,
        userData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  return useContext(UserContext);
};

export { useUserContext };
