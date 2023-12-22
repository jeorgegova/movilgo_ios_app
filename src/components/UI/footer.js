import React from 'react';
import { Text, StyleSheet, Image, View, Dimensions } from 'react-native';
import { FormatMoney } from '../../shared/utilities/formats'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { updateVersion } from '../../services/update.service';

export const Footer = (props) => {

    const { balance = null,
        version = "",
        style,
        canUpdate = false,
        styles = getStyles()
    } = props;

    const flagBalance = () => {
        if (balance) {
            return true
        } else {
            return false
        }
    }

    const flagVersion = () => {
        if (version) {
            return true
        } else {
            return false
        }
    }

    return (
        <View style={[styles.footer, style]}>
            <Image style={{ width: "100%" }} source={require('../../assets/login/footer.png')} resizeMode="stretch"></Image>
            {flagBalance() && <Text style={styles.title}>Saldo: {FormatMoney(balance)}</Text>}
            {flagVersion() && <View style={{ flexDirection: "row", height: '100%', width: '100%', position: 'absolute' }}>
                <View style={{ width: '30%' }}></View>
                <View style={{ width: '40%',}}>
                    <Text style={[styles.title, {}]}>Version: {version}</Text>
                </View>
                <View style={{ width: '30%' }}>
                    {canUpdate && <Button containerStyle={{position: 'absolute',alignSelf: 'center',bottom: 10}} icon={<Icon name="download" size={25} color="white"></Icon>} type="clear" onPress={() => updateVersion(version)}></Button>}
                </View>
            </View>}
        </View >
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

const stylesLarge = StyleSheet.create({
    title: {
        fontSize: 26,
        color: "white",
        position: 'absolute',
        alignSelf: 'center',
        bottom: 10
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        minHeight: '20%',
        maxHeight: '70%',
        width: '100%'
    }
}) 

const stylesMedium = StyleSheet.create({
    title: {
        fontSize: 18,
        color: "white",
        position: 'absolute',
        alignSelf: 'center',
        bottom: 10
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        minHeight: '20%',
        maxHeight: '60%',
        width: '100%'
    }
}) 