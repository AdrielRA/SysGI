import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Login  from './pages/Login';
import Signup from './pages/Signup';
import MENU from './pages/MENU';
import Cadastro from './pages/Cadastro';
import Consulta from './pages/Consulta';
import Controle from './pages/Controle';
import Anexo from './pages/Anexo';
const Routes = createAppContainer(
  createStackNavigator({
    Login,
    Signup,
    MENU,
    Cadastro,
    Consulta,
    Controle,
    Anexo
  },
  {
    //initialRouteName:"Login",
    defaultNavigationOptions:{
      headerShown:false
    },
  })
);

export default Routes;