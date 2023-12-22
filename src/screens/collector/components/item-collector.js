import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,ActivityIndicator,
    Alert,
} from 'react-native';
import { FormatMoney } from '../../../shared/utilities/formats';
import Icon from 'react-native-vector-icons/FontAwesome';
import { printBill, getPrintConfig } from '../../bluetooth/bluetooth-printer';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';
import { payDebt } from '../../../services/collector.service';
import NumberFormat from 'react-number-format';
import { TextInput } from 'react-native-gesture-handler';
import { GenerateInvoice } from '../../../shared/utilities/GenerateInvoice';
export const ItemCollector = (props) => {
    const { setBalance, item, styles = getStyles(), navigation } = props;
    const [amount, setAmount] = useState(-1);
    const [tempAmount, setTempAmount] = useState('');
    const [modalPay, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(true);
    const [modalShared, setModalShared] = useState(false);
    const [dataResponse, setDataResponse] = useState([]);
    const [isComplete, setIsComplete] = useState(true);
    let valor = 0;
    
    const navigateNext = (flag, response) => {
        setLoading(false)
        console.log("flag del pago jejeje",flag)
        console.log("response del pago jeje",response)
        
        if (flag) {
            const transactionType = isComplete ? 'completa' : 'parcial';
            //item.deuda = item.deuda - amount;
            const data = [
                'Tipo de transaccion: ' + transactionType,
                'Vendedor: ' + item.nombre,
                'Factura No: ' + response.valida.id,
                'Fecha:' + response.valida.fecha,
                'No.Aprobacion:' + response.valida.numero_aprobacion,
                'Producto: ' + 'Recaudo ',
                'Valor: ' + FormatMoney(valor),
            ];
            console.log("data de pdf",data)
           
            try{
                printBill(data);
                //setDataResponse(data)
                //setModalShared(true)
            }catch(err){
               console.log("esto llego por aca",err) 
            }
            
        }
    };

    const sendToOdoo = async () => {
        
        try {
            setLoading(true)
            await payDebt(parseInt(valor), item.cliente_id, navigateNext);
        } catch (error) {
            Alert.alert('Error', 'Problemas al obtener datos de sesión');
        }
    };

    const navigateToPrintConfig = (flag) => {
        if (flag) {
            navigation.navigate('Printer');
        } else {
            sendToOdoo();
        }
    };

    const pressBuy = (value) => {
        setModal(false);
        setTempAmount('');
        getPrintConfig(navigateToPrintConfig);
    };

    const payAll = (deuda) => {
        Alert.alert(
            '¡Confirme!',
            '¿Desea cancelar la totalidad de la deuda: \n' + FormatMoney(deuda) + '?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => { },
                },
                {
                    text: 'Continuar',
                    onPress: () => {
                        setVisible(false);
                        item.deuda = item.deuda - deuda;
                        setAmount(item.deuda - deuda);
                        pressBuy();
                    },
                },
            ],
        );
    };

    const reportDebt = () => {
        Alert.alert('¡Confirme!', '¿Desea reportar el no pago de éste vendedor?', [
            {
                text: 'Cancelar',
                onPress: () => {
                    setAmount(-1);
                },
            },
            {
                text: 'Reportar',
                onPress: async () => {
                    pressBuy();
                },
                style: 'cancel',
            },
        ]);
    };

    const creditMoney = () => {
        let amountConvert = tempAmount;
        if ((amountConvert <= item.deuda||amountConvert <=item.total) && amountConvert > 0) {
            pays(amountConvert, false);
            setAmount(amountConvert);
        } else {
            Alert.alert('¡Atención!', 'No se puede abonar este monto');
        }
    };
    const pays = (value, isPay) => {
        console.log("valor a pagar de l pay",value,isPay)
        
        if (value > 0) {
            if (isPay && (value === item.deuda||value ===item.total)) {
                setBalance(item.deuda==0 ? item.total:item.deuda);
                payAll(item.deuda==0 ? item.total:item.deuda);
                valor = value;
                //item.deuda=item.deuda-value;
            }
            if (!isPay && (value <= item.deuda||value ===item.total)) {
                if (item.vencido !== 0) {
                    if (item.vencido >= value) {
                        item.vencido = item.vencido - value;
                    }
                }
                setBalance(value);
                item.deuda = item.deuda - value;
                valor = value;
                pressBuy();
            }
        }
    };
    if (item.empty) {
        return <View style={{ height: 300 }}></View>;
    }
    return (
        <>
            {visible && (
                <View styles={styles.container}>
                    <View style={styles.containerHorizontal}>
                        <View style={[styles.containerText, { width: '9%' }]}>
                            <Text style={styles.title}>Id</Text>
                            <Text style={styles.text}>{item.cliente_id}</Text>
                        </View>
                        <View style={[styles.containerText, { width: '16%' }]}>
                            <Text style={styles.title}>Nombre</Text>

                            <Text style={styles.text}>{item.nombre}</Text>
                        </View>
                        <View style={[styles.containerText, { width: '20%',marginLeft:-7 }]}>
                            <Text style={styles.title}>Cobrar</Text>
                            <Text style={styles.text}>{FormatMoney(item.deuda)}</Text>
                        </View>
                        <View style={[styles.containerText, { width: '20%',marginLeft:-8 }]}>
                            <Text style={styles.title}>Vencida</Text>
                            <Text style={styles.text}>{FormatMoney(item.vencido)}</Text>
                        </View>
                        <View style={[styles.containerText, { width: '20%' ,marginLeft:-8}]}>
                            <Text style={styles.title}>Deuda</Text>
                            <Text style={styles.text}>{FormatMoney(item.total)}</Text>
                        </View>
                        <View style={[styles.containerText, { width: '22%',marginLeft:-7 }]}>
                            <Button
                                buttonStyle={[styles.buttonIcon, { backgroundColor: '#22bb33' }]}
                                icon={<Icon name="check" size={styles.icon.fontSize}></Icon>}
                                onPress={() => {
                                    setIsComplete(true);
                                    pays(item.deuda==0 ? item.total:item.deuda, true);
                                }}></Button>
                            <Button
                                buttonStyle={[styles.buttonIcon, { backgroundColor: '#f0ad4e' }]}
                                icon={<Icon name="edit" size={styles.icon.fontSize}></Icon>}
                                onPress={() => {
                                    setIsComplete(false);
                                    setModal(true);
                                }}></Button>
                            {false && (
                                <Button
                                    disabled={true}
                                    buttonStyle={[
                                        styles.buttonIcon,
                                        { backgroundColor: '#bb2124' },
                                    ]}
                                    icon={<Icon name="close" size={styles.icon.fontSize}></Icon>}
                                    onPress={() => setAmount(0)}
                                />
                            )}
                        </View>
                    </View>
                    <Modal
                        isVisible={modalPay}
                        onRequestClose={() => {
                            setModal(false);
                        }}
                        onBackButtonPress={() => {
                            setModal(false);
                        }}
                        onBackdropPress={() => {
                            setTempAmount('');
                            setModal(false);
                        }}>
                        <View
                            style={{
                                paddingBottom: 10,
                                borderRadius: 10,
                                backgroundColor: 'rgba(48, 220, 247, 0.4)',
                            }}>
                            <Text style={styles.textInfo}>Deuda de {item.nombre}</Text>
                            <View style={styles.containerInfoGreen}>
                                <NumberFormat
                                    value={tempAmount}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$ '}
                                    renderText={(value) => (
                                        <TextInput
                                            underlineColorAndroid="transparent"
                                            style={styles.input}
                                            onChangeText={(tempAmount) =>
                                                setTempAmount(
                                                    parseInt(
                                                        tempAmount
                                                            .replace('$', '')
                                                            .replace(',', '')
                                                            .replace(',', ''),
                                                    ),
                                                )
                                            }
                                            value={value}
                                            keyboardType="numeric"
                                        />
                                    )}
                                />
                            </View>
                            <Button
                                buttonStyle={styles.button}
                                titleStyle={styles.buttonLabel}
                                onPress={creditMoney}
                                title="Pagar"></Button>
                        </View>
                    </Modal>
                    <ActivityIndicator
                        size="large"
                        color="#0000ff"
                        animating={loading}>

                        </ActivityIndicator>
                        {modalShared&&<GenerateInvoice isVisible={modalShared} data={dataResponse} closeModal={(flag)=>setModalShared(flag)} title="Tu recarga fue exitosa!"/>}
       
                </View>
                
            )}
        </>
    );
};


