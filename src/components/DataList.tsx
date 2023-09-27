/**
 * This components is responsible of displaying partogramme list
 */
import { observer } from "mobx-react";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text, View
} from "react-native";
import { data_t } from "../store/partogramme/partogrammeStore";
import { FAB } from "@rneui/themed";

export interface DataListProps {
  title?: string;
  dataList: data_t[];
  onEditButtonPress: (data : data_t) => void;
}

export interface ItemProps {
  item: data_t;
  onEditButtonPress: (data : data_t) => void;
  backgroundColor: string;
}

/**
 *  This function render each item depending of item object
 * @param item Partogramme item of the partogramme list
 * @param onPress function that is called when the item is pressed
 * @param backgroundColor background color of the item
 * @param textColor text color of the item
 * @returns the rendered item
 */
const Item: React.FC<ItemProps> = observer( ({ item, onEditButtonPress, backgroundColor }: ItemProps) => {
  var options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return (
    <View style={styles.itemView}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "column" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.infoFont}> {"Type : " + item.store.name}</Text>
          </View>
          <Text style={styles.infoFont}>
            {" "}
            {"Valeur : " + item.data.value + " " + item.store.unit}
          </Text>
          <Text style={[styles.infoFont,{}]}>
            {" "}
            {"Date : " +
              new Date(item.data.created_at).toLocaleDateString(
                "fr-FR",
                options
              )}
          </Text>
        </View>
      </View>
      <FAB
          size="small"
          title=""
          color="#9F90D4"
          icon={{
            name: "pen",
            color: "white",
            type: "font-awesome-5",
          }}
          style = {styles.btn}
          onPress={() => {
            onEditButtonPress(item)
          }}
        />
    </View>
  );
});

const EmptyListMessage = ({}) => {
  return (
    // Flat List Item
    <Text style={styles.emptyListStyle}>
      Aucune données modifiée dans les dernière 10 minutes ...
    </Text>
  );
};

/**
 * This components is responsible of displaying a dataList
 * @param title title of the dataList
 * @param dataList list of the dataList
 * @param onEditButtonPress function that is called when the edit button is pressed for each item
 */
export const DataList: React.FC<DataListProps> = observer(
  ({ title, dataList, onEditButtonPress }: DataListProps) => {
    const [selectedId, setSelectedId] = useState<string>();
    const [isDeleteConfirmDialogVisible, setDeleteConfirmDialogVisible] =
      useState(false);

    /**
     * This function render each item depending of item object
     * @param item Partogramme item of the partogramme list
     * @returns the rendered item
     */
    const renderItem = ({ item }: { item: data_t }) => {
      return (
        // Flat List Item
        <Item
          item={item}
          onEditButtonPress={(data:data_t) => onEditButtonPress(data)}
          backgroundColor={"#403572"}
        />
      );
    };

    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>{title}</Text>
        <FlatList
          style={styles.list}
          data={dataList} // Use .slice() to subscribe to the partogramme store
          renderItem={renderItem}
          keyExtractor={(data) => data.data.id}
          ListEmptyComponent={EmptyListMessage}
          // extraData={}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  list: {
    marginTop: 20,
    alignContent: "center",
    alignSelf: "center",
    width: "90%",
    height: "100%",
  },
  container: {
    // marginTop: "6%",
    flex: 1,
    alignItems: "center",
  },
  itemView: {
    width: 300,
    padding: 10,
    marginBottom: 20,
    alignSelf: "center",
    borderRadius: 15,
    backgroundColor: "#403572",
  },
  patientNameFont: {
    marginLeft: 10,
    color: "#403572",
  },
  infoFont: {
    marginLeft: 0,
    marginTop: 0,
    borderRadius: 10,
    padding: 5,
    color: "#ffffff",
    // backgroundColor: "#b0a8d8",
  },
  emptyListStyle: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    width: 344,
    alignSelf: "center",
    borderRadius: 15,
  },
  icon: {
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: "2%",
    top: "15%",
    zIndex: 1,
  },
  titleText: {
    textAlign: "left",
    color: "#403572",
    fontSize: 20,
    margin: 10,
  },
  btn: {
    position: "absolute",
    bottom: "5%",
    right: "2%",
    borderRadius: 0,
  },
});
