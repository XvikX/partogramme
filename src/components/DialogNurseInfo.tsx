/**
 * This components render a dialog allowing the user to enter his nurse info
 */
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, ToastAndroid } from "react-native";
import { Dialog } from "@rneui/themed";
import { Dispatch, SetStateAction } from "react";
import { observer } from "mobx-react";
import { rootStore } from "../store/rootStore";

interface IProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

/**
 * This components render a dialog allowing the user to enter his nurse info
 * @param isVisible - boolean that indicates if the dialog is visible or not
 * @param setIsVisible - function that allows to change the visibility of the dialog
 */
export const DialogNurseInfo = observer(
  ({ isVisible, setIsVisible }: IProps) => {
    const [lastName, onChangeLastName] = useState("");
    const [FirstMidName, onChangeFirstMidName] = useState("");
    const [refDoctor, onchangeRefDoctor] = useState("");

    const toggleDialog = () => {
      setIsVisible(!isVisible);
    };

    const handleCancel = () => {
      if (!(lastName === "" || FirstMidName === "" || refDoctor === "")) {
        setIsVisible(false);
      }
    };

    const handleValidate = () => {
      rootStore.userStore
        .UpdateServerProfileInfo(FirstMidName, lastName, refDoctor)
        .then(() => {
          if (Platform.OS === "android")
          {
            ToastAndroid.show("Informations mises à jour", ToastAndroid.SHORT);
          }
          setIsVisible(false);
        })
        .catch((error) => {
          console.log("Error updating nurse info", error);
          if (Platform.OS === "android")
          {
            ToastAndroid.show(
              "Erreur lors de la mise à jour des informations",
              ToastAndroid.SHORT
            );
          }
        });
    };

    return (
      <Dialog 
        isVisible={isVisible} 
        onBackdropPress={toggleDialog}
        overlayStyle = {styles.overlay}
      >
        <Dialog.Title title="Entrez vos informations" />
        <Text>S'il vous plaît entrez votre nom et prénom</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom de famille"
          placeholderTextColor={"#939F99"}
          onChangeText={(text) => onChangeLastName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          placeholderTextColor={"#939F99"}
          onChangeText={(text) => onChangeFirstMidName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Docteur de référence"
          placeholderTextColor={"#939F99"}
          onChangeText={(text) => onchangeRefDoctor(text)}
        />
        <Dialog.Actions>
          <Dialog.Button
            title="ANNULER"
            onPress={() => handleCancel()}
            buttonStyle = {styles.cancelButton}
            type="solid"
          />
          <Dialog.Button
            title="VALIDER"
            onPress={() => handleValidate()}
            buttonStyle = {styles.validateButton}
            type="solid"
          />
        </Dialog.Actions>
      </Dialog>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    width: '90%',
    margin: 5,
    padding: 10,
  },
  cancelButton : {
    width: 100,
    borderRadius: 10,
    backgroundColor: 'red',
  },
  validateButton : {
    width: 100,
    borderRadius: 10,
    backgroundColor: '#403572',
    marginRight: 20,
  },
  input: {
      alignSelf: 'center',
      textAlign: 'center',
      borderWidth: 1,
      borderColor: '#555',
      borderRadius: 5,
      fontSize: 20,
      marginRight: 50,
      marginLeft: 50,
      margin: 10,
      width: 300,
  },
});
