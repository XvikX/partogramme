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
import { AmnioticLiquidStore } from "../store/AmnioticLiquid/amnioticLiquidStore";
import { MotherBloodPressureStore } from "../store/MotherBloodPressure/motherBloodPressureStore";
import { MotherContractionsFrequencyStore } from "../store/MotherContractionsFrequency/motherContractionsFrequencyStore";
import { MotherHeartFrequencyStore } from "../store/MotherHeartFrequency/motherHeartFrequencyStore";
import { MotherTemperatureStore } from "../store/MotherTemperature/motherTemperatureStore";
import { Database } from '../../types/supabase';
import { log } from "console";
import DataTable from "./Tables/DataTable";
import { liquidStates } from "../../types/constants";

export type DataInputTable =
  | AmnioticLiquidStore
  | MotherBloodPressureStore
  | MotherContractionsFrequencyStore
  | MotherHeartFrequencyStore
  | MotherTemperatureStore;

export interface Props {
  visible: boolean;
  data: DataInputTable[];
  onClose: (dataStore: DataInputTable, data: string) => void;
  onCancel: () => void;
}

/**
 * @brief Dialog to input data for the table model
 * @param visible boolean to show or hide the dialog
 * @param data data where the new data will be added
 * @param onClose function to call when the dialog is closed
 * @param onCancel function to call when the dialog is canceled
 * @returns a dialog to input data for the graph
 * @example
 * // returns a dialog to input data for the graph
 * <DialogDataInputGraph
 *  visible={dialogVisible}
 *  data={data}
 *  onClose={onDialogClose}
 *  onCancel={() => setDialogVisible(false)}
 * />
 */
const DialogDataInputGraph: React.FC<Props> = ({
  visible,
  data,
  onClose,
  onCancel,
}) => {
  const [selectedDataName, setSelectedDataName] = useState(
    data ? data[0].name : ""
  );
  const [selectedDataNameIndex, setSelectedDataNameIndex] = useState(0);
  const [pickerDataNameOnFocus, setPickerDataNameOnFocus] = useState(false);
  const [selectedAmnioticLiquidState, setSelectedAmnioticLiquidState] =
    useState(liquidStates[0]);
  const [inputDecimalNumber, setInputDecimalNumber] = useState("0");

  const generateDataNamesItem = () => {
    const items = [];
    // iterate trough the data array to get the data names
    for (let i = 0; i < data.length; i++) {
      items.push(
        <Picker.Item
          key={i}
          label={data[i].name}
          value={data[i].name}
          style={[
            styles.pickerItems,
            { color: pickerDataNameOnFocus ? "white" : "black" },
          ]}
        />
      );
    }
    return items;
  };

  // Generate the items for the amniotic liquid picker
  const generateAmnioticLiquidItems = () => {
    const items = [];
    // iterate trough the enum Liquid State to get the data names
    for (let i = 0; i < Object.keys(liquidStates).length; i++) {
      items.push(
        <Picker.Item
          key={i}
          label={liquidStates[i]}
          value={liquidStates[i]}
          style={[
            styles.pickerItems,
            { color: pickerDataNameOnFocus ? "white" : "black" },
          ]}
        />
      );
    }
    return items;
  };

  /**
   * @brief Render the picker for the data input
   * @returns the picker for the data input
   */
  const renderDataPicker = () => {
    if (
      selectedDataName === data[0].partogrammeStore.amnioticLiquidStore.name
    ) {
      // Create a picker for the amniotic liquid state
      return (
        <View style={styles.liquidStatesPickerContainer}>
          <Picker
            style={styles.pickerStyle}
            numberOfLines={1}
            onFocus={() => {
              setPickerDataNameOnFocus(true);
            }}
            mode="dropdown"
            dropdownIconColor={"white"}
            prompt="Sélectionnez une donnée"
            selectedValue={selectedAmnioticLiquidState}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedAmnioticLiquidState(itemValue);
            }}
          >
            {generateAmnioticLiquidItems()}
          </Picker>
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.inputTextNumber}
            keyboardType="numeric"
            onChangeText={(text) => setInputDecimalNumber(text)}
            value={inputDecimalNumber}
            maxLength={10} //setting limit of input
          />
          <Text style = {styles.unitText}>{data[selectedDataNameIndex].unit}</Text>
        </View>
      );
    }
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
          Sélectionnez le type de données à ajouter
        </Text>
        <View style={styles.dataNamePickerContainer}>
          <Picker
            style={styles.pickerStyle}
            numberOfLines={2}
            onFocus={() => {
              setPickerDataNameOnFocus(true);
            }}
            mode="dropdown"
            dropdownIconColor={"white"}
            prompt="Sélectionnez un type de données"
            selectedValue={selectedDataName}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedDataName(itemValue);
              setSelectedDataNameIndex(itemIndex);
            }}
          >
            {generateDataNamesItem()}
          </Picker>
        </View>
        <Text style={styles.modalText}>Sélectionnez la valeur à ajouter</Text>
        {
          // render the input depending on the selected data name
          renderDataPicker()
        }
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[styles.button, styles.buttonValidate]}
            onPress={() => {
              onClose(selectedDataName);
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
    justifyContent: "center",
    width: "90%",
    position: "absolute",
    top: "30%",
    left: "0%",
    margin: 20,
    backgroundColor: "#F6F3F3",
    borderRadius: 20,
    padding: 20,
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
    marginTop: 10,
  },
  buttonValidate: {
    backgroundColor: "#403572",
  },
  buttonCancel: {
    backgroundColor: "#DE2C1D",
  },
  modalText: {
    fontSize: 15,
    marginBottom: 5,
    textAlign: "center",
  },
  inputTextNumber: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    alignContent: "stretch",
    marginRight: 5,
    textAlign: "right",
    padding: 5,
    backgroundColor: "#403572",
    color: "white",
  },
  pickerStyle: {
    height: 50,
    width: "100%",
    textAlign: "center",
    color: "white",
  },
  dataNamePickerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    verticalAlign: "center",
    width: "100%",
    backgroundColor: "#403572",
    margin: 10,
    padding: 1,
    borderRadius: 25,
  },
  liquidStatesPickerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    verticalAlign: "center",
    width: 200,
    backgroundColor: "#403572",
    margin: 10,
    padding: 1,
    borderRadius: 25,
  },
  pickerItems: {
    textAlign: "center",
    textAlignVertical: "center",
  },
  unitText: {
    textAlign: "right",
    textAlignVertical: "center",
  },
});

export default DialogDataInputGraph;
