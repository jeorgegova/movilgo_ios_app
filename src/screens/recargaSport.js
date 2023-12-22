import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Text,
  Alert,
  ActivityIndicator,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {ButtonImage} from '../components/UI/buttons';
import {Header} from '../components/UI/header';
import Modal from 'react-native-modal';
import {Input, Button} from 'react-native-elements';
import {FormatMoney, Capitalize} from '../shared/utilities/formats';
import {allDataBase} from '../database/allSchemas';
import {Transaction} from '../services/products.service';
import {printBill, getPrintConfig} from './bluetooth/bluetooth-printer';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RECARGASPORT_SCHEMA} from '../database/models/recargaSport';
import {GenerateInvoice} from '../shared/utilities/GenerateInvoice';
export class ScreenRecargaSport extends PureComponent {
  constructor() {
    super();
    this.state = {
      home: false,
      loading: false,
      modalInfoVisible: false,
      selectedRecargaSport: {
        id: -1,
        title: 'None',
        color: 'white',
      },
      phone: '',
      selectedPrice: 0,
      showAnotherValueInput: false,
      stateButtons: [false, false, false, false, false, false],
      buttonsRecargaSport: [<View key={'key' + 1}></View>],
      checkPhone: false,
      checkColor: 'white',
      document: '',
      errorDocument: '',
      modalShared: false,
      dataResponse: [],
    };
    this.RecargasSport;
    this.priceList = [1000, 3000, 5000, 10000, 20000, 'Otro'];
    this.styles = getStyles();
    this.time;
  }

  buildPrices = () => {
    let row = [];
    for (let k = 0; k < this.priceList.length; k = k + 3) {
      row.push(
        <View key={k} style={this.styles.containerButtonPrice}>
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

  loadRecargaSport() {
    this.setState({
      checkPhone: false,
      phone: '',
      selectedPrice: 0,
      document: '',
      stateButtons: [false, false, false, false, false, false],
    });
    //this.setState({checkPhone:true,phone:'3222901435',selectedPrice:0,document:'12345678',stateButtons: [false, false, false, false, false, false],})
    allDataBase(RECARGASPORT_SCHEMA)
      .then(results => {
        this.RecargasSport = results;
        this.buildRecargaSport();
      })
      .catch(err => {
        console.log('loadRecargaSport', err);
      });
  }

  buildRecargaSport() {
    const results = this.RecargasSport;
    let buttons = [];
    for (let k = 0; k < results.length; k = k + 3) {
      buttons.push(
        <View key={'key' + k} style={this.styles.containerButton}>
          <ButtonImage
            onPress={() => {
              this.pressRecargaSport(results[k]);
            }}
            styleButton={this.styles.buttonImage}
            image={{
              uri: 'data:image/png;base64,' + results[k].image_medium,
            }}></ButtonImage>
          {k + 1 < results.length && (
            <ButtonImage
              onPress={() => {
                this.pressRecargaSport(results[k + 1]);
              }}
              styleButton={this.styles.buttonImage}
              image={{
                uri: 'data:image/png;base64,' + results[k + 1].image_medium,
              }}></ButtonImage>
          )}
          {k + 2 < results.length && (
            <ButtonImage
              onPress={() => {
                this.pressRecargaSport(results[k + 2]);
              }}
              styleButton={this.styles.buttonImage}
              image={{
                uri: 'data:image/png;base64,' + results[k + 2].image_cmedium,
              }}></ButtonImage>
          )}
        </View>,
      );
    }
    this.setState({buttonsRecargaSport: buttons});
  }
  componentDidMount() {
    this.loadRecargaSport();
    this.time = 0;
  }
  pressRecargaSport = recargaSport => {
    this.setState({
      modalInfoVisible: true,
      selectedRecargaSport: {
        id: recargaSport.id,
        title: Capitalize(recargaSport.name),
        color: 'rgba(7,162,186,0.7)',
      },
    });
  };

  pressPrice = index => {
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
        selectedPrice: '',
      });
    } else {
      this.setState({
        showAnotherValueInput: false,
        selectedPrice: price,
      });
    }
  };
  navigateNext = (flag, response) => {
    console.log('flag de recarga deportiva', flag);
    console.log('response de recarga deportiva', response);
    if (flag) {
      const data = [
        'Factura No: ' + response.valida.id,
        'Fecha:' + response.valida.fecha,
        'No.Aprobacion:' + response.valida.numero_aprobacion,
        'Producto: ' + this.state.selectedRecargaSport.title,
        'Celular: ' + this.state.phone,
        'Valor: ' + FormatMoney(this.state.selectedPrice),
      ];
      this.setState({loading: false});
      printBill(data);
      this.setState({modalShared: true, dataResponse: data});

      this.props.navigation.navigate('Home', {
        balance: response.valida.balanceFinal,
      });
      this.time = 0;
    } else {
      Alert.alert('¡Error!', response.errores.observacion);
      this.setState({
        loading: false,
        modalInfoVisible: false,
        phone: '',
        selectedPrice: 0,
        document: '',
        checkPhone: false,
        stateButtons: [false, false, false, false, false, false],
      });
    }
  };
  sendToOdoo = async () => {
    try {
      //Obtiene la llave de la sesion de la base de datos (No olvidar importar la libreria antes de usarla
      const product = {
        product_id: this.state.selectedRecargaSport.id,
        atributes: {
          numero: this.state.phone,
          precio: this.state.selectedPrice,
          document: this.state.document,
        },
      };
      await Transaction(product, this.navigateNext);
    } catch (error) {
      this.setState({
        modalInfoVisible: false,
        checkPhone: false,
        phone: '',
        selectedPrice: 0,
        document: '',
        stateButtons: [false, false, false, false, false, false],
      });
      Alert.alert('Error', 'Problemas al obtener datos de sesión');
      this.setState({loading: false});
    }
  };

