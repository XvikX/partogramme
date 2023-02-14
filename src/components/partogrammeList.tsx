/**
 * This components is responsible of displaying partogramme list
 */
import { Observer, observer } from 'mobx-react';
import React, { useState, useEffect, Component} from 'react';
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
import partogrammeStore, { Partogramme } from '../store/partogramme/partogrammeStore';

export interface PartogrammeListProps {
        title?:string,
    }

export interface ItemProps {
        item: Partogramme;
        onPress: () => void;
        backgroundColor: string;
        textColor: string;
    }

// This is the rendered item of the list
const Item = ({item, onPress, backgroundColor, textColor}: ItemProps) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
        <Text style={[styles.title, {color: textColor}]}>{item.id}</Text>
    </TouchableOpacity>
    );

export const PartogrammeList = observer(({
    title,
  }: PartogrammeListProps) => {
    const [selectedId, setSelectedId] = useState<string>();

    /**
     * This function render each item depending of item object
     * @param item Partogramme item of the partogramme list
     * @returns the rendered item
     */
    const renderItem = ({item}: {item: Partogramme}) => {
        const backgroundColor = item.id === selectedId ? '#403572' : '#F6F5Ff';
        const color = item.id === selectedId ? 'white' : 'black';

        return (
            <Observer>{() => (
                <Item
                item={item}
                onPress={() => setSelectedId(item.id)}
                backgroundColor={backgroundColor}
                textColor={color}
                />
            )}</Observer>
        );
    };

    return (
        <FlatList
            style={styles.list}
            data={partogrammeStore.partogrammes.slice()} // Use .slice() to subscribe to the partogramme store
            renderItem={renderItem}
            keyExtractor={item => item.id}
        />
    );
});

const styles = StyleSheet.create({
    list: {
        flex:1,
        alignContent:'center',
        width:344,
        position:"absolute"
    },
    container: {
        flex: 1,
    },
    item: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        width:344,
        height:94,
        alignSelf:"center",
        borderRadius:15,
    },
    title: {
        fontSize: 32,
    },
});