import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SignInButton from '../components/SignInButton';
import SignInInput from '../components/SignInInput';
import {AuthContext} from '../Navigation/AuthProvider';
import {windowHeight} from '../utils/Dimensions';

export default function RegistrationScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {register} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <Text style={styles.text}>
          Sign up with your Email and Password below
        </Text>
      </View>
      <SignInInput
        value={email}
        placeholderText="Email"
        placeholderTextColor="#000"
        onChangeText={(userEmail) => setEmail(userEmail)}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
      />
      <SignInInput
        value={password}
        placeholderText="Password"
        placeholderTextColor="#000"
        onChangeText={(userPassword) => setPassword(userPassword)}
        secureTextEntry={true}
      />
      <SignInButton
        buttonTitle="Register"
        onPress={() => register(email, password)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subcontainer: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: windowHeight / 30,
  },
  text: {
    fontSize: 24,
    marginBottom: 10,
    color: '#000000',
  },
  heading: {
    fontSize: 80,
    marginBottom: 10,
    color: '#000000',
    textAlign: 'left',
  },
});
