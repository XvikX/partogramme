import {
  StyleSheet, View, TextInput, ScrollView
} from "react-native";
import { useState } from "react";
import { observer } from "mobx-react";
import CustomButton from "../../components/CustomButton";
import { rootStore } from "../../store/rootStore";
import DateTimePickerUIBloc from "../../components/DateTimePickerUIBloc";

export type Props = {
  navigation: any;
};

/**
 * Screen to add a partogramme
 * @param navigation navigation object component to navigate between screens
 */
export const ScreenAddPartogramme: React.FC<Props> = observer(
  ({ navigation }) => {
    const [commentary, onChangeCommentary] = useState("");
    const [patientFirstName, onChangePatientFirstName] = useState("");
    const [patientLastName, onChangePatientLastName] = useState("");
    const [hospitalName, onChangeHospitalName] = useState("");
    const [noFile, onChangeNoFile] = useState("");
    const [admissionDateTime, onChangeAdmissionDateTime] = useState(new Date());
    const [workStartDateTime, onChangeWorkStartDate] = useState(new Date());

    // Variables to update dates and control the date picker
    const [dateTimeUpdated, setDateTimeUpdated] = useState("");

    const handleTimeAdmissionChanged = (time: Date | undefined) => {
      console.log("Function : handleTimeChanged");
      if (time !== undefined) {
        admissionDateTime.setHours(time.getHours());
        admissionDateTime.setMinutes(time.getMinutes());
        onChangeAdmissionDateTime(admissionDateTime);
      }
      console.log("Admission date time changed : " + admissionDateTime);
    };

    const handleDateAdmissionChanged = (date: Date | undefined) => {
      console.log("Function : handleDateChanged");
      if (date !== undefined) {
        admissionDateTime.setFullYear(date.getFullYear());
        admissionDateTime.setMonth(date.getMonth());
        admissionDateTime.setDate(date.getDate());
        onChangeAdmissionDateTime(admissionDateTime);
      }
      console.log("Admission date time changed : " + admissionDateTime);
    };

    const handleTimeWorkStartChanged = (time: Date | undefined) => {
      console.log("Function : handleTimeChanged");
      if (time !== undefined) {
        workStartDateTime.setHours(time.getHours());
        workStartDateTime.setMinutes(time.getMinutes());
        onChangeWorkStartDate(workStartDateTime);
      }
      console.log("Work start date time changed : " + workStartDateTime);
    };

    const handleDateWorkStartChanged = (date: Date | undefined) => {
      console.log("Function : handleDateChanged");
      if (date !== undefined) {
        workStartDateTime.setFullYear(date.getFullYear());
        workStartDateTime.setMonth(date.getMonth());
        workStartDateTime.setDate(date.getDate());
        onChangeWorkStartDate(workStartDateTime);
      }
      console.log("Work start date time changed : " + workStartDateTime);
    };

    // This function is called when the user clicks on the create button
    const createButtonPressed = () => {
      console.log("Function : createButtonPressed");
      rootStore.partogrammeStore.createPartogramme(
        admissionDateTime.toISOString(),
        commentary,
        hospitalName,
        patientFirstName,
        patientLastName,
        0,
        "ADMITTED",
        // workStartDateTime.toISOString()
        null,
      )
      .then((partogramme) => {
        console.log("Partogramme created");
      })
      .catch((error) => {
        console.log("Error while creating partogramme : " + error);
      });
      // Navigate to the menu screen
      navigation.navigate("Screen_Menu");
    };

    return (
      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          automaticallyAdjustKeyboardInsets={true}
        >
          <TextInput
            style={styles.input}
            placeholder="Prénom du patient"
            placeholderTextColor={"#939F99"}
            onChangeText={(text) => onChangePatientFirstName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Nom de famille du patient"
            placeholderTextColor={"#939F99"}
            onChangeText={(text) => onChangePatientLastName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Nom de l'hôpital"
            placeholderTextColor={"#939F99"}
            onChangeText={(text) => onChangeHospitalName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Numéro de dossier"
            placeholderTextColor={"#939F99"}
            onChangeText={(text) => onChangeNoFile(text)}
          />
          <DateTimePickerUIBloc
            title="Date et heure d'admission"
            onDateChange={handleDateAdmissionChanged}
            onTimeChange={handleTimeAdmissionChanged}
          />
          <DateTimePickerUIBloc
            title="Date et heure du début du travail"
            onDateChange={handleDateWorkStartChanged}
            onTimeChange={handleTimeWorkStartChanged}
          />
          <TextInput
            editable={true}
            multiline={true}
            onChangeText={(text) => onChangeCommentary(text)}
            placeholder="Commentaire"
            placeholderTextColor={"#939F99"}
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 5,
            }}
          />
          <CustomButton
            title="Valider"
            color="#403572"
            style={{ width: 100, height: 50, margin: 10, borderRadius: 5 }}
            onPressFunction={createButtonPressed}
            styleText={{}}
          />
        </ScrollView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  scrollView: {
    alignItems: "center",
  },
  text: {
    color: "#000000",
    fontSize: 20,
    margin: 5,
    marginLeft: 15,
    textAlign: "center",
  },
  input: {
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    fontSize: 20,
    marginRight: 50,
    marginLeft: 50,
    margin: 10,
    width: 300,
  },
  button: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#403572",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    top: 10,
    elevation: 5,
    marginLeft: 10,
  },
});
