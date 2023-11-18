import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface InfoLineProps {
  // Define the props for your component here
  labelTitle: string;
  labelValue: string;
  containerStyle?: any;
  titleStyle?: any;
  valueStyle?: any;
}

const InfoLine: React.FC<InfoLineProps> = (props:InfoLineProps) => {
  // Implement your component logic here
  return (
    <View>
      <View
        style={[
          {
            paddingTop: 5,
            paddingBottom: 5,
            alignContent: "center",
          },
          styles.backGroundInfo,
          props.containerStyle,
        ]}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.infoTitleText, { padding: 2 }, props.titleStyle]}>
            {props.labelTitle}
          </Text>
          <Text style={[styles.infoText, props.valueStyle]}>
            {props.labelValue}            
          </Text>
        </View>
      </View>
    </View>
  );
};

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
  infoTitleText: {
    fontSize: 15,
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
    paddingTop: 2,
  },
});
export default InfoLine;
