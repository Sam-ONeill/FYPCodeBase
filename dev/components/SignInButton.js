import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimensions';

export default function SignInButton({buttonTitle, ...rest}) {
  return (
    <TouchableOpacity style={styles.buttonContainer} {...rest}>
      <Text style={styles.buttonText}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    marginBottom: windowHeight / 50,
    marginRight: windowHeight / 50,
    width: windowWidth / 2.5,
    height: windowHeight / 14,
    backgroundColor: '#ffffff',
    padding: 10,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#2ce784',
  },
  buttonText: {
    fontSize: 28,
    color: '#000000',
  },
});
