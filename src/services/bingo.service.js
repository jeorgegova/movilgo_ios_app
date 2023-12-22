import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
import Odoo from 'react-native-odoo';

export const searchClientBingo = async (product_id, cedula, callback) => {
    const args = [
        0, { product_id: product_id, cedula: cedula }
    ]
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "bingoBuscarCliente",
        args: args,
        kwargs: {}
    }
    client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
        if (err) {
            callback(err, true);
           
            return false;
        }
        callback(response, true);
    });
}

export const getBingo = async (product_id, callback) => {
    const args = [
        0, { product_id }
    ]
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "bingoProximoSorteo",
        args: args,
        kwargs: {}
    }
    client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
        

        if(response===undefined){            
            callback(response, true);
        }else if (err) {
            callback(err, true);
            
            return false;
        }
        callback(response, true);
    });
}
