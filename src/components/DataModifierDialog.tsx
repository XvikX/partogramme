import React from "react";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Partogramme, data_t } from "../store/partogramme/partogrammeStore";
import DataListTable from "./Tables/DataListTable";
import dateFormat from "dateformat";
import EditDataDialog from "./EditDataDialog";
import { DataList } from "./DataList";
import DialogDataInputTable, { DataInputTable_t } from "./DialogDataInputTable";
import { AmnioticLiquidStore } from "../store/AmnioticLiquid/amnioticLiquidStore";
import { MotherTemperatureStore } from "../store/MotherTemperature/motherTemperatureStore";

interface Props {
  // Put props here
  visible: boolean;
  partogramme: Partogramme;
  onCancel: () => void;
}

const createTableData = (dataList: data_t[]) => {
  const tableData = [];
  var options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  for (const data of dataList) {
    const dataRow = [] as string[];
    dataRow.push(data.store.name); // data name
    dataRow.push(data.data.value.toString() + " " + data.store.unit); // data value
    let date = new Date(data.data.created_at).toLocaleDateString(
      "fr-FR",
      options
    );
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
  // Put state variables here
  const [isEditDataTableVisible, setEditDataTableDialogVisible] = useState(false);
  const [currentSelectedDataId, setCurrentSelectedDataId] = useState("");

  const last10MinutesData = partogramme.Last10MinutesDataIds;
  for (const data of last10MinutesData) {
    console.log("data id : " + data.data.id);
  }

  return (
    // Put JSX here
    <View>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View style={styles.modalView}>
          {/* <Text style={{ fontSize: 20, fontWeight: "", marginBottom: 15 }}>
            Données des 10 dernières minutes
          </Text>
          <DataListTable
            Headers={["Type Donnée", "Valeur", "Date"]}
            tableDataString={tableData}
            widthArr={[50, 150, 100, 100]}
            onPress={(index) => {
              console.log("pressed row index : " + index.toString());
              setEditDialogVisible(true);
            }}
            // flexArray={[1,4, 2, 2]}
          /> */}
          <DataList
            title={"Données des 10 dernières minutes"}
            dataList={partogramme.Last10MinutesDataIds}
            onEditButtonPress={(item) => {
              console.log("Edit button pressed !");
              setCurrentSelectedDataId(item.data.id);
              console.log("type of item.store : " + typeof item.store);
              if (item.store)
              setEditDataTableDialogVisible(true);
            }}
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
      <DialogDataInputTable
        visible={isEditDataTableVisible}
        onClose={(dataStore?: DataInputTable_t, data?: string) => {

        }
        }
        onCancel={() => setEditDataTableDialogVisible(false)}
        data={[
          partogramme.amnioticLiquidStore,
          partogramme.motherBloodPressureStore,
          partogramme.motherHeartRateFrequencyStore,
          partogramme.motherTemperatureStore,
          partogramme.motherContractionFrequencyStore,
        ]}
      />
      {/* <EditDataDialog
        visible={isEditDialogVisible}
        // data={partogramme.dataList[0]}
        onCancel={() => {
          setEditDialogVisible(false);
        }}
        onValidate={() => {
          setEditDialogVisible(false);
        }}
      /> */}
    </View>
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
    height: "95%",
    margin: 20,
    backgroundColor: "#efedff",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowRadius: 10,
    elevation: 20,
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

export default DataModifierDialog;
