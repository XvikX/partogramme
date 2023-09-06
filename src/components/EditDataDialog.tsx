import React from "react";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Partogramme, data_t } from "../store/partogramme/partogrammeStore";
import DataListTable from "./Tables/DataListTable";
import dateFormat from "dateformat";

interface Props {
  // Put props here
  visible: boolean;
  data?: data_t;
  onValidate: () => void;
  onCancel: () => void;
}

/**
 * @brief Dialog to edit data
 */
const EditDataDialog: React.FC<Props> = ({
  // Put props here
  visible,
  data,
  onCancel,
  onValidate,
}) => {
  // Put state variables here

  return (
    // Put JSX here
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}

      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View style={styles.modalView}>
        <TouchableOpacity
              style={[styles.button, styles.buttonCancel, { marginLeft: 50 }]}
              onPress={() => {
                onCancel();
              }}
            >
              <Text style={{ color: "white" }}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Put styles here
  container: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    justifyContent: "center",
    width: "90%",
    position: "absolute",
    top: "30%",
    left: "0%",
    margin: 20,
    backgroundColor: "#d0cbeb",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
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
    backgroundColor: "#C5613E",
    alignSelf: "flex-end",
  },
});

export default EditDataDialog;
