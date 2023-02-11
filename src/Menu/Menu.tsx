import { StyleSheet, Text, View } from 'react-native';

export function ScreenMenu({navigation}) {
    return(
      <View style={styles.body}>
        <Text style={styles.text}>Menu Screen</Text>
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
});