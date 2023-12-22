import React, { PureComponent } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert } from "react-native";
import { Header } from "../../components/UI/header";
import { ListCollector } from "./components/list-collector";
import { searchDebts } from '../../services/collector.service';
import { Input } from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
export class ScreenCollector extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalTicketVisible: false,
            deudores: [],
            allDeudores: [],
            partner_id: -1,
            amount: '',
            loading: false,
            searchedValue: '',
            balance: 0
        }
        this.styles = getStyles();
    }
    foundDebts = (response, flag) => {
        console.log("flag del cobrador",flag)
        console.log("response del cobrador",response)
        if (!flag) {
            Alert.alert("Error", data.message);
            this.setState({ loading: false });
            return
        } else {
            if (response.deudores) {
                if (response.deudores.length == 0) {
                    Alert.alert("¡Atención!", "No se encontraron deudores");
                    this.setState({ loading: false });
                } else {
                    response.deudores.push({ empty: true })
                    this.setState({ deudores: response.deudores, loading: false, allDeudores: response.deudores })
                }
            }
        }
    }
    setBalance(amount) {
        this.setState({ balance: this.state.balance+amount });
    }
    componentDidMount() {
        this.setState({ loading: true });
        searchDebts(this.foundDebts);
        this.props.navigation.addListener('focus', () => {
            this.setState({ balance: this.props.route.params.balance })
        });
        // this.findDebts()
    }

    findDebts = () => {
        this.setState({ loading: true })
        searchDebts(this.foundDebts);
    }

    searchDebtor = (searchedValue) => {
        let newDeudores = [];
        if (searchedValue.trim() === '') {
            this.setState({ deudores: this.state.allDeudores });
            return;
        }
        this.state.allDeudores.forEach(element => {
            if (element.nombre && (element.nombre.toLowerCase().includes(searchedValue.toLowerCase()))) {
                newDeudores.push(element);
            }
        });
        this.setState({ deudores: newDeudores });

    }
    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
            <View style={{ height: '100%', width: '100%' }}>
                <Header title="COBRADOR" onPressBack={() => { this.props.navigation.navigate("Home", { balance: this.state.balance }); }}></Header>
                <View style={[this.styles.containerInput]}>
                    <Input
                        value={this.state.searchedValue}
                        onChangeText={(searchedValue) => { this.setState({ searchedValue }); this.searchDebtor(searchedValue) }}
                        placeholder="Búsqueda"
                        inputStyle={{ fontSize: 22, borderBottomWidth: 0 }}
                        inputContainerStyle={{ borderBottomWidth: 0, width: '100%' }}
                        errorStyle={{ height: 0 }}
                        rightIcon={<Icon name="search"
                            size={34}></Icon>}>

                    </Input>

                </View>
                <ListCollector setBalance={(amount) => { this.setBalance(amount) }} data={this.state.deudores} findDebts={this.findDebts} navigation = {this.props.navigation}></ListCollector>
                <View style={this.styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}></ActivityIndicator>
                </View>
            </View>
            </SafeAreaView>
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
    containerButton: {
        height: '28%',
        width: '100%',
        marginVertical: '1%',
        flexDirection: "row",
        justifyContent: "space-around"
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        height: '14%',
        width: '100%'
    },
    buttonPrice: {
        borderRadius: 10,
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: 'rgba(7,162,186,0.7)',
        marginBottom: 6,
        borderRadius: 10
    },
});

const stylesMedium = StyleSheet.create({
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

    containerButton: {
        height: '28%',
        width: '100%',
        marginVertical: '1%',
        flexDirection: "row",
        justifyContent: "space-around"
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        height: '14%',
        width: '100%'
    },
    buttonPrice: {
        borderRadius: 10,
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
});