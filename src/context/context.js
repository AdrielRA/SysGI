import React, {
  createContext,
  useContext as useReactContext,
  useState,
  useEffect,
} from "react";
import { Auth, Credential } from "../controllers";

const Context = createContext({
  credential: Number,
  handlePersistence: Function,
  isLogged: Boolean,
  persistence: Boolean,
  session: String,
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

  const { getCredencial } = Credential;
  const [isLogged, setIsLogged] = useState();
  const [user, setUser] = useState();
  const [userData, setUserData] = useState();
  const [persistence, setPersiste] = useState();
  const [session, setSession] = useState(null);
  const [credential, setCredential] = useState();

  const handlePersistence = () =>
    handleAuthPersistence(persistence, setPersiste);

  useEffect(() => {
    getPersistence().then((persistence) => {
      setPersiste(persistence);
      if (!persistence) signOut();

      const timer = setTimeout(() => {
        return handleAuthChange((user) => {
          if (user) setUser(user);
          else setUser(undefined);
        });
      }, 1000);

      return clearTimeout(() => timer());
    });
  }, []);

  useEffect(() => setIsLogged(!!user), [user]);

  useEffect(() => {
    if (!!user) {
      getUserData(user.uid).then(setUserData);
      return handleSessionChange(user.uid, setSession);
    } else {
      setUserData(undefined);
    }
  }, [user]);

  useEffect(() => {
    if (isLogged) getCredencial(user.uid, setCredential);
    else setCredential(undefined);
  }, [isLogged]);

  return (
    <Context.Provider
      value={{
        credential,
        handlePersistence,
        isLogged,
        persistence,
        session,
        user,
        userData,
      }}
    >
      {children}
    </Context.Provider>
  );
};

const useContext = () => {
  return useReactContext(Context);
};

export { useContext };
