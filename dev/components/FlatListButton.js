import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimensions';

export default function FlatListButton({buttonTitle, ...rest}) {
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
    width: windowWidth / 3,
    height: windowWidth / 3,
    backgroundColor: '#2ce784',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: windowWidth,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  buttonText: {
    fontSize: 28,
    color: '#ffffff',
    textAlign: 'center',
  },
});
