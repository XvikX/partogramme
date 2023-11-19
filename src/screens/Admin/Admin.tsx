import { StyleSheet, Text, TextInput, View } from "react-native";
import { observer } from "mobx-react";
import { rootStore } from "../../store/rootStore";
import { Button } from "@rneui/themed";
import { makeAutoObservable, runInAction } from "mobx";
import { useState } from "react";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import uuid from "react-native-uuid";
import HospitalForm from "../../components/HospitalForm";
import InfoLine from "../../components/InfoLine";
import { Hospital } from "../../store/user/userInfoStore";
import UserInputForm from "../../components/UserInputForm";
import { supabase } from '../../initSupabase';

class UiState {
  hospitalName: string = "";
  hospitalCity: string = "";
  isErrorDialogVisible: boolean = false;
  errorMessage: string = "";

  constructor() {
    makeAutoObservable(this, {});
  }
  toggleErrorDialog() {
    this.isErrorDialogVisible = !this.isErrorDialogVisible;
  }
  setHospitalName(name: string) {
    this.hospitalName = name;
  }
  setHospitalCity(city: string) {
    this.hospitalCity = city;
  }
  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}

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
export const ScreenAdmin: React.FC<Props> = observer(({ navigation }) => {
  const [uiState] = useState(() => new UiState());
  const toggleErrorDialog = () => {
    uiState.toggleErrorDialog();
  };
  console.log("Hospital Id : " + rootStore.profileStore.profile.hospitalId);
  return (
    <View style={{ flexGrow: 1 }}>
      <Text style={styles.header}>
        Bienvenue sur la page d'administration de l'application
      </Text>
      <Text style={styles.text}>Information :</Text>
      <Text style={styles.paragraph}>
        Cette page vous permettra de gérer les utilisateurs de l'application.
        {"\n"}
        d'ajouter des utilisateurs, de les modifier ou de les supprimer.{"\n"}
        De gérer les partogrammes des utilisateurs.
      </Text>
      <HospitalForm
        isVisible={rootStore.profileStore.profile.hospitalId == undefined}
        onValidate={(hospitalName, hospitalCity) => {
          if (hospitalName === "") {
            uiState.setErrorMessage("Veuillez entrer un nom d'hôpital");
            toggleErrorDialog();
            return;
          }
          if (hospitalCity === "") {
            uiState.setErrorMessage("Veuillez entrer une ville d'hôpital");
            toggleErrorDialog();
            return;
          }
          let hospital = {
            adminId: rootStore.profileStore.profile.id,
            city: hospitalCity,
            id: uuid.v4().toString(),
            isDeleted: false,
            name: hospitalName,
          };
          CreateHospital(hospital)
            .then(() => {
              console.log("Hospital created");
            })
            .catch((error) => {
              uiState.setErrorMessage(error.message);
              toggleErrorDialog();
            });
        }}
      />
      <InfoLine
        labelTitle="Nom de l'hôpital : "
        labelValue={
          rootStore.profileStore.Hospital.name
            ? rootStore.profileStore.Hospital.name
            : "Aucun"
        }
        containerStyle={{
          width: 800,
          marginLeft: 20,
        }}
      />
      <InfoLine
        labelTitle="Ville de l'hôpital : "
        labelValue={
          rootStore.profileStore.Hospital.city
            ? rootStore.profileStore.Hospital.city
            : "Aucune"
        }
        containerStyle={{
          width: 800,
          marginLeft: 20,
        }}
      />
      <UserInputForm
        isVisible={true}
        onSubmit={(value) => {
          console.log("UserInputForm onSubmit");
          if (value === "") {
            uiState.setErrorMessage("Veuillez entrer une adresse mail");
            toggleErrorDialog();
            return;
          }
          if (rootStore.profileStore.Hospital.id === undefined 
            || rootStore.profileStore.Hospital.id === null 
            || rootStore.profileStore.Hospital.id === "") {
            uiState.setErrorMessage("Veuillez créer un hôpital");
            toggleErrorDialog();
            return;
          }  
          rootStore.transportLayer.inviteUser(value, rootStore.profileStore.Hospital.id)
          .then((result) => {
            console.log("Successfully invite user");
          }
          ).catch((error) => {
            uiState.setErrorMessage(error.message);
            toggleErrorDialog();
          });
        }}
        formInstructions="Veuillez entrer l'adresse mail de l'utilisateur :"
        containerStyle={{
          width: 800,
          marginLeft: 20,
        }}
      />
      <ErrorDialog
        isVisible={uiState.isErrorDialogVisible}
        toggleDialog={toggleErrorDialog}
        errorCode=""
        errorMsg={uiState.errorMessage}
        dialogStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: 400,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: "#403572",
        }}
      />
    </View>
  );
});

/**
 * @brief Create a hospital
 * @param hospital hospital to create
 */
const CreateHospital = async (hospital: any) => {
  rootStore.transportLayer
    .insertHospital(hospital)
    .then((result) => {
      runInAction(() => {
        rootStore.profileStore.profile.hospitalId = hospital.id;
      });
      console.log("Successfully insert hospital");
      rootStore.transportLayer
        .updateProfile(rootStore.profileStore.profile)
        .then((result) => {
          console.log("Successfully update profile");
        })
        .catch((error) => {
          rootStore.profileStore.profile.hospitalId = null;
          throw error;
        });
    })
    .catch((error) => {
      throw error;
    });
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff",
    width: "100%",
  },
  header: {
    padding: 20,
    fontSize: 20,
    color: "#333",
    textAlign: "left",
    marginHorizontal: 16,
    borderBottomWidth: 5,
    borderColor: "#403572",
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 18,
    textAlign: "left",
    borderBottomWidth: 5,
    borderColor: "#403572",
    paddingBottom: 20,
  },
  text: {
    marginTop: 20,
    marginLeft: 20,
    fontSize: 18,
    textAlign: "left",
    fontWeight: "bold",
  },
  textTitle: {
    marginTop: 50,
    // paddingTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#403572",
  },
  infoTitleText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#403572",
  },
  backGroundInfo: {
    backgroundColor: "#d5d0e9",
    paddingLeft: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 1,
    marginTop: 5,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 15,
    color: "#403572",
  },
  input: {
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    backgroundColor: "#ffffff",
    fontSize: 20,
    margin: 10,
    width: 300,
    color: "#403572",
  },
});
