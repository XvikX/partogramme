import React, { useState } from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

interface Props {
    visible: boolean;
    dataName: string;
    onClose: (data:string) => void;
}

const DialogDataInputGraph: React.FC<Props> = ({ visible, dataName, onClose }) => {
    const [data, onChangeData] = useState('');
    return (
        <Modal
            visible={visible}
            animationType='slide'
            transparent={true}
        >
            <View
                style={
                    {
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                }>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Entrez la valeur de {dataName}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={dataName}
                        placeholderTextColor={'#939F99'}
                        onChangeText={(text) => onChangeData(text)}
                    />
                    <TouchableOpacity 
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => {
                            onClose(data);
                        }}>
                        <Text style={{ color: 'white' }}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#403572',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
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
        width: 80,
    },
});

export default DialogDataInputGraph;
