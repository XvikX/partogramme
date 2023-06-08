import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from "react-native-reanimated-table";
import { tableTitles } from "../../../types/constants";

interface Props {
  tableHead: string[];
  tableTitle: string[];
  tableData: string[][];
}

const DataTable: React.FC<Props> = ({
  tableHead = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ],
  tableTitle = tableTitles,
  tableData,
}) => {
  return (
    <View style={styles.container}>
      <View style={{ width: 100}}>
        <Table borderStyle={{ borderWidth: 1 }}>
          <Col 
            data={["", ...tableTitle]} 
            style={styles.title} 
            width={100}
            heightArr={[40, 40, 60, 40, 60, 40]}
            textStyle={styles.text} 
            />
        </Table>
      </View>
      <ScrollView horizontal={true}>
        <View style={{ width: 800}}>
          <Table borderStyle={{ borderWidth: 1 }}>
              <TableWrapper style={styles.wrapper_rows}>
                <Row 
                data={tableHead} 
                style={styles.head} 
                flexArr={[1, 1, 1, 1, 1, 1, 1 , 1, 1, 1, 1, 1, 1]}
                textStyle={styles.text} 
                widthArr={[100]}
                />
                <Rows
                  data={tableData ? tableData : [[]]}
                  heightArr={[40, 60, 40, 60, 40]}
                  flexArr={[1, 1, 1, 1, 1, 1, 1 , 1, 1, 1, 1, 1, 1]}
                  style={styles.row}
                  textStyle={styles.text}
                />
              </TableWrapper>
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
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
  },
  head: { height: 40, backgroundColor: "#f1f8ff", width: "100%" },
  wrapper: { flex: 1, flexDirection: "row" , width: "100%"},
  wrapper_rows: { flex: 1, flexDirection: "column" , width: "100%"},
  dataWrapper: { },
  title: { backgroundColor: "#f6f8fa"},
  row: {flex :1},
  text: { textAlign: "center" },
});

export default DataTable;
