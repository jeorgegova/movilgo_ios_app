import AsyncStorage from '@react-native-community/async-storage';
import Odoo from 'react-native-odoo';
import { OdooConfig, version } from '../shared/utilities/odoo-config';

export const getBox = async (type, page,fecha,callback) => {
    const args = [
        0, { tipo: type, pagina: page,fecha }
    ]
   console.log("args de las cajas",args)
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    
    const params = {
        model: "movilgo.webservice",
        method: "obtenerDatosCaja",
        args: args,
        kwargs: {}
    }

    
    client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                   
            return callback(err,false);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
                    console.log("err de obtener",err)
                    console.log("response del getbox",response)
                    if (err) {
                        callback(err, false);
                        return false;
                    }
                    callback(response, true);
                    
            });
        }
    })
    
}

export const pse = async ( data,callback) => {
    const args = [
        0, data
    ]
    const session = await AsyncStorage.getItem("session");
    const config = await OdooConfig();
    const client = new Odoo({
        host: '192.168.0.182',
        port: '8069',
        database: 'pruebasmovilgo7enero',
        username: '8230mario',
        password: '8230'
    })
    const params = {
        model: "movilgo.webservice",
        method: "pagoPSE",
        args: args,
        kwargs: {}
    }
    client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
        if (err) {
           
            callback(err, false);
            return false;
        }
        callback(response, true);
    });
}

export const getReport = async (date,callback) => {
    let args=[]
    if(date===null){
        args=[0]
    }else{
        args = [0,date]
    }
    
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "obtenerResumenCaja",
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
                    console.log("Error", err);
                    return false;
                }
                callback(response);

            });
        }
    })
    
    


}
