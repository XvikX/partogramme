import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  AppStateStatus,
  AppState,
} from "react-native";
import "react-native-url-polyfill/auto";
import CustomButton from "../../components/CustomButton";
import { rootStore } from "../../store/rootStore";
import { supabase } from "../../initSupabase";

export function ScreenLogin({ navigation }) {
  // Login variables
  const [email, SetEmail] = useState("victorbellemin@outlook.fr");
  const [password, SetPassword] = useState("jeanne42");

  useEffect(() => {
    // Handle app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "inactive" || nextAppState === "background") {
      }
    };

    const handleAuthStateChange = (event: any) => {
      if (event === "SIGNED_OUT") {
        // User is logged out, handle your cleanup process here
        // e.g., clear sensitive data from MobX or secure storage
        // cleanupOnLogout();
        console.log("Auth Event listener : User is logged out");
        // Clean every store
        rootStore.userStore.cleanUp();
        rootStore.partogrammeStore.cleanUp();
      }
      if (event === "SIGNED_IN") {
        // User is logged in
        console.log("Auth Event listener : User is logged in");
      }
    };

    // Listen to Supabase auth state change
    supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Listen to AppState changes to stop listening when the app is in the background or inactive
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Clean up listeners when the component unmounts
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = navigation.addListener("focus", () => {
      supabase.auth.signOut();
    });

    const cleanup = () => {
      // Call your cleanup function here
      console.log("Screen is unmounted or quit");
    };

    return () => {
      cleanup();
      subscription();
    };
  }, [navigation]);

  const LoginButtonPressed = () => {
    if (email.length == 0) {
      Alert.alert("Please enter a Valid Email Adress");
    } else {
      console.log("Function : LoginButtonPressed");
      rootStore.userStore.signInWithEmail(email, password).then((result) => {
        if (result) {
          console.log("Login success");
          navigation.navigate("Screen_Menu");
        }
      })
      .catch((error) => {
        console.log("Login error");
        Alert.alert("Login error : " + error.message);
      });
    }
  };

  return (
    <View style={styles.body}>
      <Text style={styles.text}>Login:</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(value) => SetEmail(value)}
      />
      <Text style={styles.text}>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(value) => SetPassword(value)}
      />
      <CustomButton
        title="Login"
        color="#403572"
        onPressFunction={LoginButtonPressed}
        style={{}}
        styleText={{}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  text: {
    color: "#000000",
    fontSize: 20,
    margin: 10,
    textAlign: "center",
  },
  input: {
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    fontSize: 20,
    marginRight: 50,
    marginLeft: 50,
    width: 344,
  },
});
