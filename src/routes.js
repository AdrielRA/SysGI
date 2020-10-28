import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import {
  Anexo,
  Cadastro,
  Consulta,
  Controle,
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
      Cadastro,
      Consulta,
      Controle,
      Anexo,
    },
    {
      defaultNavigationOptions: {
        headerShown: false,
      },
    }
  )
);

export default Routes;