const getStyles = () => {
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);
    if (screenWidth === 480 && screenHeight === 805) {
        return stylesLarge;
    } else {
        return stylesMedium;
    }
};

const stylesLarge = StyleSheet.create({
    container: {},
    containerHorizontal: {
        flexDirection: 'row',
    },
    icon: {
        fontSize: 30,
    },
    containerText: {
        marginLeft: 1,
    },
    text: {
        alignSelf: 'center',
        fontSize: 14,
        margin: 4,
    },
    title: {
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 4,
        marginBottom: 0,
    },
    titleSoat: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 4,
        marginBottom: 0,
        color: 'white',
    },

    buttonIcon: {
        marginTop: 4,
        marginHorizontal: 10,
        backgroundColor: 'rgba(7,162,186,0.7)',
        marginVertical: '1%',
        borderRadius: 10,
    },
    input: {
        fontSize: 40,
        backgroundColor: 'white',
        borderRadius: 6,
        marginBottom: 10,
        marginTop: 20,
        marginHorizontal: 20,
    },
    inputSoat: {
        fontSize: 20,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInfo: {
        color: 'white',
        alignSelf: 'center',
        marginTop: 10,
        fontSize: 22,
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: 'rgba(7,162,186,0.7)',
        marginVertical: '1%',
        borderRadius: 10,
    },
    buttonLabel: {
        fontSize: 22,
    },
    containerInput: {
        width: '100%',
        backgroundColor: 'white',
        marginVertical: '1%',
        borderRadius: 10,
        borderBottomWidth: 0,
    },
});

const stylesMedium = StyleSheet.create({
    container: {},
    containerHorizontal: {
        flexDirection: 'row',
    },
    containerText: {
        marginVertical: 4,
        width: '32%',
        marginLeft: '1%',
    },
    icon: {
        fontSize: 20,
    },
    text: {
        alignSelf: 'center',
        fontSize: 14,
        margin: 4,
    },
    title: {
        alignSelf: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 2,
        marginBottom: 0,
    },
    titleSoat: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 4,
        marginBottom: 0,
        color: 'white',
    },

    buttonIcon: {
        marginHorizontal: 10,
        backgroundColor: 'rgba(7,162,186,0.7)',
        marginVertical: '1%',
        borderRadius: 10,
    },
    input: {
        fontSize: 18,
        backgroundColor: 'white',
        borderRadius: 6,
        marginBottom: 10,
        marginTop: 20,
        marginHorizontal: 20,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInfo: {
        color: 'white',
        alignSelf: 'center',
        marginTop: 10,
        fontSize: 18,
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: 'rgba(7,162,186,0.7)',
        marginVertical: '1%',
        borderRadius: 10,
    },
    buttonLabel: {
        fontSize: 18,
    },
    containerInput: {
        width: '100%',
        backgroundColor: 'white',
        marginVertical: '1%',
        borderRadius: 10,
        borderBottomWidth: 0,
    },
});
