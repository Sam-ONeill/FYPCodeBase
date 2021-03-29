import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen.js';
import ProfileScreen from '../Screens/ProfileScreen.js';
import CreateGroupScreen from '../Screens/CreateGroupScreen.js';
import ChatRoomScreen from '../Screens/ChatRoomScreen';
import GroupScreen from '../Screens/GroupScreen';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="GroupPage"
        component={GroupScreen}
        options={({route}) => ({
          title: route.params.thread.name,
        })}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({route}) => ({
          title: route.params.thread.name,
        })}
      />
    </Stack.Navigator>
  );
}
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
function GroupStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Add a Group" component={CreateGroupScreen} />
    </Stack.Navigator>
  );
}
export default function App() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Add Group" component={GroupStack} />
    </Tab.Navigator>
  );
}
