import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Partogramme, data_t } from "../store/partogramme/partogrammeStore";
import DataListTable from "./Tables/DataListTable";
import dateFormat from "dateformat";

interface Props {
  // Put props here
  visible: boolean;
  partogramme: Partogramme;
  onCancel: () => void;
}

const createTableData = (dataList: data_t[]) => {
  const tableData = [];
  var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  for (const data of dataList) {
    const dataRow = [] as string[];
    dataRow.push(data.store.name); // data name
    dataRow.push(data.data.value.toString() + " " + data.store.unit); // data value
    let date = new Date(data.data.created_at).toLocaleDateString("fr-FR", options);
    dataRow.push(date); // data timestamp
    tableData.push(dataRow);
  }
  // console.log(tableData);
  return tableData;
};

/**
 * @brief Dialog to
 */
const DataModifierDialog: React.FC<Props> = ({
  // Put props here
  visible,
  partogramme,
  onCancel,
}) => {
  const last10MinutesDataIds = partogramme.Last10MinutesDataIds;
  console.log(last10MinutesDataIds);
  const last10MinutesData = partogramme.getDataByIds(last10MinutesDataIds);
  const tableData = createTableData(last10MinutesData);

  return (
    // Put JSX here
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
        <DataListTable
          Headers={["Type Donnée", "Valeur", "Date"]}
          tableData={tableData}
          widthArr={[100, 100, 100]}
          flexArray={[2, 1, 1]}
        />
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
    backgroundColor: "#F6F3F3",
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
  },
});

export default DataModifierDialog;
