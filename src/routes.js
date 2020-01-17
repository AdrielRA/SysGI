import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Login  from './pages/Login';
import Signup from './pages/Signup';
import MENU from './pages/MENU';
import Cadastro from './pages/Cadastro';
import Consulta from './pages/Consulta';

const Routes = createAppContainer(
  createStackNavigator({
    Login,
    Signup,
    MENU,
    Cadastro,
    Consulta
  },
  {
    initialRouteName:"Login",
    defaultNavigationOptions:{
      headerShown:false
    },
  })
);

export default Routes;