import React, {PureComponent} from 'react';
//import { Picker } from '@react-native-picker/picker';
import {Text, View} from 'react-native';
import {Button, Input} from 'react-native-elements';
import Modal from 'react-native-modal';
import {StyleSheet} from 'react-native';
import {searchPolisaSoat} from '../../../services/soat.service';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {DateToString} from '../../../shared/utilities/formats';
import {SOAT_SCHEMA} from '../../../database/models/soat';
import {getTableFromDB} from '../../../database/allSchemas';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Header} from '../../../components/UI/header';
import {ActivityIndicator} from 'react-native';
import {ScrollView} from 'react-native';
import {Alert} from 'react-native';

export class ScreenSoatBuscar extends PureComponent {
  constructor() {
    super();
    this.state = {
      Numberplate: '',
      InsurancePolicyNumber: '',
      email: '',
      date: this.getDate(1),
      loading: false,
      soats: [{id: -1}],
      source_request: 'M',
    };
  }

  componentDidMount() {
    getTableFromDB(SOAT_SCHEMA, true)
      .then((response) => {
        this.setState({soats: response});
      })
      .catch((err) => console.error(err));
  }

  getDate = (addDays = 0) => {
    let date = new Date();
    date.setDate(date.getDate() + addDays);
    return date;
  };

  clearData = () => {
    this.setState({
      loading: false,
      date: this.getDate(1),
      Numberplate: '',
      licensePlate: '',
      email: '',
    });
  };
  verifyFields = (Numberplate, InsurancePolicyNumber, email) => {
    const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    /* const email2 = emailValid.trim(); */
   /*  console.log("emailvalid",emailValid) */
    /* console.log("emailvalid",email2) */
    if (Numberplate.trim() == '') {
      Alert.alert('Error', 'El numero de Poliza es obligatorio');
    } else if (email.trim() === '') {
      Alert.alert('Error', 'El Email es obligatorio');
    } else if (!emailValid) {
      Alert.alert('Error', 'El Email es incorrecto');
    /* } else if (!email2) {
      Alert.alert('Error', 'El Email es incorrecto'); */
    } else {
      Alert.alert(
        'Confirmar',
        'Desea consultar los siguientes datos ' +
          Numberplate +
          ' ' +
          InsurancePolicyNumber +
          ' ' +
          email,
        [
          {text: 'Cancelar', onPress: () => null},
          {
            text: 'Confirmar',
            onPress: () => {
              this.setState({loading: true});
               searchPolisaSoat(
                this.state.source_request,
                this.state.Numberplate.trim(),
                this.state.InsurancePolicyNumber.trim(),
                this.state.soats[0].id,
                this.state.email.trim(),
                this.setSearchedData,
                console.log("DATOS ENVIADOS AL CONFIRMAR",Numberplate,email)
              ); 
            },
          },
        ],
      );
    }
  };

  setSearchedData = (res, flag) => {//PENDIENTE PONER A IMPRIMIR EL ERROR QUE VIENE DEL BACK
    console.log("DATOS DEL RES ", res)
    console.log("DATOS DEL FLAG", flag)
    if (flag) {
      if (res.errores) {
        Alert.alert('Error, ', res.errores.observacion);
      } else {
        Alert.alert(
          'Movilgo',
          'Cosulta exitosa, Verifique el Email ingresado.',
          [{text: 'Ok', onPress: () => this.clearData()}],
        );
      }
    } else {
      Alert.alert(
        'Error',
        'Por favor verifique los datos. Si el error persiste comuniquese con MovilGo',
        [{text: 'Volver', onPress: () => this.clearData()}],
      );
    }
  };

  render() {
    return (
      <>
      <SafeAreaView style={{flex: 1}}>
        <View>
          <Header
            title="Buscar SOAT"
            onPressBack={() => {
              this.props.navigation.goBack();
            }}></Header>
          <ScrollView>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Ingrese número de placa</Text>
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
              value={this.state.Numberplate}
              onChangeText={(Numberplate) => this.setState({Numberplate})}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Ingrese No de Poliza</Text>
            </View>
            <Input
              placeholder="No es Obligatorio"
              leftIcon={{
                type: 'font-awesome-5',
                name: 'file-signature',
                size: 24,
                color: 'black',
              }}
              keyboardType="numeric"
              inputStyle={{borderWidth: 1, borderRadius: 5}}
              inputContainerStyle={{borderBottomWidth: 0}}
              containerStyle={{width: '75%', alignSelf: 'center'}}
              value={this.state.InsurancePolicyNumber}
              onChangeText={(InsurancePolicyNumber) =>
                this.setState({InsurancePolicyNumber})
              }
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Correo Electronico</Text>
            </View>
            <Input
              label="Email"
              placeholder=""
              leftIcon={{
                type: 'font-awesome-5',
                name: 'envelope',
                size: 24,
                color: 'black',
              }}
              inputStyle={{borderWidth: 1, borderRadius: 5}}
              inputContainerStyle={{borderBottomWidth: 0}}
              containerStyle={{width: '75%', alignSelf: 'center'}}
              value={this.state.email}
              onChangeText={(email) => {
                this.setState({email});
              }}
            />
            <Button
              title="Buscar"
              disabled={this.state.loading}
              containerStyle={{
                width: '50%',
                padding: 5,
                alignSelf: 'center',
                marginVertical: 10,
                marginHorizontal: 10,
                marginBottom: 30,
                paddingBottom: 60,
              }}
              onPress={() => {
                this.verifyFields(
                  this.state.Numberplate,
                  this.state.InsurancePolicyNumber,
                  this.state.email,
                );
              }}
              buttonStyle={{backgroundColor: '#07A2BA', marginTop: '2%'}}
            />
          </ScrollView>
        </View>
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
