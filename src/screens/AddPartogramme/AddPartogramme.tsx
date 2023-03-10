import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, ScrollView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useState, useEffect } from 'react';
import partogrammeStore, { PartogrammeStore } from '../../store/partogramme/partogrammeStore';
import { observer } from 'mobx-react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomButton from '../../components/CustomButton';
import userStore from '../../store/user/userStore';

export type Props = {
    navigation: any;
};

/**
 * Screen to add a partogramme
 * @param navigation navigation object component to navigate between screens
 */
export const ScreenAddPartogramme: React.FC<Props> = observer(({ navigation }) => {
    const [commentary, onChangeCommentary] = useState('');
    const [patientFirstName, onChangePatientFirstName] = useState('');
    const [patientLastName, onChangePatientLastName] = useState('');
    const [hospitalName, onChangeHospitalName] = useState('');
    const [noFile, onChangeNoFile] = useState('');
    const [nurseId, onChangeNurseId] = useState('');
    const [state, onChangeState] = useState('');
    const [admissionDateTime, onChangeAdmissionDateTime] = useState('None');
    const [workStartDateTime, onChangeWorkStartDate] = useState('None');

    // Variables to update dates and control the date picker
    const [isDateTimePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateTimeUpdated, setDateTimeUpdated] = useState('');

    const showDatePickerAdmissionDateTime = () => {
        setDateTimeUpdated('admissionDateTime');
        setDatePickerVisibility(true);
    };
    const showDatePickerWorkStartDateTime = () => {
        setDateTimeUpdated('workStartDateTime');
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleConfirm = (dateTime: any) => {
        dateTime = dateTime.toISOString();
        if (dateTimeUpdated === 'admissionDateTime') {
            onChangeAdmissionDateTime(dateTime);
        } else if (dateTimeUpdated === 'workStartDateTime') {
            onChangeWorkStartDate(dateTime);
        }
        console.log("A date has been picked: ", dateTime);
        hideDatePicker();
    };

    const createButtonPressed = () => {
        console.log("Function : createButtonPressed");
        partogrammeStore.newPartogramme(
            admissionDateTime,
            commentary,
            hospitalName,
            patientFirstName,
            patientLastName,
            0,
            userStore.profile.id,
            "NOT_STARTED",
            workStartDateTime
        );
        console.log("Partogramme created");
        navigation.navigate('Screen_Menu');
    };
    return (
        <View style={styles.body}>
            <ScrollView 
                contentContainerStyle={styles.scrollView}
                automaticallyAdjustKeyboardInsets={true}>
                <TextInput
                    style={styles.input}
                    placeholder='Prénom du patient'
                    onChangeText={(text) => onChangePatientFirstName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Nom de famille du patient'
                    onChangeText={(text) => onChangePatientLastName(text)}
                />
                <TextInput style={styles.input}
                    placeholder="Nom de l'hôpital"
                    onChangeText={(text) => onChangeHospitalName(text)}
                />
                <TextInput style={styles.input}
                    placeholder="Numéro de dossier"
                    onChangeText={(text) => onChangeNoFile(text)}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        width: 380,
                    }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            showDatePickerAdmissionDateTime();
                        }}>
                        <FontAwesome5
                            name={"calendar-alt"}
                            size={15}
                            color={'#ffffff'}
                        />
                    </TouchableOpacity>
                    <Text style={styles.text}>
                        Date et heure d'admission : {'\n'} {admissionDateTime}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        width: 380,
                    }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            showDatePickerWorkStartDateTime();
                        }}>
                        <FontAwesome5
                            name={"calendar-alt"}
                            size={15}
                            color={'#ffffff'}
                        />
                    </TouchableOpacity>
                    <Text style={styles.text}>
                        Date et Heure du début du travail : {'\n'} {workStartDateTime}
                    </Text>
                </View>
                <TextInput
                    editable={true}
                    multiline={true}
                    onChangeText={(text) => onChangeCommentary(text)}
                    placeholder="Commentaire"
                    style={{padding: 10}}
                />
                <DateTimePickerModal
                    isVisible={isDateTimePickerVisible}
                    mode="datetime"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                <CustomButton
                    title='Valider'
                    color='#403572'
                    style = {{width: 100, height: 50, margin: 10, borderRadius: 5}}
                    onPressFunction={createButtonPressed}
                />
            </ScrollView>
        </View>
    )
});

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    scrollView: {
        alignItems: 'center',
    },
    text: {
        color: '#000000',
        fontSize: 20,
        margin: 5,
        textAlign: 'center',
    },
    input: {
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 5,
        fontSize: 20,
        marginRight: 50,
        marginLeft: 50,
        margin: 10,
        width: 300,
    },
    button: {
        width: 30,
        height: 30,
        borderRadius: 5,
        backgroundColor: '#403572',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: 10,
        elevation: 5,
    },
});