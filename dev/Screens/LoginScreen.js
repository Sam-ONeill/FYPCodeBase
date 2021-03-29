import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, PermissionsAndroid} from 'react-native';
import SignInButton from '../components/SignInButton';
import SignInInput from '../components/SignInInput';
import {AuthContext} from '../Navigation/AuthProvider';
import {windowHeight, windowWidth} from '../utils/Dimensions';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useContext(AuthContext);

  useEffect(() => {
    requestCameraPermission();
  }, []);
  //Request permissions to access Photos and Files
  const requestCameraPermission = async () => {
    try {
      const grantedPhoto = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      const grantedStorageRead = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      const grantedStorageWrite = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (
        grantedPhoto &&
        grantedStorageRead &&
        grantedStorageWrite === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the camera and storage');
      } else {
        console.log('Camera and storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Headingtext}>{'Find \nYour \nStudy\nGroup'}</Text>
      <View style={styles.subcontainer}>
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
          buttonTitle="Sign in"
          onPress={() => login(email, password)}
        />
        <View style={styles.regcontainer}>
          <Text style={styles.navButtonText}>New user? Join here</Text>
          <SignInButton
            buttonTitle="Registration"
            onPress={() => navigation.navigate('RegistrationScreen')}
          />
        </View>
        <View style={styles.iconcontainer} />
        {/*<Text style={styles.Headingtext}> Apple Google Outlook</Text> */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    textAlign: 'left',
    alignItems: 'center',
  },
  subcontainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconcontainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regcontainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight / 5,
  },
  text: {
    fontSize: 24,
    marginBottom: 10,
    color: '#000000',
  },
  Headingtext: {
    fontSize: windowHeight / 18,
    marginBottom: 10,
    color: '#2ce784',
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 20,
    color: '#000000',
  },
});
