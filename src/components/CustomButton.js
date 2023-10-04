import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
} from 'react-native';

/**
 * @brief Custom button component
 * @param {object} props
 * @param {string} props.title 
 * @param {function} props.onPressFunction
 * @param {string} props.color
 * @param {object} props.style
 * @param {object} props.styleText
 * @param {boolean} props.disabled
 * @returns  {JSX.Element}  Custom button component
 */
const CustomButton = (props) => {
    return (
        <Pressable
            onPress={props.onPressFunction}
            disabled={props.disabled}
            hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
            android_ripple={{ color: '#00000050' }}
            style={({ pressed }) => [
                { backgroundColor: pressed ? '#dddddd' : props.color },
                styles.button,
                { ...props.style }
            ]}
        >
            <Text style={[styles.text, {...props.styleText}]}>
                {props.title}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    text: {
        color: '#ffffff',
        fontSize: 20,
        margin: 10,
        textAlign: 'center',
    },
    button: {
        width: 150,
        height: 50,
        alignItems: 'center',
        borderRadius: 5,
        margin: 10,
    },
})

export default CustomButton;