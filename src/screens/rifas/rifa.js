import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  ToastAndroid,
  Alert,
  ActivityIndicator,
  Dimensions,Linking
} from 'react-native';
import {Header} from '../../components/UI/header';
import {FormatMoney} from '../../shared/utilities/formats';
import {Input, Button} from 'react-native-elements';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {Footer} from '../../components/UI/footer';
import Modal from 'react-native-modal';
import {UserForm} from '../../components/forms/user';
import {searchClient} from '../../services/client.service';
import {searchNumber} from '../../services/rifa.service';
import {printBill, getPrintConfig} from '../bluetooth/bluetooth-printer';
import {Transaction} from '../../services/products.service';
import Icon from 'react-native-vector-icons/FontAwesome';
import {allDataBase, getElementByIdDataBase} from '../../database/allSchemas';
import NumberFormat from 'react-number-format';
import { GenerateInvoice } from '../../shared/utilities/GenerateInvoice';
import AsyncStorage from '@react-native-community/async-storage';
import SendIntentAndroid from 'react-native-send-intent';
import { Url_pago } from '../../shared/utilities/odoo-config';
import { SafeAreaView } from 'react-native-safe-area-context';
export class ScreenRifa extends PureComponent {
  constructor() {
    super();
    this.state = {
      modalClientVisible: false,
      modalTicketVisible: false,
      showAnotherValueInput: false,
      loading: false,
      linkPayu:false,
      rifa: {
        id: 0,
        name: '',
        fecha_sorteo: '',
        price: 0,
        image: '',
        porcentajeRecaudo: 0,
        numero_resolucion_rifa: '',
      },
      availableNumbers:[],
      number: '',
      numbers: [],
      buttonsNumbers: [],
      selectedNumber: false,
      cedula: '',
      partner_id: -1,
      payedValue: '',
      //temp
      tipoTemp: 'cedula',
      searchedValueTemp: '',
      stateButtons: [false, false, false, false, false, false],
      client: '',
      luckyNumber:false,
      idProduct:-1,
      flagSearch:false,
      modalShared:false,
      dataResponse:[]
    };
    this.priceList = [];
    this.styles = getStyles();
    this.numSuerte = 0;
  }
  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      
      this.props.navigation.addListener('focus',async () => {
        const linkPayu=  await AsyncStorage.getItem("linkPayu");
        this.setState({rifa: this.props.route.params.rifa,linkPayu:linkPayu=='true'? true:false});
        if (this.props.route.params.rifa.porcentajeRecaudo < 100) {
          this.priceList = [
            (this.props.route.params.rifa.price *
              this.props.route.params.rifa.porcentajeRecaudo) /
              100,
            this.props.route.params.rifa.price * 0.5,
            this.props.route.params.rifa.price,
            'Otro',
          ];
        } else {
          this.priceList = [this.props.route.params.rifa.price];
        }
      });
    }
  }

  setClient(identification, name) {
    const client = '' + identification + '-' + name;

    this.setState({client});
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.props.navigation.removeListener();
  }

  buildPrices = () => {
    let row = [];
    for (let k = 0; k < this.priceList.length; k = k + 3) {
      row.push(
        <View key={'key' + k} style={this.styles.containerButtonPrice}>
          <Button
            titleStyle={this.styles.titleButton}
            containerStyle={this.styles.containerPriceButton}
            buttonStyle={[
              this.styles.buttonPrice,
              {
                backgroundColor: this.state.stateButtons[k]
                  ? '#bedb02'
                  : 'rgba(7,162,186,0.7)',
              },
            ]}
            title={FormatMoney(this.priceList[k])}
            onPress={() => {
              this.pressPrice(k);
            }}
            disabled={this.state.loading}></Button>
          {k + 1 < this.priceList.length && (
            <Button
              titleStyle={this.styles.titleButton}
              containerStyle={this.styles.containerPriceButton}
              buttonStyle={[
                this.styles.buttonPrice,
                {
                  backgroundColor: this.state.stateButtons[k + 1]
                    ? '#bedb02'
                    : 'rgba(7,162,186,0.7)',
                },
              ]}
              title={FormatMoney(this.priceList[k + 1])}
              onPress={() => {
                this.pressPrice(k + 1);
              }}
              disabled={this.state.loading}></Button>
          )}
          {k + 2 < this.priceList.length && (
            <Button
              titleStyle={this.styles.titleButton}
              containerStyle={this.styles.containerPriceButton}
              buttonStyle={[
                this.styles.buttonPrice,
                {
                  backgroundColor: this.state.stateButtons[k + 2]
                    ? '#bedb02'
                    : 'rgba(7,162,186,0.7)',
                },
              ]}
              title={FormatMoney(this.priceList[k + 2])}
              onPress={() => {
                this.pressPrice(k + 2);
              }}
              disabled={this.state.loading}></Button>
          )}
        </View>,
      );
    }
    return row;
  };

  pressPrice = (index) => {
    const price = this.priceList[index];
    let stateButtons = [];
    for (let i = 0; i < this.state.stateButtons.length; i++) {
      if (i === index) {
        stateButtons.push(true);
      } else {
        stateButtons.push(false);
      }
    }

    this.setState({stateButtons: stateButtons});
    if (price === 'Otro') {
      this.setState({
        showAnotherValueInput: true,
        payedValue: '',
      });
    } else {
      this.setState({
        showAnotherValueInput: false,
        payedValue: price,
      });
    }
  };

  buildNumbers = (numbers) => {
    /* console.log("buildNumbers de numeros disponible",this.state.luckyNumber,numbers)
    this.setState({availableNumbers:numbers})
    let row = [];
    let newNumber=[]
        if(this.state.luckyNumber){
            newNumber.push(numbers[0])
        }else{
          for (let k = 0; k < 6; k = k + 1) {
              newNumber.push(numbers[k])
          }
        }
    let head =
    newNumber.length > 0 ? (
        <View style={{padding: 6}}>
          {this.numSuerte === 0 && (
            <Text style={this.styles.title}>
              La boleta {this.state.number} no se encuentra disponible, sin
              embargo existen estas sugerencias.
            </Text>
          )}
          {this.numSuerte !== 0 && (
            <Text style={this.styles.title}>
              Tu número de la suerte es el {this.numSuerte} estas son tus
              sugerencias.
            </Text>
          )}
        </View>
      ) : (
        <View style={{padding: 6}}>
          <Text style={this.styles.title}>
            La boleta {this.state.number} no se encuentra disponible, por favor
            intente otras combinaciones.
          </Text>
        </View>
      );
    for (let k = 0; k < newNumber.length; k = k + 2) {
      if (newNumber[k].numero_boleta === this.state.number) {
        head = (
          <View key={'head' + k} style={{padding: 6}}>
            {
              <Text style={this.styles.title}>
                El número {this.state.number} se encuentra disponible.
              </Text>
            }
            <Button
              titleStyle={this.styles.titleButton}
              containerStyle={this.styles.containerPriceButton}
              buttonStyle={[this.styles.buttonPrice, {alignSelf: 'center'}]}
              title={newNumber[k].numero_boleta}
              onPress={() => this.pressNumber(k, newNumber[k].numero_boleta)}></Button>
            {newNumber.length > 1 && (
              <Text style={this.styles.label}>
                Tambien podria interesarle alguno de estos números.
              </Text>
            )}
          </View>
        );
      } else if (k + 1 < newNumber.length && newNumber[k + 1].numero_boleta === this.state.number) {
        head = (
          <View key={'head' + k} style={{padding: 6}}>
            <Text style={this.styles.title}>
              El número {this.state.number} se encuentra disponible.
            </Text>
            <Button
              titleStyle={this.styles.titleButton}
              containerStyle={this.styles.containerPriceButton}
              buttonStyle={[this.styles.buttonPrice]}
              title={newNumber[k + 1].numero_boleta}
              onPress={() => this.pressNumber(k + 1, newNumber[k + 1].numero_boleta)}></Button>
            {newNumber.length > 1 && (
              <Text style={this.styles.label}>
                Tambien podria interesarle estos numeros.
              </Text>
            )}
          </View>
        );
      } 
        row.push(
          <View key={'key' + k} style={this.styles.containerButtonPrice}>
            <Button
              titleStyle={this.styles.titleButton}
              containerStyle={this.styles.containerPriceButton}
              buttonStyle={[this.styles.buttonPrice]}
              title={newNumber[k].numero_boleta}
              onPress={() => this.pressNumber(k, newNumber[k].numero_boleta)}></Button>
            {k + 1 < newNumber.length && (
              <Button
                titleStyle={this.styles.titleButton}
                containerStyle={this.styles.containerPriceButton}
                buttonStyle={[this.styles.buttonPrice]}
                title={newNumber[k + 1].numero_boleta}
                onPress={() =>
                  this.pressNumber(k + 1, newNumber[k + 1].numero_boleta)
                }></Button>
            )}
          </View>,
        );
    }
    row.unshift(head);
    this.setState({numbers, buttonsNumbers: row}); */
    console.log("numbers del buildNumbers",this.state.luckyNumber,numbers)
        let row = [];
        this.setState({availableNumbers:numbers})
        let newNumber=[]
        let head
        let cantVeces=0
        let lengFor=numbers.length==1 || numbers.length==2 ? 0:6
        if(this.state.luckyNumber){
            console.log("ingreso al this.state.luckyNumber",this.state.luckyNumber)
            newNumber.push(numbers[0])
            head=(
                <View key={'head'+0} style={{ padding: 6 }}>                        
                         <Text style={this.styles.title}>
                            Tu numero de la suerte es el 
                        </Text> 
                    
                </View>
            )
        
        }else if(this.state.flagSearch){
            console.log("ingreso al this.state.flagSearch",this.state.flagSearch,numbers)
            for (let k = 0; k < numbers.length; k = k + 1) {
                console.log("leng  del for",lengFor)
                if(numbers[k].numero_boleta == this.state.number){
                    console.log("for newNumber[k].numero_boleta",numbers[k])
                    lengFor+=1
                    head=(
                        <View key={'head'} style={{ padding: 6 }}>
                              <Text style={this.styles.title}>
                                    El número {this.state.number} se encuentra disponible.
                            </Text>
                            <Button
                                titleStyle={this.styles.titleButton}
                                containerStyle={[this.styles.containerPriceButton,{alignSelf:'center'}]}
                                buttonStyle={[this.styles.buttonPrice, { alignSelf: 'center' }]}
                                title={numbers[k].numero_boleta}
                                onPress={() => this.pressNumber(numbers[k].numero_boleta,numbers[k].product_id)}>
                            </Button>                            
                             {lengFor>1&&<Text style={[this.styles.label,{alignSelf:'center'}]}>
                                Tambien podria interesarle alguno de estos números.
                            </Text> }
                        </View>
                    )
                    break
        
                }else{
                    head =(
                        <View style={{ padding: 6 }}>
                             <Text style={this.styles.title}>
                            La boleta {this.state.number} no se encuentra disponible, por favor 
                            intente otras combinaciones.
                            </Text> 
                        </View>
                    );
                }
                //newNumber.push(numbers[k])
                
            }
            console.log("lengFor jojo",lengFor)
            for (let k = 0; k < lengFor; k = k + 1) {
                console.log("k del for ",k,numbers[k])
                if(numbers[k].numero_boleta != this.state.number){
                    console.log("k del if for",k)
                    newNumber.push(numbers[k]) 
                }else{
                    //esto se hizo dado que el mismo numero pued estar en ambas series 
                    //entonces se busca mostara nuevos numeros
                    cantVeces+=1
                    if(cantVeces==2){
                        lengFor+=1
                    }
                }
                
            }
        }else{
            console.log("ingreso en numeros para jugar")
            head=(
                <View key={'head'+0} style={{ padding: 6 }}>                        
                        <Text style={this.styles.title}>
                            Estas son tus sugerencias. 
                        </Text>
                    
                </View>
            )
            for (let k = 0; k < 6; k = k + 1) {
                newNumber.push(numbers[k]) 
                
                
            }
        }
        
        
         
        console.log("leng de los botones ",newNumber.length)
        for (let k = 0; k < newNumber.length; k = k + 2) {
            
                row.push(
                    <View key={'key' + k} style={this.styles.containerButtonPrice}>
                        <Button
                            titleStyle={this.styles.titleButton}
                            containerStyle={this.styles.containerPriceButton}
                            buttonStyle={[this.styles.buttonPrice]}
                            title={newNumber[k].numero_boleta}
                            onPress={() => this.pressNumber(newNumber[k].numero_boleta,newNumber[k].product_id)}></Button>
                        {k + 1 < newNumber.length && (
                            <Button
                                titleStyle={this.styles.titleButton}
                                containerStyle={this.styles.containerPriceButton}
                                buttonStyle={[this.styles.buttonPrice]}
                                title={newNumber[k + 1].numero_boleta}
                                onPress={() => this.pressNumber(newNumber[k + 1].numero_boleta,newNumber[k + 1].product_id)}>
                            </Button>
                        )}
                    </View>
                );
        }
        console.log("row leng de salida",row.length)
        console.log("head leng de salida",head)
        row.unshift(head);
        this.setState({ numbers, buttonsNumbers: row });
  };

  closeUserForm = () => {
    Alert.alert(
      '¡Espera!',
      'No termino de llenar este formulario ¿Esta seguro que desea salir?',
      [
        {
          text: 'Salir',
          onPress: () =>
            this.setState({
              modalClientVisible: false,
            }),
        },
        {
          text: 'Continuar',
          onPress: () => null,
          style: 'cancel',
        },
      ],
    );
  };

  pressNumber = (number,idProduct) => {
    this.setState({
      number,
      idProduct,
      selectedNumber: true,
      modalTicketVisible: false,
    });
  };

  foundClient = (response, flag) => {
    if (!flag) {
      Alert.alert('Error', response.data.message);
      this.setState({loading: false});
      return;
    }
    if (response.partner_id) {
      this.setState({
        partner_id: response.partner_id,
        client: response.name,
        loading: false,
      });
      ToastAndroid.show('Cliente encontrado.', ToastAndroid.SHORT);
      return true;
    } else {
      this.setState({modalClientVisible: true, loading: false});
      return false;
    }
  };

  findClient = () => {
    if (this.state.cedula.trim() !== '') {
      this.setState({loading: true});
      searchClient(this.state.rifa.id, this.state.cedula, this.foundClient);
    } else {
      Alert.alert('Atención', 'No ha digitado un número de cédula que buscar.');
    }
  };

  foundNumber = (response, flag) => {
    console.log("llego a foundNumber",flag,response)
    if (!flag) {
      Alert.alert('Error', ' Error de proveedor, comunicate con MovilGo');
      this.setState({loading: false});
      return;
    }else{
      if(response?.errores){
          Alert.alert('Error', " Se produjo un error al consultar la boletas");
          this.setState({ loading: false });            
          return
      }else if (response.disponibles.length > 0) {
        this.buildNumbers(response.disponibles);
        ToastAndroid.show('Resultados encontrados.', ToastAndroid.SHORT);
        this.setState({loading: false, modalTicketVisible: true});
        this.numSuerte = 0;
        return true;
      } else {
        ToastAndroid.show('Sin resultados.', ToastAndroid.SHORT);
        const result = [
          <View>
            <Text style={{color: this.render, fontSize: 18}}>
              No se encontraron resultados relacionados, prueba otro numero.
            </Text>
          </View>,
        ];
        this.setState({buttonsNumbers: result, loading: false});
        this.numSuerte = 0;
        return false;
      }
    }
    
  };

  findNumber = () => {
    console.log("findNumber",)
    if (this.numSuerte !== 0) {
      this.setState({loading: true});

      searchNumber(this.numSuerte, this.state.rifa.id, this.foundNumber);
    } else if (this.state.number.trim() !== '') {
      this.setState({loading: true});
      searchNumber(this.state.number, this.state.rifa.id, this.foundNumber);
    } else {
      Alert.alert('Atención', 'No ha digitado un número de boleta que buscar.');
    }
  };

  navigateNext = (flag, response) => {
    let data = [];
    if (flag) {
      data = [
        'Factura No: ' + response.valida.id,
        'Fecha:' + response.valida.fecha,
        'No.Aprobacion:' + response.valida.numero_aprobacion,
        'Producto: ' + this.state.rifa.name,
        'Resolucion: ' + this.state.rifa.numero_resolucion_rifa,
        'Fecha del sorteo: ' + this.state.rifa.fecha_sorteo,
        'Numero de boleta: ' + this.state.number,
        'Cliente: ' + this.state.cedula,
        'Valor: ' + FormatMoney(this.state.rifa.price),
      ];
      if (this.state.rifa.price > this.state.payedValue) {
        data = [
          'Factura No: ' + response.valida.id,
          'Fecha:' + response.valida.fecha,
          'No.Aprobacion:' + response.valida.numero_aprobacion,
          'Producto: Abono ' + this.state.rifa.name,
          'Resolucion: ' + this.state.rifa.numero_resolucion_rifa,
          'Fecha del sorteo: ' + this.state.rifa.fecha_sorteo,
          'Numero de boleta: ' + this.state.number,
          'Cliente: ' + this.state.cedula,
          'Valor total: ' + FormatMoney(this.state.rifa.price),
          'Valor abonado: ' + FormatMoney(parseInt(this.state.payedValue)),
          'Valor por pagar: ' +
            FormatMoney(this.state.rifa.price - this.state.payedValue),
        ];
      }

      this.setState({loading: false});
      printBill(data);
      this.setState({modalShared:true,dataResponse:data})
     
    } else {
      if (response) {
        if (response.errores) {
          if (response.errores.observacion) {
            Alert.alert('Error ', response.errores.observacion);
            this.setState({loading: false});
          } else {
            Alert.alert('Error ', 'No se pudo relizar la transaccion');
            this.setState({loading: false});
          }
        } else {
          Alert.alert('Error ', 'Se ha presentado un error de conexion');
          this.setState({loading: false});
        }
      }
    }
  };
  generatedLink=async()=>{
    const session = await AsyncStorage.getItem("session");
    const client = JSON.parse(session);
    const urlPago = `${Url_pago}PagosExternos/?${this.state.idProduct}&&${client.uid}&&${this.state.number}&&${this.state.payedValue}&&${this.state.partner_id}&&${this.state.client.trim()}&&${this.state.rifa.name.trim()}&&${this.state.rifa.numero_resolucion_rifa}&&${this.state.rifa.fecha_sorteo}&&${this.state.rifa.price}`
    console.log("generatedLink",client.uid)
    console.log("jejeje envio",urlPago.replace(/\s+/g, ''))
    try{
      SendIntentAndroid.openChooserWithOptions(
        {
          subject: "",
          text: urlPago.replace(/\s+/g, ''),
        }
      );
      this.props.navigation.navigate('Home');

    }catch(err){
      console.log("el erro del whatsApp es",err)

    }
    //Linking.openURL(`http://45.79.43.96:8098/PagosExternos/?${this.state.idProduct}&&${client.uid}&&${this.state.number}&&${this.state.payedValue}&&${this.state.partner_id}&&${this.state.client}&&${this.state.rifa.name}&&${this.state.rifa.numero_resolucion_rifa}&&${this.state.rifa.fecha_sorteo}&&${this.state.rifa.price}`);
  }
  sendToOdoo = async () => {
    try {
      
      const product = {
        product_id: this.state.idProduct,
        atributes: {
          numeroBoleta: this.state.number,
          valorPagar: parseInt(this.state.payedValue),
          partner_id: this.state.partner_id,
          nombre_cliente: this.state.client,
        },
      };
      console.log("product de la rifa",product)
      await Transaction(product, this.navigateNext);
    } catch (error) {
      Alert.alert('Error', 'Problemas al obtener datos de sesión');
      this.setState({loading: false});
    }
  };

  navigateToPrintConfig = (flag) => {
    if (flag) {
      this.setState({
        loading: false,
        modalInfoVisible: false,
      });
      this.props.navigation.navigate('Printer');
    } else {
      this.sendToOdoo();
    }
  };

  pressBuy = () => {
    const price = this.state.payedValue;

    if (
      this.state.number.trim() === '' ||
      parseInt(this.state.number < 0) ||
      !this.state.selectedNumber
    ) {
      Alert.alert('Atención', 'No ha seleccionado un numero para su boleta.');
      return;
    }
    if (this.state.partner_id < 0) {
      Alert.alert('Atención', 'No ha seleccionado un cliente.');
      return;
    }
    if (
      price <
      (this.state.rifa.price * this.state.rifa.porcentajeRecaudo) / 100
    ) {
      Alert.alert(
        'Atención',
        'Recuerde que el monto minimo para comprar esta boleta es de ' +
          FormatMoney(
            (this.state.rifa.price * this.state.rifa.porcentajeRecaudo) / 100,
          ),
      );
      return;
    }
    if (price > this.state.rifa.price) {
      Alert.alert(
        'Atención',
        'Recuerde que el monto maximo de compra de esta boleta es de ' +
          FormatMoney(this.state.rifa.price),
      );
      return;
    }
    this.setState({loading: true});
    getPrintConfig(this.navigateToPrintConfig);
  };
  numeroDeLaSuerte = (flag) => {
    this.setState({luckyNumber:flag,flagSearch:false})
    const min = 1;
    const max = 99;
    const numeroAleatorio = Math.floor(Math.random() * (max - min)) + min;
    this.numSuerte = numeroAleatorio;
    this.findNumber();
  };
  render() {
    const buttonsPrice = this.buildPrices();
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <View style={this.styles.background}>
            <Header
              onPressBack={() => {
                this.props.navigation.goBack();
              }}></Header>
            <ScrollView>
              <Image
                style={{
                  height: 200,
                  width: '90%',
                  backgroundColor: 'black',
                  alignSelf: 'center',
                  marginTop: 10,
                }}
                source={{uri: 'data:image/png;base64,' + this.state.rifa.image}}
                resizeMode="stretch"></Image>
              <View style={this.styles.containerInfoGreen}>
                <View
                  style={[
                    this.styles.containerInput,
                    {
                      borderColor: this.state.selectedNumber
                        ? '#22bb33'
                        : 'black',
                      borderWidth: this.state.selectedNumber ? 4 : 0,
                    },
                  ]}>
                  <Input
                    value={this.state.number}
                    onChangeText={(number) =>
                      this.setState({number, selectedNumber: false})
                    }
                    placeholder="Numero de boleta"
                    keyboardType="number-pad"
                    inputStyle={this.styles.input}
                    inputContainerStyle={{borderBottomWidth: 0}}
                    containerStyle={{width: '86%'}}
                    errorStyle={{height: 0}}></Input>
                  <Button
                    disabled={this.state.loading}
                    onPress={()=>{this.findNumber()
                      this.setState({flagSearch:true})}}
                    type="clear"
                    titleStyle={{color: 'black'}}
                    icon={
                      <Icon name="search" size={this.styles.icon.fontSize}></Icon>
                    }></Button>
                </View>
                <View
                  style={[
                    this.styles.containerInput,
                    {
                      borderColor:
                        this.state.partner_id > -1 ? '#22bb33' : 'black',
                      borderWidth: this.state.partner_id > -1 ? 4 : 0,
                    },
                  ]}>
                  <Input
                    value={this.state.cedula}
                    onChangeText={(cedula) =>
                      this.setState({cedula, partner_id: -1, client: ''})
                    }
                    placeholder="Cédula"
                    keyboardType="number-pad"
                    inputStyle={this.styles.input}
                    inputContainerStyle={{borderBottomWidth: 0}}
                    containerStyle={{width: '86%'}}
                    errorStyle={{height: 0}}></Input>
                  <Button
                    disabled={this.state.loading}
                    onPress={this.findClient}
                    type="clear"
                    titleStyle={{color: 'black'}}
                    icon={
                      <Icon name="search" size={this.styles.icon.fontSize}></Icon>
                    }></Button>
                </View>
                <View
                  style={{
                    marginHorizontal: 10,
                    marginVertical: 10,
                    paddingBottom: 10,
                    paddingTop: 6,
                    paddingHorizontal: 10,
                    alignItems: 'center',
                  }}>
                  {this.state.client != '' && (
                    <Text style={this.styles.label}>{this.state.client}</Text>
                  )}
                  <Text style={this.styles.label}>{this.state.rifa.name}</Text>
                  <Text style={this.styles.label}>
                    Sorteo: {this.state.rifa.fecha_sorteo}
                  </Text>
                  <Text style={this.styles.label}>
                    Valor: {FormatMoney(this.state.rifa.price)}
                  </Text>
                </View>
              </View>
              {buttonsPrice}
              {this.state.showAnotherValueInput && (
                <NumberFormat
                  value={this.state.payedValue}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$ '}
                  renderText={(value) => (
                    <TextInput
                      value={value}
                      onChangeText={(payedValue) =>
                        this.setState({
                          payedValue: parseInt(
                            payedValue
                              .replace('$', '')
                              .replace(',', '')
                              .replace(',', ''),
                          ),
                        })
                      }
                      placeholder="Otro valor"
                      keyboardType="number-pad"
                      style={[this.styles.input, {margin: 10}]}></TextInput>
                  )}
                />
              )}
              <Button
                title="Comprar"
                disabled={this.state.loading}
                buttonStyle={this.styles.button}
                titleStyle={{fontSize: 22}}
                onPress={this.pressBuy}></Button>
                {/* this.state.linkPayu&& */<Button
                    title="Generar Link"
                    disabled={this.state.number.trim() == ''||
                                this.state.payedValue==''||
                                this.state.cedula==''||this.state.loading}
                    buttonStyle={this.styles.button}
                    titleStyle={{fontSize: 22}}
                    onPress={()=>this.generatedLink()}>
                  </Button>}
              <Button
                disabled={this.state.loading}
                buttonStyle={this.styles.button}
                titleStyle={{fontSize: 22}}
                title="Número de la suerte"
                onPress={()=>this.numeroDeLaSuerte(true)}></Button>
                <Button
                disabled={this.state.loading}
                buttonStyle={this.styles.button}
                titleStyle={{fontSize: 22}}
                title="Números para jugar"
                onPress={()=>this.numeroDeLaSuerte(false)}></Button>
              <View style={{height: 110}}></View>
            </ScrollView>
            <Footer style={this.styles.footer}></Footer>
          </View>

          <Modal
            style={{flex: 1}}
            isVisible={this.state.modalTicketVisible}
            onRequestClose={() => {
              this.setState({
                modalTicketVisible: false,
              });
            }}
            onBackButtonPress={() => {
              this.setState({
                modalTicketVisible: false,
              });
            }}
            onBackdropPress={() => {
              this.setState({
                modalTicketVisible: false,
              });
            }}>
            <View style={this.styles.containerInfoGreen}>
              {this.state.buttonsNumbers}
            </View>
          </Modal>
          <Modal
            style={{flex: 1}}
            isVisible={this.state.modalClientVisible}
            onRequestClose={() => {
              this.closeUserForm();
            }}
            onBackButtonPress={() => {
              this.closeUserForm();
            }}
            onBackdropPress={() => {
              this.closeUserForm();
            }}>
            <UserForm
              setClient={(identification, name) => {
                this.setClient(identification, name);
              }}
              identification={this.state.cedula}
              closeMethod={(response) => {
                if (response.id) {
                  this.setState({
                    partner_id: response.id,
                    modalClientVisible: false,
                  });
                  ToastAndroid.show('Cliente creado', ToastAndroid.LONG);
                } else {
                  const err = {
                    table: 'Errors',
                    product: {
                      id: response.errores.id,
                    },
                  };
                  getElementByIdDataBase(err)
                    .then((results) => {
                      if (results) {
                        Alert.alert(Error, results.comment);
                      } else {
                        Alert.alert(
                          Error,
                          'Movilgo no ha parametrizado el error, Comunicate con nosotros',
                        );
                      }
                    })
                    .catch((error) => console.log(error));
                }
              }}
              product_id={this.state.rifa.id}
              onPressClose={() => this.setState({modalClientVisible: false})}
              updateIdentification={(xidentification) =>
                this.setState({cedula: xidentification})
              }></UserForm>
          </Modal>
          <View style={this.styles.loading}>
            <ActivityIndicator
              size="large"
              color="#0000ff"
              animating={this.state.loading}></ActivityIndicator>
          </View>
          {this.state.modalShared&&<GenerateInvoice isVisible={this.state.modalShared} data={this.state.dataResponse} closeModal={(flag)=>{this.setState({modalShared:flag})
                                                                                                                                          this.props.navigation.navigate('Home');}} title="Tu recarga fue exitosa!"/>}
    
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
};

