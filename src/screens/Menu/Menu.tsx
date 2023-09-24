import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { PartogrammeList } from "../../components/PartogrammeList";
import { observer } from "mobx-react";
import { SafeAreaView } from "react-native-safe-area-context";
import { DialogNurseInfo } from "../../components/DialogNurseInfo";
import { useState, useEffect } from "react";
import { rootStore } from "../../store/rootStore";

export type Props = {
  navigation: any;
};

/**
 * Screen for the menu
 * @param navigation - navigation object that allowed us to navigate between screens
 */
export const ScreenMenu: React.FC<Props> = observer(({ navigation }) => {
  const [isNurseInfoDialogVisible, setNurseInfoDialogVisible] = useState(false);

  // fetch nurse info based on logged in user id
  useEffect(() => {
    rootStore.userStore.fetchNurseId().then(() => {
      // Ask for the neccesary informations if it is the first time
      if (
        rootStore.userStore.profile.firstName === null ||
        rootStore.userStore.profile.lastName === null ||
        rootStore.userStore.profile.refDoctor === null
      ) {
        setNurseInfoDialogVisible(true);
      }
      else {
        // load partogrammes when the component is mounted
        if (rootStore.userStore.profile.role === "NURSE") {
          console.log("fetch partogrammes for nurse");
          rootStore.partogrammeStore.fetchPartogrammes(
            rootStore.userStore.profile.id
          );
        } else if (rootStore.userStore.profile.role === "DOCTOR") {
          console.log("fetch partogrammes for doctor");
          rootStore.partogrammeStore.fetchPartogrammes();
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    /**
     * SafeAreaView is used to avoid the notch on the top of the screen
     */
    <View 
      style={styles.body}>
      <Text style={styles.titleText}>
        Partogrammes de {rootStore.userStore.getProfileName()}
      </Text>
      <View style={styles.listContainer}>
        <PartogrammeList
          title={"Partogrammes"}
          navigation={navigation}
        ></PartogrammeList>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("Screen_AddPartogramme");
            }}
          >
          <FontAwesome5 name={"plus"} size={20} color={"#ffffff"} />
        </TouchableOpacity>
      </View>
      <DialogNurseInfo
        isVisible={isNurseInfoDialogVisible}
        setIsVisible={setNurseInfoDialogVisible}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    height: "99%",
  },
  listContainer: {
    flex: 1,
    marginTop: 5,
    marginBottom: "8%",
    paddingTop: 10,
    alignItems: "center",
    height: "95%",
  },
  text: {
    color: "#000000",
    fontSize: 20,
    margin: 10,
    textAlign: "center",
  },
  titleText: {
    textAlign: "left",
    color: "#403572",
    fontSize: 20,
    margin: 10,
    position: "absolute",
    top: 10,
    left: 10,
  },
  input: {
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    fontSize: 20,
    marginRight: 50,
    marginLeft: 50,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#403572",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "-3%",
    left: "70%",
  },
});
