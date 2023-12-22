import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, ImageBackground, Text, Alert, ActivityIndicator, Dimensions, ToastAndroid, ScrollView } from 'react-native';
import { ButtonImage } from '../components/UI/buttons';
import { Header } from '../components/UI/header';
import Modal from "react-native-modal";
import { Input, Button } from 'react-native-elements';
import { FormatMoney, Capitalize } from '../shared/utilities/formats';
import { allDataBase,getElementByOperator } from '../database/allSchemas';
import { Transaction } from '../services/products.service';
import { printBill, getPrintConfig } from './bluetooth/bluetooth-printer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GenerateInvoice } from '../shared/utilities/GenerateInvoice';
import { SafeAreaView } from 'react-native-safe-area-context';
export class ScreenPines extends PureComponent {
    constructor() {
        super();
        this.state = {
            home: false,
            loading: false,
            modalInfoVisible: false,
            selectedPin: {
                id: -1,
                title: 'None',
                color: 'white',
            },
            package: {
                title: "",
                id: 0
            },
            vigencia: 0,
            phone: "",
            selectedPrice: 0,
            buttonsPines: [<View key={'key' + 1}></View>],
            checkPhone: false,
            checkColor: 'white',
            email: '',
            prices: [],
            selectedProduct: {},
            showAnotherValueInput: false,
            modalInfoPines:false,
            //pines: [],
            resumeView: <></>,
            listTypes: <></>,
            errorEmail: '',
            stateButtons: [false, false, false, false, false, false],
            modalShared:false,
            dataResponse:[]
        }
        this.pines={};
        //this.pines;
        this.items;
        this.styles = getStyles();
        this.time;
        
    }

    componentDidMount() {
        this.getPines();
        this.time = 0;
    }

    getPines() {
        allDataBase('PinesItems').then((results) => {
             console.log('element de pines',results)
            results.forEach(element=>{
               
                if (this.pines[element.operador]) {
                    this.pines[element.operador].push(element);
                } else {
                    this.pines[element.operador] = [];
                    this.pines[element.operador].push(element);
                }
            })
            console.log("los pines",this.pines)
            this.loadPines(this.pines);
        }).catch((err) => { console.log("Pines", err) });

    }
    loadPines(pines) {
        const keys = Object.keys(pines);

        getElementByOperator(keys,'Pines').then((results) => {
            this.buildPines(results);
        }).catch((err) => { console.log("loadPines",err) });

    }

    buildPines(results) {
        //const results = this.pines;
        let buttons = []
        for (let k = 0; k < results.length; k = k + 3) {
            buttons.push(
                <View key={'key' + k} style={this.styles.containerButton}>
                    <ButtonImage onPress={() => { this.pressPin(results[k].operador) }} styleButton={this.styles.buttonImage} image={{ uri: 'data:image/png;base64,' + results[k].image_medium }}></ButtonImage>
                    {k + 1 < results.length && <ButtonImage onPress={() => { this.pressPin(results[k + 1].operador) }} styleButton={this.styles.buttonImage} image={{ uri: 'data:image/png;base64,' + results[k + 1].image_medium }}></ButtonImage>}
                    {k + 2 < results.length && <ButtonImage onPress={() => { this.pressPin(results[k + 2].operador) }} styleButton={this.styles.buttonImage} image={{ uri: 'data:image/png;base64,' + results[k + 2].image_medium }}></ButtonImage>}
                </View>
            )
        }
        this.setState({ buttonsPines: buttons });
    }
    
