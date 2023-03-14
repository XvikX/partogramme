import { StyleSheet, Text } from 'react-native';
import { observer } from "mobx-react";
import { SafeAreaView } from 'react-native-safe-area-context';

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
    return (
        /**
         * SafeAreaView is used to avoid the notch on the top of the screen
         */
        <SafeAreaView style={styles.body}>
            <Text style={styles.text}>Graph</Text>
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