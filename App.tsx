import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screen Importation
import { ScreenLogin } from './Login/Login';
import { ScreenMenu } from './Menu/Menu';

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
          options={{title: 'Menu des Partogrammes'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
