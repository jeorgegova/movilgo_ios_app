import React from 'react';
import { View, StyleSheet, Image, ImageBackground, Text } from 'react-native';
import { ButtonImage } from '../components/UI/buttons';
import { Header } from '../components/UI/header';
import Modal from "react-native-modal";
import { Input, Button } from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import { FormatMoney } from '../shared/utilities/formats';


export class ScreenIPTV extends React.Component {
    constructor() {
        super();
        this.state = {
            modalInfoVisible: false,
            selectedOperator: {
                title: 'None',
                color: 'white',
            },
            selectedPrice: 0,
            showAnotherValueInput: false,
            stateButtons: [false, false, false, false, false, false]
        }
        this.priceList = [
            1000, 3000, 5000, 10000, 20000, 'otro valor'
        ]
    }
    buildPrices = () => {
        let row = [];
        let stateButtons = [];
        for (let k = 0; k < this.priceList.length; k = k + 3) {
            row.push(
                <View style={styles.containerButtonPrice}>
                    <Button buttonStyle={[styles.buttonPrice, {backgroundColor: this.state.stateButtons[k]? '#bedb02':'rgba(7,162,186,0.7)'}]} title={FormatMoney(this.priceList[k])} onPress={(e) => { this.pressPrice(e, this.priceList[k], k) }}></Button>
                    {k + 1 < this.priceList.length && <Button buttonStyle={[styles.buttonPrice, {backgroundColor: this.state.stateButtons[k+1]? '#bedb02':'rgba(7,162,186,0.7)'}]} title={FormatMoney(this.priceList[k + 1])} onPress={(e) => { this.pressPrice(e, this.priceList[k + 1], k + 1) }}></Button>}
                    {k + 2 < this.priceList.length && <Button buttonStyle={[styles.buttonPrice, {backgroundColor: this.state.stateButtons[k+2]? '#bedb02':'rgba(7,162,186,0.7)'}]} title={FormatMoney(this.priceList[k + 2])} onPress={(e) => { this.pressPrice(e, this.priceList[k + 2], k + 2) }}></Button>}
                </View>
            );
        }
        return row;

    }
    pressOperator = (operator) => {
        switch (operator) {
            case 'claro':
                this.setState({
                    modalInfoVisible: true,
                    selectedOperator: {
                        title: 'Claro',
                        color: 'rgba(238,35,35,0.75)'
                    }
                });
                break;
            case 'movistar':
                this.setState({
                    modalInfoVisible: true,
                    selectedOperator: {
                        title: 'Movistar',
                        color: 'rgba(127,182,53, 0.75)'
                    }
                });
                break;
            case 'etb':
                this.setState({
                    modalInfoVisible: true,
                    selectedOperator: {
                        title: 'ETB',
                        color: 'rgba(0,146,188, 0.75)'
                    }
                });
                break;
            case 'exito':
                this.setState({
                    modalInfoVisible: true,
                    selectedOperator: {
                        title: 'Exito',
                        color: 'rgba(253,229,0,0.75)'
                    }
                });
                break;

            default:
                break;
        }
    }
    pressPrice = (e, price, index) => {
        let stateButtons = [];
        for (let i = 0; i < this.state.stateButtons.length; i++) {
            if(i === index){
                stateButtons.push(true);
            }else{
                stateButtons.push(false);
            }
        }
        this.setState({stateButtons:stateButtons});
        if (price == 'otro valor') {
            this.setState({ showAnotherValueInput: true })
        } else {
            this.setState({
                showAnotherValueInput: false,
                selectedPrice: price
            });
        }
    }
    render() {
        const buttonsPrice = this.buildPrices();
        return (
            <SafeAreaView style={{flex: 1}}>
            <View>
                <ImageBackground style={styles.background} source={require('../assets/login/background.png')}>
                    <Header onPressBack={() => { this.props.navigation.goBack() }}></Header>
                    <View style={styles.containerContent}>
                        <View style={styles.containerButton}>
                            <ButtonImage onPress={() => { this.pressOperator('claro') }} styleButton={styles.buttonImage} image={require("../assets/recargas-test/movistar.png")}></ButtonImage>
                            <ButtonImage onPress={() => { this.pressOperator('movistar') }} styleButton={styles.buttonImage} image={require("../assets/recargas-test/movistar.png")}></ButtonImage>
                            <ButtonImage onPress={() => { this.pressOperator('etb') }} styleButton={styles.buttonImage} image={require("../assets/recargas-test/etb.png")}></ButtonImage>
                        </View>
                        <View style={styles.containerButton}>
                            <ButtonImage onPress={() => { this.pressOperator('etb') }} styleButton={styles.buttonImage} image={require("../assets/recargas-test/etb.png")}></ButtonImage>
                            <ButtonImage onPress={() => { this.pressOperator('etb') }} styleButton={styles.buttonImage} image={require("../assets/recargas-test/etb.png")}></ButtonImage>
                            <ButtonImage onPress={() => { this.pressOperator('exito') }} styleButton={styles.buttonImage} image={require("../assets/recargas-test/movilexito.png")}></ButtonImage>
                        </View>
                    </View>
                    <Image style={styles.footer} source={require('../assets/login/footer.png')}></Image>
                </ImageBackground>
                <Modal
                    style={{ flex: 1 }}
                    isVisible={this.state.modalInfoVisible}
                    onRequestClose={() => {
                        this.setState({
                            modalInfoVisible: false,
                        });
                    }}
                    onBackButtonPress={() => {
                        this.setState({
                            modalInfoVisible: false,
                        });
                    }}
                    onBackdropPress={() => {
                        this.setState({
                            modalInfoVisible: false,
                        });
                    }}
                >
                    <View style={{ backgroundColor: this.state.selectedOperator.color }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center', marginVertical: 10 }}>{this.state.selectedOperator.title}</Text>
                        <Input placeholder="Número de Celular" inputStyle={{ backgroundColor: 'white', borderRadius: 6 }}></Input>
                        {buttonsPrice}
                        {this.state.showAnotherValueInput && <Input inputStyle={{ backgroundColor: 'white', borderRadius: 6, marginBottom: 10 }} placeholder="Otro valor"></Input>}
                        <Button title="Comprar"></Button>
                    </View>
                </Modal>
            </View>
            </SafeAreaView>
        );
    }
}

var styles = StyleSheet.create({
    background: {
        height: '100%',
        width: '100%'
    },
    containerContent: {
        width: '90%',
        height: '50%',
        marginHorizontal: '5%',
    },
    containerButton: {
        height: '28%',
        width: '100%',
        marginVertical: '1%',
        flexDirection: "row",
        justifyContent: "space-around"
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        height: '14%',
        width: '100%'
    },
    buttonImage: {
        alignItems: "center",
        margin: '5%',
        aspectRatio: 1
    },
    buttonPrice: {
        borderRadius: 10,
        width: 100
    },
    containerButtonPrice: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10
    }
});