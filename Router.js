import { createStackNavigator, createAppContainer } from "react-navigation";

import Position from './Position'
import Camara from './Camara'
import CamaraAPI from './CameraFromAPI'
import Login from './Login'

const AppNavigator = createStackNavigator({
  Position: Position,
  Camara: Camara,
  CamaraAPI: CamaraAPI,
  Login: Login
},
{
  initialRouteName: "Login"
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;