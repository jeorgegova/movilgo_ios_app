import React from 'react';
import { View, StyleSheet, Image, ImageBackground, ActivityIndicator, Dimensions } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Odoo from 'react-native-odoo-promise-based'
import { AuthService } from '../services/login.service';
import { version } from '../shared/utilities/odoo-config';
import { Footer } from '../components/UI/footer';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
import { StartSync } from '../shared/utilities/cronaplicarpago';
export class ScreenLogin extends React.Component {
    constructor() {
        super();
        this.state = {
            //username: 'aleja',
            username: '',
            errorUsername: '',
            //password: '1111',
            password: '',
            errorPassword: '',
            loading: false,
            canUpdate: false
        }
        this._isMounted = false;
        this.styles = getStyles();
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {
            this.updateAppState();
        }
    }

    updateAppState = async () => {
        const keys = await AsyncStorage.getAllKeys()
        console.log("keys del login", keys)
        const session = await AsyncStorage.getItem("session");
        const permission = await AsyncStorage.getItem('Permission');
        const balanceFinal = await AsyncStorage.getItem('balanceFinal');
        if (session) {
            NetInfo.fetch().then(state => {
                if (state.isConnected && (state.type === "wifi" || state.type === "cellular")) {
                    this.setState({ canUpdate: true });
                }
            });
            if (session) {
                this.props.navigation.navigate("Home", { balance: balanceFinal })
            }
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }
    setBalance = async (key, data) => {
        await AsyncStorage.setItem(key, data);
        return true
    }
    navigateNext = async (flag, balanceFinal) => {
        //const balance="balance"
        console.log("balanceFinal navigateNext", flag, balanceFinal)
        if (flag) {
            const session = await AsyncStorage.getItem("session");
            console.log("sesion del navigateNext", session)
            if (JSON.parse(session).username == 'movilgo') {
                console.log("ingreso al if del admin")
                StartSync(this.props.navigation)
            }
            this.setState({ loading: false });
            await AsyncStorage.setItem('balanceFinal', JSON.stringify(balanceFinal));
            this.props.navigation.navigate("Home", { balance: balanceFinal });


        } else {
            this.setState({ loading: false });
        }
    }

    verifyFields = () => {
        let error = false;
        if (this.state.username.trim() == "") {
            this.setState({ errorUsername: "Este campo es requerido" })
            error = true;
        }
        if (this.state.password.trim() == "") {
            this.setState({ errorPassword: "Este campo es requerido" })
            error = true;
        }
        return error;
    }

    login = async () => {
        if (this._isMounted) {
            this.setState({ loading: true });
            if (this.verifyFields()) {
                this.setState({ loading: false });
                return;
            }
            try {
                await AuthService({ username: this.state.username, password: this.state.password }, this.navigateNext);
            } catch (error) {
                console.error("Error en AuthService:", error);
                this.setState({ loading: false });
            }
        }
    }

    openConfigPage = () => {
        if (this.state.password === "&") {
            this.props.navigation.navigate("Config");
        }
    }
    send = () => {
        let data = {
            "flt_total_con_iva": 83000,
            "flt_valor_iva": 833,
            "str_id_pago": "1",//definir con don Alfonso
            "str_descripcion_pago": "camisa",//definir con don Alfonso
            "str_email": "sebastiannorena@reactiva.com.co",
            "str_id_cliente": "123456789",//cedula o numero de identificación en el sistema
            "str_tipo_id": "1",//Hacer un picker
            "str_nombre_cliente": "Elsa",
            "str_apellido_cliente": "Pito",
            "str_telefono_cliente": "319632555648",
            "str_opcional1": "opcion 11",//
            "str_opcional2": "opcion 12",
            "str_opcional3": "opcion 13",
            "str_opcional4": "opcion 14",
            "str_opcional5": "opcion 15"

        }

    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <ImageBackground style={this.styles.background} source={require('../assets/login/background.png')}>
                        <View style={this.styles.headerContainer} >
                            <Image style={this.styles.header} source={require('../assets/login/header.png')} resizeMode="stretch"></Image>
                            <View style={this.styles.headerLogoContainer}>
                                <Image style={this.styles.headerLogo} source={require('../assets/login/logo.png')} resizeMode="center"></Image>
                            </View>
                        </View>
                        <View style={this.styles.containerLogin}>
                            <Button buttonStyle={this.styles.buttonConfig} icon={<Icon name="cog" size={26} color="white" />} type="clear" onPress={this.openConfigPage}></Button>
                            <Input
                                inputStyle={this.styles.input}
                                value={this.state.username}
                                onChangeText={(username) => { this.setState({ username }) }}
                                inputContainerStyle={this.styles.containerInput}
                                leftIcon={<Icon name="user" size={this.styles.icon.fontSize} style={{ marginHorizontal: 6 }} color="black" />}
                                placeholder="Usuario"
                                errorMessage={this.state.errorUsername}
                            />
                            <Input
                                value={this.state.password}
                                inputStyle={this.styles.input}
                                onChangeText={(password) => { this.setState({ password }) }}
                                inputContainerStyle={this.styles.containerInput}
                                leftIcon={<Icon name="lock" size={this.styles.icon.fontSize} style={{ marginHorizontal: 6 }} color="black" />}
                                placeholder="Contraseña" secureTextEntry={true}
                                errorMessage={this.state.errorUsername}
                            />
                            <Button title="Iniciar sesión" titleStyle={this.styles.buttonTitle} buttonStyle={this.styles.button} onPress={this.login}></Button>
                        </View>
                        <Footer version={version} canUpdate={this.state.canUpdate}></Footer>

                    </ImageBackground>
                    <View style={this.styles.loading}>
                        <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}></ActivityIndicator>
                    </View>
                    {/*{this.state.loading&&<Image style={this.styles.image} source={require('../assets/login/vic.png')} resizeMode='center'/>} */}
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
    background: {
        height: '100%',
        width: '100%'
    },
    input: {
        fontSize: 40,
    },
    icon: {
        fontSize: 50
    },
    containerInput: {
        width: '100%',
        backgroundColor: 'white',
        marginVertical: '1%',
        borderRadius: 10,
        borderBottomWidth: 0,
        minHeight: 80,
    },
    containerLogin: {
        flex: 1,
        marginHorizontal: '5%',
        justifyContent: 'center'
    },
    header: {
        height: '100%',
        width: '100%'
    },
    headerContainer: {
        top: 0,
        position: 'absolute',
        height: '20%',
        width: '100%'
    },
    headerLogo: {
        marginHorizontal: '20%',
        width: '60%',
        aspectRatio: 1,
    },
    headerLogoContainer: {
        position: 'absolute',
        height: '50%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        height: '14%',
        width: '100%'
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: 'rgba(7,162,186,0.7)',
        marginVertical: '1%',
        borderRadius: 10,
        minHeight: 80
    },
    buttonConfig: {
        width: 42,
        marginVertical: '4%',
    },
    buttonTitle: {
        fontSize: 24
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

const stylesMedium = StyleSheet.create({
    background: {
        height: '100%',
        width: '100%'
    },
    input: {
        fontSize: 20,
    },
    icon: {
        fontSize: 30
    },
    containerInput: {
        width: '100%',
        backgroundColor: 'white',
        marginVertical: '1%',
        borderRadius: 10,
        borderBottomWidth: 0,
    },
    containerLogin: {
        flex: 1,
        marginHorizontal: '5%',
        justifyContent: 'center'
    },
    header: {
        height: '100%',
        width: '100%'
    },
    headerContainer: {
        top: 0,
        position: 'absolute',
        height: '20%',
        width: '100%'
    },
    headerLogo: {
        marginHorizontal: '20%',
        width: '60%',
        aspectRatio: 1,
    },
    headerLogoContainer: {
        position: 'absolute',
        height: '50%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        height: '14%',
        width: '100%'
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: 'rgba(7,162,186,0.7)',
        marginVertical: '1%',
        borderRadius: 10,
    },
    buttonConfig: {
        width: 42,
        marginVertical: '4%',
    },
    buttonTitle: {
        fontSize: 24
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