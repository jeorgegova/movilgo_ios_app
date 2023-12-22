import React, { PureComponent } from "react";
import { View, Switch, Text, StyleSheet, Alert, Dimensions } from "react-native";
import { Input, Button } from "react-native-elements";
import { saveClient } from "../../services/client.service";
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
export class UserForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isEnabled: false,
            'name': '',
            lastname: '',
            'mobile': '',
            'email': '',
            'direccion': '',
            'xidentification': this.props.identification,
            errors: {
                'name': '',
                'lastname': '',
                'email':'',
                'mobile': '',
                'direccion': '',
                'xidentification': ''
            }
        }
        this.styles = getStyles();
    }

    checkFields() {
        const emailValid = this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        const nameValid=this.state.name.match(/[^a-zA-Z0-9\s/]/)
        const lastValid=this.state.lastname.match(/[^a-zA-Z0-9\s/]/)  
        const keys = [
            'name',
            'lastname',
            'mobile',
            'direccion',
            'xidentification'
        ]
        let flag = true;
        const errors = {};
        keys.forEach(element => {
            if(element==='email'&&!emailValid){
                flag = false;
                errors[element] = "El correo en incorrecto"
            }else if (element==='name'&&nameValid) {
                flag = false;
                errors[element] = "El nombre no debe llevar tildes ni caracteres especiales"
            }else if (element==='lastname'&&lastValid) {
                flag = false;
                errors[element] = "El apellido no debe llevar tildes ni caracteres especiales"
            }else if (this.state[element].trim() === "") {
                flag = false;
                errors[element] = "Este campo es obligatorio"
            } else {
                errors[element] = ""
            }
        });
        this.setState({ errors });
        return flag;
    }

    saved = (response) => {
        if (response) {
            this.props.setClient(this.state.xidentification, this.state.name);
            this.props.closeMethod(response);
        }

    }

    pressSave = () => {
        if (!this.state.isEnabled) {

            Alert.alert("¡Atencion!", "Debe confirmar terminos y condiciones antes de continuar.");
            return;
        }
        if (!this.checkFields()) {
            return
        }
        const client = {
            'x_name1': this.state.name.split(' ')[0],
            'x_name2': this.state.name.split(' ')[1] ?? '',
            'x_lastname1': this.state.lastname.split(' ')[0],
            'x_lastname2': this.state.lastname.split(' ')[1] ?? '',
            'mobile': this.state.mobile,
            'email': this.state.email,
            'direccion': this.state.direccion,
            'xidentification': this.state.xidentification,
            product_id: this.props.product_id
        }

        saveClient(client, this.saved);
    }
    render() {
        return (
            <View style={{ paddingBottom: 10, borderRadius: 10, backgroundColor: 'rgba(48, 220, 247, 0.3)' }}>
                <ScrollView>
                    <View style={this.styles.containerInfoGreen}>
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                            <View style={{ width: '20%' }}></View>
                            <View style={{ width: '60%' }}>
                                <Text style={this.styles.title}>Datos personales.</Text>
                            </View>
                            <View style={{ width: '20%' }}>
                                <Button
                                    buttonStyle={{ width: 40, alignSelf: "flex-end" }}
                                    type="clear"
                                    icon={<Icon name="close" size={24} color='white' ></Icon>}
                                    onPress={this.props.onPressClose}
                                ></Button>
                            </View>
                        </View>
                        <Input
                            value={this.state.xidentification}
                            onChangeText={(xidentification) => {
                                this.setState({ xidentification });
                                this.props.updateIdentification(xidentification);
                            }}
                            keyboardType="number-pad"
                            inputStyle={this.styles.input}
                            inputContainerStyle={this.styles.inputContainer}
                            errorMessage={this.state.errors.xidentification}
                            placeholder="Cedula">
                        </Input>
                        <Input
                            value={this.state.name}
                            onChangeText={(name) => this.setState({ name })}
                            inputStyle={this.styles.input}
                            inputContainerStyle={this.styles.inputContainer}
                            errorMessage={this.state.errors.name}
                            placeholder="Nombre">
                        </Input>
                        <Input
                            value={this.state.lastname}
                            onChangeText={(lastname) => this.setState({ lastname })}
                            inputStyle={this.styles.input}
                            inputContainerStyle={this.styles.inputContainer}
                            errorMessage={this.state.errors.lastname}
                            placeholder="Apellido">
                        </Input>
                        <Input
                            value={this.state.direccion}
                            onChangeText={(direccion) => this.setState({ direccion })}
                            inputStyle={this.styles.input}
                            inputContainerStyle={this.styles.inputContainer}
                            errorMessage={this.state.errors.direccion}
                            placeholder="Dirección">
                        </Input>
                        <Input
                            value={this.state.email}
                            onChangeText={(email) => this.setState({ email })}
                            inputStyle={this.styles.input}
                            inputContainerStyle={this.styles.inputContainer}
                            errorMessage={this.state.errors.email}
                            keyboardType="email-address"
                            placeholder="Correo eléctronico(Opcional)">
                        </Input>
                        <Input
                            value={this.state.mobile}
                            onChangeText={(mobile) => this.setState({ mobile })}
                            inputStyle={this.styles.input}
                            inputContainerStyle={this.styles.inputContainer}
                            errorMessage={this.state.errors.mobile}
                            keyboardType="phone-pad"
                            placeholder="Celular">
                        </Input>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ alignSelf: "center", fontSize: 20, color: 'white', }}>Aceptar terminos y condiciones</Text>
                            <Switch trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={this.state.isEnabled ? "#f5dd4b" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={(isEnabled) => this.setState({ isEnabled })}
                                value={this.state.isEnabled}>
                            </Switch>
                        </View>
                    </View>
                </ScrollView>
                <Button title="Enviar" buttonStyle={this.styles.button} titleStyle={{ fontSize: 30 }} onPress={this.pressSave}></Button>
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

const stylesLarge = StyleSheet.create({
    button: {
        backgroundColor: 'rgba(7,162,186,0.7)',
        padding: 10,
        minHeight: 70,
        marginVertical: 20,
        marginHorizontal: 10
    },
    containerInfoGreen: {
        borderRadius: 10,
        marginBottom: 10,
        padding: 14,
        backgroundColor: 'rgba(7, 162, 186, 0.9)'
    },
    input: { fontSize: 22, borderBottomWidth: 0 },
    inputContainer: {
        borderBottomWidth: 0,
        backgroundColor: 'white',
        borderRadius: 10
    },
    title: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
        alignSelf: 'center',
        marginVertical: 6
    }
});

const stylesMedium = StyleSheet.create({
    button: {
        backgroundColor: 'rgba(7,162,186,0.7)',
        padding: 10,
        minHeight: 50,
        marginVertical: 20,
        marginHorizontal: 10
    },
    containerInfoGreen: {
        borderRadius: 10,
        marginBottom: 10,
        padding: 14,
        backgroundColor: 'rgba(7, 162, 186, 0.9)'
    },
    input: {
        fontSize: 18,
        borderBottomWidth: 0
    },
    inputContainer: {
        borderBottomWidth: 0,
        backgroundColor: 'white',
        borderRadius: 10
    },
    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        alignSelf: 'center',
        marginVertical: 6
    }
})