import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export const Header = (props) => {
    const { onPressBack, title, styles = getStyles() } = props;
    return (
        <View style={styles.headerContainer} >
            <Image style={styles.header} source={require('../../assets/login/header.png')} resizeMode="stretch"></Image>
            <View style={styles.headerLogoContainer}>
                <View style={{ width: '24%' }}>
                    <Button onPress={onPressBack} type="clear" icon={<Icon name="arrow-left" color="#02606e" size={32}></Icon>}></Button>
                </View>
                <Image style={styles.headerLogo} source={require('../../assets/login/logo.png')} resizeMode="contain"></Image>
                <View style={{ width: '24%' }}></View>
            </View>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const getStyles = () => {
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);
    if (screenWidth === 480 && screenHeight === 805) {
        return stylesLarge;
    } else {
        return stylesMedium;
    }
}

var stylesLarge = StyleSheet.create({
    title: { 
        color: 'white', 
        fontSize: 28, 
        fontWeight: 'bold', 
        alignSelf: "center" 
    },
    header: {
        height: '70%',
        width: '100%',
    },
    headerContainer: {
        backgroundColor: '#02606e',
        height: '20%',
        width: '100%'
    },
    headerLogo: {
        width: '60%',
        aspectRatio: 1,
    },
    headerLogoContainer: {
        position: 'absolute',
        height: '50%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

var stylesMedium = StyleSheet.create({
    title: { 
        color: 'white', 
        fontSize: 20, 
        fontWeight: 'bold', 
        alignSelf: "center" 
    },
    header: {
        height: '70%',
        width: '100%',
    },
    headerContainer: {
        backgroundColor: '#02606e',
        height: '20%',
        width: '100%'
    },
    headerLogo: {
        width: '60%',
        aspectRatio: 1,
    },
    headerLogoContainer: {
        position: 'absolute',
        height: '50%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});