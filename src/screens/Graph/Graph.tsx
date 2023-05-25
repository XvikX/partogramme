import { StyleSheet, Text } from "react-native";
import { observer } from "mobx-react";
import { SafeAreaView } from "react-native-safe-area-context";
import patientDataStore from "../../store/partogramme/partogrammeStore";
import DialogDataInputGraph from "../../components/DialogDataInputGraph";
import { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import BabyGraph from "../../components/BabyGraph";
import babyHeartFrequencyStore from "../../store/BabyHeartFrequency/babyHeartFrequencyStore";
import reactotron from "reactotron-react-native";

reactotron.onCustomCommand({
  command: "show baby heart frequency data",
  handler: () => {
    reactotron.display({
      name: "BABY HEART FREQUENCY DATA",
      value: {
        babyHeartFrequencyStore: babyHeartFrequencyStore.babyHeartList,
      },
    });
  },
});

export type Props = {
  navigation: any;
};

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
  if (patientDataStore.selectedPartogrammeId !== null) {
    const patientData = patientDataStore.getPartogramme(
      patientDataStore.selectedPartogrammeId
    );
  } else {
    console.log("No patient selected");
    navigation.goBack();
  }

  const onDialogCloseAddFcBaby = (data: string, delta: string) => {
    console.log("Function : onDialogClose");
    console.log("Create new fc baby data : " + data);
    if (patientDataStore.selectedPartogrammeId === null) {
      console.log("No patient selected");
      return;
    }

    babyHeartFrequencyStore
      .newBabyHeartFrequency(
        Number(data),
        Number(delta),
        new Date().toISOString(),
        patientDataStore.selectedPartogrammeId
      )
      .then(() => {
        console.log("New fc baby data created");
        setDialogVisible(false);
      })
      .catch((error) => {
        console.log("Error creating new fc baby data : " + error);
      });
  };

  const openDialog = () => {
    console.log("Function : openDialog");
    setDialogVisible(true);
  };

  const fetchData = () => {
    console.log("Function : fetchData");
    if (patientDataStore.selectedPartogrammeId === null) {
      console.log("No patient selected");
      return;
    }
    babyHeartFrequencyStore
      .fetchBabyHeartFrequencyList(patientDataStore.selectedPartogrammeId)
      .then(() => {
        console.log("Baby heart frequency data fetched");
        console.log(babyHeartFrequencyStore.babyHeartList.slice());
      })
      .catch((error) => {
        console.log("Error fetching baby heart frequency data : " + error);
      });
  };

  return (
    /**
     * SafeAreaView is used to avoid the notch on the top of the screen
     */
    <SafeAreaView style={styles.body}>
      <Text style={styles.textTitle}>Graph</Text>
      <BabyGraph
        babyHeartFrequencyList={babyHeartFrequencyStore.babyHeartList.slice()}
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
