import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import 'react-native-url-polyfill/auto';

// Screen Importation
import { ScreenLogin } from "./src/screens/Login/Login";
import { ScreenMenu } from "./src/screens/Menu/Menu";
import { ScreenAddPartogramme } from "./src/screens/AddPartogramme/AddPartogramme";
import { ScreenGraph } from "./src/screens/Graph/Graph";
import { ScreenAdmin } from "./src/screens/Admin/Admin";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['https://partogramme.com', 'mypartogramme://'],
  config: {
    screens: {
      Screen_Login: '/login',
      Screen_Menu: '/menu',
      Screen_AddPartogramme: '/add_partogramme',
      Screen_Graph: '/graph',
      Screen_Admin: '/admin',
    }
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
      linking={linking}
      >
        <Stack.Navigator
        >
          <Stack.Screen
            name="Screen_Login"
            component={ScreenLogin}
            options={{
              title: "Login",
              headerShown: false,
          }}
          />
          <Stack.Screen
            name="Screen_Menu"
            component={ScreenMenu}
            options={{
              title: "Menu des Partogrammes",
              headerTintColor: "#403572",
              headerTitleAlign: "center",
              // headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="Screen_AddPartogramme"
            component={ScreenAddPartogramme}
            options={{
              title: "Nouveau Partogramme",
              headerTintColor: "#403572",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="Screen_Graph"
            component={ScreenGraph}
            options={{
              title: "Partogramme",
              headerTintColor: "#403572",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="Screen_Admin"
            component={ScreenAdmin}
            options={{
              title: "Administration",
              headerTintColor: "#403572",
              headerTitleAlign: "center",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
