import React, { PureComponent } from 'react';
import { Dimensions, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { Image, ImageBackground, View } from 'react-native';
import { Icon, Input, Button } from 'react-native-elements';
import { Header } from '../../components/UI/header';
import { Capitalize, FormatMoney } from '../../shared/utilities/formats';
import Register from '../../components/UI/register';
import { InputForm, InputNumber } from '../../components/UI/input';
import { ScrollView } from 'react-native-gesture-handler';
import { allDataBase } from '../../database/allSchemas';
import { BINGO_SCHEMA } from '../../database/models/bingo';
import { Transaction } from '../../services/products.service';
import { getBingo, searchClientBingo } from '../../services/bingo.service';
import { ActivityIndicator } from 'react-native';
import { getPrintConfig, printBill } from '../bluetooth/bluetooth-printer';
import { Alert } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { ToastAndroid } from 'react-native';
import { GenerateInvoice } from '../../shared/utilities/GenerateInvoice';
export class GanaBingo extends Register {
    constructor(props) {
        super();
        this.state = {
            value: 0,
            color: 'black',
            price: 0,
            modalCreateUser: false,
            names: {
                name: 'names',
                value: "",
                error: '',
                type: "off",
                required: true
            },
            lastNames: {
                name: 'lastNames',
                value: "",
                error: '',
                type: "off",
                required: true
            },
            identification: {
                name: 'identification',
                value: "",
                error: '',
                type: "off",
                required: true
            },
            email: {
                name: 'email',
                value: "",
                error: '',
                type: "email",
                required: true
            },
            address: {
                name: 'address',
                value: "",
                error: '',
                type: "off",
                required: true
            },
            phone: {
                name: 'phone',
                value: "",
                error: '',
                type: "mobile",
                required: true
            },
            ok: false,
            user_found: false,
            loading: false,
            product_id: 0,
            dateStart: "",
            reward: "",
            count: 1,
            text:"esto es lo que lleva ",
            modalShared:false,
            dataResponse:[]
        }
        this.inputsToVerify = ["names", "lastNames", "identification", "phone"];
        this.styles = getStyles();
    }
    
    count = (flag) => {
        if (flag && this.state.count < 5) {
            this.setState({ count: this.state.count + 1 })
        } else if (!flag && this.state.count > 1) {
            this.setState({ count: this.state.count - 1 })
        }
    }

    navigateToPrintConfig = (flag) => {
        if (flag) {
            this.setState({
                loading: false,
                modalInfoVisible: false
            });
            navigation.navigate("Printer");
        } else {
            this.sendTransaction();
        }
    }

    sendTransaction = () => {
        this.setState({ loading: true })
        let product = {}
        product = {
            product_id: this.state.product_id,
            atributes: {
                bingo_cedula: this.state.identification.value,
                bingo_numero_celular: this.state.phone.value,
                bingo_cliente_nombre: this.state.names.value,
                bingo_apellido_nombre: this.state.lastNames.value,
                bingo_tripletas: "" + this.state.count,
                precio: this.state.price * this.state.count
            }
        }
        Transaction(product, this.navigateNext);
    }

    navigateNext = (flag, response) => {

        if (flag && response.valida) {
            const data = [
                "Factura No: " + response.valida.id,
                "Fecha:" + response.valida.fecha,
                "No.Aprobacion:" + response.valida.numero_aprobacion,
                "Producto: GANA BINGO",
                "Cedula: " + this.state.identification.value,
                "Cliente: " + this.state.names.value + " " + this.state.lastNames.value,
                "Celular: " + this.state.phone.value,
                "Valor: " + FormatMoney(this.state.price * this.state.count)
            ]
            this.setState({ loading: false });
            
            printBill(data);
            this.setState({modalShared:true,dataResponse:data})
            
            this.props.navigation.navigate("Home", { balance: response.valida.balanceFinal });
        } else {
            //Alert.alert("¡Error!", response)
            if(response){
                if(response.errores){
                     Alert.alert("Error", response.errores.observacion,[{text:"Volver",
                        onPress:()=>this.clearData()
                        }]);
                }else{
                    Alert.alert("Error", "Error en la transaccion ",[{text:"Volver",
                        onPress:()=>this.clearData()
                        }]);
                }
               
            }
            this.setState({ loading: false });
        }
    }

    searchUser = () => {
        if (this.state.identification.value.trim() === "") {
            this.setState({
                identification: {
                    name: 'identification',
                    value: "",
                    error: 'Debe llenar este campo antes de realizar una busqueda',
                    type: "off",
                    required: true
                }
            })
            return;
        }
        this.setState({ loading: true })
        searchClientBingo(this.state.product_id, this.state.identification.value, (data, flag) => {
           
            if (flag) {
                if (data && data.data && data.message === "Cliente Listado con exito") {
                    ToastAndroid.show("Cliente encontrado", ToastAndroid.SHORT)
                    this.setState({
                        ok: true,
                        loading: false,
                        phone: {
                            name: 'phone',
                            value: data.data.cusPhone,
                            error: '',
                            type: "mobile",
                            required: true
                        },
                        names: {
                            name: 'names',
                            value: data.data.cusName,
                            error: '',
                            type: "off",
                            required: true
                        },
                        lastNames: {
                            name: 'lastNames',
                            value: data.data.cusLastName,
                            error: '',
                            type: "off",
                            required: true
                        }
                    })
                } else {
                    if (data && data.message === "Cliente no Encontrado") {
                        ToastAndroid.show("Cliente no encontrado", ToastAndroid.SHORT)
                    }
                    this.setState({
                        ok: true,
                        user_found: true,
                        loading: false,
                        phone: {
                            name: "phone",
                            value: "",
                            error: '',
                            type: "mobile",
                            required: true
                        },
                        names: {
                            name: "names",
                            value: "",
                            error: '',
                            type: "off",
                            required: true
                        },
                        lastNames: {
                            name: "lastNames",
                            value: "",
                            error: '',
                            type: "off",
                            required: true
                        }
                    })
                }
            } else {
                Alert.alert("ERROR", "Ha ocurrido un error inesperado, si persiste comuniquese con MovilGo.");
                this.setState({ loading: false })
            }

        })
    }
    clearData = () =>{
        this.setState({
            ok: false,
            loading: false,
            phone: {
                name: 'phone',
                value: "",
                error: '',
                type: "mobile",
                required: true
            },
            names: {
                name: 'names',
                value: "",
                error: '',
                type: "off",
                required: true
            },
            lastNames: {
                name: 'lastNames',
                value: "",
                error: '',
                type: "off",
                required: true
            },
            identification: {
                name: 'identification',
                value: "",
                error: '',
                type: "off",
                required: true
            }
        })
    }
    
    componentDidMount = () => {
        this.setState({ loading: true })
        allDataBase(BINGO_SCHEMA).then(results => {
            if (results) {
                getBingo(results[0].id, (res, flag) => {
                    let newDate
                    
                    if(res===undefined){            
                        
                        Alert.alert("Error", "Se presento un error con la conexion");
                        this.setState({ loading: false });
                    }else if (res.dateStart) {                        
                        newDate = res.dateStart.split("T")[0].split("-");
                    }
                    this.setState({
                        dateStart: res.dateStart ? newDate[2] + "-" + newDate[1] + "-" + newDate[0] : "",
                        reward: res.reward ? FormatMoney(res.reward) : "",
                        product_id: results[0].id,
                        price: results[0].precio,
                        value: results[0].precio,
                        loading: false                        
                    })
                    
                });
            }
        }).catch()
    }
    

    render() {
        return (
            <>
            <SafeAreaView style={{flex: 1}}>
                <View>
                    <ImageBackground style={this.styles.background} source={require('../../assets/login/f.png')}>
                        <Header title="GANA BINGO" onPressBack={() => { this.props.navigation.goBack() }}></Header>
                        <View style={{ width: '100%', marginTop: '5%' }}>
                            {this.state.dateStart !== "" && <Text style={{ textAlign: 'center', fontSize: 18 }}> Fecha de sorteo {this.state.dateStart}</Text>}
                            {this.state.reward !== "" && <Text style={{ textAlign: 'center', fontSize: 18 }}> Premio {this.state.reward}</Text>}
                            <View style={{ marginHorizontal: 16, marginTop: 20, height: '85%' }}>
                                <ScrollView>
                                    {this.state.user_found && <View>
                                        <InputForm
                                            title="Nombres"
                                            field={this.state.names}
                                            handleChange={this.handleChange}
                                            onBlur={this.handleRelease}
                                            placeholder="Nombres"
                                        />
                                        <InputForm
                                            title="Apellidos"
                                            field={this.state.lastNames}
                                            handleChange={this.handleChange}
                                            onBlur={this.handleRelease}
                                            placeholder="Apellidos"
                                        />
                                        <InputNumber
                                            title="Número de identificación"
                                            field={this.state.identification}
                                            errorMessage={this.state.error}
                                            handleChange={this.handleChange}
                                            onBlur={this.handleRelease}
                                            placeholder="Número de identificación"
                                        />
                                        <InputNumber
                                            title="Número de celular"
                                            field={this.state.phone}
                                            handleChange={this.handleChange}
                                            onBlur={this.handleRelease}
                                            placeholder="Número de celular"
                                        />
                                    </View>}

                                    {!this.state.user_found && <InputNumber
                                        title="Número de identificación"
                                        field={this.state.identification}
                                        handleChange={this.handleChange}
                                        onBlur={this.handleRelease}
                                        placeholder="Número de identificación"
                                        icon="search"
                                        onPress={this.searchUser}
                                        
                                    />}
                                    {this.state.ok && <View>
                                         <View style={{ justifyContent: 'center' }}> 
                                         {this.state.identification.value !==0 && <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>
                                                {
                                                Capitalize(this.state.names.value.split(" ")[0])+ " " + Capitalize(this.state.names.value.split(" ")[1]??"") + " " + 
                                                Capitalize(this.state.lastNames.value.split(" ")[0])+ " " + Capitalize(this.state.lastNames.value.split(" ")[1]??"")
                                                }
                                            </Text>}
                                        </View>
                                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                                            <View style={{ width: '15%', justifyContent: 'center' }}>
                                                <Button onPress={() => this.count(false)} icon={<Icon type="font-awesome-5" name="minus" color="#02606e" />} type="clear" />
                                            </View>
                                            <View style={{ width: 100, justifyContent: 'center' }}>
                                                <Input
                                                    inputStyle={{ textAlign: 'center' }}
                                                    textAlignVertical="center"
                                                    keyboardType={'number-pad'}
                                                    onChangeText={(count) => {
                                                        if (parseInt(count) > 5) {
                                                            if (count % 10 < 1) {
                                                                this.setState({ count: 1 })
                                                            } else if (count % 10 <= 5) {
                                                                this.setState({ count: count % 10 })
                                                            } else {
                                                                this.setState({ count: 5 })
                                                            }

                                                            return
                                                        }
                                                        if (count === "") {
                                                            this.setState({ count: 1 })
                                                            return
                                                        }
                                                        if (parseInt(count) > 1) {
                                                            this.setState({ count })
                                                            return
                                                        }
                                                    }}
                                                    value={"" + this.state.count}
                                                    containerStyle={{ borderBottomWidth: 0, justifyContent: 'center' }} />
                                            </View>
                                            <View style={{ width: '15%', justifyContent: 'center' }}>
                                                <Button onPress={() => this.count(true)} icon={<Icon type="font-awesome-5" name="plus" color="#02606e" />} type="clear" />
                                            </View>
                                        </View>
                                        <Text style={{ fontSize: 20, marginHorizontal: 16, alignSelf: 'center' }}>Valor: {FormatMoney(this.state.value * this.state.count)}</Text>
                                        <Button
                                            disabled={this.state.loading}
                                            titleStyle={{ color: 'white' }}
                                            buttonStyle={{ backgroundColor: '#02606e', marginHorizontal: 20, marginTop: 20 }}
                                            title="Comprar" onPress={() => {
                                                if (this.verifyForm()) {
                                                    getPrintConfig(this.navigateToPrintConfig)
                                                }
                                            }} type="clear"
                                        />
                                        <View style={{ height: 150 }}></View>
                                    </View>}

                                </ScrollView>
                            </View>
                        </View>
                        <Image style={this.styles.footer} source={require('../../assets/login/footer.png')} resizeMode="stretch"></Image>
                    </ImageBackground>
                </View>
                <View style={this.styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}></ActivityIndicator>
                </View>
                {this.state.modalShared&&<GenerateInvoice isVisible={this.state.modalShared} data={this.state.dataResponse} closeModal={(flag)=>this.setState({modalShared:flag})} title="Tu recarga fue exitosa!"/>}
                </SafeAreaView>
            </>
        )
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
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 10,
        color: 'white'
    },
    inputPhone: {
        fontSize: 45,
        backgroundColor: 'white',
        borderRadius: 6
    },
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
        height: '25%',
        width: '100%',
        marginVertical: '1%',
        flexDirection: "row",
        justifyContent: "space-around",
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        height: '6%',
        width: '100%'
    },
    buttonImage: {
        alignItems: "center",
        margin: '1%',
        aspectRatio: 1,
        marginVertical: 0
    },
    containerPriceButton: {
        width: '33%',
    },
    input: {
        fontSize: 40,
        backgroundColor: 'white',
        borderRadius: 6,
        marginBottom: 10,
        marginTop: 20
    },
    buttonBuy: {
        backgroundColor: 'rgba(7,162,186,0.7)',
        padding: 10,
        minHeight: 70,
        marginVertical: 20
    },
    buttonPrice: {
        borderRadius: 10,
        marginVertical: '1%',
        borderBottomWidth: 0,
        minHeight: 30,
        marginHorizontal: 10,
    },
    containerButtonPrice: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10
    },
    loading: {
        left: 0,
        right: 0,
        top: '-50%',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleButton: {
        fontSize: 25
    }
});

const stylesMedium = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 8,
        color: 'white'
    },
    background: {
        height: '100%',
        width: '100%'
    },
    inputPhone: {
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 6
    },
    containerContent: {
        width: '90%',
        height: '50%',
        marginHorizontal: '5%',
    },
    containerButton: {
        height: '25%',
        width: '100%',
        marginVertical: '1%',
        flexDirection: "row",
        justifyContent: "space-around",
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        height: '8%',
        width: '100%'
    },
    buttonImage: {
        alignItems: "center",
        margin: '1%',
        aspectRatio: 1,
        marginVertical: 0
    },
    containerPriceButton: {
        width: '33%',
    },
    input: {
        fontSize: 18,
        backgroundColor: 'white',
        borderRadius: 6,
        marginBottom: 10,
        marginTop: 20
    },
    buttonBuy: {
        backgroundColor: 'rgba(7,162,186,0.7)',
        padding: 10,
        marginVertical: 20
    },
    buttonPrice: {
        borderRadius: 10,
        marginVertical: '1%',
        borderBottomWidth: 0,
        marginHorizontal: 10,
    },
    containerButtonPrice: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10
    },
    loading: {
        left: 0,
        right: 0,
        top: '-50%',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleButton: {
        fontSize: 16
    }
});