import AsyncStorage from '@react-native-community/async-storage';
import {Alert, Linking} from 'react-native';
import Odoo from 'react-native-odoo';

export const searchDisbursement = async (product_id,tipo,id_solicitud,cedula,callback) => {
  const args = [0, product_id, id_solicitud, cedula, tipo];
  
  const session = await AsyncStorage.getItem('session');
  const client = new Odoo(JSON.parse(session));
  const params = {
    model: 'movilgo.webservice',
    method: 'obtenerSolicitudCreditoMovilgo',
    args: args,
    kwargs: {},
  };
  client.connect((err, response) => {

      if(err){
          console.log("El Error 1 es: ", JSON.stringify(err));  
                
          return callback(err,false);            
      }else{
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
      }
  })
  
};

