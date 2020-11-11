import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import {
  Anexo,
  Cadastro,
  Consulta,
  Controle,
  Infracao,
  Infrator,
  Login,
  MENU,
  Recovery,
  Signup,
  Sobre,
} from "./pages";

const Routes = createAppContainer(
  createStackNavigator(
    {
      Login,
      Signup,
      Recovery,
      Sobre,
      MENU,
      Infrator,
      Cadastro,
      Infracao,
      Consulta,
      Controle,
      Anexo,
    },
    {
      defaultNavigationOptions: {
        headerShown: false,
        initialRouteName: "Login",
      },
    }
  )
);

export default Routes;
