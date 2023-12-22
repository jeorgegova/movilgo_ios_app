import React, { PureComponent } from "react";
import { StyleSheet, Text, View, Dimensions, Image, BackHandler, ToastAndroid, ActivityIndicator, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getPrintConfig, printBill } from "../bluetooth/bluetooth-printer";
import { payCollector,paySeller } from "../../services/collector.service";
import NumberFormat from "react-number-format";
import { TextInput } from "react-native-gesture-handler";
import { FormatMoney } from "../../shared/utilities/formats";
import { stylesLarge, stylesMedium } from './stylesCollectorPay'
import { GenerateInvoice } from "../../shared/utilities/GenerateInvoice";
export class CollectorPayModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            image: '',
            amount: '',
            description: '',
            loading: false,
            collector:this.props.collector,
        }
        
        this.modalBill = this.props.modalBill;
        this.modalCamera = this.props.modalCamera;
        this.styles = getStyles();

    }

    componentDidMount = () => {
        this.setState({ image: this.props.image, description: this.props.data.description, amount: this.props.data.amount })
    }

    actionCamera = () => {
        const data = {
            description: this.state.description,
            amount: this.state.amount,
        }
        //this.modalBill(false);
        this.modalCamera(true, data);
    }
    navigateNext = (flag, response) => {
        console.log("navigateNext flag response",flag,response)
     
        if (flag) {
            this.setState({ loading: false });
            if(this.state.collector){
                const data = [
                    "Factura No: " + response.valida.id,
                    "Producto: Carga Bolsa",
                    "Fecha:" + response.valida.fecha,
                    "Valor: " + FormatMoney(this.state.amount)
                ]
            printBill(data);
            
            }
            
            Alert.alert("Movilgo", "Factura cargada correctamente");
            //ToastAndroid.show("Factura cargada correctamente", ToastAndroid.SHORT);
            this.setState({ description: '', amount: '' });
            this.modalBill(false);
        } else {
            Alert.alert("¡Error!", response.data.message)
            this.setState({ loading: false });
        }
    }

    sendToOdoo = async () => {
        //console.log("perfil de collector",this.state.collector)
        if(this.state.collector){
            this.setState({ "loading": true });
            const data = {
                "amount": this.state.amount,
                "consignacion": this.state.image,
                "descripcion": this.state.description
            };
            //consolg("this.state.collector",data)
            await payCollector(data, this.navigateNext);
        }else{
            this.setState({ "loading": true });
            const data = {
                "amount": this.state.amount,
                "consignacion": this.state.image,
                "descripcion": this.state.description,
                "tipo":"documento_pago_cliente"
            };
            //console.log("this.state.seller",data)
            await paySeller(data, this.navigateNext);
        }
       /*  try {
            
        } catch (error) {
            
            Alert.alert("Error", "Error inesperado.");
            this.setState({ "loading": false });
        } */
    }
    navigateToPrintConfig = (flag) => {
        if (flag) {
            this.setState({
                loading: false,
            });
            this.modalBill(false);
            this.props.navigation.navigate("Printer");
        } else {
            this.sendToOdoo();
        }
    }

    pressBuy = () => {
        if (this.state.amount > 0 && this.state.description!="" && this.state.image!="") {
            this.setState({ "loading": true });
            getPrintConfig(this.navigateToPrintConfig);

        } else {
            Alert.alert("Atención", "Deben de llenarsen todos los campos");
        }
    }
    render() {

        return (
            <View style={this.styles.container}>
                <View style={{ backgroundColor: '#02606e', paddingVertical: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ width: '20%' }}></View>
                        <View style={{ width: '60%' }}>
                            <Text style={this.styles.titleModal}>Subir Consignación</Text>
                        </View>
                        <View style={{ width: '20%' }}>
                            <Button
                                buttonStyle={{ width: 40, alignSelf: "flex-end", marginRight: 10 }}
                                type="clear"
                                icon={<Icon name="close" size={24} color='white' ></Icon>}
                                onPress={() => {
                                    this.modalBill(false);
                                }}
                            ></Button>
                        </View>
                    </View>
                </View>
                <View style={this.styles.containerInfoGreen}>
                    <NumberFormat
                        thousandSeparator={true}
                        displayType="text"
                        prefix={'$'}
                        value={this.state.amount}
                        renderText={value =>
                            <TextInput
                                value={value}
                                onChangeText={(amount) => this.setState({ amount: parseInt(amount.replace("$", "").replace(",", "").replace(",", "")) })}
                                placeholder="Valor a pagar"
                                keyboardType="number-pad"
                                style={[this.styles.inputModal, { margin: 10 }]}>
                            </TextInput>
                        }
                    />
                    <Input
                        inputStyle={this.styles.inputModal}
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        errorStyle={{ height: 0 }}
                        value={this.state.description}
                        onChangeText={(description) => { this.setState({ description }) }}
                        placeholder="Descripción">
                    </Input>
                    {this.state.image != '' && <Image style={{ height: 200, width: "90%", alignSelf: "center" }} 
                    source={{ uri: 'data:image/png;base64,' + this.state.image }} />}
                    <Button buttonStyle={this.styles.button} onPress={this.actionCamera} icon={<Icon name="camera" color="white" size={this.styles.icon.fontSize}></Icon>}></Button>
                    <Button
                        disabled={this.state.amount==''||this.state.image==''} 
                        onPress={this.pressBuy} buttonStyle={[this.styles.button, { marginVertical: 10 }]} title="Enviar" ></Button>
                    <View style={{height: 150}}></View>
                </View>
                <View style={this.styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}></ActivityIndicator>
                </View>
               
            </View>
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

