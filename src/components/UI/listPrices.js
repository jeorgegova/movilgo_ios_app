import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { FormatMoney } from '../../shared/utilities/formats';

export const ListPrices = (props) => {
    const { priceList, styles, onPress } = props;
    const [stateButtons, setStateButtons] = useState([])
    const initializeStates = () => {
        const _stateButtons = []
        for (let index = 0; index < priceList.length; index++) {
             _stateButtons.push(false);
        }
        setStateButtons(_stateButtons);
    }
    const changeState = (index) => {
        const _stateButtons = [];
        for (let k = 0; k < priceList.length; k++) {
            if (k === index) {
                _stateButtons.push(true);
            } else {
                _stateButtons.push(false);
            }
        }
        onPress(priceList[index]);
        setStateButtons(_stateButtons);
    }
    const initializeButtons = () =>{
        let row = []
        for (let k = 0; k < priceList.length; k = k + 3) {
            row.push(
                <View key={k} style={styles.containerButtonPrice}>
                    <Button titleStyle={styles.titleButton}
                        containerStyle={styles.containerPriceButton}
                        buttonStyle={[styles.buttonPrice,
                        { backgroundColor: stateButtons[k] ? '#bedb02' : 'rgba(7,162,186,0.7)' }]}
                        title={FormatMoney(priceList[k].price)}
                        onPress={() => { changeState(k) }}>
                    </Button>
                    {k + 1 < priceList.length &&
                        <Button
                            titleStyle={styles.titleButton}
                            containerStyle={styles.containerPriceButton}
                            buttonStyle={[styles.buttonPrice,
                            { backgroundColor: stateButtons[k + 1] ? '#bedb02' : 'rgba(7,162,186,0.7)' }]}
                            title={FormatMoney(priceList[k + 1].price)}
                            onPress={() => { changeState(k + 1); }}>
                        </Button>}
                    {k + 2 < priceList.length &&
                        <Button
                            titleStyle={styles.titleButton}
                            containerStyle={styles.containerPriceButton}
                            buttonStyle={[styles.buttonPrice,
                            { backgroundColor: stateButtons[k + 2] ? '#bedb02' : 'rgba(7,162,186,0.7)' }]}
                            title={FormatMoney(priceList[k + 2].price)}
                            onPress={() => { changeState(k + 2);}}>
                        </Button>}
                </View>
            );
        }
        return row;
    }
    const buttons = initializeButtons();
    useEffect(() => {
        initializeStates();
    }, [])
    return <>{buttons}</>;
}