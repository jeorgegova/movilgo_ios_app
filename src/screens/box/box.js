import React, {PureComponent} from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {
  View,
  Image,
  Text,
  Alert,
  ActivityIndicator,
  BackHandler,
  Dimensions,
  PermissionsAndroid,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import {Header} from '../../components/UI/header';
import {getBox, getReport, getNameProduct} from '../../services/box.service';
import {Button, Input} from 'react-native-elements';
import {FormatMoney} from '../../shared/utilities/formats';
import {DateToString}from '..//../shared/utilities/formats';
import { ListError,ListMoves,ListReport, Bill} from '../../components/UI/list/list';
import {Transaction} from '../../services/products.service';
import {printBill, getPrintConfig} from '../bluetooth/bluetooth-printer';
import {getElementByIdDataBase} from '../../database/allSchemas';
import {Camera} from '../../components/UI/camera';
import {CollectorPayModal} from './collector-pay-modal';
import {InputMoney} from '../../components/UI/input';
import {stylesLarge, stylesMedium} from './stylesBox';
import {SafeAreaView} from 'react-native-safe-area-context';
import NetInfo from "@react-native-community/netinfo";
import { GenerateInvoice } from '../../shared/utilities/GenerateInvoice';
export class ScreenBox extends PureComponent {
  constructor() {
    super();
    this.state = {
      loading: false,
      modalCargaBolsa: false,
      modalListMoves: false,
      modalListErrors: false,
      modalListReport: false,
      modalBill: false,
      dataBill: {
        description: '',
        amount: '',
      },
      modalCamera: false,
      pageMove: 1,
      pageError: 1,
      pageReport: 1,
      caja: {
        balanceFinal: 0,
        balanceInicial: 0,
        credito: 0,
        debito: 0,
        estado: 'No disponible',
        fecha: '--',
        nombre_caja: '--',
        ganancia:0
      },
      fecha_movimientos:this.getDate(0),
      showDate:false,
      movimientos: [],
      movimientosError: [],
      movimientosReport: [],
      listProducts: [],
      stateButtons: [false, false, false, false, false],
      selectedPrice: '',
      showAnotherValueInput: false,
      seller: true,
      image: '',
      amount: '',
      description: '',
      aplicadatosmoviles:false,
      modalShared:false,
      dataResponse:[]
    };

    this._isMounted = false;
    this.priceList = [10000, 20000, 30000, 50000, 'Otro'];
    this.styles = getStyles();
  }
  getDate = (addDays = 0) => {
    let date = new Date();
    date.setDate(date.getDate() + addDays);
    return date;
 };

  checkPermission = async () => {
    try {
      const permission = await AsyncStorage.getItem('Permission');
      const aplicadatosmoviles=  await AsyncStorage.getItem("aplicadatosmoviles");
      console.log("home aplicadatosmoviles",aplicadatosmoviles)
      
      
      if (permission === 'cobrador') {
        this.setState({seller: false, collector: true});
      }
      NetInfo.fetch().then(state => {
        if (state.isConnected && (state.type === "wifi")||aplicadatosmoviles==="true") {
            this.setState({ aplicadatosmoviles: true });
        }
      });

    } catch (error) {
      this.setState({seller: false});
      Alert.alert(
        'Error',
        'No se encontraron permisos, si el problema persiste comuniquese con MovilGo',
      );
    }
  };

  backHandler = () => {
    this.props.navigation.goBack();
    return true;
  };

  initializeData = (data, flag) => {
    
    if (!flag) {
      Alert.alert('Error', data.message);
      this.setState({loading: false});
      return;
    }
    this.setState({
      caja: data.caja,
      loading: false,
    });
  };
  
  
  initializeMoves = (data) => {
    if (!data.movimientos){
      this.setState({loading: false});
      Alert.alert('Error', 'Se presento un error al obtener los datos!');
    }else{
      this.setState({
      movimientos: data.movimientos,
      loading: false,
      });
    }
    
  };
  
  initializeErrors = (data) => {
    console.log("response de errores",data)
    if(!data.movimientosError){
      this.setState({loading: false});
      Alert.alert('Error', 'Se presento un error al obtener los datos!');
    }else{
      this.setState({
      movimientosError: data.movimientosError,
      loading: false,
      });
    }
    
  };
  getNameProduct = async (product_id) => {
    const dataRec = {
      table: 'Recargas',
      product: {
        id: product_id,
      },
    };
    const dataPaqu = {
      table: 'Paquetes',
      product: {
        id: product_id,
      },
    };

    const dataRif = {
      table: 'Rifas',
      product: {
        id: product_id,
      },
    };

    let result = await getElementByIdDataBase(dataRec);

    if (result) {
      return result.description;
    }
    result = await getElementByIdDataBase(dataPaqu);
    if (result) {
      return 'Paquete';
    }
    result = await getElementByIdDataBase(dataRif);
    if (result) {
      return 'Rifa';
    }
    const cargaBolsa = await AsyncStorage.getItem('CargaBolsa');

    if (product_id === parseInt(cargaBolsa)) {
      return 'Carga Bolsa';
    }
    return product_id;
  };

  initializeReport = async (data) => {
    data.movimientos = data.movimientos.reverse();
    for (let i = 0; i < data.movimientos.length; i++) {
      if (data.movimientos[i].product_id === null) {
        data.movimientos[i].product_id = 'Comisión';
      }
    }
    this.setState({
      movimientosReport: data.movimientos,
      loading: false,
    });
  };

  componentDidMount = () => {
    this.setState({loading: true});
    getBox(2, 0, null,this.initializeData);
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backHandler,
    );
    this.checkPermission();
  };

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
            }}></Button>
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
              }}></Button>
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
              }}></Button>
          )}
        </View>,
      );
    }
    return row;
  };

  pageMoveNext = (res) => {
    let arraymovimientos = this.state.movimientos;
    res.movimientos.forEach((element) => {
      arraymovimientos.push(element);
    });
    this.setState({
      pageMove: this.state.pageMove + 1,
      movimientos: arraymovimientos,
    });
  };

  pageErrorNext = (res) => {
    let errors = this.state.movimientos;
    res.movimientosError.forEach((element) => {
      errors.push(element);
    });
    this.setState({
      pageError: this.state.pageError + 1,
      movimientosError: errors,
    });
  };

  pageReportNext = (res) => {
    let report = this.state.movimientosReport;
    res.movimientosReport.forEach((element) => {
      report.push(element);
    });
    this.setState({
      pageReport: this.state.pageReport + 1,
      movimientosReport: report,
    });
  };

  reloadMoves = () => {
    if (this.state.movimientos.length / this.state.pageMove > 6) {
      getBox(0, this.state.pageMove + 1,null ,this.pageMoveNext);
    }
  };

  reloadErros = () => {
    if (this.state.movimientosError.length / this.state.pageError > 6) {
      getBox(1, this.state.pageError + 1, null,this.pageErrorNext);
    }
  };

  reloadReport = () => {
    if (this.state.modalListReport.length / this.state.pageReport > 6) {
      getReport(this.pageReportNext);
    }
  };

  navigateNext = (flag, response) => {
    console.log("flag del cargar bolsa",flag, response)
    if (flag) {
      this.setState({loading: false});
      const data = [
        'Factura No: ' + response.valida.id,
        'Producto: Carga Bolsa',
        'Fecha:' + response.valida.fecha,
        'Valor: ' + FormatMoney(this.state.selectedPrice),
      ];
      this.setState({loading: false});
      printBill(data);
      Alert.alert('Movilgo', 'Tu carga bolsa fue exitoso!');
      this.props.navigation.navigate('Home', {
        balance: response.valida.balanceFinal,
      });

            
      
    } else {

      if(response.errores){
          Alert.alert(
                  'Error',
                  response.errores.observacion,
                  [{text: 'Volver', onPress: () =>this.setState({loading: false,modalCargaBolsa:false}) }],
                );
      }else if(response.data){
        Alert.alert(
          'Error',
          response.data.arguments[0],
          [{text: 'Volver', onPress: () =>this.setState({loading: false,modalCargaBolsa:false}) }],
        );
      }else {
        Alert.alert(
          'Error',
          'Algo salio mal Comunicate con movilgo',
          [{text: 'Volver', onPress: () =>this.setState({loading: false,modalCargaBolsa:false}) }],
        );
      }
      
      //this.setState({loading: false});
    }
  };

  sendToOdoo = async () => {

    try {
      this.setState({loading: true});
      let idProduct = -1;
      id = await AsyncStorage.getItem('CargaBolsa');
      idProduct = parseInt(id);
      console.log("idProduct",idProduct)
      if(!idProduct){
        Alert.alert(
          'Error',
          'Usted no tiene el ID de carga bolsa.',
          [{text: 'Volver', onPress: () =>this.setState({loading: false,modalCargaBolsa:false}) }],
        );
      }else{
          const product = {
          product_id: idProduct,
          atributes: {
            tipo:'venta',
            precio: parseInt(this.state.selectedPrice),
          },
        };
        await Transaction(product, this.navigateNext);
      }
      
      
    } catch (error) {
      Alert.alert('Error', 'Error inesperado.');
      this.setState({loading: false});
    }
  };

  navigateToPrintConfig = (flag) => {

    if (flag) {
      this.setState({
        loading: false,
        modalCargaBolsa: false,
      });
      this.props.navigation.navigate('Printer');
    } else {
      this.sendToOdoo();
    }
  };

  pressBuy = () => {
    if (this.state.selectedPrice >= 10000) {
      
        this.setState({loading: true});
        getPrintConfig(this.navigateToPrintConfig);
      
    } else {
      Alert.alert('Atención', 'El valor debe ser mayor a $10.000');
    }
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
    if (price === 'Otro') {
      this.setState({
        showAnotherValueInput: true,
        selectedPrice: '',
        stateButtons: stateButtons,
      });
    } else {
      this.setState({
        showAnotherValueInput: false,
        selectedPrice: price,
        stateButtons: stateButtons,
      });
    }
  };

  requestCameraPermission = async () => {
    try {
      this.setState({modalCamera: true});
    } catch (err) {}
  };

  modalCamera = (flag, data) => {
    this.setState({modalCamera: flag, dataBill: data, modalBill: !flag});
  };
  render() {
    const buttonsPrice = this.buildPrices();
    return (
      <>
        <SafeAreaView style={{flex: 1}}>
          <View style={this.styles.background}>
            <Header
              title="CAJA"
              onPressBack={() => {
                this.props.navigation.goBack();
              }}></Header>

            <View style={this.styles.containerContent}>

              <View>
                <Text>
                  <Text style={this.styles.title}>Nombre: </Text>
                  <Text style={this.styles.text}>{this.state.caja.nombre_caja}</Text>
                </Text>
              </View>
              
                {/* sección Estado y Fecha  */}

              <View style={this.styles.containerRowInfo}>
                <Text style={{width: '50%'}}>
                  <Text style={this.styles.title}>Estado: </Text>
                  <Text style={this.styles.text}>{this.state.caja.estado}</Text>
                </Text>
                <Text style={{width: '50%'}}>
                  <Text style={this.styles.title}>Fecha: </Text>
                  <Text style={this.styles.text}>{this.state.caja.fecha}</Text>
                </Text>
              </View>

              {/* sección Inicial y Final  */}

              <View style={this.styles.containerRowInfo}>
                
                <Text style={{width: '50%'}}>
                  <Text style={this.styles.title}>Inicial: </Text>
                  <Text style={this.styles.text}>{FormatMoney(this.state.caja.balanceInicial)}</Text>
                </Text>

                <Text style={{width: '50%'}}>
                  <Text style={this.styles.title}>Final: </Text>
                  <Text style={this.styles.text}>{FormatMoney(this.state.caja.balanceFinal)}</Text>
                </Text>
              
              </View>

              {/* sección Cobrar, Ganancias y Pagar  */}

              <View style={(this.styles.containerRowInfo, {marginBottom: 12})}>
                <Text style={{width: '50%'}}>
                  <Text style={this.styles.title}>Cobrar: </Text>
                  <Text style={this.styles.text}>{FormatMoney(this.state.caja.debito)}</Text>
                </Text>

                <Text  style={{ width: '50%'}}>
                  <Text style={this.styles.title}>Ganancia: </Text>
                  <Text style={this.styles.text}>{FormatMoney(this.state.caja.ganancia)}  </Text>
                </Text>

                <Text style={{width: '50%'}}>
                  <Text style={this.styles.title}>Pagar: </Text>
                  <Text style={this.styles.text}>{FormatMoney(this.state.caja.credito)}</Text>
                </Text>

              </View>

              <View>

              <ScrollView >
                {/* modales de los botones de las cajas */}

                {this.state.seller && (
                  <Button
                    buttonStyle={this.styles.button}
                    onPress={() => this.setState({
                      modalCargaBolsa: true,
                      movimientos: [],
                      movimientosError: [],
                      movimientosReport: [],})}
                    title="Carga bolsa"
                    titleStyle={this.styles.titleButton}>
                    </Button>
                )}

                <Button
                  buttonStyle={this.styles.button}
                  onPress={() => {
                    this.setState({
                      modalListMoves: true,
                      loading: true,
                      movimientos: [],
                      movimientosError: [],
                      movimientosReport: [],
                    });
                    if (this.state.movimientos.length === 0) {
                      getBox(0, 1, null,this.initializeMoves);
                    } else {
                      this.setState({
                        loading: false,
                      });
                    }
                  }}
                  title="Movimientos"
                  titleStyle={this.styles.titleButton}></Button>
                
                <Button
                  buttonStyle={this.styles.button}
                  onPress={() => {
                    this.setState({
                      modalListErrors: true,
                      loading: true,
                      movimientos: [],
                      movimientosError: [],
                      movimientosReport: [],
                    });
                    if (this.state.movimientosError.length === 0) {
                      getBox(1, 1,null ,this.initializeErrors);
                    } else {
                      this.setState({
                        loading: false,
                      });
                    }
                  }}
                  title="Errores"
                  titleStyle={this.styles.titleButton}>
                  </Button>

                <Button
                  buttonStyle={this.styles.button}
                  onPress={() => {
                    this.setState({
                      modalListReport: true,
                      loading: true,
                      movimientos: [],
                      movimientosError: [],
                      movimientosReport: [],
                    });
                    if (this.state.movimientosReport.length === 0) {
                      getReport(null,this.initializeReport);
                    } else {
                      this.setState({
                        loading: false,
                      });
                    }
                  }}
                  title="Resumen Caja"
                  titleStyle={this.styles.titleButton}>
                  </Button>

                {this.state.aplicadatosmoviles&& (
                  <Button
                    buttonStyle={this.styles.button}
                    onPress={() => {
                      this.setState({
                        modalBill: true,
                        image: '',
                        dataBill: {
                          amount: '',
                          description: '',
                        },
                      });
                    }}
                    title="Subir factura"
                    titleStyle={this.styles.titleButton}></Button>
                )}

                  <View style={{height: 950}}>
                    {/* Este view permite darle mas pixeles al scroll para desplazarse  */}
                  </View> 

                  </ScrollView>

              </View>

            </View>
            
            <Image
              style={this.styles.footer}
              source={require('../../assets/login/footer.png')}></Image>
            <Modal
              style={{flex: 1}}
              isVisible={this.state.modalCargaBolsa}
              onRequestClose={() => {this.setState({modalCargaBolsa: false,});}}
              onBackButtonPress={() => {this.setState({modalCargaBolsa: false,});}}
              onBackdropPress={() => {this.setState({modalCargaBolsa: false,});}}>
              <View style={{backgroundColor: '#02606e', borderRadius: 10}}>
                <Text style={this.styles.label}>¿Cuanto desea cargar?</Text>
                {buttonsPrice}
                {this.state.showAnotherValueInput && (
                  <InputMoney
                    value={'' + this.state.selectedPrice}
                    keyboardType="phone-pad"
                    handleChange={(name, selectedPrice) => {
                    
                      this.setState({selectedPrice});
                    }}
                    inputStyle={this.styles.input}
                    placeholder="Otro Valor"></InputMoney>
                )}
                <Button
                  disabled={this.state.loading}
                  buttonStyle={[
                    this.styles.button,
                    {marginVertical: 30, padding: 10, minHeight: 70},
                  ]}
                  title="Cargar"
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
            <Modal
              style={{flex: 1}}
              isVisible={this.state.modalListMoves}
              onRequestClose={() => {
                this.setState({
                  modalListMoves: false,
                });
              }}
              onBackButtonPress={() => {
                this.setState({
                  modalListMoves: false,
                });
              }}
              onBackdropPress={() => {
                this.setState({
                  modalListMoves: false,
                });
              }}>
              <ListMoves
                data={this.state.movimientos}
                onPressClose={() => {
                  this.setState({modalListMoves: false});
                }}
                onEndReached={this.reloadMoves}
                initialNumToRender={7}></ListMoves>
            </Modal>
            <Modal
              style={{flex: 1}}
              isVisible={this.state.modalListErrors}
              onRequestClose={() => {
                this.setState({
                  modalListErrors: false,
                });
              }}
              onBackButtonPress={() => {
                this.setState({
                  modalListErrors: false,
                });
              }}
              onBackdropPress={() => {
                this.setState({
                  modalListErrors: false,
                });
              }}>
              <ListError
                data={this.state.movimientosError}
                onPressClose={() => {
                  this.setState({modalListErrors: false});
                }}
                onEndReached={this.reloadErros}
                initialNumToRender={7}></ListError>
            </Modal>
            <Modal
              style={{flex: 1}}
              isVisible={this.state.modalListReport}
              onRequestClose={() => {
                this.setState({
                  modalListReport: false,
                });
              }}
              onBackButtonPress={() => {
                this.setState({
                  modalListReport: false,
                });
              }}
              onBackdropPress={() => {
                this.setState({
                  modalListReport: false,
                });
              }}>
              <ListReport
                data={this.state.movimientosReport}
                onPressClose={() => {
                  this.setState({modalListReport: false, loading: false});
                }}
                onEndReached={this.reloadReport}
                initialNumToRender={7}></ListReport>
            </Modal>
            <Modal
              style={{flex: 1}}
              isVisible={this.state.modalBill}
              onRequestClose={() => {
                this.setState({
                  modalBill: false,
                });
              }}
              onBackButtonPress={() => {
                this.setState({
                  modalBill: false,
                });
              }}
              onBackdropPress={() => {
                this.setState({
                  modalBill: false,
                });
              }}>
              <CollectorPayModal
                data={this.state.dataBill}
                collector={this.state.collector}
                modalBill={(flag) => {
                  this.setState({modalBill: flag});
                }}
                modalCamera={(flag, data) => {
                  this.modalCamera(flag, data);
                }}
                image={this.state.image}
              />
              
            </Modal>
            <Modal
              style={{flex: 1}}
              isVisible={this.state.modalCamera}
              onRequestClose={() => {
                this.setState({
                  modalCamera: false,
                });
              }}
              onBackButtonPress={() => {
                this.setState({
                  modalCamera: false,
                });
              }}
              onBackdropPress={() => {
                this.setState({
                  modalCamera: false,
                });
              }}>
              <Camera
                data={this.state.dataBill}
                modalCamera={(flag, data) => {
                  this.modalCamera(flag, data);
                }}
                image={(value) => {
                  this.setState({image: value});
                }}
              />
            </Modal>
            <View style={this.styles.loading}>
              <ActivityIndicator
                size="large"
                color="#0000ff"
                animating={this.state.loading}></ActivityIndicator>
            </View>
          
            {this.state.showDate && (
            <RNDateTimePicker
            value={this.state.fecha_movimientos}
            mode="date"
            display="default"
            maximumDate={this.getDate(0)}
            onChange={(date) => {
              if (date && date.type === 'dismissed') {
                this.setState({showDate: false});
              } else {
                this.setState({
                  fecha_movimientos: date.nativeEvent.timestamp,
                  showDate: false,
                  modalListMoves:true,
                  loading:true
                });
              }
            }}
          />
        )}
          </View>     
      </SafeAreaView>
    </>
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
