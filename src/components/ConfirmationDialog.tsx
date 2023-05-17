/**
 * This components render a dialog asking the user to confirm an action
 */
import React from "react";
import Dialog from "react-native-dialog";
import { Dispatch, SetStateAction } from "react";

interface IProps {
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
    actionToConfirm: () => void; // Action fct with any data
    confirmationText: string;
}

/**
 * This components render a dialog allowing the user to enter his nurse info
 * @param isVisible - boolean that indicates if the dialog is visible or not
 * @param setIsVisible - function that allows to change the visibility of the dialog
 */
export const ConfirmationDialog = ({
    isVisible,
    setIsVisible,
    actionToConfirm,
    confirmationText,
}: IProps) => {

    const handleCancel = () => {
        setIsVisible(false);
    };

    const handleValidate = () => {
        actionToConfirm();
        setIsVisible(false);
    };

    return (
        <Dialog.Container visible={isVisible}>
            <Dialog.Title>Confirmation</Dialog.Title>
            <Dialog.Description> {confirmationText} </Dialog.Description>
            <Dialog.Button label="Annuler" onPress={handleCancel} />
            <Dialog.Button label="Valider" onPress={handleValidate} />
        </Dialog.Container>
    );
};