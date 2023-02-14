import { StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { PartogrammeList } from '../../components/PartogrammeList';
import partogrammeStore, { PartogrammeStore } from '../../store/partogramme/partogrammeStore';
import { observer } from "mobx-react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { DialogNurseInfo } from '../../components/DialogNurseInfo';
import { useState, useEffect } from 'react';
import { supabase } from '../../initSupabase';
import { Database } from '../../../types/supabase';
import userStore from '../../store/user/userStore';

export type Props = {
    navigation: any;
    partogrammeStore: PartogrammeStore;
};

export const ScreenMenu: React.FC<Props> = observer(({navigation}) => {
    const [isVisible, setIsVisible] = useState(false);

    // fetch nurse id depending on the profile
    useEffect(() => {
        const fetchNurseInfo = async () => {
            const result = await supabase.from<Database['public']['Tables']['nurse_info']>('nurse_info')
            .select('*')
            .eq('profiles', userStore.profile.id);
            console.log(result);
            if (result.data?.length === 0)
                setIsVisible(true);
        };
        console.log(userStore.nurseInfo)
        if (userStore.nurseInfo.id === '')
            fetchNurseInfo();
    }, []);

    return(
    <SafeAreaView style={styles.body}>
        <PartogrammeList></PartogrammeList>
        <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate('Screen_AddPartogramme');
                }}>
                <FontAwesome5
                    name={'plus'}
                    size={20}
                    color={'#ffffff'}
                />
        </TouchableOpacity>
        <DialogNurseInfo isVisible={isVisible} setIsVisible={setIsVisible}/>
    </SafeAreaView>
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