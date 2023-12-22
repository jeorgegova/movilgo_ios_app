import React from 'react';
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image, StyleSheet } from "react-native";

export const ButtonImage = (props) => {
    const {
        image,
        onPress,
        styleButton
    } = props;
    return (
        <TouchableOpacity onPress={onPress} style={styleButton}>
            <Image style={styles.image} source={image} resizeMode='center'></Image>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    image: {
        height: '100%',
        width: '100%'
    }
});