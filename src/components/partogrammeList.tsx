/**
 * This components is responsible of displaying partogramme list
 */
import { Observer, observer } from 'mobx-react';
import React, { useState, useEffect, Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ToastAndroid,
    Alert,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import partogrammeStore, { Partogramme } from '../store/partogramme/partogrammeStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { DoubleTap } from './DoubleTap';
import { log } from 'console';

export interface PartogrammeListProps {
    title?: string,
    navigation: any;
}

export interface ItemProps {
    item: Partogramme['Row'];
    onPress: () => void;
    onDoublePress: () => void;
    backgroundColor: string;
    patientNameTextColor: string;
    infoTextColor: string;
}

const renderPatientTextElement = (item: Partogramme['Row']) => {
    let patientName = '';
    if (item.patientFirstName !== null) {
        patientName = item.patientFirstName.charAt(0).toUpperCase() + item.patientFirstName.slice(1);
    }
    else {
        patientName = 'Aucun prénom';
    }
    if (item.patientLastName !== null) {
        patientName += ' ' + item.patientLastName.charAt(0).toUpperCase() + item.patientLastName.slice(1);
    }
    else {
        patientName += ' Aucun nom';
    }
    return patientName;
}

const renderDateTextElement = (itemDate: string): string => {
    let retDate = '';
    if (itemDate !== null) {
        let dateFmt = new Date(itemDate);
        let date = dateFmt.getDate().toString();
        let month = (dateFmt.getMonth() + 1).toString();
        let year = dateFmt.getFullYear().toString();
        let hours = dateFmt.getHours().toString();
        let minutes = dateFmt.getMinutes().toString();
        retDate = date + '/' + month + '/' + year + '-' + hours + ':' + minutes;
    }
    else {
        retDate = 'Aucune date';
    }
    return retDate;
}

/**
 *  This function render each item depending of item object
 * @param item Partogramme item of the partogramme list
 * @param onPress function that is called when the item is pressed
 * @param backgroundColor background color of the item
 * @param textColor text color of the item 
 * @returns the rendered item
 */
const Item = ({ item, onPress, onDoublePress, backgroundColor, patientNameTextColor: patientNameTextColor, infoTextColor: infoTextColor }: ItemProps) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
        <TapGestureHandler
            numberOfTaps={2}
            onActivated={() => (
                onDoublePress() )}>
            <View style={{ flexDirection: "column" }}>
                <View style={{ flexDirection: "row" }}>
                    <FontAwesomeIcon style={[styles.icon, { color: patientNameTextColor }]} icon={faUser} />
                    <Text style={[styles.patientNameFont, { color: patientNameTextColor }]}>
                        {renderPatientTextElement(item)}
                    </Text>
                </View>
                <Text style={[styles.infoFont, { color: infoTextColor }]}>
                    Date d'admission {'\t\t'}{renderDateTextElement(item.admissionDateTime)}{'\n'}
                    Date de début du travail {'\t'}{renderDateTextElement(item.workStartDateTime)}
                </Text>
            </View>
        </TapGestureHandler>
    </TouchableOpacity>
);

const EmptyListMessage = ({ item }) => {
    return (
        // Flat List Item
        <Text
            style={styles.emptyListStyle}
        >
            Aucun partogramme disponible !
        </Text>
    );
};

export const PartogrammeList = observer(({
    title,
    navigation,
}: PartogrammeListProps) => {
    const [selectedId, setSelectedId] = useState<string>();

    const partogrammeSelected = (id:string) => {
        console.log('Partogramme selected: ' + id);
        partogrammeStore.updateSelectedPartogramme(id);
        navigation.navigate('Screen_Graph');
    };

    /**
     * This function render each item depending of item object
     * @param item Partogramme item of the partogramme list
     * @returns the rendered item
     */
    const renderItem = ({ item }: { item: Partogramme['Row'] }) => {
        const backgroundColor = item.id === selectedId ? '#403572' : '#F6F5Ff';
        const patientNameColor = item.id === selectedId ? 'white' : '#403572';
        const infoTextColor = item.id === selectedId ? 'white' : '#403572';

        return (
            <Observer>{() => (
                <Item
                    item={item}
                    onPress={() => setSelectedId(item.id)}
                    onDoublePress={() => partogrammeSelected(item.id)}
                    backgroundColor={backgroundColor}
                    patientNameTextColor={patientNameColor}
                    infoTextColor={infoTextColor}
                />
            )}</Observer>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={styles.list}
                data={partogrammeStore.partogrammeList.slice()} // Use .slice() to subscribe to the partogramme store
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={EmptyListMessage}
            />
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    list: {
        flex: 1,
        alignContent: 'center',
        width: 344,
        position: "absolute"
    },
    container: {
        flex: 1,
        marginTop: '6%',
        alignItems: 'center',
    },
    item: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        width: 344,
        height: 94,
        alignSelf: "center",
        borderRadius: 15,
    },
    patientNameFont: {
        marginLeft: 10,
        color: '#403572',
    },
    infoFont: {
        marginLeft: 0,
        marginTop: 5,
        color: '#403572',
        opacity: 0.5,
    },
    emptyListStyle: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        width: 344,
        height: 94,
        alignSelf: "center",
        borderRadius: 15,
    },
    icon: {

    }
});