const stylesLarge = StyleSheet.create({
  label: {
    color: 'white',
    fontSize: 24,
  },
  backgroundImage: {
    margin: 2,
    height: '60%',
    width: '100%',
    marginRight: 15,
  },
  loading: {
    left: 0,
        right: 0,
        top: '-50%',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 6,
  },
  background: {
    height: '100%',
    width: '100%',
  },
  containerPriceButton: {
    width: '32%',
  },
  containerButton: {
    height: '28%',
    width: '100%',
    marginVertical: '1%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  containerInfoGreen: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: 'rgba(7, 162, 186, 0.9)',
  },
  footer: {
    bottom: 0,
    position: 'absolute',
    height: '14%',
    width: '100%',
  },
  buttonPrice: {
    borderRadius: 10,
  },
  containerButtonPrice: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: 'rgba(7,162,186,0.7)',
    marginBottom: 6,
    borderRadius: 10,
  },
  titleButton: {
    fontSize: 25,
  },
  input: {fontSize: 30, backgroundColor: 'white', borderRadius: 6},
  containerInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
  },
  icon: {
    fontSize: 50,
  },
});

const stylesMedium = StyleSheet.create({
  label: {
    color: 'white',
    fontSize: 18,
  },
  loading: {
      left: 0,
      right: 0,
      top: '-50%',
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
  },
  backgroundImage: {
    marginTop: 0,
    margin: 2,
    height: '60%',
    width: '100%',
    marginRight: 15,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 6,
  },
  background: {
    height: '100%',
    width: '100%',
  },

  containerPriceButton: {
    width: '32%',
  },
  containerButton: {
    height: '28%',
    width: '100%',
    marginVertical: '1%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  containerInfoGreen: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: 'rgba(7, 162, 186, 0.9)',
  },
  footer: {
    bottom: 0,
    position: 'absolute',
    height: '14%',
    width: '100%',
  },
  buttonPrice: {
    borderRadius: 10,
  },
  containerButtonPrice: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: 'rgba(7,162,186,0.7)',
    marginBottom: 6,
    borderRadius: 10,
  },
  titleButton: {
    fontSize: 20,
  },
  footer: {
    height: '12%',
  },
  input: {fontSize: 20, backgroundColor: 'white', borderRadius: 6},
  containerInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
  },
  icon: {
    fontSize: 30,
  },
});
