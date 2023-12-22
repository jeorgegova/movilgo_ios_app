import AsyncStorage from '@react-native-community/async-storage';
import Odoo from 'react-native-odoo';

export const searchNumber = async (numero_boleta, product_id, callback) => {
    const args = [
        0, { numero_boleta, product_id  }
    ]
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "buscarBoleta",
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
                    callback(err,false);
                    
                    return false;
                }
                
                callback(response,true);
            });
        }
    })
    
}

export const searchPayments = async (tipo, valor, product_id, callback) => {
    const args = [
        0, { tipo, valor, product_id  }
    ]
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "buscarAbonoRifa",
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
                    callback(err,false);
                    
                    return false;
                }
                callback(response,true);
            });
        }
    })
    
}
