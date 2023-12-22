import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, ImageBackground, Text, Alert, ActivityIndicator, Dimensions, ToastAndroid ,ScrollView} from 'react-native';
import { ButtonImage } from '../../components/UI/buttons';
import { Header } from '../../components/UI/header';
import Modal from "react-native-modal";
import { Input, Button } from 'react-native-elements';
import { FormatMoney, Capitalize } from '../../shared/utilities/formats';
import { allDataBase } from '../../database/allSchemas';
import { Transaction } from '../../services/products.service';
import { printBill, getPrintConfig } from '../bluetooth/bluetooth-printer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CERTIFICADO_SCHEMA } from '../../database/models/certificado'; 
import {searchCertification,searchSnr}from '../../services/certification.service'
import {SafeAreaView} from 'react-native-safe-area-context';
import{SearchPicker}from '../../shared/picker/picker'
import { GenerateInvoice } from '../../shared/utilities/GenerateInvoice';
export class ScreenCertification extends PureComponent {
    constructor() {
        super();
        this.state = {
            home: false,
            loading: false,
            modalInfoVisible: false,
            selectCertification: {
                id: -1,
                title: 'None',
                color: 'white',
            },
            phone: "",//3126060066
            email:"",//fosebad@gmail.com
            document:'',
            snrLicense:"202720",//202720
            snrOffice:"",//290
            buttonCertification: [<View key={'key' + 1}></View>],
            checkPhone: false,
            checkColor: 'white',
            errorDocument: '',
            errorPhone:'',
            errorEmail:'',
            errorLicense:'',
            errorOffice:'',
            payplace:{},
            package:{},
            modalInfoPay:false,
            modalInfoSnrLicense:false,
            optionPlaces:{},
            modalInfoVisible:false,
            placeSelected:{label:'--Seleccione un Departamento--',value:-1},
            loadplaces:false,
            modalShared:false,
            dataResponse:[]


        }
        this.products;
        this.places={};
        this.styles = getStyles();
        this.time;
    }

    loadCertificate() {
        
        allDataBase(CERTIFICADO_SCHEMA).then((results) => {
            //console.log("CERTIFICADO_SCHEMA",results)
            this.products = results;
            this.buildCertificate();
        }).catch((err) => { console.log("loadCertificate", err) });
    }

