import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { observer, inject } from 'mobx-react';
import Partogramme from '../store/partogramme/partogrammeModel';
import observablePartogrammeStore from '../store/partogramme/partogrammeStore';
import { PartogrammeList } from '../components/partogrammeList';

const DATA: Partogramme[] = [
    {
        id: '300',
        no_case:'test',
        admission_time: new Date(Date.now()),
        commentary: 'test',
        start_work_time: new Date(Date.now()),
        state:'test',
        center_name:'test',
        nurse_id:'test',
    },
    {
        id: '201',
        no_case:'test',
        admission_time: new Date(Date.now()),
        commentary: 'test',
        start_work_time: new Date(Date.now()),
        state:'test',
        center_name:'test',
        nurse_id:'test',
    },
]

export type Props = {
    navigation: any;
};

export const ScreenMenu: React.FC<Props> = ({navigation}) => {
    return(
      <View style={styles.body}>
        <PartogrammeList
            title='Partogramme Liste'
            item={DATA}
            ></PartogrammeList>
        <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate('Screen_AddPartogramme');
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
};

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