import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import {
  Detalhes,
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
      Infracao,
      Consulta,
      Controle,
      Detalhes,
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
