import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";

export interface Props {
  // Put props here
  data: string[];
  title?: string;
}

/**
 * Component that displays comments in a lateral list slider
 */
export const CommentsSlider: React.FC<Props> = ({
  // Put props here
  data,
  title = "Comments",
}) => {
  // Put state variables here
  const [currentComment, setCurrentComment] = useState(0);

  const renderItem = ({ data }: { data: string }) => {
    return (
      // Flat List Item
      <Item
        data={data}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.itemText}>{title}</Text>
        <FlatList
          style={styles.list}
          horizontal={true}
          data={data} // Use .slice() to subscribe to the partogramme store
          renderItem={renderItem}
          ListEmptyComponent={EmptyListMessage}
        />
    </View>
  );
};

const EmptyListMessage = ({}) => {
  return (
    // Flat List Item
    <Text style={styles.emptyListStyle}>
      Aucune données modifiée dans les dernière 10 minutes ...
    </Text>
  );
};

export interface ItemProps {
  data: any;
}

/**
 *  This function render each item depending of item object
 * @param item Partogramme item of the partogramme list
 * @param onPress function that is called when the item is pressed
 * @param backgroundColor background color of the item
 * @param textColor text color of the item
 * @returns the rendered item
 */
const Item: React.FC<ItemProps> = observer( ({data}: ItemProps) => {
  return (
    <View style={styles.itemView}>
      <Text style={styles.itemText}>
        Comment : {data}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  // Put styles here
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  list: {
    marginTop: 20,
    alignContent: "center",
    alignSelf: "center",
    width: "90%",
    height: "100%",
  },
  emptyListStyle: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    width: 344,
    alignSelf: "center",
    borderRadius: 15,
  },
  itemView: {
    width: 300,
    padding: 10,
    marginBottom: 20,
    alignSelf: "center",
    borderRadius: 15,
    backgroundColor: "#403572",
  },
  itemText: {
    marginLeft: 0,
    marginTop: 0,
    borderRadius: 10,
    padding: 5,
    color: "#ffffff",
  },
});

