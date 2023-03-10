import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ToastAndroid,
    Alert,
} from 'react-native';
import 'react-native-url-polyfill/auto'
import CustomButton from '../../components/CustomButton';
import { supabase } from "../../initSupabase";
import { DialogNurseInfo } from '../../components/DialogNurseInfo';
import userStore from '../../store/user/userStore';

async function signInWithEmail(email: string, password: string) {
    let isLoggedIn = false;
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
    if (error) {
        Alert.alert(error.message);
    }
    if (data.user && data.user.email && data.user.id){
        isLoggedIn = true;
        console.log("User logged in with id :" + data.user.id);
        userStore.setProfileId(data.user.id);
        userStore.setProfileEmail(data.user.email);
        ToastAndroid.showWithGravity(
            'Signed Up as ' + data.user.email + ' !',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
        )
    }
    return isLoggedIn;
}

export function ScreenLogin({navigation}) {
    // Login variables
    const [email, SetEmail] = useState('');
    const [password, SetPassword] = useState('');

    const LoginButtonPressed = () => {
        if (email.length == 0) {
            Alert.alert('Please enter a Valid Email Adress');
        }
        else{
            console.log("Function : LoginButtonPressed");
            signInWithEmail(email, password)
                .then((value) => {
                    if (value) {
                        navigation.navigate('Screen_Menu')
                    }
                })
        }
    }

    return(
    <View style={styles.body}>
        <Text style={styles.text}>
            Login:
        </Text>
        <TextInput
            style={styles.input}
            placeholder='Email'
            onChangeText={(value) => SetEmail(value)}
        />
        <Text style={styles.text}>
            Password:
        </Text>
        <TextInput
            style={styles.input}
            placeholder='Password'
            secureTextEntry= {true}
            onChangeText={(value) => SetPassword(value)}
        />
        <CustomButton
            title='Login'
            color='#403572'
            onPressFunction={LoginButtonPressed}
        />
    </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    text: {
        color: '#000000',
        fontSize: 20,
        margin: 10,
        textAlign: 'center',
    },
    input: {
        textAlign:'center',
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 5,
        fontSize: 20,
        marginRight: 50,
        marginLeft: 50,
        width: 344,
    },
});