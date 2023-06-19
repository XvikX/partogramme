import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";

// Screen Importation
import { ScreenLogin } from "./src/screens/Login/Login";
import { ScreenMenu } from "./src/screens/Menu/Menu";
import { ScreenAddPartogramme } from "./src/screens/AddPartogramme/AddPartogramme";
import { ScreenGraph } from "./src/screens/Graph/Graph";
import { log } from "console";
import { Platform } from "react-native";

if (__DEV__) {
  if (Platform.OS === "web") {
    import("./reactotron/index.web");
  }
  else {
    import("./reactotron/index.native");
  }
  console.log("Reactotron Configured");
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Screen_Login"
            component={ScreenLogin}
            options={{ title: "Login" }}
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
              title: "Création du nouveau Partogramme",
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
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
