/**
 * This components render a dialog allowing the user to enter his nurse info
 */
import React, { useState } from "react";
import { 
    ToastAndroid,
} from "react-native";
import Dialog from "react-native-dialog";
import { Dispatch, SetStateAction } from "react";
import { observer } from "mobx-react";
import userStore from "../store/user/userStore";

interface IProps {
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
}

/**
 * This components render a dialog allowing the user to enter his nurse info
 * @param isVisible - boolean that indicates if the dialog is visible or not
 * @param setIsVisible - function that allows to change the visibility of the dialog
 */
export const DialogNurseInfo = observer(({
        isVisible,
        setIsVisible,
    }: IProps) => {
    const [lastName, onChangeLastName] = useState('');
    const [FirstMidName, onChangeFirstMidName] = useState('');
    const [refDoctor, onchangeRefDoctor] = useState('');

    const handleCancel = () => {
        setIsVisible(false);
    };

    const handleValidate = () => {
        userStore.initProfileInfo(FirstMidName, lastName, refDoctor)
        // userStore.UpdateServerProfileInfo()
        //     .then(() => {
        //         setIsVisible(false);
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         ToastAndroid.showWithGravity(
        //             'Impossible de mettre à jour le serveur ! Veuillez réesayer.',
        //             ToastAndroid.LONG,
        //             ToastAndroid.CENTER,
        //         )
        //     });
    };

    return (
    <Dialog.Container visible={isVisible}>
        <Dialog.Title>Entrez vos informations</Dialog.Title>
        <Dialog.Description> S'il vous plaît entrez votre nom et prénom </Dialog.Description>
        <Dialog.Input label="Nom de famille" onChangeText={onChangeLastName} value={lastName}/>
        <Dialog.Input label="Prénom" onChangeText={onChangeFirstMidName} value={FirstMidName}/>
        <Dialog.Input label="Docteur de référence" onChangeText={onchangeRefDoctor} value={refDoctor}/>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Validate" onPress={handleValidate} />
    </Dialog.Container>
    );
});