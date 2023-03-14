import { State, TapGestureHandler } from 'react-native-gesture-handler';
import React, { useRef } from 'react';

export interface DoubleTapProps {
    onTap?: () => void;
    onDoubleTap?: () => void;
    children: any;
}

export const DoubleTap = ({ onTap, onDoubleTap}: DoubleTapProps, {children}) => {
    const doubleTapRef = useRef(null);

    const onSingleTapEvent = (event: any) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            console.log("single tap 1");
            props.onTap();
        }
    };

    const onDoubleTapEvent = (event: any) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            console.log("double tap 1");
            props.onDoubleTap();
        }
    };

    return (
        <TapGestureHandler
            onHandlerStateChange={onSingleTapEvent}
            waitFor={doubleTapRef}>
            <TapGestureHandler
                ref={doubleTapRef}
                onHandlerStateChange={onDoubleTapEvent}
                numberOfTaps={2}>
                {children}
            </TapGestureHandler>
        </TapGestureHandler>
    );
};