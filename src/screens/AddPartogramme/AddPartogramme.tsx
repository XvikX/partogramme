import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import partogrammeStore, { PartogrammeStore } from '../../store/partogramme/partogrammeStore';
import { observer } from 'mobx-react';

export function ScreenAddPartogramme({navigation}) {
    return(
      <View style={styles.body}>
        <Text style={styles.text}>ScreenAddPartogramme</Text>
      </View>
    )
}

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