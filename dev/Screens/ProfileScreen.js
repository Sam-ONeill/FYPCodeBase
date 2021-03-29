import React, {useContext} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import SignInButton from '../components/SignInButton';
import {AuthContext} from '../Navigation/AuthProvider';
import {windowWidth} from '../utils/Dimensions';

export default function ProfileScreen({navigation}) {
  const {user, logout} = useContext(AuthContext);
  const atPos = user.email.indexOf('@');
  const UserName = user.email.slice(0, atPos);
  return (
    <View style={PS.container}>
      <Text style={PS.HeadingText}>Welcome</Text>
      <Text style={PS.HeadingText}>{UserName}</Text>
      <Text style={PS.text}>Your user ID is {user.uid}</Text>
      <Image
        source={require('../Icons/user.png')}
        style={StyleSheet.iconSize}
        resizeMode={'center'}
      />
      {/* Icon made by Freepik https://www.freepik.com */}

      <SignInButton buttonTitle="Logout" onPress={() => logout()} />
    </View>
  );
}
const PS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerHeader: {
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    backgroundColor: '#2ce784',
  },
  containerMiddle: {
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 2,
  },
  containerFooter: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flexGrow: 3,
  },
  HeadingText: {
    textAlign: 'center',
    fontSize: 0.09 * windowWidth,
    color: '#000000',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: '#333333',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconSize: {
    width: windowWidth / 10,
    height: windowWidth / 10,
  },
});
