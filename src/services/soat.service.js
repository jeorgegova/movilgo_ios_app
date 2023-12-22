import AsyncStorage from '@react-native-community/async-storage';
import {Alert, Linking} from 'react-native';
import Odoo from 'react-native-odoo';

export const searchSoat = async (
  documento,
  placa,
  product_id,
  fecha,
  fechaVencimiento,
  callback,
) => {
  const args = [
    0,
    {product_id, documento, placa, fecha, fechaVencimiento, callback},
  ];
  console.log("args",args)
  const session = await AsyncStorage.getItem('session');
  const client = new Odoo(JSON.parse(session));
  const params = {
    model: 'movilgo.webservice',
    method: 'soatSolicitarDatos',
    args: args,
    kwargs: {},
  };
  
  client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
    if (err) {
      if (err.code === 100) {
        Alert.alert(
          'Error',
          'La sesión a expirado, es necesario volver a loguearse.',
        );
        callback('close', false);
        return false;
      }
      console.log('El Error es: ', JSON.stringify(err));
      callback(err, false);
      return false;
    }
    callback(response, true);
  });
};

export const searchPolisaSoat = async (
  source_request,
  Numberplate,
  InsurancePolicyNumber,
  product_id,
  email,
  callback,
) => {
  const args = [0,{source_request,product_id,Numberplate, InsurancePolicyNumber,email,callback,},
  ];

  const session = await AsyncStorage.getItem('session');
  const client = new Odoo(JSON.parse(session));
  const params = {
    model: 'movilgo.webservice',
    method: 'soatDatosReimpresion',
    args: args,
    kwargs: {},
  };

  client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
    if (err) {
      if (err.code === 100) {
        Alert.alert(
          'Error',
          'La sesión ha expirado, es necesario volver a loguearse.',
        );
        callback('close', false);
        return false;
      }
      console.log('El Error es: ', JSON.stringify(err));
      callback(err, false);
      return false;
    }

    callback(response, true);
  });
};

export const paySoat = async (product_id, json, callback) => {
  const args = [0, product_id, json];
  const session = await AsyncStorage.getItem('session');
  const client = new Odoo(JSON.parse(session));
  const params = {
    model: 'movilgo.webservice',
    method: 'soatComprarSoat',
    args: args,
    kwargs: {},
  };
  client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
    if (err) {
      Alert.alert('Error', JSON.stringify(err));
      callback(err, false);
      return false;
    }
    callback(response, true);
  });
};

export const OpenURL = async (url) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert('La descarga no esta disponible');
  }
};
