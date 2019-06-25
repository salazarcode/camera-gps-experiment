import { createStackNavigator, createAppContainer } from "react-navigation";

import Position from './Position'
import Camara from './Camara'
import CamaraAPI from './CameraFromAPI'

const AppNavigator = createStackNavigator({
  Position: Position,
  Camara: Camara,
  CamaraAPI: CamaraAPI
},
{
  initialRouteName: "Position"
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;