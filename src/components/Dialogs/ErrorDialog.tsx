import * as React from "react";
import { Dialog } from "@rneui/themed";
import { View, StyleSheet, Text } from "react-native";

/**
 * AppProps interface for the component props
 * @interface AppProps interface for the component props (see below)
 * @param isVisible boolean to show or hide the dialog
 * @param errorCode string to display the error code
 * @param errorMsg string to display the error message
 * @param toggleDialog function to toggle the dialog
 */
export interface AppProps {
  isVisible: boolean;
  errorCode: string;
  errorMsg: string;
  toggleDialog: () => void;
}

export interface AppState {
  // empty
}

/**
 * ErrorDialog component
 * @param props @ref AppProps interface for the component props (see above)
 * @returns {JSX.Element}
 */
export default class AppComponent extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <View>
        <Dialog
          isVisible={this.props.isVisible}
          onBackdropPress={this.props.toggleDialog}
        >
          <Dialog.Title
            title={"Erreur : " + this.props.errorCode}
            titleStyle={styles.textTitle}
          />
          <Text>{this.props.errorMsg}</Text>
          <Dialog.Actions>
            <Dialog.Button
              title="OK"
              onPress={this.props.toggleDialog}
            />
          </Dialog.Actions>
        </Dialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textTitle: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "red",
    paddingLeft:10,
    borderRadius: 10,
  },
  textBody: {
    fontSize: 16,
  },
});