    pressPin = (pin) => {
        this.buildListType(pin)
        this.setState({
            modalInfoVisible: true,
            selectedProduct: {
                id: pin.id,
                title: Capitalize(pin),
                color: 'rgba(7,162,186,0.7)',
            },
            //pines: this.items[pin.name.toLowerCase()]
        });
    }
    buildListType=(operador)=>{
        
        let types = this.pines["" + operador];
        
        let categories = {}
        types.forEach(element => {            
            if (categories[element.categ_id_name]) {
                categories[element.categ_id_name].push(element);
            } else {
                categories[element.categ_id_name] = [];
                categories[element.categ_id_name].push(element);
            }
        });
        let row = [];
        const keys = Object.keys(categories);
        categories[keys].forEach(element=>{

            console.log("element pines",element) 
            if(element.active===true){
                row.push(
                    <Button
                        key={"package" }
                        buttonStyle={this.styles.buttonPrice}
                        titleStyle={{ color: "white", shadowColor: "black", shadowRadius: 2 }}
                        type="outline"
                        title={
                            <Text style={{
                                flexDirection: "row",
                                justifyContent: "space-around"
                            }}>
                                <Text style={this.styles.label}>{Capitalize(element.name + "\n")}</Text>
                                <Text style={this.styles.label}>{"Vigencia=" + element.vigencia + "\n"}</Text>
                                <Text style={this.styles.labelPrice}>{FormatMoney(element.precio)}</Text>
                            </Text>
                        }
                        onPress={() => {
                            this.setState({
                                package: {
                                    title: "" + element.name,
                                    id: element.id,
                                    price: element.precio
                                }
                            });
                            this.buildResume(element);
                        }}
                    >
                    </Button>
                );
            }
        })

        this.setState({ listTypes: row }); 

    }
    buildResume=(pinSeleted)=>{
        this.setState({ modalInfoPines:true})
        const resumeView =
            <>
                <View style={{ backgroundColor: 'rgb(2,96,110, 0.5)', borderRadius: 6, marginHorizontal: 10, marginVertical: 6, paddingBottom: 10, paddingTop: 6, paddingHorizontal: 10 }}>
                    <Text style={[{ color: "white" }, this.styles.title]} color="white">Resumen</Text>
                    <Text style={this.styles.label}>Producto: {this.state.selectedProduct.title}</Text>
                    <Text style={this.styles.label}>Paquete: {pinSeleted.name}</Text>
                    <Text style={this.styles.label}>Precio: {FormatMoney(pinSeleted.precio)}</Text>
                </View>
            </>
        this.setState({
            modalInfoPines: true,
            resumeView: resumeView,
            selectedPin:{
                id:pinSeleted.id,
                precio:pinSeleted.precio
            }
        });

    }
    navigateNext = (flag, response) => {
        console.log("response de fre fire",flag,response)
        if (flag) {
            const data = [
                "Factura No: " + response.valida.id,
                "Fecha:" + response.valida.fecha,
                "Email:" + this.state.email,
                "No.Aprobacion:" + response.valida.numero_aprobacion,
                "Producto: " + this.state.selectedProduct.title,
                "Celular: " + this.state.phone,
                "Valor: " + FormatMoney(this.state.selectedPin.precio)
            ]
            this.setState({ loading: false });
            printBill(data);
            this.setState({modalShared:true,dataResponse:data})
             this.setState({ loading: false, modalInfoVisible: false,modalInfoPines:false,phone: '',email:'',checkPhone:false });
           
           
            this.time = 0;
        } else {
            Alert.alert("¡Error!", response.errores.observacion)
            this.setState({ loading: false, modalInfoVisible: false,modalInfoPines:false,phone: '',email:'',checkPhone:false });

        }

    }
    sendToOdoo = async () => {
        const emailTest = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i
        this.setState({ "loading": true });
        if (emailTest.test(this.state.email)) {
            try {
                //console.log("this.state.selectedProduct",this.state.selectedProduct)
                //Obtiene la llave de la sesion de la base de datos (No olvidar importar la libreria antes de usarla
                const product = {
                    product_id: this.state.selectedPin.id,
                    atributes: {
                        correo: this.state.email,
                        numero: this.state.phone,
                        precio: this.state.selectedPin.precio
                    }
                }
                console.log("product de garena",product)
                await Transaction(product, this.navigateNext);

            } catch (error) {
                Alert.alert("Error", "Problemas al obtener datos de sesión");
                this.setState({ "loading": false });
            }
        } else {
            this.setState({ errorEmail: 'Correo inválido', loading: false })
        }
    }

    navigateToPrintConfig = (flag) => {
        if (flag) {
            this.setState({
                loading: false,
                modalInfoVisible: false,
                modalInfoPines:false,
            });

            this.props.navigation.navigate("Printer");
        } else {
            this.sendToOdoo();
        }
    }

