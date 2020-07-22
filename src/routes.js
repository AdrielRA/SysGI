import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import {
  Anexo,
  Cadastro,
  Consulta,
  Controle,
  Login,
  MENU,
  Signup,
  Sobre,
} from "./pages";

const Routes = createAppContainer(
  createStackNavigator(
    {
      Login,
      Signup,
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
