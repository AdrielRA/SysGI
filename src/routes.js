import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import {
  Detalhes,
  Consulta,
  Controle,
  EditeInfracao,
  Infracao,
  Infrator,
  Login,
  MENU,
  Profile,
  Recovery,
  Signup,
  Sobre,
  Teste,
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
      Infracao,
      Consulta,
      Controle,
      Profile,
      Detalhes,
      EditeInfracao,
      Teste,
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
