import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';

// Importa las pantallas
import Perfil from './Pantallas/Perfil';
import OpenAi from './Pantallas/OpenAi';
import Lista from './Pantallas/Lista';
import PDF from './Pantallas/PDF';

// Crea el navegador de pestañas
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline'; 
          } else if (route.name === 'OpenAI') {
            iconName = focused ? 'brain' : 'brain'; 
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Lista') {
            iconName = focused ? 'form' : 'form'; 
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'PDF') {
            iconName = focused ? 'document-text' : 'document-text-outline'; 
          }

          // Devuelve el componente de icono
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name='Perfil' component={Perfil} />

      <Tab.Screen name='OpenAI' component={OpenAi} />

      <Tab.Screen name='Lista' component={Lista} />

      <Tab.Screen name='PDF' component={PDF} />
    </Tab.Navigator> 
  );
}

export default function Navigation(){
  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}
