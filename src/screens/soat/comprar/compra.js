import React, {PureComponent} from 'react';
//import { Picker } from '@react-native-picker/picker';
import {Text, View} from 'react-native';
import {Button, Input} from 'react-native-elements';
import Modal from 'react-native-modal';
import {ClientInfo} from './componets/client-info';
import {StyleSheet} from 'react-native';
import {searchSoat} from '../../../services/soat.service';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {DateToString} from '../../../shared/utilities/formats';
import {SOAT_SCHEMA} from '../../../database/models/soat';
import {getTableFromDB} from '../../../database/allSchemas';
import {SendPolicy} from './componets/send-policy';
import {VehicleInfo} from './componets/vehicle-info';
import {Header} from '../../../components/UI/header';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ActivityIndicator} from 'react-native';
import {ScrollView} from 'react-native';
import {Alert} from 'react-native';

export class ScreenSoatCompar extends PureComponent {
  constructor() {
    super();
    this.state = {
      showClientInfo: false,
      showVehicleInfo: false,
      documentNumber: '', //
      licensePlate: '',
      documentType: 1,
      insurance: 1,
      date: this.getDate(1),
      date2: this.getDate(1),
      showDate: false,
      loading: false,
      soats: [{id: -1}],
      datepolicy: this.getDate(1),
      dataContact: {},
      dataVehicle: {},
      getVehiculo: {}
    };
    this.minDate = this.getDate(1);
  }

  componentDidMount() {
    getTableFromDB(SOAT_SCHEMA, true)
      .then((response) => {
        this.setState({soats: response});        
      })
      .catch((err) => console.error(err));
  }

  getDate = (addDays = 0) => {
    console.log("addDays",addDays)
    let date = new Date();
    date.setDate(date.getDate() + addDays);
    console.log("date",date)
    return date;
  };

  clearData = () => {
    this.setState({
      loading: false,
      date: this.getDate(1),
      date2: this.getDate(1),
      documentNumber: '',
      licensePlate: '',
      dataContact: {},
      /* dataVehicle: {}, */
      getVehiculo: {},
      showClientInfo: false,
      showPaymentInfo: false,
      showVehicleInfo: false,
    });
  };
  
  setSearchedData = (res, flag) => {
  console.log("setSearchedData: res de soat(compra) ",res)
    if (flag) {
      if (res.errores) {
        
        if (res.errores.observacion === "'NoneType' object has no attribute 'update'") 
        {
           Alert.alert('Error', 'No existe informacion de estos datos', [
            {text: 'Volver', onPress: () => this.clearData()},
            ])
            ;
        }else if (res.errores.observacion){
          Alert.alert('Error', res.errores.observacion, [
            {text: 'Volver', onPress: () => this.clearData()},
          ])
          ;
        } 
        else {
          Alert.alert('Error', 'Se ha presentado un error con la conexion, Comunicate con MovilGo',
            [{text: 'Volver', onPress: () => this.clearData()}],)
          ;
        }
      } 
      else {
        let str = JSON.stringify(res).replace(/\\/g, '');
        str = str.replace('""""', '""');
        str = str.replace('"{', '{');
        str = str.replace('}"', '}');
        str = str.replace('""""', '""');
        str = str.replace('"{', '{');
        str = str.replace('}"', '}');
        const json = JSON.parse(str);
        const TarifaError = json.soat.respuesta_tarifa.error;
        const Vehicle = json.soat.respuesta_vehiculo.VehicleBodyTypeId;
        const Poliza = json.soat.respuesta_poliza_vigente.Message;
        const Mesajetarifa=json.soat.respuesta_tarifa.Message
        console.log("Mesajetarifa",Mesajetarifa)
        console.log("json.soat.respuesta_vehiculo",json.soat.respuesta_vehiculo)
        console.log("json.soat.respuesta_cliente",json.soat.respuesta_cliente)
        console.log("json.soat.respuesta_tarifa",json.soat.respuesta_tarifa)
        if (Vehicle === null) {
          Alert.alert(
            'Error',
            'Algunos datos vienen incompletos. Valide los datos RUNT',
            [{text: 'Volver', onPress: () => this.clearData()}],
          );
        } 
        else if (TarifaError) {
          Alert.alert(
            'Error',
            'No se puede realizar la compra dirijasea ISOAT ',
            [{text: 'Volver', onPress: () => this.clearData()}],
          );

          
        } else if (Poliza !== '') {       
          Alert.alert(
            'Error',
            'Existe una o varias polizas vigentes coincidente con los datos de la placa ',
            [{text: 'Volver', onPress: () => this.clearData()}],
          );
        } else if(Mesajetarifa){
          Alert.alert(
            'Error',
            'La tarifa Viene incompleta ',
            [{text: 'Volver', onPress: () => this.clearData()}],
          );
        }  else if (json) {
          this.setState({
            dataVehicle: json,
            showVehicleInfo: true,
            loading: false,
          });
        } else {
          Alert.alert(
            'Error',
            'Ocurrio un error al obtener datos, verfique la Cédula ingresada.',
            [{text: 'Volver', onPress: () => this.clearData()}],
          );
        }
      }
    } 
    else {
      Alert.alert('Error','Por favor verifique los datos. Si el error persiste comuniquese con MovilGo',
        [{text: 'Volver', onPress: () => this.clearData()}],
      );
    }
  }
  ;

  contact = (response) => {
    console.log("contact",this.state.date2)
    this.setState({dataContact: response});
  };

  vehicle = (response) => {    
    console.log("vehicle",this.state.date2)

    this.setState({getVehiculo: response})
  }

