import { StyleSheet, Text, View } from "react-native";
import { observer } from "mobx-react";
import { SafeAreaView } from "react-native-safe-area-context";
import DialogDataInputGraph from "../../components/DialogDataInputGraph";
import { useEffect, useState } from "react"; 
import CustomButton from "../../components/CustomButton";
import BabyGraph from "../../components/Graphs/BabyGraph";
import reactotron from "reactotron-react-native";
import { rootStore } from "../../store/rootStore";
import DilationGraph from "../../components/Graphs/DilationGraph";
import { ScrollView } from "react-native-gesture-handler";
import { runInAction } from "mobx";
import DataTable from "../../components/Tables/DataTable";
import DialogDataInputTable, { DataInputTable } from "../../components/DialogDataInputTable";
import { AmnioticLiquidStore } from "../../store/AmnioticLiquid/amnioticLiquidStore";
import { Database } from "../../../types/supabase";
import { MotherBloodPressure, MotherBloodPressureStore } from "../../store/MotherBloodPressure/motherBloodPressureStore";
import { MotherContractionsFrequencyStore } from "../../store/MotherContractionsFrequency/motherContractionsFrequencyStore";
import { MotherHeartFrequencyStore } from "../../store/MotherHeartFrequency/motherHeartFrequencyStore";
import { MotherTemperatureStore } from "../../store/MotherTemperature/motherTemperatureStore";

export type Props = {
  navigation: any;
};

reactotron.onCustomCommand({
  command: "Show Selected Partogramme data",
  handler: () => {
    reactotron.display({
      name: "Selected Partogramme",
      value: {
        data: rootStore.partogrammeStore.selectedPartogramme,
      },
    });
  },
});

reactotron.onCustomCommand({
  command: "Show Partogramme data",
  handler: () => {
    reactotron.display({
      name: "Partogramme",
      value: {
        data: rootStore.partogrammeStore,
      },
    });
  },
});

/**
 * Screen for the graph
 * @param navigation - navigation object that allowed us to navigate between screens
 *
 * TODO: Add the graph
 *
 */
