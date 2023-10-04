import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  InteractionManager,
} from "react-native";
import { observer } from "mobx-react";
import DialogDataInputGraph from "../../components/Dialogs/DialogDataInputGraph";
import { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import BabyGraph from "../../components/Graphs/BabyGraph";
import { rootStore } from "../../store/rootStore";
import DilationGraph from "../../components/Graphs/DilationGraph";
import { ScrollView } from "react-native-gesture-handler";
import DataTable from "../../components/Tables/DataTable";
import DialogDataInputTable, {
  DataInputTable_t,
} from "../../components/Dialogs/DialogDataInputTable";
import { AmnioticLiquidStore } from "../../store/TableData/AmnioticLiquid/amnioticLiquidStore";
import { Database } from "../../../types/supabase";
import { MotherSystolicBloodPressureStore } from "../../store/TableData/MotherSystolicBloodPressure/motherSystolicBloodPressureStore";
import { MotherContractionsFrequencyStore } from "../../store/TableData/MotherContractionsFrequency/motherContractionsFrequencyStore";
import { MotherHeartFrequencyStore } from "../../store/TableData/MotherHeartFrequency/motherHeartFrequencyStore";
import { MotherTemperatureStore } from "../../store/TableData/MotherTemperature/motherTemperatureStore";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import { FAB } from "@rneui/themed";
import DataModifierDialog from "../../components/DataModifierDialog";
import { MotherDiastolicBloodPressureStore } from "../../store/TableData/MotherDiastolicBloodPressure/motherDiastolicBloodPressureStore";
import { MotherContractionDurationStore } from "../../store/TableData/MotherContractionDuration/MotherContractionDurationStore";
import { CommentsSlider } from "../../components/CommentsSlider";
import { DialogEditText } from "../../components/Dialogs/DialogEditText";

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
  // State Variable to indicate screen is ready
  const [isReady, setIsReady] = useState(false);

  // State variables to control the dialogs
  const [isFcDialogVisible, setFcDialogVisible] = useState(false);
  const [isDilationDialogVisible, setDilationDialogVisible] = useState(false);
  const [isDescentBabyDialogVisible, setDescentBabyDialogVisible] =
    useState(false);
  const [isAddTableDataDialogVisible, setAddTableDataDialogVisible] =
    useState(false);
  const [isDataModifierDialogVisible, setDataModifierDialogVisible] =
    useState(false);
  const [isAddCommentDialogVisible, setAddCommentDialogVisible] =
    useState(false);

  // State variables to control the error dialog
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const partogramme = rootStore.partogrammeStore.selectedPartogramme;
  if (partogramme === undefined) {
    console.log("Partogramme selected is undefined");
    navigation.goBack();
  }

  useEffect(() => {
    // Function to be called on screen opening
    InteractionManager.runAfterInteractions(() => {
      fetchData();
      setTimeout(() => setIsReady(true), 1);
    });
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
    partogramme?.babyHeartFrequencyStore
      .createBabyHeartFrequency(
        Number(data),
        new Date().toISOString(),
        Number(delta)
      )
      .then(() => {
        console.log("Data added to the partogramme");
      });
    setFcDialogVisible(false);
  };

  // Create a new dilatation data and add it to the partogramme
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
    dataStore?: DataInputTable_t,
    data?: string
  ) => {
    // Check parameters
    if (partogramme === null || dataStore === undefined || data === undefined) {
      console.error("No patient selected");
      Alert.alert(
        "Code Error : Unknown data store type. \n contact the administrator"
      );
      return;
    }

    // Depending on the parameters create the correct data for the partogram
    if (dataStore instanceof AmnioticLiquidStore) {
      dataStore
        .createAmnioticLiquid(
          new Date().toISOString(),
          dataStore.highestRank + 1,
          data as Database["public"]["Enums"]["LiquidState"]
        )
        .then(() => {
          console.log("Data added to the partogramme");
        })
        .catch((error) => {
          console.error(error);
          Platform.OS === "web" ? null : Alert.alert(error.message);
        });
    } else if (dataStore instanceof MotherSystolicBloodPressureStore) {
      dataStore.createNew(
        Number(data),
        new Date().toISOString(),
        dataStore.highestRank + 1
      );
    } else if (dataStore instanceof MotherDiastolicBloodPressureStore) {
      dataStore.createNew(
        Number(data),
        new Date().toISOString(),
        dataStore.highestRank + 1
      );
    } else if (dataStore instanceof MotherContractionsFrequencyStore) {
      dataStore.createMotherContractionsFrequency(
        Number(data),
        new Date().toISOString(),
        dataStore.highestRank + 1
      );
    } else if (dataStore instanceof MotherContractionDurationStore) {
      dataStore.createData({
        value: Number(data),
        created_at: new Date().toISOString(),
        Rank: dataStore.highestRank + 1,
      });
    } else if (dataStore instanceof MotherHeartFrequencyStore) {
      dataStore.createMotherHeartFrequency(
        Number(data),
        new Date().toISOString(),
        dataStore.highestRank + 1
      );
    } else if (dataStore instanceof MotherTemperatureStore) {
      dataStore.createMotherTemperature(
        Number(data),
        new Date().toISOString(),
        dataStore.highestRank + 1
      );
    } else {
      console.error("Unknown data store type");
      Alert.alert(
        "Code Error : Unknown data store type. \n contact the administrator"
      );
      setAddTableDataDialogVisible(false);
      return;
    }
    console.log("Data added to the partogramme");
    setAddTableDataDialogVisible(false);
  };

  // Function that is called when the user clicks on the add comment button
  const onDialogCloseAddComment = (comment: string) => {
    if (partogramme === null) {
      console.error("No patient selected");
      return;
    }
    partogramme?.commentStore
      .createData(
        {
          value: comment,
          created_at: new Date().toISOString(),
        }
      )
      .then(() => {
        console.log("Comment added to the partogramme");
      })
      .catch((error) => {
        setErrorMsg(error.message);
        setErrorCode(error.code);
        setIsErrorDialogVisible(true);
      });
    setAddCommentDialogVisible(false);
  };

  // This function is called when the user clicks on the add comment button
  const openAddCommentDialog = () => {
    console.log("Function : open Dialog Add Comment");
    setAddCommentDialogVisible(true);
  };

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
    setAddTableDataDialogVisible(true);
  };

  // Fetch every data from the database related to the selected partogramme
  const fetchData = () => {
    console.log("Function : fetchData");
    if (partogramme === null) {
      console.log("No patient selected");
      return;
    }
    partogramme?.babyHeartFrequencyStore.loadBabyHeartFrequencies();
    partogramme?.babyDescentStore.loadBabyDescents();
    partogramme?.dilationStore.loadDilations();
    partogramme?.motherSystolicBloodPressureStore.loadData();
    partogramme?.motherDiastolicBloodPressureStore.loadData();
    partogramme?.motherContractionFrequencyStore.loadMotherContractionsFrequencies();
    partogramme?.motherContractionDurationStore.load();
    partogramme?.motherTemperatureStore.loadMotherTemperatures();
    partogramme?.motherHeartRateFrequencyStore.loadMotherHeartFrequencies();
    partogramme?.amnioticLiquidStore
      .loadAmnioticLiquids()
      .then(() => {
        console.log("AmnioticLiquids loaded");
      })
      .catch((error) => {
        console.error("Error while loading amniotic liquids");
        console.error(error);
      });
    partogramme?.commentStore.load()
      .then(() => {
        console.log("Comments loaded");
      })
      .catch((error) => {
        console.error("Error while loading comments");
        console.error(error);
      });
  };

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#403572" />
      </View>
    );
  } else {
    return (
      /**
       * SafeAreaView is used to avoid the notch on the top of the screen
       */
      <View style={{ flexGrow: 1 }}>
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.scrollViewContentStyle}
        >
          <Text style={styles.titleText}>
          Partogrammes de {partogramme?.asJson.patientFirstName}{" "}{partogramme?.asJson.patientLastName}
          </Text>
          <Text style={styles.textTitle}>Fréquence Cardiaque du bébé</Text>
          <BabyGraph
            // babyHeartFrequencyList={partogramme?.babyHeartFrequencyStore}
            data={
              rootStore.partogrammeStore.selectedPartogramme
                ?.babyHeartFrequencyStore.babyHeartFrequencyGraphData
            }
          />
          <DialogDataInputGraph
            visible={isFcDialogVisible}
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
            visible={isDilationDialogVisible}
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
              visible={isDescentBabyDialogVisible}
              onClose={onDialogCloseAddDescentBaby}
              onCancel={() => setDescentBabyDialogVisible(false)}
              startValue={0}
              endValue={10}
              step={1}
              dataName={"Descente du bébé"}
            />
          </View>
          <DataTable
            maxHours={12}
            tableData={[
              partogramme!.motherTemperatureStore.motherTemperatureListAsString,
              partogramme!.motherSystolicBloodPressureStore
                .motherBloodPressureListAsString,
              partogramme!.motherDiastolicBloodPressureStore
                .motherBloodPressureListAsString,
              partogramme!.motherHeartRateFrequencyStore
                .motherHeartRateFrequencyListAsString,
              partogramme!.motherContractionFrequencyStore
                .motherContractionFrequencyListAsString,
              partogramme!.motherContractionDurationStore.DataListAsString,
              partogramme!.amnioticLiquidStore.amnioticLiquidAsTableString,
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
                visible={isAddTableDataDialogVisible}
                onClose={onDialogCloseAddDataTable}
                onCancel={() => setAddTableDataDialogVisible(false)}
                data={[
                  partogramme.amnioticLiquidStore,
                  partogramme.motherSystolicBloodPressureStore,
                  partogramme.motherDiastolicBloodPressureStore,
                  partogramme.motherHeartRateFrequencyStore,
                  partogramme.motherTemperatureStore,
                  partogramme.motherContractionFrequencyStore,
                  partogramme.motherContractionDurationStore,
                ]}
              />
            )
          }
          <CommentsSlider
            data={partogramme!.commentStore.DataListAsJson}
            title="Liste des Commentaires"
          />
          <DialogEditText
            visible={isAddCommentDialogVisible}
            onClose={onDialogCloseAddComment}
            onCancel={() => setAddCommentDialogVisible(false)}
            data_name={"Ajouter un commentaire"}
          />
          <CustomButton
            title="Ajouter un commentaire"
            color="#403572"
            style={styles.buttonAddCommentary}
            onPressFunction={openAddCommentDialog}
            styleText={{ fontSize: 15, fontWeight: "bold" }}
          />
        </ScrollView>
        <FAB
          size="large"
          title=""
          color="#9F90D4"
          icon={{
            name: "pen",
            color: "white",
            type: "font-awesome-5",
          }}
          style={styles.overlayPenButton}
          onPress={() => {
            setDataModifierDialogVisible(true);
          }}
        />
        <ErrorDialog
          isVisible={isErrorDialogVisible}
          errorCode={errorCode}
          errorMsg={errorMsg}
          toggleDialog={() => setIsErrorDialogVisible(!isErrorDialogVisible)}
        />
        <DataModifierDialog
          visible={isDataModifierDialogVisible}
          partogramme={partogramme!}
          onCancel={() => setDataModifierDialogVisible(false)}
        />
      </View>
    );
  }
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
    marginTop: 50,
    // paddingTop: 20,
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
  buttonAddCommentary: {
    alignItem: "center",
    justifyContent: "center",
    width: "40%",
    height: 70,
    borderRadius: 35,
    marginBottom: 50,
  },
  overlayPenButton: {
    position: "absolute",
    bottom: "5%",
    right: "5%",
  },
  titleText: {
    textAlign: "left",
    color: "#403572",
    fontSize: 20,
    margin: 5,
    position: "absolute",
    top: 10,
    left: 10,
  },
});