    pressBuy = () => {
        let max = 11;
        /*if (this.state.selectedPin.title == 'Recarga Etb' || this.state.selectedPin.title == 'Recarga Directv') {
            max = 13;
        }*/
        if (this.state.phone.length > 9 && this.state.phone.length < max) {
            if (this.state.selectedPin.precio >= 1000) {

                this.setState({ "loading": true });
                getPrintConfig(this.navigateToPrintConfig);
                this.setState({ vigencia: 0 })
            } else {
                Alert.alert("Atención", "El valor debe ser mayor a $1.000");
            }
        } else {
            Alert.alert("Atención", "Numero de celular incorrecto.");
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <ImageBackground style={this.styles.background} source={require('../assets/login/f.png')} >
                        <Header title="PINES" onPressBack={() => { this.props.navigation.goBack() }}></Header>
                        <View style={this.styles.containerContent}>
                            {this.state.buttonsPines}
                        </View>
                        <Image style={this.styles.footer} source={require('../assets/login/footer.png')} resizeMode="stretch"></Image>
                    </ImageBackground>
                    <Modal
                        style={{ flex: 1 }}
                        isVisible={this.state.modalInfoVisible}
                        onRequestClose={() => { this.setState({modalInfoVisible: false,modalInfoPines:false,vigencia: 0});}}
                        onBackButtonPress={() => {this.setState({modalInfoVisible: false,modalInfoPines:false,vigencia: 0});}}
                        onBackdropPress={() => {this.setState({modalInfoVisible: false,modalInfoPines:false,vigencia: 0});}}
                    >
                        <View style={{ backgroundColor: this.state.selectedProduct.color, padding: 6, borderRadius: 10, }}>
                            <Text style={this.styles.title}>{this.state.selectedProduct.title}</Text>
                            {this.state.listTypes}
                        </View>
                    </Modal>
                    <Modal
                        style={{ flex: 1 }}
                        isVisible={this.state.modalInfoPines}
                        onRequestClose={() => { this.setState({modalInfoPines:false,phone: '',email:'',checkPhone:false,vigencia: 0});}}
                        onBackButtonPress={() => {this.setState({modalInfoPines:false,phone: '',email:'',checkPhone:false,vigencia: 0});}}
                        onBackdropPress={() => {this.setState({modalInfoPines:false,phone: '',email:'',checkPhone:false,vigencia: 0});}}
                    >
                        <View style={{ backgroundColor: this.state.selectedProduct.color, padding: 6, borderRadius: 10, }}>
                            <ScrollView>
                                <Text style={this.styles.title}>{this.state.selectedProduct.title}</Text>
                                {this.state.resumeView}
                                <Input value={this.state.phone}
                                    keyboardType="phone-pad"
                                    onChangeText={(phone) => {
                                        const re = /^[0-9\b]+$/
                                        if (phone === '' || re.test(phone)) {
                                            if (phone.length > 9) {
                                                this.setState({
                                                    checkPhone: true,
                                                    checkColor: '#bedb02',
                                                    phone
                                                })
                                            } else {
                                                this.setState({
                                                    checkPhone: false,
                                                    checkColor: 'white',
                                                    phone
                                                })
                                            }
                                        }
                                    }}
                                    rightIcon={
                                        this.state.checkPhone && <Icon
                                            name="check"
                                            size={40}
                                            color={this.state.checkColor}>
                                        </Icon>
                                    }
                                    placeholder="Celular"
                                    inputStyle={[this.styles.inputPhone, { marginTop: 40 }]}></Input>

                            
                                <Input
                                    errorMessage={this.state.errorEmail}
                                    require={true}
                                    value={this.state.email}
                                    placeholder="Correo"
                                    inputStyle={this.styles.inputPhone}
                                    onChangeText={(correo) => { this.setState({ email: correo }) }}
                                ></Input>
                                <Button disabled={this.state.loading || !this.state.checkPhone}
                                    title="Comprar"
                                    buttonStyle={this.styles.buttonBuy}
                                    onPress={this.pressBuy}
                                    titleStyle={this.styles.titleButton}>
                                </Button>
                                <View style={this.styles.loading}>
                                    <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}></ActivityIndicator>
                                </View>
                            </ScrollView>
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
        height: '38%',
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
        margin: '30%',
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
        height: '38%',
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
        margin: '30%',
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