// In App.js in a new project

import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./Screens/Home";
import Actions from "./Screens/Actions";
import PlayGround from "./Screens/PlayGround";
import StoreContextProvider from "./Context";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <StoreContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Actions" component={Actions} />
          <Stack.Screen name="PlayGround" component={PlayGround} />
        </Stack.Navigator>
      </NavigationContainer>
    </StoreContextProvider>
  );
}

export default App;
