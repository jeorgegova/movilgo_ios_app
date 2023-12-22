import React, { PureComponent } from 'react'
import { Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import Register from '../../../components/UI/register'
import { InputForm, InputNumber } from '../../../components/UI/input'
import { ScrollView } from 'react-native-gesture-handler';
export class ModalCreateUser extends Register {

    constructor() {
        super();
        this.state = {
            name: {
                name: 'name',
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

        }
        this.inputsToVerify = [
            'name',
            'identification',
            'email',
            'address',
            'phone'
        ]
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', borderRadius: 10 }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#02606e' }}>
                    <View style={{ width: '20%', justifyContent: 'center' }}>

                    </View>
                    <View style={{ width: '60%', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, textAlign: 'center', color: 'white' }}>Crear usuario</Text>
                    </View>
                    <View style={{ width: '20%', justifyContent: 'center' }}>
                        <Button onPress={()=>this.props.close()} type="clear" icon={<Icon type="font-awesome-5" name="times" color='white' />} />
                    </View>
                </View>
                <View>
                    <ScrollView>
                        <InputForm
                            title="Nombre completo"
                            field={this.state.name}
                            handleChange={this.handleChange}
                            onBlur={this.handleRelease}
                            placeholder="Nombre completo"
                        />
                        <InputNumber
                            title="Número de identificación"
                            field={this.state.identification}
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
                        <InputForm
                            title="Dirección"
                            field={this.state.address}
                            handleChange={this.handleChange}
                            onBlur={this.handleRelease}
                            placeholder="Dirección"
                        />
                        <InputForm
                            title="Correo electrónico"
                            field={this.state.email}
                            handleChange={this.handleChange}
                            onBlur={this.handleRelease}
                            placeholder="Correo electrónico"
                        />

                        <Button titleStyle={{ color: 'white' }} buttonStyle={{ backgroundColor: '#02606e', marginHorizontal: 20, marginTop: 20 }} title="Registrar" onPress={()=>null} type="clear" ></Button>
                        <Text></Text>
                    </ScrollView>

                </View>
            </View>
        )
    }
}
