import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cell,
} from "react-native-reanimated-table";
import { tableTitles } from "../../../types/constants";
import { table } from "console";

interface Props {
  Headers: string[];
  tableData: any[][];
  widthArr: number[];
  flexArray: number[];
}

const DataListTable: React.FC<Props> = ({
  Headers,
  tableData,
  widthArr,
  flexArray,
}) => {
  const element = (data, index) => (
    <TouchableOpacity
      onPress={() => {
        console.log("pressed" + index.toString());
      }}
    >
      <View style={styles.btn}>
        <Text style={styles.btnText}>button</Text>
      </View>
    </TouchableOpacity>
  );
  console.log(tableData);
  console.log(tableData[0]);
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View style={{ width: 400 }}>
          <Table borderStyle={{ borderWidth: 1 }}>
            <Row
              data={Headers}
              style={styles.head}
              textStyle={styles.text}
              flexArr={flexArray}
            />
            {tableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell
                      flex={flexArray[cellIndex]}
                      key={cellIndex}
                      data={cellIndex === 3 ? element(cellData, index) : cellData}
                      textStyle={styles.text}
                    />
                  ))
                }
              </TableWrapper>
            ))}
          </Table>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    // padding: 16,
    // paddingTop: 30,
    backgroundColor: "#F6F3F3",
    width: "100%",
    borderRadius: 10,
    alignSelf: "center",
  },
  head: { height: 40, backgroundColor: "#403572", width: "100%" },
  wrapper: { flex: 1, flexDirection: "row", width: "100%" },
  wrapper_rows: { flex: 1, flexDirection: "column", width: "100%" },
  dataWrapper: {},
  title: { backgroundColor: "#f6f8fa" },
  row: { flexDirection: "row", backgroundColor: "#C9BDF0" },
  rowWrapper: { flexDirection: "row" },
  text: { textAlign: "center" , color: "#fff"},
  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "#fff" },
});

export default DataListTable;
