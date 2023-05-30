import { StyleSheet, Text } from "react-native";
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
  const [dialogDataName, setDialogDataName] = useState("");
  const [dialogOnClose, setDialogOnClose] = useState<(data: string, delta: string | null) => void>(() => {});
  const partogramme = rootStore.partogrammeStore.selectedPartogramme;

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

  // retreive the patient data
  if (rootStore.partogrammeStore.selectedPartogrammeId === null) {
    console.log("No patient selected");
    navigation.goBack();
  }

  // Create a new frequency baby data and add it to the partogramme
  const onDialogCloseAddFcBaby = (data: string, delta: string | null) => {
    if (partogramme === null) {
      console.error("No patient selected");
      return;
    }
    if (delta === "" ){
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
      if (delta === "" ){
        delta = null;
      }
      partogramme?.dilationStore.createDilation(
        new Date().toISOString(),
        Number(data),
        Number(delta)
      );
      setDilationDialogVisible(false);
    };

  // This function is called when the user clicks on the heartbeat button
  const openFcDialog = () => {
    console.log("Function : openDialog");
    setFcDialogVisible(true);
  };

  // Function is called when the user clicks on the add dilation button
  const openDilationDialog = () => {
    console.log("Function : openDialog");
    setDilationDialogVisible(true);
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
        <CustomButton
          title="Ajouter dilatation"
          color="#403572"
          style={styles.buttonStyle}
          onPressFunction={openDilationDialog}
          styleText={{ fontSize: 15, fontWeight: "bold" }}
        />
      </ScrollView>
  );
});

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff",
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
    width : 200,
  },
});
