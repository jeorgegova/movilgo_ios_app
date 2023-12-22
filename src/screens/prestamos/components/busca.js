import React, {useState, useEffect} from 'react';
import {Text, View, Alert, ScrollView, ActivityIndicator} from 'react-native';
import {Button, Input} from 'react-native-elements';
import Modal from 'react-native-modal';
import {StyleSheet} from 'react-native';
import {searchDisbursement} from '../../../services/nova.service';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {DateToString} from '../../../shared/utilities/formats';
import {PRESTAMOS_SCHEMA} from '../../../database/models/prestamos';
import {getTableFromDB} from '../../../database/allSchemas';
import {Header} from '../../../components/UI/header';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Desembolso} from './desembolso';
import {Pago} from './pago'

export const ScreenPrestamosBuscar = (props) => {
  const [showDesembolso, setShowDesembolso] = useState(false);
  const [showPago, setShowPago] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [cedula, setCedula] = useState('');
  const [id_solicitud, setId_solicitud] = useState('');

  const clearData = () => {
    setLoading(false);
    setShowDesembolso(false)
    setShowPago(false)
    setCedula('');
    setId_solicitud('');
  };

  const verifyFields = () => {
    let error = true;
    if (cedula === '' || id_solicitud === '') {
      error = false;
      return Alert.alert('Alerta', 'Todos los campos son obligatorios', [
        {text: 'Volver', onPress: () => clearData()},
      ]);
    } else {
      //PENDIENTE PARA REVISION 
      searchDisbursement(props.route.params.produc_id, props.route.params.tipo, id_solicitud, cedula, searchedData)
      
    }
    return error;
  };

  const searchedData = (res, flag) => {
    /* console.log ('respuesta BUSCA credito',res) */
    
    setLoading(false)
   
    if (flag) {
      if (res.errores) {
        Alert.alert('Error, ', res.errores.observacion);
      } else {

        if (res.solictud_ids.length === 0) {
          setShowDesembolso(false)
          Alert.alert(
            'Error',
            'Sin informacion asociada'
          )
        } else {
         
          if(props.route.params.tipo==='venta'){
            setData(res.solictud_ids[0])
            setShowDesembolso(true);
          }else if(props.route.params.tipo==='pago'){
            
            setData(res.solictud_ids[0])
            setShowPago(true)
          }
          
        }
        
      }
    } else {
      Alert.alert(
        'Error',
        'Por favor verifique los datos. Si el error persiste comuniquese con MovilGo'/* ,
        [{text: 'Volver', onPress: () => clearData()}], */
      );
    }
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
      <View>
        <Header
          title="Buscar PRESTAMO"
          onPressBack={() => {
            props.navigation.goBack();
          }}></Header>
        <ScrollView>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Ingrese el ID del Credito</Text>
          </View>
          
          <Input
            leftIcon={{
              type: 'font-awesome-5',
              name: 'dollar-sign',
              size: 24,
              color: 'black',
            }}
            keyboardType="numeric"
            inputStyle={{borderWidth: 1, borderRadius: 5}}
            inputContainerStyle={{borderBottomWidth: 0}}
            containerStyle={{width: '75%', alignSelf: 'center'}}
            value={id_solicitud}
            onChangeText={(value) => setId_solicitud(value)}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Ingrese N° cedula</Text>
          </View>
          <Input
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
            value={cedula}
            onChangeText={(value) => setCedula(value)}
          />
          <Button
            title="Buscar"
            disabled={loading}
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
              verifyFields(),
              setLoading(true);
              /* sendData(); */
            }}
            buttonStyle={{backgroundColor: '#07A2BA', marginTop: '2%'}}
          />
          <Modal style={{height: '98%'}}
            isVisible={showDesembolso}
            onBackButtonPress={() => {setShowDesembolso(false)
            }}
            >
            <Desembolso 
            data={data}
            loading={loading}
            productId={props.route.params.produc_id}
            document={cedula}
            closeAction={() => clearData()}
            navigation={props.navigation}
            setLoading={(loading) => setLoading(loading)}
            />
          </Modal>
          <Modal
            isVisible={showPago}
            onBackButtonPress={() => {setShowPago(false)}}>
            <Pago
            data={data}
            loading={loading}
            document={cedula}
            productId={props.route.params.produc_id}
            closeAction={() => clearData()}
            navigation={props.navigation}
            setLoading={(loading) => setLoading(loading)}
            >    
            </Pago>
          </Modal>
        </ScrollView>
      </View>
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#0000ff"
          animating={loading}></ActivityIndicator>
      </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
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
