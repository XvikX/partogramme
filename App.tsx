import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screen Importation
import { ScreenLogin } from './src/screens/Login/Login';
import { ScreenMenu } from './src/screens/Menu/Menu';
import { ScreenAddPartogramme } from './src/screens/AddPartogramme/AddPartogramme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Screen_Login"
          component={ScreenLogin}
          options={{title: 'Login'}}
        />
        <Stack.Screen
          name="Screen_Menu"
          component={ScreenMenu}
          options={{
            title: 'Menu des Partogrammes',
            headerTintColor: "#403572",
            headerTitleAlign: "center",
        }}
        />
        <Stack.Screen
          name="Screen_AddPartogramme"
          component={ScreenAddPartogramme}
          options={{
            title: 'Création du nouveau Partogramme',
            headerTintColor: "#403572",
            headerTitleAlign: "center",
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
