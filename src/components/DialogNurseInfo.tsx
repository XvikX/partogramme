/**
 * This components render a dialog allowing the user to enter his nurse info
 */
import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import Dialog from "react-native-dialog";
import { Dispatch, SetStateAction } from "react";
import { observer } from "mobx-react";
import userStore from "../store/user/userStore";

interface IProps {
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
}

export const DialogNurseInfo = observer(({
        isVisible,
        setIsVisible,
    }: IProps) => {
    const [lastName, onChangeLastName] = useState('');
    const [FirstMidName, onChangeFirstMidName] = useState('');

    const handleCancel = () => {
        setIsVisible(false);
    };

    const handleValidate = () => {
        userStore.setNurseInfo(lastName,FirstMidName);
        console.log(userStore.nurseInfo);
        setIsVisible(false);
    };

    return (
    <Dialog.Container visible={isVisible}>
        <Dialog.Title>Entrez vos informations</Dialog.Title>
        <Dialog.Description> S'il vous plaît entrez votre nom et prénom </Dialog.Description>
        <Dialog.Input label="Nom de famille" onChangeText={onChangeLastName} value={lastName}/>
        <Dialog.Input label="Prénom" onChangeText={onChangeFirstMidName} value={FirstMidName}/>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Validate" onPress={handleValidate} />
    </Dialog.Container>
    );
});