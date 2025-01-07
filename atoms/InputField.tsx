import React = require('react');
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: any;
  onChangeText: (input: any) => void;
}

export const InputField = (props: InputFieldProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        style={styles.input}
        value={props.value}
        placeholder={props.placeholder}
        onChangeText={props.onChangeText}
        placeholderTextColor="#000000"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    color: '#000000',
    marginBottom: 5,
    fontSize: 12,
    fontFamily: 'Montserrat',
  },
  input: {
    height: 55,
    minWidth: '30%',
    maxWidth: '80%',
    borderColor: '#CCCCCC',
    borderWidth: 5,
    borderRadius: 15,
    backgroundColor: '#EAE7E7',
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },
});
