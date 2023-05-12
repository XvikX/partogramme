import { StyleSheet, Text } from 'react-native';
import { observer } from "mobx-react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { VictoryChart, VictoryLine } from 'victory-native';
import patientDataStore from '../../store/partogramme/partogrammeStore';
import DialogCodeInput from 'react-native-dialog/lib/CodeInput';
import DialogDataInputGraph from '../../components/DialogDataInputGraph';
import { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import BabyGraph from "../../components/BabyGraph"
import { DataPoint } from '../../../types/types';

export type Props = {
    navigation: any;
};

/**
 * Screen for the graph
 * @param navigation - navigation object that allowed us to navigate between screens
 * 
 * TODO: Add the graph
 * 
 */
export const ScreenGraph: React.FC<Props> = observer(({ navigation }) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dataName, setDataName] = useState('');
    // retreive the patient data
    if (patientDataStore.selectedPartogrammeId !== null)
    {
        const patientData = patientDataStore.getPartogramme(patientDataStore.selectedPartogrammeId);
    }

    const onDialogClose = (data:string) => {
        console.log("Function : onDialogClose");
        console.log("Data : " + data);
        setDialogVisible(false);
    }

    const openDialog = () => {
        console.log("Function : openDialog");
        setDialogVisible(true);
    }

    const data1: DataPoint[] = [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 5 },
        // Add more data points as needed
      ];
    
      const data2: DataPoint[] = [
        { x: 1, y: 4 },
        { x: 2, y: 2 },
        { x: 3, y: 6 },
        // Add more data points as needed
      ];
    
    return (
        /**
         * SafeAreaView is used to avoid the notch on the top of the screen
         */
        <SafeAreaView style={styles.body}>
            <Text style={styles.text}>Graph</Text>
            <BabyGraph data1={data1} data2={data2}/>

            <DialogDataInputGraph 
                visible={dialogVisible}
                onClose={onDialogClose}
                dataName={dataName}
            />
            <CustomButton
                title='Open'
                color='#403572'
                style = {{width: 100, height: 50, margin: 10, borderRadius: 5}}
                onPressFunction={openDialog}
            />
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#403572',
    },
});