export const ScreenGraph: React.FC<Props> = observer(({ navigation }) => {
  const [fcDialogVisible, setFcDialogVisible] = useState(false);
  const [dilationDialogVisible, setDilationDialogVisible] = useState(false);
  const [descentBabyDialogVisible, setDescentBabyDialogVisible] =
    useState(false);
  const [addTableDataDialogVisible, setAddTableDataDialogVisible] =
    useState(false);

  const partogramme = rootStore.partogrammeStore.selectedPartogramme;
  if (partogramme === undefined) {
    console.log("Partogramme selected is undefined");
    navigation.goBack();
  }

  useEffect(() => {
    // Function to be called on screen opening
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
    });

    const cleanup = () => {
      // Call your cleanup function here
      console.log("Screen is unmounted or quit");
    };

    return () => {
      cleanup();
      unsubscribe();
    };
  }, [navigation]);

  // Create a new frequency baby data and add it to the partogramme
  const onDialogCloseAddFcBaby = (data: string, delta: string | null) => {
    if (partogramme === null) {
      console.error("No patient selected");
      return;
    }
    if (delta === "") {
      delta = null;
    }
    partogramme?.babyHeartFrequencyStore.createBabyHeartFrequency(
      Number(data),
      new Date().toISOString(),
      Number(delta)
    );
    setFcDialogVisible(false);
  };

  // Create a new frequency baby data and add it to the partogramme
  const onDialogCloseAddDilation = (data: string, delta: string | null) => {
    if (partogramme === null) {
      console.error("No patient selected");
      return;
    }
    if (delta === "") {
      delta = null;
    }
    partogramme?.dilationStore.createDilation(
      new Date().toISOString(),
      Number(data),
      Number(delta)
    );
    setDilationDialogVisible(false);
  };

  // Create a new descent baby data and add it to the partogramme
  const onDialogCloseAddDescentBaby = (data: string, delta: string | null) => {
    if (partogramme === null) {
      console.error("No patient selected");
      return;
    }
    if (delta === "") {
      delta = null;
    }
    partogramme?.babyDescentStore.createBabyDescent(
      Number(data),
      new Date().toISOString(),
      Number(delta)
    );
    setDescentBabyDialogVisible(false);
  };

  // Create a new data into the selected data store and add it to the partogramme
  const onDialogCloseAddDataTable = (
    dataStore: DataInputTable,
    data: string,
  ) => {
    if (partogramme === null) {
      console.error("No patient selected");
      return;
    }
    if (dataStore instanceof AmnioticLiquidStore) {
      dataStore.createAmnioticLiquid(
        new Date().toISOString(),
        dataStore.highestRank + 1,
        data as Database["public"]["Enums"]["LiquidState"],
      )
    } else if (dataStore instanceof MotherBloodPressureStore) {
      dataStore.createMotherBloodPressure(
        Number(data),
        new Date().toISOString(),
        dataStore.highestRank + 1,
      )
    } else if (dataStore instanceof MotherContractionsFrequencyStore) {
      dataStore.createMotherContractionsFrequency(
        Number(data),
        new Date().toISOString(),
        dataStore.highestRank + 1,
      )
    } else if (dataStore instanceof MotherHeartFrequencyStore) {
      dataStore.createMotherHeartFrequency(
        Number(data),
        new Date().toISOString(),
        dataStore.highestRank + 1,
      )
    } else if (dataStore instanceof MotherTemperatureStore) {
      dataStore.createMotherTemperature(
        Number(data),
        new Date().toISOString(),
        dataStore.highestRank + 1,
      )
    } else {
      console.error("Unknown data store type");
      return;
    }
    setAddTableDataDialogVisible(false);
  }

  // This function is called when the user clicks on the heartbeat button
  const openFcDialog = () => {
    console.log("Function : open Dialog FC");
    setFcDialogVisible(true);
  };

  // Function is called when the user clicks on the add dilation button
  const openDilationDialog = () => {
    console.log("Function : open Dialog Dilation");
    setDilationDialogVisible(true);
  };

  // function that is called when the user clicks on the add descent baby button
  const openDescentBabyDialog = () => {
    console.log("Function : open Dialog Descent Baby");
    setDescentBabyDialogVisible(true);
  };

  // Function that is called when the user click on the adddata table button
  const openAddDataTable = () => {
    console.log("Function : open Dialog Add Data Table");
    // TODO : open the dialog
    setAddTableDataDialogVisible(true);
  };
  
  const fetchData = () => {
    console.log("Function : fetchData");
    if (partogramme === null) {
      console.log("No patient selected");
      return;
    }
    partogramme?.babyHeartFrequencyStore.loadBabyHeartFrequencies();
  };

  return (
    /**
     * SafeAreaView is used to avoid the notch on the top of the screen
     */
    <ScrollView
      style={styles.body}
      contentContainerStyle={styles.scrollViewContentStyle}
    >
      <Text style={styles.textTitle}>Fréquence Cardiaque du bébé</Text>
      <BabyGraph
        babyHeartFrequencyList={partogramme?.babyHeartFrequencyStore}
      />
      <DialogDataInputGraph
        visible={fcDialogVisible}
        onClose={onDialogCloseAddFcBaby}
        onCancel={() => setFcDialogVisible(false)}
        startValue={120}
        endValue={180}
        step={10}
        dataName={"Fréquence cardiaque du bébé"}
      />
      <CustomButton
        title="Ajouter FC bébé"
        color="#403572"
        style={styles.buttonStyle}
        onPressFunction={openFcDialog}
        styleText={{ fontSize: 15, fontWeight: "bold" }}
      />
      <Text style={styles.textTitle}>Graphique de dilatation</Text>
      <DilationGraph
        dilationStore={partogramme?.dilationStore}
        babyDescentStore={partogramme?.babyDescentStore}
      />
      <DialogDataInputGraph
        visible={dilationDialogVisible}
        onClose={onDialogCloseAddDilation}
        onCancel={() => setDilationDialogVisible(false)}
        startValue={4}
        endValue={10}
        step={1}
        dataName={"Dilatation du col de l'utérus"}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
          paddingHorizontal: 20,
          marginRight: 20,
          marginLeft: 20,
        }}
      >
        <CustomButton
          title="Ajouter dilatation"
          color="#403572"
          style={styles.buttonStyle2}
          onPressFunction={openDilationDialog}
          styleText={{ fontSize: 15, fontWeight: "bold" }}
        />
        <CustomButton
          title="Ajouter descente bébé"
          color="#403572"
          style={styles.buttonStyle2}
          onPressFunction={openDescentBabyDialog}
          styleText={{ fontSize: 15, fontWeight: "bold" }}
        />
        <DialogDataInputGraph
          visible={descentBabyDialogVisible}
          onClose={onDialogCloseAddDescentBaby}
          onCancel={() => setDescentBabyDialogVisible(false)}
          startValue={0}
          endValue={10}
          step={1}
          dataName={"Descente du bébé"}
        />
      </View>
      <DataTable
        tableData={[
          // [
          //   "0",
          //   "1",
          //   "2",
          //   "3",
          //   "4",
          //   "5",
          //   "6",
          //   "7",
          //   "8",
          //   "9",
          //   "10",
          //   "11",
          //   "12",
          // ],
          // [
          //   "0",
          //   "1",
          //   "2",
          //   "3",
          //   "4",
          //   "5",
          //   "6",
          //   "7",
          //   "8",
          //   "9",
          //   "10",
          //   "11",
          //   "12",
          // ],
          // [
          //   "0",
          //   "1",
          //   "2",
          //   "3",
          //   "4",
          //   "5",
          //   "6",
          //   "7",
          //   "8",
          //   "9",
          //   "10",
          //   "11",
          //   "12",
          // ],
          // [
          //   "0",
          //   "1",
          //   "2",
          //   "3",
          //   "4",
          //   "5",
          //   "6",
          //   "7",
          //   "8",
          //   "9",
          //   "10",
          //   "11",
          //   "12",
          // ],
          // [
          //   "0",
          //   "1",
          //   "2",
          //   "3",
          //   "4",
          //   "5",
          //   "6",
          //   "7",
          //   "8",
          //   "9",
          //   "10",
          //   "11",
          //   "12",
          // ],
        ]}
      />
      <CustomButton
        title="Ajouter des données au tableau"
        color="#403572"
        style={styles.buttonStyle2}
        onPressFunction={openAddDataTable}
        styleText={{ fontSize: 15, fontWeight: "bold" }}
      />
      {
        // Render the DialogDataInputTable if partogramme is defined
        partogramme && (
          <DialogDataInputTable
            visible={addTableDataDialogVisible}
            onClose={onDialogCloseAddDataTable}
            onCancel={() => setAddTableDataDialogVisible(false)}
            data={[
              partogramme.amnioticLiquidStore,
              partogramme.motherBloodPressureStore,
              partogramme.motherHeartRateFrequencyStore,
              partogramme.motherTemperatureStore,
              partogramme.motherContractionFrequencyStore,
            ]}
          />
        )
      }
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff",
    width: "100%",
  },
  scrollViewContentStyle: {
    alignItems: "center",
  },
  textTitle: {
    paddingTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#403572",
  },
  buttonStyle: {
    alignItem: "center",
    justifyContent: "center",
    width: 200,
  },
  buttonStyle2: {
    alignItem: "center",
    justifyContent: "center",
    width: "40%",
    height: 70,
  },
});
