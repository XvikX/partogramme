import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { PartogrammeList } from '../components/partogrammeList';
import partogrammeStore, { newPartogramme, PartogrammeStore } from '../store/partogramme/partogrammeStore';
import { observer } from "mobx-react";

export type Props = {
    navigation: any;
    partogrammeStore: PartogrammeStore;
};

export const ScreenMenu: React.FC<Props> = observer(({navigation}) => {
    return(
      <View style={styles.body}>
        <PartogrammeList
            title='Partogramme Liste'
            ></PartogrammeList>
        <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    newPartogramme(
                        'test',
                        new Date(Date.now()),
                        'test',
                        new Date(Date.now()),
                        'test',
                        'test',
                        'test',
                        'Victor',
                        'Bellemin'
                    )
                    // navigation.navigate('Screen_AddPartogramme');
                }}
            >
                <FontAwesome5
                    name={'plus'}
                    size={20}
                    color={'#ffffff'}
                />
        </TouchableOpacity>
      </View>
    )
});

const styles = StyleSheet.create({
  body: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
  },
  text: {
      color: '#000000',
      fontSize: 20,
      margin: 10,
      textAlign: 'center',
  },
  input: {
      textAlign:'center',
      borderWidth: 1,
      borderColor: '#555',
      borderRadius: 5,
      fontSize: 20,
      marginRight: 50,
      marginLeft: 50,
    },
  button: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#403572',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 10,
      right: 10,
      elevation: 5,
  },
});