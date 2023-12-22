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
import {InputMoney} from '../../components/UI/input';
import {stylesLarge, stylesMedium} from './stylesBox';
import {SafeAreaView} from 'react-native-safe-area-context';
import { GenerateInvoice } from '../../shared/utilities/GenerateInvoice';
export class ScreenBoxDate extends PureComponent {
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
      movimientos: [],
      movimientosError: [],
      movimientosReport: [],
      selectedPrice: '',
      showDate:false,
      seller: true,
      image: '',
      amount: '',
      description: '',
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
      if (permission === 'cobrador') {
        this.setState({seller: false, collector: true});
      }
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
  /*   console.log("esti es la respuesta de las cajas",data)
    console.log("esti es la respuesta de la bandera de la cajas",flag) */

    if (!flag) {
      Alert.alert('Error', data.message);
      this.setState({loading: false});
      return;
    }
    else{

      if(data.errores){
        Alert.alert('Error',"No hay dato de esa fecha ");
        this.setState({
          caja:{nombre_caja:'---',
          estado:'---',
          fecha:'---',
          balanceInicial:'0',
          balanceFinal:'0',
          debito:'0',
          ganancia:'0',
          credito:'0'},
          loading: false,
        });
      }
      else{
        this.setState({caja: data.caja, loading: false,});
      }

    }
    
  };
  //aca
  initializeMoves = (data) => {
    this.setState({
      movimientos: data.movimientos,
      loading: false,
    });
  };
  initializeErrors = (data) => {
    this.setState({
      movimientosError: data.movimientosError,
      loading: false,
    });
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
    this.setState({showDate: true});

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backHandler,
    );
    this.checkPermission();
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
      getBox(0, this.state.pageMove + 1,this.state.fecha_movimientos ,this.pageMoveNext);
    }
  };

  reloadErros = () => {
    if (this.state.movimientosError.length / this.state.pageError > 6) {
      getBox(1, this.state.pageError + 1,this.state.fecha_movimientos,this.pageErrorNext);
    }
  };

  reloadReport = () => {
    if (this.state.modalListReport.length / this.state.pageReport > 6) {
      getReport(this.state.fecha_movimientos,this.pageReportNext);
    }
  };

  navigateNext = (flag, response) => {
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
      this.setState({modalShared:true,dataResponse:data})
      this.props.navigation.navigate('Home', {
        balance: response.valida.balanceFinal,
      });
    } else {
      this.setState({loading: false});
    }
  };



  render() {
    return (
      <>
      <SafeAreaView style={{flex: 1}}>
        <View style={this.styles.background}>
          <Header
            title="CAJA POR FECHA"
            onPressBack={() => {
              this.props.navigation.goBack();
            }}></Header>

          <View style={this.styles.containerContent}>
          
            <Text>
              <Text style={this.styles.title}>Nombre: </Text>
              <Text style={this.styles.text}>{this.state.caja.nombre_caja}</Text>
            </Text>

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

            <View style={this.styles.containerRowInfo}>
              <Text style={{width: '50%'}}>
                <Text style={this.styles.title}>Inicial: </Text>
                <Text style={this.styles.text}>{FormatMoney(this.state.caja.balanceInicial)} </Text>
              </Text>
              <Text style={{width: '50%'}}>
                <Text style={this.styles.title}>Final: </Text>
                <Text style={this.styles.text}>{FormatMoney(this.state.caja.balanceFinal)} </Text>
              </Text>           
            </View>

            <View style={(this.styles.containerRowInfo, {marginBottom: 12})}>
              <Text style={{width: '50%'}}>
                <Text style={this.styles.title}>Cobrar: </Text>
                <Text style={this.styles.text}>
                  {FormatMoney(this.state.caja.debito)}
                </Text>
              </Text>
              <Text  style={{ width: '50%'}}>
                <Text style={this.styles.title}>Ganancia: </Text>
                <Text style={this.styles.text}> {FormatMoney(this.state.caja.ganancia)} </Text>              
              </Text>

              <Text style={{width: '50%'}}>
                <Text style={this.styles.title}>Pagar: </Text>
                <Text style={this.styles.text}> {FormatMoney(this.state.caja.credito)}</Text>
              </Text>
            </View>

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
                  getBox(0, 1,this.state.fecha_movimientos, this.initializeMoves);
                  this.setState({loading: true});
                
              }}
              title="Movimientos"
              titleStyle={this.styles.titleButton}>              
            </Button>
            
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
                
                  getBox(1, 1,this.state.fecha_movimientos,this.initializeErrors);
                  this.setState({loading: true});
                
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
                });
                getReport(this.state.fecha_movimientos,this.initializeReport);
                  this.setState({loading: false});
                
                }}
                title="Resumen Caja"
                titleStyle={this.styles.titleButton}>              
            </Button>

            <Button
                buttonStyle={this.styles.button}              
                title={"Elija fecha"}
                disabled={this.state.loading}
              
                onPress={() => {this.setState({showDate: true});
              }
              }
            /> 

          </View>
          
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
          
          </Modal>
          <View style={this.styles.loading}>
            <ActivityIndicator
              size="large"
              color="#0000ff"
              animating={this.state.loading}></ActivityIndicator>
          </View>
          {this.state.modalShared&&<GenerateInvoice isVisible={this.state.modalShared} data={this.state.dataResponse} closeModal={(flag)=>this.setState({modalShared:flag})} title="Tu recarga fue exitosa!"/>}
    
          {/* es quien me llama el metodo initializaData luego de
              seleccionar la Fecha */}
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
                    loading:true
                  });
                  getBox(2, 0,this.state.fecha_movimientos,this.initializeData);
                
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
