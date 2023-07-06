import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ToastAndroid,
  Alert,
  Platform,
} from "react-native";
import "react-native-url-polyfill/auto";
import CustomButton from "../../components/CustomButton";
import { rootStore } from "../../store/rootStore";

export function ScreenLogin({ navigation }) {
  // Login variables
  const [email, SetEmail] = useState("victorbellemin@outlook.fr");
  const [password, SetPassword] = useState("jeanne42");

  const LoginButtonPressed = () => {
    if (email.length == 0) {
      Alert.alert("Please enter a Valid Email Adress");
    } else {
      console.log("Function : LoginButtonPressed");
      rootStore.userStore.signInWithEmail(email, password).then((result) => {
        if (result) {
          navigation.navigate("Screen_Menu");
        }
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
