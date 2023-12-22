import AsyncStorage from '@react-native-community/async-storage';
import {Alert, Linking} from 'react-native';
import Odoo from 'react-native-odoo';

export const searchCertification = async (id,callback) => {
  const args = [0,{product_id:id}];
  console.log("searchCertification",args)
  const session = await AsyncStorage.getItem('session');
  const client = new Odoo(JSON.parse(session));
  const params = {
    model: 'movilgo.webservice',
    method: 'certificadoConsultaOficinas',
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
        callback(false,'close');
        return false;
      }
      console.log('El Error es: ', JSON.stringify(err));
      callback(false,err);
      return false;
    }
    callback(true,response);
  });
};

export const searchSnr = async (id,code,license,callback) => {
  const args = [0,{product_id:id,snrOffice:code,snrLicense:license}];
  console.log("searchSnr",args)
  const session = await AsyncStorage.getItem('session');
  const client = new Odoo(JSON.parse(session));
  const params = {
    model: 'movilgo.webservice',
    method: 'certificadoConsultaMatricula',
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
        callback(false,'close');
        return false;
      }
      console.log('El Error es: ', JSON.stringify(err));
      callback(false,err);
      return false;
    }
    callback(true,response);
  });
};


