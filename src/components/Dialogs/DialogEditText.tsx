import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

export interface Props {
  // Put props here
  visible: boolean;
  onClose: (data: string) => void;
  onCancel: () => void;
  data_name: string;
  data?: string;
}

/**
 * @brief Dialog to edit data
 */
export const DialogEditText: React.FC<Props> = ({
  // Put props here
  visible,
  onClose,
  onCancel,
  data_name,
  data = "",
}) => {
  // Put state variables here
  const [dataText, setDataText] = useState(data);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          onCancel();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Modifier {data_name}</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setDataText(text)}
              value={dataText}
              multiline={true}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  onClose(dataText);
                }}
              >
                <Text style={styles.buttonText}>Valider</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  onCancel();
                }}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "#000000aa",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  },
  textInput: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    width: 200,
    height: 100,
    alignContent: "flex-start",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#403572",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});