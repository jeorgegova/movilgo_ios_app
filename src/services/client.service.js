import AsyncStorage from '@react-native-community/async-storage';
import Odoo from 'react-native-odoo';

export const searchClient = async (product_id, cedula, callback) => {
    const args = [
        0, { product_id, cedula }
    ]
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "buscarCliente",
        args: args,
        kwargs: {}
    }
    client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                   
            return callback(err,false);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
                if (err) {
                    callback(err, false);
                    
                    return false;
                }
                callback(response, true);
            });
        }
    })
    
}

export const saveClient = async (usuario, callback) => {
    const args = [
        0, usuario
    ]
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "registrarCliente",
        args: args,
        kwargs: {}
    }
    client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                   
            return callback(false);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
                if (err) {
                    
                    return false;
                }
                callback(response);
            });
        }
    })
    
}