  sendData =async () => {
    if (this.state.licensePlate.match(/[^a-zA-Z0-9\s/]/) !== null) {
      this.setState({loading: false});
      Alert.alert('Error', 'La placa no puede contener caracteres especiales');
    } else {
      console.log("ENTRA AL sendData, en compra")
      searchSoat(
        this.state.documentNumber.trim(),
        this.state.licensePlate.trim(),
        this.state.soats[0].id,
        DateToString(this.state.date, true),
        DateToString(this.state.date, true, 0, 0, 1),
        this.setSearchedData,
      );
    }
  };

  render() {
    return (
      <>
      <SafeAreaView style={{flex: 1}}>
        <View>
          <Header
            title="COMPRAR SOAT"
            onPressBack={() => {
              this.props.navigation.goBack();
            }}>              
          </Header>

          <ScrollView>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Ingrese número de documento</Text>
            </View>

            <Input
              placeholder="####"
              leftIcon={{
                type: 'font-awesome-5',
                name: 'id-card',
                size: 24,
                color: 'black',
              }}
              keyboardType="numeric"
              inputStyle={{borderWidth: 1, borderRadius: 5}}
              inputContainerStyle={{borderBottomWidth: 0}}
              containerStyle={{width: '75%', alignSelf: 'center'}}
              value={this.state.documentNumber}
              onChangeText={(documentNumber) => this.setState({documentNumber})}
            />

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Ingrese placa del vehiculo</Text>
            </View>

            <Input
              placeholder="####"
              leftIcon={{
                type: 'font-awesome-5',
                name: 'car',
                size: 24,
                color: 'black',
              }}
              inputStyle={{borderWidth: 1, borderRadius: 5}}
              inputContainerStyle={{borderBottomWidth: 0}}
              containerStyle={{width: '75%', alignSelf: 'center'}}
              value={this.state.licensePlate}
              onChangeText={(licensePlate) => this.setState({licensePlate})}
            />

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Seleccione fecha de inicio</Text>
            </View>

            <Button
              title={DateToString(this.state.date2)}
              disabled={this.state.loading}
              onPress={() => this.setState({showDate: true})}
              containerStyle={{
                width: '70%',
                padding: 5,
                alignSelf: 'center',
              }}
              buttonStyle={{backgroundColor: '#07A2BA'}}
            />

            <Button
              //disabled={this.state.documentNumber.trim() !== "" ? true : false}
              title="Buscar"
              disabled={this.state.loading}
              containerStyle={{
                width: '70%',
                padding: 5,
                alignSelf: 'center',
                marginVertical: 10,
                marginHorizontal: 10,
                marginBottom: 30,
                paddingBottom: 60,
              }}
              onPress={() => {
                this.setState({loading: true});
                this.sendData();
              }}
              buttonStyle={{backgroundColor: '#07A2BA', marginTop: '2%'}}
            />

          </ScrollView>

        </View>

        {this.state.showDate && (
          
          <RNDateTimePicker
            value={this.state.date}
            mode="date"
            minimumDate={this.minDate}
            display="default"
            onChange={(date) => {
              if (date && date.type === 'dismissed') {
                this.setState({showDate: false});
              } else {
                this.setState({
                  date: date.nativeEvent.timestamp /* timestdataVehicleamp */,
                  date2: date.nativeEvent.timestamp,/*esta conchinada se puso por que la variable date  se actualizaba con la fecha limite de la poliza al ingresarse al DateToString y lo hizo jaime */
                  showDate: false,
                });
              }
            }}
          />

        )}

        <Modal
          style={{height: '98%'}}
          isVisible={this.state.showVehicleInfo}
          onBackButtonPress={() => {
            this.setState({showClientInfo: false});
          }}
          onBackdropPress={() => {
            /*this.setState({ showClientInfo: false })*/
          }}>
          <VehicleInfo
            data={this.state.dataVehicle}
            dataVehicle={this.state.getVehiculo}
            infoVehicle={this.vehicle}
            closeAction={() => this.clearData()}
            confirmAction={() =>
              this.setState({
                showVehicleInfo: false,
                showClientInfo: true,
              })
            }
          />
        </Modal>

        <Modal
          isVisible={this.state.showClientInfo}
          onBackButtonPress={() => {
            this.setState({showClientInfo: false});
          }}
          onBackdropPress={() => {
            /*this.setState({ showClientInfo: false })*/
          }}>
          <ClientInfo
            data={this.state.dataVehicle}
            dataContact={this.state.dataContact}
            back={() => this.setState({showVehicleInfo: true,showClientInfo: false}) }
            closeAction={() => this.clearData()}
            infoContact={this.contact}
            confirmAction={() =>this.setState({showClientInfo: false,showPaymentInfo: true,})}
          />
        </Modal>

        <Modal
          isVisible={this.state.showPaymentInfo}
          onBackButtonPress={() => {
            this.setState({showPaymentInfo: false, loading: false});
          }}
          onBackdropPress={() => {
            /*this.setState({ showPaymentInfo: false, loading: false }) */
          }}>
          <SendPolicy
            data={this.state.dataVehicle}
            date={this.state.date2}
            back={() =>this.setState({showClientInfo: true,showPaymentInfo: false})}
            dataContact={this.state.dataContact}
            infoVehicle={this.state.getVehiculo}
            productId={this.state.soats[0].id}
            closeAction={() => this.clearData()}
            navigation={this.props.navigation}
            loading={this.state.loading}
            setLoading={(loading) => this.setState({loading})}
          />
        </Modal>

        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="#0000ff"
            animating={this.state.loading}></ActivityIndicator>
        </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#c3c3c3',
    marginHorizontal: 10,
    padding: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#07A2BA',
  },
  loading: {
    left: 0,
    right: 0,
    top: '-50%',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
