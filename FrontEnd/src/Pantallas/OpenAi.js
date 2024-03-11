import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

const OpenAi = ({ navigation }) => {
  const [inputValue, setInputValue] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleConsult = () => {
    // Aquí puedes realizar la acción de consultar con el valor ingresado
    console.log('Consultar con el valor:', inputValue);
  };

  return (
    <View style={styles.container}>
      <Text>Ingrese un número:</Text>
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={handleInputChange}
        keyboardType="numeric"
      />
      <Button title="Consultar" onPress={handleConsult} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white"
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor:"rgba(0, 0, 0, 0.15)",
    borderRadius:10,
    borderColor: "white"
  },
  button: {
    width: '80%',
    marginTop: 10,
    backgroundColor:"rgba(0, 0, 0, 0.5)",
    color:"rgba(0, 0, 0, 0.5)"
  },
});

export default OpenAi;
