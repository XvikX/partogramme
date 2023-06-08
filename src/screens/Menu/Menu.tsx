import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { PartogrammeList } from '../../components/partogrammeList';
import { observer } from "mobx-react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { DialogNurseInfo } from '../../components/DialogNurseInfo';
import { useState, useEffect } from 'react';
import { supabase } from '../../initSupabase';
import { rootStore } from '../../store/rootStore';
import { Profile } from '../../store/user/userStore';
import { runInAction } from 'mobx';

export type Props = {
    navigation: any;
};

/**
 * Screen for the menu
 * @param navigation - navigation object that allowed us to navigate between screens
 */
export const ScreenMenu: React.FC<Props> = observer(({ navigation }) => {
    const [isNurseInfoDialogVisible, setNurseInfoDialogVisible] = useState(false);

    // fetch nurse info based on logged in user id
    useEffect(() => {
        const fetchNurseId = async () => {
            const { data, error } = await supabase
                .from('Profile')
                .select('*')
                .eq('id', rootStore.userStore.profile.id)
                .single();
            if (error) {
                console.log('Error fetching profile id', error);
            } else if (data) {
                runInAction(() => {
                  rootStore.userStore.profile = data as Profile['Row'];
                });
                if (rootStore.userStore.profile.firstName === null) {
                    setNurseInfoDialogVisible(true);
                }
            }
        }
        fetchNurseId();
    }, []);

    useEffect(() => {
        rootStore.partogrammeStore.loadPartogrammes(rootStore.userStore.profile.id);
    }, []);

    return (
        /**
         * SafeAreaView is used to avoid the notch on the top of the screen
         */
        <SafeAreaView style={styles.body}>
            <Text style={styles.titleText}>Partogrammes de {rootStore.userStore.getProfileName()}</Text>
            <View style={styles.listContainer}>
                <PartogrammeList
                    title={'Partogrammes'}
                    navigation={navigation}
                ></PartogrammeList>
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
            </View>
            <DialogNurseInfo isVisible={isNurseInfoDialogVisible} setIsVisible={setNurseInfoDialogVisible} />
        </SafeAreaView>
    )
});

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        height: '100%',
    },
    listContainer: {
        marginTop: '8%',
        marginBottom: '8%',
        alignItems: 'center',
        height: '95%',
    },
    text: {
        color: '#000000',
        fontSize: 20,
        margin: 10,
        textAlign: 'center',
    },
    titleText: {
        textAlign: 'left',
        color: '#403572',
        fontSize: 20,
        margin: 10,
        position: 'absolute',
        top: 10,
        left: 10,
    },
    input: {
        textAlign: 'center',
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
        bottom: '5%', 
        left: '25%',
    },
});