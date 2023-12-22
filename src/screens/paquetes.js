import React from 'react';
import { View, StyleSheet, Image, ImageBackground, Text, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { ButtonImage } from '../components/UI/buttons';
import { Header } from '../components/UI/header';
import Modal from "react-native-modal";
import { Input, Button } from 'react-native-elements';
import { FormatMoney, Capitalize } from '../shared/utilities/formats';
import { allDataBase, getElementByOperator } from '../database/allSchemas';
import { Transaction } from '../services/products.service'
import { printBill, getPrintConfig } from './bluetooth/bluetooth-printer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PAQUETE_SCHEMA } from '../database/models/paquete';
import {RECARGA_SCHEMA} from '../database/models/recarga'
import { GenerateInvoice } from '../shared/utilities/GenerateInvoice';
import { SafeAreaView } from 'react-native-safe-area-context';
export class ScreenPaquete extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            modalInfoVisible: false,
            modalInfoVisiblePaquetes: false,
            selectedOperador: {
                name: 'None',
                title: 'None',
                color: 'white',
            },
            selectedPrice: 0,
            showAnotherValueInput: false,
            packageButtons: <></>,
            operador: "",
            package: {
                title: "",
                id: 0
            },
            phone: "",
            price: "",
            buttonsOperador: [<View key={'key' + 1}></View>],
            resumeView: <></>,
            listTypes: <></>,
            checkPhone: false,
            checkColor: 'white',
            modalShared:false,
            dataResponse:[]
        }
        this.operador = {};
        this.styles = getStyles();
    }
    componentDidMount = () => {//0
        this.buildList();
    }
    buildList = () => {//1
        this.setState({ loading: true });
        allDataBase(PAQUETE_SCHEMA).then((results) => {
            console.log("result de PAQUETE_SCHEMA",results.length)
            results.forEach(element => {
                 
                if (this.operador[element.operador]) {
                    this.operador[element.operador].push(element);
                } else {
                    this.operador[element.operador] = [];
                    this.operador[element.operador].push(element);
                }
            });
            console.log("this.operador",this.operador)
               
            this.loadOperator(this.operador);
        }).catch((err) => { console.log(err) });
    }
    loadOperator(listOperador) {//2
        
        const keys = Object.keys(listOperador);
        getElementByOperator(keys,RECARGA_SCHEMA).then((results) => {
            this.buildOperator(results);
        }).catch((err) => { console.log(err) });

    }
    buildOperator(results) {//3
        
        let buttons = []
        for (let k = 0; k < results.length; k = k + 3) { 
            buttons.push(
                <View key={"operador" + k} style={this.styles.containerButton}>
                    <ButtonImage onPress={() => { this.pressOperator(results[k].operador) }} styleButton={this.styles.buttonImage} image={{ uri: 'data:image/png;base64,' + results[k].image_medium }}></ButtonImage>
                    
                    {k + 1 < results.length && <ButtonImage onPress={() => { this.pressOperator(results[k + 1].operador) }} styleButton={this.styles.buttonImage} image={{ uri: 'data:image/png;base64,' + results[k + 1].image_medium }}></ButtonImage>}
                    {k + 2 < results.length && <ButtonImage onPress={() => { this.pressOperator(results[k + 2].operador) }} styleButton={this.styles.buttonImage} image={{ uri: 'data:image/png;base64,' + results[k + 2].image_medium }}></ButtonImage>}
                </View>
            )
        }
        this.setState({ buttonsOperador: buttons, loading: false });
    }
    pressOperator = (operador) => {//4

        this.buildListTypes(operador);
        this.setState({
            modalInfoVisible: true,
            selectedOperador: {
                title: Capitalize(operador),
                color: 'rgba(7,162,186,0.7)'
            }
        });
    }

    buildListTypes = (operador) => {//5
        let types = this.operador["" + operador];
        
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
        console.log("categories paquetes",categories)
        for (let k = 0; k < keys.length; k++) {
            row.push(
                <Button
                    key={"category" + k}
                    buttonStyle={this.styles.buttonPrice}
                    titleStyle={this.styles.titleButton}
                    type="outline" 
                    title={Capitalize(keys[k])}
                    onPress={() => {
                        this.buildPackagesTypes(keys[k], categories[keys[k]]);
                    }}
                ></Button>
            );
        }
        this.setState({ listTypes: row });
    }
    
    buildPackagesTypes = (category, packages) => {//6
        let row = [];
        console.log("packages packages",packages)
        for (let k = 0; k < packages.length; k++) {
            console.log("packages[k]",packages[k])
            if(packages[k].active===true){
                row.push(
                    <Button
                        key={"package" + k}
                        buttonStyle={this.styles.buttonPrice}
                        titleStyle={{ color: "white", shadowColor: "black", shadowRadius: 2 }}
                        type="outline"
                        title={
                            <Text style={{
                                flexDirection: "row",
                                justifyContent: "space-around"
                            }}>
                                <Text style={this.styles.label}>{Capitalize(packages[k].name + "\n")}</Text>
                                <Text style={this.styles.label}>{"Vigencia=" + packages[k].vigencia + "\n"}</Text>
                                <Text style={this.styles.labelPrice}>{FormatMoney(packages[k].precio)}</Text>
                            </Text>
                        }
                        onPress={() => {
                            this.setState({
                                package: {
                                    title: "" + packages[k].name,
                                    id: packages[k].id,
                                    price: packages[k].precio
                                }
                            });
                            this.buildResume(packages[k]);
                        }}
                    >
                    </Button>
                );
            }
        }
        this.setState({
            modalInfoVisiblePaquetes: true,
            selectedOperador: {
                title: "" + this.state.selectedOperador.title + " - " + category,
                color: this.state.selectedOperador.color
            },
            packageButtons: row
        });
    }
    buildResume = (paquete) => {
        let row = [];
        const resumeView =
            <>
                <View style={{ backgroundColor: 'rgb(2,96,110, 0.5)', borderRadius: 6, marginHorizontal: 10, marginVertical: 6, paddingBottom: 10, paddingTop: 6, paddingHorizontal: 10 }}>
                    <Text style={[{ color: "white" }, this.styles.title]} color="white">Resumen</Text>
                    <Text style={this.styles.label}>Operador: {this.state.selectedOperador.title}</Text>
                    <Text style={this.styles.label}>Producto: {paquete.name}</Text>
                    <Text style={this.styles.label}>Precio: {FormatMoney(paquete.precio)}</Text>
                </View>
            </>
        this.setState({
            modalInfoResume: true,
            resumeView: resumeView,
        });
    }
    navigateNext = (flag, response) => {
        this.setState({ loading: false });
        console.log("flag de paquequttes quiero a adri",flag)
        console.log("response de paquetes",response)
        if (flag) {
            
            const data = [
                "Factura No: " + response.valida.id,
                "Fecha:" + response.valida.fecha,
                "No.Aprobacion:" + response.valida.numero_aprobacion,
                "Producto: " + this.state.package.title,
                "Celular: " + this.state.phone,
                "Valor: " + FormatMoney(this.state.package.price)
            ]
            
            printBill(data);
            this.setState({modalShared:true,dataResponse:data})
            
        } else {
            if(response.errores){
                Alert.alert("Error",response.errores.observacion)

            }else{
                Alert.alert("Error","Se presento un error comunicate con MovilGo")
            }
            
        }
    }
    sendToOdoo = async () => {
        try {
            this.setState({ "loading": true });
            //Obtiene la llave de la sesion de la base de datos (No olvidar importar la libreria antes de usarla
            const product = {
                product_id: this.state.package.id,
                atributes: {
                    numero: this.state.phone
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
                modalInfoVisible: false,
                modalInfoVisiblePaquetes: false,
                modalInfoResume: false
            });
            this.props.navigation.navigate("Printer")
        } else {
            this.sendToOdoo();
        }
    }

    pressBuy = () => {
        if (this.state.phone.length > 9) {
            getPrintConfig(this.navigateToPrintConfig);
        } else {
            Alert.alert("Atencion", "Debe rellenar completamente todos los datos necesarios");
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <ImageBackground style={this.styles.background}source={require('../assets/login/f.png')}>
                        <Header title="PAQUETES" onPressBack={() => { this.props.navigation.goBack() }}></Header>
                        <View style={this.styles.containerContent}>
                            {this.state.buttonsOperador}
                        </View>
                        <Image style={this.styles.footer} source={require('../assets/login/footer.png')}></Image>
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
                        <View style={{ backgroundColor: this.state.selectedOperador.color, borderRadius: 6, paddingBottom: 16, paddingTop: 12 }}>
                            <Text style={this.styles.title}>{this.state.selectedOperador.title}</Text>
                            {this.state.listTypes}
                        </View>
                    </Modal>
                    <Modal
                        style={{ flex: 1 }}
                        isVisible={this.state.modalInfoVisiblePaquetes}
                        onRequestClose={() => {this.setState({
                                selectedOperador: {
                                    title: this.state.selectedOperador.title.split("-")[0],
                                    color: this.state.selectedOperador.color
                                },
                                modalInfoVisiblePaquetes: false,
                            });
                        }}
                        onBackButtonPress={() => {
                            this.setState({
                                selectedOperador: {
                                    title: this.state.selectedOperador.title.split("-")[0],
                                    color: this.state.selectedOperador.color
                                },
                                modalInfoVisiblePaquetes: false,
                            });
                        }}
                        onBackdropPress={() => {
                            this.setState({
                                selectedOperador: {
                                    title: this.state.selectedOperador.title.split("-")[0],
                                    color: this.state.selectedOperador.color
                                },
                                modalInfoVisiblePaquetes: false,
                            });
                        }}
                    >

                        <View style={{ backgroundColor: this.state.selectedOperador.color, borderRadius: 6, paddingBottom: 16, paddingTop: 12 }}>
                            <ScrollView>
                                <Text style={this.styles.title}>{this.state.selectedOperador.title}</Text>
                                {this.state.packageButtons}
                            </ScrollView>
                        </View>

                    </Modal>
                    <Modal
                        style={{ flex: 1 }}
                        isVisible={this.state.modalInfoResume}
                        onRequestClose={() => {this.setState({modalInfoResume: false});}}
                        onBackButtonPress={() => {this.setState({modalInfoResume: false});}}
                        onBackdropPress={() => {this.setState({modalInfoResume: false,phone: ''});}}
                    >
                        <View style={{ backgroundColor: "rgba(7, 162, 186, 0.9)", borderRadius: 6, paddingBottom: 14, paddingTop: 12 }}>
                            <Text style={this.styles.title}>Comprar paquete</Text>
                            <Input value={this.state.phone}
                                onChangeText={(phone) => {
                                    //this.setState({ phone }) 
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
                                inputStyle={this.styles.inputPhone}
                                inputContainerStyle={this.styles.containerInput}
                                errorStyle={{ height: 0 }}
                                keyboardType="phone-pad">
                            </Input>
                            {this.state.resumeView}
                            <Button disabled={this.state.loading}
                                buttonStyle={this.styles.button}
                                onPress={this.pressBuy}
                                title="Comprar"
                                titleStyle={this.styles.title}>
                            </Button>
                        </View>
                        <View style={this.styles.loading}>
                            <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}></ActivityIndicator>
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

var stylesLarge = StyleSheet.create({
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
        marginVertical: '2%',
        flexDirection: "row",
        justifyContent: "space-around",
        margin: 0,
        marginHorizontal: 0
    },
    inputPhone: {
        fontSize: 45,
        backgroundColor: 'white',
        borderRadius: 6
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        height: '14%',
        width: '100%'
    },
    buttonImage: {
        alignItems: "center",
        margin: '0%',
        aspectRatio: 1
    },
    containerButtonPrice: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10
    },
    buttonPrice: {
        marginVertical: 2,
        marginHorizontal: 4,
        borderColor: "white"
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: 'rgb(7,162,186)',
        marginVertical: '1%',
        borderRadius: 10,
        minHeight: 80
    },
    label: {
        color: "white",
        fontSize: 22
    },
    labelPrice: {
        textAlign: "right",
        fontSize: 30,
        color: '#bedb02'
    },
    titleButton: {
        fontSize: 25,
        color: "white",
        shadowColor: "black",
        shadowRadius: 2
    },

    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
        alignSelf: 'center',
        marginVertical: 10
    },
    containerInput: {
        width: '100%',
        backgroundColor: 'white',
        marginVertical: '1%',
        borderRadius: 10,
        borderBottomWidth: 0,
        minHeight: 80,
    },
    loading: {
        left: 0,
        right: 0,
        top: '-50%',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

var stylesMedium = StyleSheet.create({
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
        marginVertical: '2%',
        flexDirection: "row",
        justifyContent: "space-around",
        margin: 0,
        marginHorizontal: 0
    },
    inputPhone: {
        fontSize: 20,
        backgroundColor: 'white',
        borderRadius: 6
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        height: '14%',
        width: '100%'
    },
    buttonImage: {
        alignItems: "center",
        margin: '0%',
        aspectRatio: 1
    },
    containerButtonPrice: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10
    },
    buttonPrice: {
        marginVertical: 2,
        marginHorizontal: 4,
        borderColor: "white"
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: 'rgb(7,162,186)',
        marginVertical: '1%',
        borderRadius: 10,
        minHeight: 80
    },
    label: {
        color: "white",
        fontSize: 16
    },
    labelPrice: {
        textAlign: "right",
        fontSize: 20,
        color: '#bedb02'
    },
    titleButton: {
        fontSize: 18,
        color: "white",
        shadowColor: "black",
        shadowRadius: 2
    },

    title: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
        alignSelf: 'center',
        marginVertical: 10
    },
    containerInput: {
        width: '100%',
        backgroundColor: 'white',
        marginTop: 6,
        borderRadius: 10,
        borderBottomWidth: 0,
    },
    loading: {
        left: 0,
        right: 0,
        top: '-50%',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});