import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimensions';
export default function SignInInput({labelName, placeholderText, ...rest}) {
  return (
    <TextInput
      label={labelName}
      style={styles.input}
      numberOfLines={1}
      {...rest}
      placeholder={placeholderText}
      placeholderTextColor="#ffff"
      {...rest}
    />
  );
}
const styles = StyleSheet.create({
  input: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    color: '#000000',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#2ce784',
  },
});
