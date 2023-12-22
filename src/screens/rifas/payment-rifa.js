import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, Text, Alert, ActivityIndicator, Dimensions, ToastAndroid } from 'react-native';
import { Header } from '../../components/UI/header';
import { FormatMoney } from '../../shared/utilities/formats';
import { Input, Button } from 'react-native-elements';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Footer } from '../../components/UI/footer';
import Modal from "react-native-modal";
import { searchPayments } from '../../services/rifa.service';
import { printBill, getPrintConfig } from '../bluetooth/bluetooth-printer';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Transaction } from '../../services/products.service';
import Icon from 'react-native-vector-icons/FontAwesome';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import NumberFormat from 'react-number-format';
import { GenerateInvoice } from '../../shared/utilities/GenerateInvoice';
export class ScreenPaymentRifa extends PureComponent {
    constructor() {
        super();
        this.state = {
            modalPayVisible: false,
            showAnotherValueInput: false,
            loading: false,
            rifa: {
                id: 0,
                name: "",
                fecha_sorteo: "",
                price: 0,
                image: "",
                porcentajeRecaudo: 0,
                numero_resolucion_rifa: ''
            },
            debt: 0,
            num_boleta: -1,
            partner_id: -1,
            payedValue: '',
            searchType: "cedula",
            searchedValue: '',
            cliente: "",
            cedula: '',
            listDebts: [<View key={'key' + 1}></View>],
            stateButtons: ['rgba(7,162,186,0.7)', 'rgba(7,162,186,0.7)', 'rgba(7,162,186,0.7)'],
            priceList: [0, 0, 0],
            vendedor_externo_id: -1,
            value3Index: 0,
            modalShared:false,
            dataResponse:[]
        };
        this.searchTypes = [
            { label: 'Cédula', value: 'cedula' },
            { label: 'Boleta', value: 'boleta' },
            { label: 'Celular', value: 'celular' }
        ];
        this.styles = getStyles();
    }
    componentDidMount() {

        this._isMounted = true;
        if (this._isMounted) {
            this.props.navigation.addListener('focus', () => {
                this.setState({ rifa: this.props.route.params.rifa })
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.navigation.removeListener();
    }

    buildPrices = () => {
        let row = [];
        for (let k = 0; k < this.state.priceList.length; k = k + 3) {
            row.push(
                <View key={'key' + k} style={this.styles.containerButtonPrice}>
                    <Button titleStyle={this.styles.titleButton}
                        containerStyle={this.styles.containerPriceButton}
                        buttonStyle={[this.styles.buttonPrice,
                        { backgroundColor: this.state.stateButtons[k] }]}
                        title={FormatMoney(this.state.priceList[k])}
                        onPress={() => { this.pressPrice(k) }}
                        disabled={this.state.loading}>
                    </Button>
                    {k + 1 < this.state.priceList.length &&
                        <Button titleStyle={this.styles.titleButton}
                            containerStyle={this.styles.containerPriceButton}
                            buttonStyle={[this.styles.buttonPrice,
                            { backgroundColor: this.state.stateButtons[k + 1] }]}
                            title={FormatMoney(this.state.priceList[k + 1])}
                            onPress={() => { this.pressPrice(k + 1) }}
                            disabled={this.state.loading}>
                        </Button>}
                    {k + 2 < this.state.priceList.length &&
                        <Button titleStyle={this.styles.titleButton}
                            containerStyle={this.styles.containerPriceButton}
                            buttonStyle={[this.styles.buttonPrice,
                            { backgroundColor: this.state.stateButtons[k + 2] }]}
                            title={FormatMoney(this.state.priceList[k + 2])}
                            onPress={() => { this.pressPrice(k + 2) }}
                            disabled={this.state.loading}>
                        </Button>}
                </View>
            );
        }
        return row;
    }

    pressPrice = (index) => {
        const price = this.state.priceList[index];

        let stateButtons = [];
        for (let i = 0; i < this.state.stateButtons.length; i++) {
            if (i === index) {
                stateButtons.push('#bedb02');
            } else {
                stateButtons.push('rgba(7,162,186,0.7)');
            }
        }
        if (price === 'Otro') {
            this.setState({
                stateButtons,
                showAnotherValueInput: true,
                payedValue: ""
            });
        } else {
            this.setState({
                stateButtons,
                showAnotherValueInput: false,
                payedValue: price
            });
        }
    }

    foundPayments = (response, flag) => {
        console.log("paso por el foundPayments",flag,response)
        if (!flag) {
            Alert.alert("Error", response.data.message);
            this.setState({ loading: false });
            return
        }
        let result = [];

        if (response) {
            if (response.abonos.length === 0) {
                ToastAndroid.show("No se han encontrado resultados.", ToastAndroid.LONG);
                this.setState({ listDebts: result, loading: false });
            }
            response.abonos.forEach(element => {
                if (element.deuda !== 0) {
                    result.push(
                        <View key={'debt' + element.boleta} style={[this.styles.containerInfoGreen, { padding: 10 }]}>
                            <Text style={this.styles.label}>Cliente: {element.nombre}</Text>
                            <Text style={this.styles.label}>Celular: {element.celular ?? this.state.searchedValue}</Text>
                            <Text style={this.styles.label}>Boleta: {element.boleta ?? this.state.searchedValue}</Text>
                            <Text style={this.styles.title}>Saldo: {FormatMoney(element.deuda)}</Text>
                            <Button
                                title='Abonar'
                                buttonStyle={this.styles.button}
                                onPress={() => {
                                    if (element.deuda == 0) {
                                        ToastAndroid.show("La deuda ya se encuentra paga", ToastAndroid.LONG)
                                    } else {
                                        const priceList = [];
                                        priceList.push(element.deuda * 0.5);
                                        priceList.push(element.deuda);
                                        priceList.push("Otro");
                                        this.setState({
                                            priceList,
                                            cliente: element.nombre,
                                            selectedDebt: element,
                                            modalPayVisible: true,
                                            partner_id: element.partner_id,
                                            debt: element.deuda,
                                            num_boleta: element.boleta ?? this.state.searchedValue,
                                            vendedor_externo_id: element.vendedor_externo_id
                                        });
                                    }
                                }} ></Button>
                        </View >
                    )
                };
            });
            this.setState({ listDebts: result, loading: false });
        }
    }
    findPayments = () => {
        console.log("ingreso al findPayments")
        if (this.state.searchedValue.trim() !== "") {
            this.setState({ loading: true });
            console.log("paso por el if de findPayments")
            searchPayments(this.state.searchType, this.state.searchedValue, this.state.rifa.id, this.foundPayments);
        } else {
            Alert.alert("Atención", "No ha digitado un valor de busqueda.")
        }

    }

    navigateNext = (flag, response) => {
        console.log("flag de abono",flag)
        console.log("res de abono",response)
        let data=[]
        if (flag) {            
            data = [
                "Factura No: " + response.valida.id,
                "Fecha:" + response.valida.fecha,
                "No.Aprobacion:" + response.valida.numero_aprobacion,
                "Producto: " + this.state.rifa.name,
                "Resolucion: " + this.state.rifa.numero_resolucion_rifa,
                "Fecha del sorteo: " + this.state.rifa.fecha_sorteo,
                "Numero de boleta: " + this.state.num_boleta,
                "Cliente: " + this.state.cliente,
                "Valor: " + FormatMoney(this.state.rifa.price)
            ]
            if (this.state.rifa.price > this.state.payedValue) {
                data = [
                    "Factura No: " + response.valida.id,
                    "Fecha:" + response.valida.fecha,
                    "No.Aprobacion:" + response.valida.numero_aprobacion,
                    "Producto: Abono " + this.state.rifa.name,
                    "Resolucion: " + this.state.rifa.numero_resolucion_rifa,
                    "Fecha del sorteo: " + this.state.rifa.fecha_sorteo,
                    "Numero de boleta: " + this.state.num_boleta,
                    "Cliente: " + this.state.cliente,
                    "Valor total: " + FormatMoney(this.state.rifa.price),
                    "Valor abonado: " + FormatMoney(parseInt(this.state.payedValue)),
                    "Valor por pagar: " + FormatMoney(this.state.debt - this.state.payedValue),
                ]
            }
           
            this.setState({ loading: false });
            printBill(data);
            this.setState({modalShared:true,dataResponse:data})
            
            
        } else {
            if(response.errores){
                Alert.alert("Error",response.errores.observacion);
            }else{
                Alert.alert("Error","Se presento un Error comunicate con Movilgo");
            }
            
            this.setState({ loading: false });
        }
    }
    sendToOdoo = async () => {
        try {
            //Obtiene la llave de la sesion de la base de datos (No olvidar importar la libreria antes de usarla
            const product = {
                product_id: this.state.rifa.id,
                atributes: {
                    numeroBoleta: this.state.num_boleta,
                    valorPagar: parseInt(this.state.payedValue),
                    partner_id: this.state.partner_id,
                    vendedor_externo_id: this.state.vendedor_externo_id,
                    nombre_cliente: this.state.cliente
                }
            }


            await Transaction(product, this.navigateNext);
        } catch (error) {
            Alert.alert("Error", "Problemas al obtener datos de sesión");
            this.setState({ "loading": false });
        }
    }

    navigateToPrintConfig = (flag) => {
        if (flag) {

            this.setState({
                loading: false,
                modalInfoVisible: false
            });
            this.props.navigation.navigate("Printer");
        } else {
            this.sendToOdoo();
        }
    }

    pressBuy = () => {
        if (this.state.payedValue > this.state.debt) {
            Alert.alert("Atención", "El pago maximo de abono es " + FormatMoney(this.state.debt));
            this.setState({ "loading": false });
            return
        }

        if (this.state.payedValue <= 0) {
            Alert.alert("Atención", "El valor abonar no puede ser cero");
            this.setState({ "loading": false });
            return
        }
        getPrintConfig(this.navigateToPrintConfig);
    }
    pay = () => {

        if (this.state.loading === true) {
            return
        } else {
            this.setState({ loading: true });
            this.pressBuy();
            this.setState({ modalPayVisible: false })
        }

    }

    render() {
        const buttonsPrice = this.buildPrices();
        return (
            <SafeAreaView style={{flex: 1}}>
            <View>
                <View style={this.styles.background}>
                    <Header onPressBack={() => { this.props.navigation.goBack() }}></Header>
                    <ScrollView>
                        <Image style={{ height: 200, width: '90%', backgroundColor: "black", alignSelf: "center", marginTop: 10 }} source={{ uri: 'data:image/png;base64,' + this.state.rifa.image }} resizeMode='stretch'></Image>
                        <View style={this.styles.containerInfoGreen}>
                            <RadioForm
                                style={{ alignSelf: 'center', marginTop: 10 }}
                                formHorizontal={true}
                                animation={true}
                            >
                                {/* To create radio buttons, loop through your array of options */}
                                {
                                    this.searchTypes.map((obj, i) => (
                                        <RadioButton labelHorizontal={true} key={i} >
                                            <RadioButtonInput
                                                obj={obj}
                                                index={i}
                                                isSelected={this.state.value3Index === i}
                                                onPress={(searchType) => { this.setState({ searchType, searchedValue: '', listDebts: [], value3Index: i }) }}
                                                borderWidth={1}
                                                buttonInnerColor={'#bedb02'}
                                                buttonOuterColor={this.state.value3Index === i ? '#bedb02' : '#ffffff'}
                                                buttonSize={20}
                                                buttonOuterSize={30}
                                                buttonStyle={{}}
                                                buttonWrapStyle={{ marginLeft: 10 }}
                                            />
                                            <RadioButtonLabel
                                                obj={obj}
                                                index={i}
                                                labelHorizontal={true}
                                                onPress={(searchType) => { this.setState({ searchType, searchedValue: '', listDebts: [], value3Index: i }) }}
                                                labelStyle={[this.styles.title, { color: 'white' }]}
                                                labelWrapStyle={{}}
                                            />
                                        </RadioButton>
                                    ))
                                }
                            </RadioForm>

                            <View style={[this.styles.containerInput, { borderColor: this.state.partner_id > -1 ? '#22bb33' : 'black', borderWidth: this.state.partner_id > -1 ? 4 : 0 }]}>
                                <Input
                                    value={this.state.searchedValue}
                                    onChangeText={(searchedValue) => this.setState({ searchedValue })}
                                    placeholder="Búsqueda"
                                    keyboardType="number-pad"
                                    inputStyle={{ fontSize: 22, borderBottomWidth: 0 }}
                                    inputContainerStyle={{ borderBottomWidth: 0 }}
                                    containerStyle={{ width: '80%' }}
                                    errorStyle={{ height: 0 }}>
                                </Input>
                                <Button
                                    containerStyle={{ width: '20%' }}
                                    disabled={this.state.loading}
                                    onPress={()=>this.findPayments()}
                                    type="clear"
                                    titleStyle={{ color: 'black' }}
                                    icon={<Icon name="search"
                                        size={34}></Icon>} >
                                </Button>
                            </View>
                        </View>
                        {this.state.listDebts}
                        <View style={{ height: 100, width: "100%" }}></View>
                    </ScrollView>
                    <Footer style={this.styles.footer}></Footer>
                </View>


                <Modal
                    style={{ flex: 1 }}
                    isVisible={this.state.modalPayVisible}
                    onRequestClose={() => {
                        this.setState({
                            modalPayVisible: false,
                        });
                    }}
                    onBackButtonPress={() => {
                        this.setState({
                            modalPayVisible: false,
                        });
                    }}
                    onBackdropPress={() => {
                        this.setState({
                            modalPayVisible: false,
                            payedValue: ''
                        });
                    }}
                >

                    <View style={{ backgroundColor: 'white', borderRadius: 10 }}>
                        <View style={this.styles.containerInfoGreen}>
                            <Text style={[this.styles.label, { textAlign: "center", alignSelf: 'center' }]}>El saldo de la deuda es {FormatMoney(this.state.debt ?? 0)}</Text>
                            {buttonsPrice}
                            {this.state.showAnotherValueInput &&
                                <NumberFormat
                                    thousandSeparator={true}
                                    displayType="text"
                                    prefix={'$'}
                                    value={this.state.payedValue}
                                    renderText={value =>
                                        <TextInput
                                            value={value}
                                            onChangeText={(payedValue) => this.setState({ payedValue: parseInt(payedValue.replace("$", "").replace(",", "").replace(",", "")) })}
                                            placeholder="Otro valor"
                                            keyboardType="number-pad"
                                            style={[this.styles.input, { margin: 10 }]}>
                                        </TextInput>
                                    }
                                />
                            }
                            <Button title="Comprar" disabled={this.state.loading} buttonStyle={this.styles.button} titleStyle={{ fontSize: 22 }} onPress={this.pay}></Button>
                        </View>
                    </View>
                </Modal>
                <View style={this.styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}></ActivityIndicator>
                </View>
                {this.state.modalShared&&<GenerateInvoice isVisible={this.state.modalShared} data={this.state.dataResponse} closeModal={(flag)=>{this.setState({modalShared:flag})
                                                                                                                                                this.props.navigation.navigate("Home");}} title="Tu recarga fue exitosa!"/>}
   
            </View>

            </SafeAreaView>
        );
    }
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
    label: {
        color: 'white',
        fontSize: 18
    },
    containerPriceButton: {
        width: '32%'
    },
    input: {
        fontSize: 30,
        backgroundColor: 'white',
        borderRadius: 6
    },
    titleButton: {
        fontSize: 25
    },
    loading: {
        left: 0,
        right: 0,
        top: '-50%',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: 'center',
        marginVertical: 6
    },
    background: {
        height: '100%',
        width: '100%'
    },
    containerInfoGreen: {
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 10,
        backgroundColor: 'rgba(7, 162, 186, 0.7)'
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        height: '14%',
        width: '100%'
    },
    buttonPrice: {
        borderRadius: 10,
        width: 100
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: 'rgba(7,162,186,0.7)',
        marginBottom: 6,
        borderRadius: 10
    },
    containerInput: {
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        marginHorizontal: 16,
        marginVertical: 14
    },
    containerButtonPrice: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10
    },
});

const stylesMedium = StyleSheet.create({
    label: {
        color: 'white',
        fontSize: 18
    },
    containerPriceButton: {
        width: '32%'
    },
    input: {
        fontSize: 20,
        backgroundColor: 'white',
        borderRadius: 6
    },
    titleButton: {
        fontSize: 18
    },
    loading: {
        left: 0,
        right: 0,
        top: '-50%',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: 'center',
        marginVertical: 6
    },
    background: {
        height: '100%',
        width: '100%'
    },
    containerInfoGreen: {
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 10,
        backgroundColor: 'rgba(7, 162, 186, 0.7)'
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        height: '14%',
        width: '100%'
    },
    buttonPrice: {
        borderRadius: 10,
        width: 100
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: 'rgba(7,162,186,0.7)',
        marginBottom: 6,
        borderRadius: 10
    },
    containerInput: {
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        marginHorizontal: 16,
        marginVertical: 14
    },
    containerButtonPrice: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10
    },
});