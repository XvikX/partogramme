import { Button } from '@rneui/themed';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

interface Props {
  isVisible: boolean;
  onValidate: (hospitalName:string, hospitaCity:string) => void;
}

const HospitalForm:React.FC<Props> = ({ isVisible, onValidate}) => {
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalCity, setHospitalCity] = useState("");
  return (
    isVisible ? (
        <View style={{ flexDirection: "row" }}>
          <View
            style={[
              styles.backGroundInfo,
              {
                alignContent: "center",
                justifyContent: "center",
                width: "20%",
                marginLeft: "2%",
              },
            ]}
          >
            <Text style={styles.infoTitleText}>Nom de l'hôpital :</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom de l'hôpital"
              placeholderTextColor={"#939F99"}
              textAlign="left"
              onChangeText={(text) => setHospitalName(text)}
            />
          </View>
          <View
            style={[
              styles.backGroundInfo,
              {
                alignContent: "center",
                justifyContent: "center",
                width: "20%",
                marginLeft: "2%",
              },
            ]}
          >
            <Text style={styles.infoTitleText}> Ville de l'hôpital :</Text>
            <TextInput
              style={styles.input}
              placeholder="Ville de l'hôpital"
              placeholderTextColor={"#939F99"}
              textAlign="left"
              onChangeText={(text) => setHospitalCity(text)}
            />
          </View>
          <Button
            style={{
              width: 200,
            }}
            buttonStyle={{
              margin: 20,
              backgroundColor: "#403572",
              borderRadius: 10,
            }}
            onPress={() => {
              onValidate(hospitalName, hospitalCity);
            }}
          >
            Créer l'hôpital
          </Button>
        </View>
    ) : null
  );
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
export default HospitalForm;
