import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RegistrationScreen from '../Screens/RegistrationScreen.js';
import LoginScreen from '../Screens/LoginScreen.js';
const Stack = createStackNavigator();
export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{header: () => null}}
      />
      <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
    </Stack.Navigator>
  );
}
