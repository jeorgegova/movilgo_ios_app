import AsyncStorage from '@react-native-community/async-storage';
import Odoo from 'react-native-odoo';
import { Alert, ToastAndroid } from 'react-native';
import { getElementByIdDataBase } from '../database/allSchemas';

export const Transaction = async (data, call) => {
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const args = [
        0, data
    ]
    console.log("args de transaccion",args)
    const params = {
        model: "movilgo.webservice",
        method: "transaccion",
        args: args,
        kwargs: {}
    }
    console.log("salida de  transaccion ",args)

    client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                   
            return call(false,err);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
            console.log("errores de TRANSACCIÓN",err)
            console.log("responde de TRANSACCIÓN",response) 
            if (err) {           
                return call(false, err);
            }else {
                if (response.errores && response.errores.id) {
                    const err = {
                        table: "Errors",
                        product: {
                            id: response.errores.id
                        }
                    }
                    getElementByIdDataBase(err).then(results => {
                        if (results) {
                            
                            
                            return call(false, response);
                            //Alert.alert(Error, results.comment);
                        } else {
                            Alert.alert(Error, "Movilgo no ha parametrizado el error, Comunicate con nosotros");
                        }

                    }).catch(error => console.log(error));
                    
                    return call(false, response);
                }
                
                return call(true, response);
            }

        });
        }
    })
 
    
}
