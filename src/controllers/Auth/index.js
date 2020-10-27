import { db, auth } from "../../services/firebase";
import { useState, useEffect } from "react";

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
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
        });
      else setUser(undefined);
    });
  };

  return { isLogged, user };
};

export { useAuth };
