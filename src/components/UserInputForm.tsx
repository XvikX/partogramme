import { Button } from "@rneui/themed";
import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

interface UserInputFormProps {
  // Define your props here
  onSubmit: (value: string) => void;
  formInstructions: string;
  stylesInstructions?: any;
  containerStyle?: any;
  isVisible: boolean;
}

const UserInputForm: React.FC<UserInputFormProps> = (props) => {
  const [userEmail, setUserEmail] = React.useState("");
  return props.isVisible ? (
    <View
    style={[
      styles.container,
      {
        borderBottomColor: "#403572",
        flexDirection: "row",
      },
      props.containerStyle,
    ]}
    >
      <View style={{ flexDirection: "column" }}>
        <Text style={[styles.instructions, props.stylesInstructions]}>
          {props.formInstructions}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Adresse email"
          placeholderTextColor={"#939F99"}
          textAlign="left"
          onChangeText={(text) => setUserEmail(text)}
        />
      </View>
      <Button
        buttonStyle={{
          backgroundColor: "#403572",
          borderRadius: 20,
          width: 150,
          marginTop: 10,
          marginLeft: 150,
        }}
        onPress={() => props.onSubmit(userEmail)}
      >
        Inviter
      </Button>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  // Define your styles here
  container: {
    backgroundColor: "#d5d0e9",
    paddingLeft: 5,
    padding:10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 1,
    marginTop: 5,
    marginBottom: 5,
  },
  instructions: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#403572",
  },
  input: {
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    backgroundColor: "#ffffff",
    fontSize: 20,
    margin: 10,
    width: 300,
    color: "#403572",
  },
});

export default UserInputForm;