    buildCertificate() {
        const results = this.products;
        let buttons = []
        for (let k = 0; k < results.length; k = k + 3) {
            buttons.push(
                <View key={'key' + k} style={this.styles.containerButton}>
                    <ButtonImage onPress={() => { this.pressCertification(results[k]) }} styleButton={this.styles.buttonImage} image={{ uri: 'data:image/png;base64,' + results[k].image_medium }}></ButtonImage>
                    {k + 1 < results.length && <ButtonImage onPress={() => { this.pressCertification(results[k + 1]) }} styleButton={this.styles.buttonImage} image={{ uri: 'data:image/png;base64,' + results[k + 1].image_medium }}></ButtonImage>}
                    {k + 2 < results.length && <ButtonImage onPress={() => { this.pressCertification(results[k + 2]) }} styleButton={this.styles.buttonImage} image={{ uri: 'data:image/png;base64,' + results[k + 2].image_cmedium }}></ButtonImage>}
                </View>
            )
        }
        this.setState({ buttonCertification: buttons });
    }
    componentDidMount() {
        this.loadCertificate();
        this.time = 0;
    }
    pressCertification = (certification) => {
        this.setState({
            loading:true,
            selectCertification: {
                id: certification.id,
                title: Capitalize(certification.name),
                color: 'rgba(7,162,186,0.7)'
            }
        });
        searchCertification(certification.id,this.getPlacePay)
    }
    getPlacePay=(flag,res)=>{
    console.log("loadpay",flag,res)
        if(flag){
            this.setState({loading:false})
            res.forEach((element)=>{
                //this.places[element.group].push(element)
                if (this.places[element.group]) {
                    this.places[element.group].push(element);
                } else {
                    this.places[element.group] = [];
                    this.places[element.group].push(element);
                }
            })
            this.loadPlaces(this.places)
        }else{
            this.setState({loading:false})
            Alert.alert("Error", "No se obtuvieron lugares de pago");
        }
    }
    loadPlaces=(places)=>{
        
        const keys = Object.keys(places);
        let options=[]
        keys.forEach((element)=>{
            options.push({value:element,label:element})
            options.sort((a, b) => {
                return a.label < b.label ? -1 : 1;
              });
        })
        this.setState({optionPlaces:options,modalInfoVisible:true})
    }
    initialicePlaces=(places)=>{
        console.log("initialicePlaces",this.places[places.value])
        let row=[]
        
        this.places[places.value].forEach((element)=>{
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
                                <Text style={this.styles.label}>{"Codigo= " + element.code}</Text>
                                <Text style={this.styles.label}>{"Grupo=" + Capitalize(element.group + "\n")}</Text>
                                <Text style={this.styles.labelPrice}>{"Nombre=" + Capitalize(element.name)}</Text>
                            </Text>
                        }
                        onPress={() => {
                            this.setState({
                                package: {
                                    code: "" + element.code,
                                    group: element.group,
                                    name: element.name
                                },
                                modalInfoSnrLicense:true
                            });
                            //this.buildResume(element);
                        }}
                    >
                    </Button>
            )
        })
        this.setState({payplace:row,loadplaces:true})
    }
    
    snrLicenseResumen=()=>{
        this.setState({loading:true})
        //console.log("dato",this.state.package.code,this.state.snrLicense,this.snrLicense)
        searchSnr(this.state.selectCertification.id,this.state.package.code,this.state.snrLicense,this.snrLicense)
    }
    snrLicense=(flag,res)=>{
        console.log("responde del snrLicense",flag,res)
        if(flag){
            this.setState({modalInfoPay:true,loading:true})
        }else{
            this.setState({loading:false})
            Alert.alert("Error", "algo salio mal certification");
        }

    }
    navigateNext = (response,flag) => {
        console.log("response del certificado",response)
        if (flag) {
            const data = [
                "Factura No: " + response.valida.id,
                "Fecha:" + response.valida.fecha,
                "No.Aprobacion:" + response.valida.numero_aprobacion,
                "Producto: " + this.state.selectCertification.title,
                "Celular: " + this.state.phone,
                //"Valor: " + FormatMoney(this.state.selectedPrice)
            ]
            this.setState({ loading: false });
            printBill(data);
            this.setState({modalShared:true,dataResponse:data})
            this.props.navigation.navigate("Home", { balance: response.valida.balanceFinal });
            this.time = 0;
            
        } else {
            Alert.alert("¡Error!", response.errores.observacion)
            this.setState({ loading: false, modalInfoVisible: false ,phone:'',
            email:'',
            document:'',
            snrLicense:'',
            snrOffice:'',});
        }
    }
    sendToOdoo = async () => {
        
        try {
            //Obtiene la llave de la sesion de la base de datos (No olvidar importar la libreria antes de usarla
            const product = {
                product_id: this.state.selectCertification.id,
                atributes: {
                    cellphone:this.state.phone,
                    email:this.state.email,
                    document:this.state.document,
                    snrLicense:this.state.snrLicense,
                    snrOffice:his.state.package.code
                }
            }
            console.log("product de certificados ",product)
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
        const emailValid = this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        if(this.state.phone==''){
            console.log("esto entro al phone",this.state.phone)
            this.setState({ errorPhone: 'El campo Celular es obligatorio' })
       
        }else if(this.state.document==''){
            this.setState({ errorDocument: 'Falta llenar el campo del documento' })
       
        }else if (this.state.email==''||!emailValid){
            this.setState({ errorEmail: 'El Email es invalido' })
       
        }else {
            console.log("esto entro al ultimo if")
            this.setState({errorDocument:'',errorPhone:'',errorLicense:'',errorOffice:''})
            this.setState({ "loading": true });
            getPrintConfig(this.navigateToPrintConfig);
        }
        
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
            <View>
                <ImageBackground style={this.styles.background} source={require('../../assets/login/f.png')} >
                    
                    <Header title="CERTIFICADOS " onPressBack={() => { this.props.navigation.goBack() }}></Header>
                    
                    <View style={this.styles.containerContent}>
                        {this.state.buttonCertification}
                    </View>

                    <Image style={this.styles.footer} source={require('../../assets/login/footer.png')} resizeMode="stretch"></Image>
                </ImageBackground>
                
                <Modal
                    style={{ flex: 1 }}
                    isVisible={this.state.modalInfoVisible}
                    onRequestClose={() => { this.setState({modalInfoVisible: false,placeSelected:{label:'--Seleccione un departamento--',value:-1}});}}
                    onBackButtonPress={() => {this.setState({modalInfoVisible: false,placeSelected:{label:'--Seleccione un departamento--',value:-1}});}}
                    onBackdropPress={() => {this.setState({modalInfoVisible: false,placeSelected:{label:'--Seleccione un departamento--',value:-1}});}}
                >
                    <ScrollView>
                    
                        <View style={{ backgroundColor: this.state.selectCertification.color, padding: 6, borderRadius: 10, }}>
                            <Text style={this.styles.title}>{this.state.selectCertification.title}</Text>
                            <View>
                                <SearchPicker
                                    style={{button: {marginHorizontal: 0}}}
                                    value={this.state.placeSelected}
                                    items={this.state.optionPlaces}
                                    onChange={(value) => {
                                    this.setState({placeSelected:value});
                                    this.initialicePlaces(value);
                                    }}
                                />
                            </View>
                            {this.state.loadplaces&&<View>
                                {this.state.payplace}
                            </View>
                            }
                        </View>
                    </ScrollView>
                    
                </Modal>
                <Modal
                    style={{ flex: 1 }}
                    isVisible={this.state.modalInfoSnrLicense}
                    onRequestClose={() => { this.setState({modalInfoSnrLicense:false,snrLicense:''});}}
                    onBackButtonPress={() => {this.setState({modalInfoSnrLicense:false,snrLicense:''});}}
                    onBackdropPress={() => {this.setState({modalInfoSnrLicense:false,snrLicense:''});}}
                >
                    <View style={{ backgroundColor: this.state.selectCertification.color, padding: 6, borderRadius: 10, }}>
                        <Text style={this.styles.title}>{this.state.package.name}</Text>
                        <Input
                            /* errorMessage={this.state.errorPhone}  */
                            value={this.state.snrLicense}
                            keyboardType="phone-pad"
                            onChangeText={(snrLicense) => {
                                            const re = /^[0-9\b]+$/
                                            if (phone === '' || re.test(snrLicense)) {
                                                this.setState({snrLicense})
                                            }
                                        }}
                            placeholder="SnrLicense"
                            inputStyle={this.styles.inputPhone}
                            >  

                        </Input>
                        <Button /*disabled={this.state.loading || !this.state.checkPhone}*/
                            title="Buscar"
                            buttonStyle={this.styles.buttonBuy}
                            onPress={this.snrLicenseResumen}
                            titleStyle={this.styles.titleButton}>
                        </Button>
                    </View>
                </Modal>
                <Modal
                    style={{ flex: 1 }}
                    isVisible={this.state.modalInfoPay}
                    onRequestClose={() => { this.setState({modalInfoPay: false});}}
                    onBackButtonPress={() => { this.setState({modalInfoPay: false});}}
                    onBackdropPress={() => { this.setState({modalInfoPay: false,phone: ''});}}
                >
                    <View style={{ backgroundColor: this.state.selectCertification.color, padding: 6, borderRadius: 10 }}>
                        <Text style={this.styles.title}>{this.state.selectCertification.title}</Text>
                        <Input
                            errorMessage={this.state.errorPhone} 
                            value={this.state.phone}
                            keyboardType="phone-pad"
                            onChangeText={(phone) => {
                                            const re = /^[0-9\b]+$/
                                            if (phone === '' || re.test(phone)) {
                                                this.setState({phone})
                                            }
                                        }}
                            placeholder="Celular"
                            inputStyle={this.styles.inputPhone}
                            >  

                        </Input>
                        
                        <Input
                            errorMessage={this.state.errorDocument}
                            keyboardType="phone-pad"
                            require={true}
                            value={this.state.document}
                            placeholder="Cédula"
                            inputStyle={this.styles.inputPhone}
                            onChangeText={(document) => {
                                const re = /^[0-9\b]+$/
                                if (document === '' || re.test(document)) {
                                    this.setState({ document })
                                }
                            }}
                        ></Input>
                        <Input
                            errorMessage={this.state.errorEmail}
                            require={true}
                            value={this.state.email}
                            placeholder="Email"
                            inputStyle={this.styles.inputPhone}
                            onChangeText={(email) => {this.setState({ email })}}
                        >                                 
                        </Input>
                        
                        <Button /*disabled={this.state.loading || !this.state.checkPhone}*/
                            title="Comprar"
                            buttonStyle={this.styles.buttonBuy}
                            onPress={this.pressBuy}
                            titleStyle={this.styles.titleButton}>
                        </Button>
                        <View style={this.styles.loading}>
                            <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}></ActivityIndicator>
                        </View>
                    </View>
                </Modal>
                <View style={this.styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}></ActivityIndicator>
                </View>
                {this.state.modalShared&&<GenerateInvoice isVisible={this.state.modalShared} data={this.state.dataResponse} closeModal={(flag)=>this.setState({modalShared:flag})} title="Tu recarga fue exitosa!"/>}
   
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
        margin: '20%',
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