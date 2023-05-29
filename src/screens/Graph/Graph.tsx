import { StyleSheet, Text } from "react-native";
import { observer } from "mobx-react";
import { SafeAreaView } from "react-native-safe-area-context";
import DialogDataInputGraph from "../../components/DialogDataInputGraph";
import { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import BabyGraph from "../../components/BabyGraph";
import reactotron from "reactotron-react-native";
import { rootStore } from "../../store/rootStore";

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
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dataName, setDataName] = useState("");
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

  const onDialogCloseAddFcBaby = (data: string, delta: string | null) => {
    console.log("Function : onDialogClose");
    console.log("Create new fc baby data : " + data);
    
    if (partogramme === null) {
      console.log("No patient selected");
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

    setDialogVisible(false);
  };

  const openDialog = () => {
    console.log("Function : openDialog");
    setDialogVisible(true);
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
    <SafeAreaView style={styles.body}>
      <Text style={styles.textTitle}>Fréquence Cardiaque du bébé</Text>
      <BabyGraph
        babyHeartFrequencyList={partogramme?.babyHeartFrequencyStore}
      />

      <DialogDataInputGraph
        visible={dialogVisible}
        onClose={onDialogCloseAddFcBaby}
        onCancel={() => setDialogVisible(false)}
        startValue={120}
        endValue={180}
        step={10}
        dataName={"fréquence cardiaque du bébé"}
      />
      <CustomButton
        title="Ajouter FC bébé"
        color="#403572"
        style={{
          margin: 10,
          borderRadius: 5,
          alignItem: "center",
          justifyContent: "center",
        }}
        onPressFunction={openDialog}
        styleText={{ fontSize: 15, fontWeight: "bold" }}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  textTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#403572",
  },
});
