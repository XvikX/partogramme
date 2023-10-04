/**
 * This components render a dialog allowing the user to enter his nurse info
 */
import {
  StyleSheet,
  Text
} from "react-native";
import { Dialog } from "@rneui/themed";
import { Dispatch, SetStateAction } from "react";
import { observer } from "mobx-react";

interface IProps {
  isVisible: boolean;
  Title: string;
  InfoText?: string;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  onValidate: () => void;
}

/**
 * This components render a dialog allowing the user to enter his nurse info
 * @param isVisible - boolean that indicates if the dialog is visible or not
 * @param setIsVisible - function that allows to change the visibility of the dialog
 */
export const DialogConfirm = observer(
  ({ isVisible, setIsVisible, onValidate, Title, InfoText }: IProps) => {
    const toggleDialog = () => {
      setIsVisible(!isVisible);
    };

    const handleCancel = () => {
      setIsVisible(false);
    };

    const handleValidate = () => {
      onValidate();
      setIsVisible(false);
    };

    return (
      <Dialog
        isVisible={isVisible}
        onBackdropPress={toggleDialog}
        overlayStyle={styles.overlay}
        animationType="fade"
      >
        <Dialog.Title title={Title} />
        <Text>{InfoText}</Text>
        <Dialog.Actions>
          <Dialog.Button
            title="ANNULER"
            onPress={() => handleCancel()}
            buttonStyle={styles.cancelButton}
            type="solid"
          />
          <Dialog.Button
            title="VALIDER"
            onPress={() => handleValidate()}
            buttonStyle={styles.validateButton}
            type="solid"
          />
        </Dialog.Actions>
      </Dialog>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    width: "90%",
    margin: 5,
    padding: 10,
  },
  cancelButton: {
    width: 100,
    borderRadius: 10,
    backgroundColor: "red",
  },
  validateButton: {
    width: 100,
    borderRadius: 10,
    backgroundColor: "#403572",
    marginRight: 20,
  },
  input: {
    alignSelf: "center",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    fontSize: 20,
    marginRight: 50,
    marginLeft: 50,
    margin: 10,
    width: 300,
  },
});
