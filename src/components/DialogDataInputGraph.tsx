import React, { useState } from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

interface Props {
  visible: boolean;
  dataName: string;
  startValue: number;
  endValue: number;
  step: number;
  onClose: (data: string, delta: string) => void;
  onCancel: () => void;
}

/**
 * @brief Dialog to input data for the graph
 * @param visible boolean to show or hide the dialog
 * @param dataName name of the data to input
 * @param startValue start value of the picker
 * @param endValue end value of the picker
 * @param step step of the picker
 * @param onClose function to call when the dialog is closed
 * @param onCancel function to call when the dialog is canceled
 * @returns a dialog to input data for the graph
 * @example
 * // returns a dialog to input data for the graph
 * <DialogDataInputGraph
 *  visible={dialogVisible}
 *  onClose={onDialogClose}
 *  onCancel={() => setDialogVisible(false)}
 *  startValue={120}
 *  endValue={180}
 *  step={10}
 * />
 */
const DialogDataInputGraph: React.FC<Props> = ({
  visible,
  dataName,
  onClose,
  onCancel,
  startValue,
  endValue,
  step,
}) => {
  const [selectedValue, setSelectedValue] = useState(startValue.toString());
  const [delta, onChangeDelta] = useState("");

  const generatePickerItems = () => {
    const items = [];
    for (let i = startValue; i <= endValue; i += step) {
      items.push(
        <Picker.Item key={i} label={i.toString()} value={i.toString()} />
      );
    }
    return items;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View style={styles.modalView}>
        <Text style={styles.modalText}>
          Sélectionnez la valeur de {dataName}
        </Text>
        <View 
          style={{
            backgroundColor: "#D6A02A",
            borderRadius: 10,
            width: "100%",
            paddingRight: 10,
          }}
        >
          <TextInput
            style={styles.input}
            placeholder="Entrez un delta (facultatif/test)"
            placeholderTextColor={"#FFFFFF"}
            onChangeText={(text) => onChangeDelta(text)}
            keyboardType="numeric"
          />
        </View>
        <Picker
          style={{ height: 50, width: 120, marginBottom: 10 }}
          prompt="Sélectionnez un chiffre"
          selectedValue={selectedValue}
          onValueChange={(itemValue) => setSelectedValue(itemValue)}
        >
          {generatePickerItems()}
        </Picker>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[styles.button, styles.buttonValidate]}
            onPress={() => {
              onClose(selectedValue, delta);
            }}
          >
            <Text style={{ color: "white" }}>Valider</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonCancel, { marginLeft: 50 }]}
            onPress={() => {
              onCancel();
            }}
          >
            <Text style={{ color: "white" }}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    width: '90%',
    position: 'absolute',
    top: '30%',
    left: '0%',
    margin: 20,
    backgroundColor: "#F6F3F3",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonValidate: {
    backgroundColor: "#403572",
  },
  buttonCancel: {
    backgroundColor: "#DE2C1D",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    fontSize: 18,
    marginRight: 5,
    marginLeft: 5,
    margin: 10,
    width: "100%",
  },
});

export default DialogDataInputGraph;
