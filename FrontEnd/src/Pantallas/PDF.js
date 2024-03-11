import React, { useState, useRef } from 'react';
import { View, Button, Text, Alert, StyleSheet, TextInput, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const ChatMessage = ({ message }) => {
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};


const ChatScreen = () => {
  const [textoDelInput, setTextoDelInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedFileUri, setSelectedFileUri] = useState(null); // Estado para almacenar la URI del archivo seleccionado
  const scrollViewRef = useRef();

  const clasificar= async()=>{
    if (!textoDelInput.trim()) {
      Alert.alert('Error', 'Por favor, introduzca algún texto para clasificar.');
      return;
    }
  
    try {
      // Preparar el cuerpo de la solicitud. Asumimos que tu backend espera un campo de texto llamado 'texto'
      const body = {
        texto: textoDelInput,
      };
  
      // Realizar la solicitud POST al backend
      const response = await axios.post('http://192.168.200.219:5000/procesar_texto', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        console.log('Texto enviado correctamente al backend');
  
        // Aquí puedes manejar la respuesta del servidor, por ejemplo, mostrándola en la interfaz de usuario
        const formattedResponse = formatResponse(response.data);
  
        // Ejemplo de cómo podrías actualizar el estado para mostrar mensajes
        setChatMessages(prevMessages => [...prevMessages, 'Texto clasificado correctamente:', formattedResponse]);
      } else {
        console.log('Error al enviar el texto al backend:', response.statusText);
        Alert.alert('Error', 'Hubo un problema al enviar el texto para su clasificación');
      }
    } catch (error) {
      console.log('Error al enviar el texto:', error);
      Alert.alert('Error', 'Hubo un problema al enviar el texto para su clasificación');
    }
  }

  const enviarPDF = async () => {
    if (!selectedFileUri) {
      Alert.alert('Error', 'Por favor, seleccione un archivo PDF');
      return;
    }
  
    try {
      // Obtener el archivo como bytes
      const pdfBytes = await FileSystem.readAsStringAsync(selectedFileUri, { encoding: FileSystem.EncodingType.Base64 });
  
      // Crear FormData y adjuntar el archivo como bytes
      const formData = new FormData();
      formData.append('pdf_file', {
        uri: selectedFileUri,
        name: 'pdf_file',
        type: 'application/pdf',
        data: pdfBytes,
      });
  
      // Realizar la solicitud POST al backend
      const response = await axios.post('http://192.168.200.219:5000/procesar_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        console.log('El Archivo fue enviado correctamente al backend');
  
        // Formatear la respuesta del backend como una cadena de texto antes de agregarla a chatMessages
        const formattedResponse = formatResponse(response.data);
  
        // Agregar mensaje al chat
        setChatMessages(prevMessages => [...prevMessages, 'PDF enviado correctamente al backend']);
        // Agregar la respuesta del backend al chat
        setChatMessages(prevMessages => [...prevMessages, formattedResponse]);
      } else {
        console.log('Error al enviar el PDF al backend:', response.statusText);
        // Manejar el error si la solicitud no fue exitosa
        Alert.alert('Error', 'Hubo un problema al enviar el PDF al backend');
      }
    } catch (error) {
      console.log('Error al enviar el PDF:', error);
      // Manejar el error si ocurre un problema al enviar el PDF
      Alert.alert('Error', 'Hubo un problema al enviar el PDF');
    }
  };
  
  // Función para formatear la respuesta del backend como una cadena de texto
  const formatResponse = (data) => {
    let formattedResponse = '';
    // Iterar sobre las claves y valores del objeto de respuesta
    for (const key in data) {
      formattedResponse += `${key}: ${data[key]}, `;
    }
    // Eliminar la coma y el espacio extra al final de la cadena
    formattedResponse = formattedResponse.slice(0, -2);
    return formattedResponse;
  };  

  const seleccionarArchivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
  
      if (!result.cancelled) {
        const fileUri = result.assets[0].uri; // Acceder correctamente a la URI del PDF seleccionado
        console.log('PDF seleccionado:', result);
        console.log('URI del PDF:', fileUri);
        setSelectedFileUri(fileUri);
      } else {
        console.log('El usuario canceló la selección del PDF');
      }
    } catch (error) {
      console.log('Error al seleccionar el PDF:', error);
      // Manejar el error si ocurre un problema al seleccionar el PDF
      Alert.alert('Error', 'Hubo un problema al seleccionar el PDF');
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.chatContainer}
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContentContainer}
      >
        {chatMessages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </ScrollView>
      
      <View style={styles.input}>
        <TextInput
          value={textoDelInput}
          onChangeText={setTextoDelInput}
          placeholder="Escribe aquí..."
        />
      </View>

      <View style={styles.buttonContainer}>
          <Button title="Clasifica" onPress={clasificar} />
        </View>

      <View style={styles.buttonContainer}>
        <Button title="Seleccionar Archivo" onPress={seleccionarArchivo} />
      </View>
      {selectedFileUri && (
        <View style={styles.buttonContainer}>
          <Button title="Enviar" onPress={enviarPDF} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  chatContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 10,
    weight: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  buttonContainer: {
    marginBottom: 20,
  },
});

export default ChatScreen;