  navigateToPrintConfig = flag => {
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
    this.setState({errorDocument: ''});
    if (this.state.document) {
      let max = 11;
      if (
        this.state.selectedRecargaSport.title == 'Recarga Etb' ||
        this.state.selectedRecargaSport.title == 'Recarga Directv'
      ) {
        max = 13;
      }
      if (this.state.phone.length > 9 && this.state.phone.length < max) {
        if (this.state.selectedPrice >= 1000) {
          if (this.state.selectedPrice % 1000 == 0) {
            this.setState({loading: true});
            getPrintConfig(this.navigateToPrintConfig);
          } else {
            Alert.alert(
              'Atención',
              'El valor de la recarga debe estar en miles.',
            );
          }
        } else {
          Alert.alert('Atención', 'El valor debe ser mayor a $1.000');
        }
      } else {
        Alert.alert('Atención', 'Numero de celular incorrecto.');
      }
    } else {
      this.setState({errorDocument: 'Falta llenar el campo del documento'});
    }
  };

  render() {
    const buttonsPrice = this.buildPrices();
    return (
      <SafeAreaView style={{flex: 1}}>
        <View>
          <ImageBackground
            style={this.styles.background}
            source={require('../assets/login/f.png')}>
            <Header
              title="APUESTAS DEPORTIVAS"
              onPressBack={() => {
                this.props.navigation.goBack();
              }}></Header>

            <View style={this.styles.containerContent}>
              {this.state.buttonsRecargaSport}
            </View>

            <Image
              style={this.styles.footer}
              source={require('../assets/login/footer.png')}
              resizeMode="stretch"></Image>
          </ImageBackground>
          <Modal
            style={{flex: 1}}
            isVisible={this.state.modalInfoVisible}
            onRequestClose={() => {
              this.setState({
                modalInfoVisible: false,
                checkPhone: false,
                phone: '',
                selectedPrice: 0,
                document: '',
                stateButtons: [false, false, false, false, false, false],
              });
            }}
            onBackButtonPress={() => {
              this.setState({
                modalInfoVisible: false,
                checkPhone: false,
                phone: '',
                selectedPrice: 0,
                document: '',
                stateButtons: [false, false, false, false, false, false],
              });
            }}
            onBackdropPress={() => {
              this.setState({
                modalInfoVisible: false,
                checkPhone: false,
                phone: '',
                selectedPrice: 0,
                document: '',
                stateButtons: [false, false, false, false, false, false],
              });
            }}>
            <View
              style={{
                backgroundColor: this.state.selectedRecargaSport.color,
                padding: 6,
                borderRadius: 10,
              }}>
              <Text style={this.styles.title}>
                {this.state.selectedRecargaSport.title}
              </Text>
              <Input
                value={this.state.phone}
                keyboardType="phone-pad"
                onChangeText={phone => {
                  const re = /^[0-9\b]+$/;
                  if (phone === '' || re.test(phone)) {
                    if (phone.length > 9) {
                      this.setState({
                        checkPhone: true,
                        checkColor: '#bedb02',
                        phone,
                      });
                    } else {
                      this.setState({
                        checkPhone: false,
                        checkColor: 'white',
                        phone,
                      });
                    }
                  }
                }}
                rightIcon={
                  this.state.checkPhone && (
                    <Icon
                      name="check"
                      size={40}
                      color={this.state.checkColor}></Icon>
                  )
                }
                placeholder="Celular"
                inputStyle={this.styles.inputPhone}></Input>
              {buttonsPrice}
              {this.state.showAnotherValueInput && (
                <Input
                  value={'' + this.state.selectedPrice}
                  keyboardType="phone-pad"
                  onChangeText={selectedPrice => {
                    const re = /^[0-9\b]+$/;
                    if (selectedPrice === '' || re.test(selectedPrice)) {
                      this.setState({selectedPrice});
                    }
                  }}
                  inputStyle={this.styles.input}
                  placeholder="Otro Valor"></Input>
              )}
              <Input
                errorMessage={this.state.errorDocument}
                keyboardType="phone-pad"
                require={true}
                value={this.state.document}
                placeholder="Cédula"
                inputStyle={this.styles.inputPhone}
                onChangeText={document => {
                  const re = /^[0-9\b]+$/;
                  if (document === '' || re.test(document)) {
                    this.setState({document});
                  }
                }}></Input>
              <Button
                disabled={this.state.loading || !this.state.checkPhone}
                title="Comprar"
                buttonStyle={this.styles.buttonBuy}
                onPress={this.pressBuy}
                titleStyle={this.styles.titleButton}></Button>
              <View style={this.styles.loading}>
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  animating={this.state.loading}></ActivityIndicator>
              </View>
            </View>
          </Modal>
          <View style={this.styles.loading}>
            <ActivityIndicator
              size="large"
              color="#0000ff"
              animating={this.state.loading}></ActivityIndicator>
          </View>
          {this.state.modalShared && (
            <GenerateInvoice
              isVisible={this.state.modalShared}
              data={this.state.dataResponse}
              closeModal={flag => this.setState({modalShared: flag})}
              title="Tu recarga fue exitosa!"
            />
          )}
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
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 10,
    color: 'white',
  },
  inputPhone: {
    fontSize: 45,
    backgroundColor: 'white',
    borderRadius: 6,
  },
  background: {
    height: '100%',
    width: '100%',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footer: {
    bottom: 0,
    position: 'absolute',
    height: '6%',
    width: '100%',
  },
  buttonImage: {
    alignItems: 'center',
    margin: '20%',
    marginVertical: 0,
  },
  containerPriceButton: {
    width: '33%',
  },
  input: {
    fontSize: 40,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 20,
  },
  buttonBuy: {
    backgroundColor: 'rgba(7,162,186,0.7)',
    padding: 10,
    minHeight: 70,
    marginVertical: 20,
  },
  buttonPrice: {
    borderRadius: 10,
    marginVertical: '1%',
    borderBottomWidth: 0,
    minHeight: 30,
    marginHorizontal: 10,
  },
  containerButtonPrice: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  loading: {
    left: 0,
    right: 0,
    top: '-50%',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleButton: {
    fontSize: 25,
  },
});

const stylesMedium = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 8,
    color: 'white',
  },
  background: {
    height: '100%',
    width: '100%',
  },
  inputPhone: {
    fontSize: 16,
    backgroundColor: 'white',
    borderRadius: 6,
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
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footer: {
    bottom: 0,
    position: 'absolute',
    height: '8%',
    width: '100%',
  },
  buttonImage: {
    alignItems: 'center',
    margin: '1%',
    aspectRatio: 1,
    marginVertical: 0,
  },
  containerPriceButton: {
    width: '33%',
  },
  input: {
    fontSize: 18,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 20,
  },
  buttonBuy: {
    backgroundColor: 'rgba(7,162,186,0.7)',
    padding: 10,
    marginVertical: 20,
  },
  buttonPrice: {
    borderRadius: 10,
    marginVertical: '1%',
    borderBottomWidth: 0,
    marginHorizontal: 10,
  },
  containerButtonPrice: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  loading: {
    left: 0,
    right: 0,
    top: '-50%',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleButton: {
    fontSize: 16,
  },
});
