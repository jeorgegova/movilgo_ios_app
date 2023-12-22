import React, { PureComponent } from 'react';
import { Input, Button, Card } from 'react-native-elements';
import { OdooConfig } from '../shared/utilities/odoo-config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Alert } from 'react-native';
import { Header } from '../components/UI/header';
import AsyncStorage from '@react-native-community/async-storage';

export class ScreenConfig extends PureComponent {
    constructor() {
        super();
        this.state = {
            host: "",
            port: "",
            database: ""
        }
    }

    componentDidMount = () => {
        this.updateConfig();
    }

    updateConfig = async () => {
        const config = await OdooConfig();
        this.setState({
            host: config.host,
            port: config.port,
            database: config.database
        })
    }
    save = async () => {
        try {
            await AsyncStorage.setItem("host", this.state.host);
            await AsyncStorage.setItem("port", this.state.port);
            await AsyncStorage.setItem("database", this.state.database);
            this.props.navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Error", 'Error al almacenar la sesión');
        }

    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ height: "100%", width: "100%" }}>
                    <Header title="Configuración" onPressBack={() => { this.props.navigation.navigate("Login") }}></Header>
                    <Card>
                        <Input value={this.state.host} onChangeText={(host) => { this.setState({ host }) }} placeholder="Introduzca una Ip"></Input>
                        <Input value={this.state.port} onChangeText={(port) => { this.setState({ port }) }} placeholder="Puerto"></Input>
                        <Input value={this.state.database} onChangeText={(database) => { this.setState({ database }) }} placeholder="Base de datos"></Input>
                        <Button title="Guardar" onPress={this.save}></Button>
                    </Card>
                </View>
            </SafeAreaView>
        );
    }
}