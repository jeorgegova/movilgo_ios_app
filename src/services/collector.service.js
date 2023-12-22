import AsyncStorage from '@react-native-community/async-storage';
import Odoo from 'react-native-odoo';
import { getElementByIdDataBase } from '../database/allSchemas';
import { Alert, ToastAndroid } from 'react-native';
export const searchDebts = async (callback) => {
    const args = [
        0
    ]
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "listarDeudaRuta",
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

export const payDebt = async (amount, partner_id, call) => {
    console.log("paso por pagar deuad")
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const args = [
        0, { amount, partner_id }
    ]
    const params = {
        model: "movilgo.webservice",
        method: "pagarDeuda",
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
                    
                    call(false, response);
                    return false;
                }

                if (response) {
                    if (response.errores && response.errores.id) {
                        const err = {
                            table: "Errors",
                            product: {
                                id: response.errores.id
                            }
                        }
                        getElementByIdDataBase(err).then(results => {
                            if (results) {
                                Alert.alert(Error, results.comment);
                            } else {
                                Alert.alert(Error, "Movilgo no ha parametrizado el error, Comunicate con nosotros");
                            }

                        }).catch(error => console.log(error));
                        call(false, response);
                        return false;
                    }
                    ToastAndroid.showWithGravity(
                        "Transacción realizada.",
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                    );
                    
                    return call(true, response,amount);
                }
                return false;
            });
        }
    })
    
}

export const payCollector = async (data, call) => {
    console.log("paso por transferenciaCaja")
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const args = [
        0, data
    ]

    const params = {
        model: "movilgo.webservice",
        method: "transferenciaCaja",
        args: args,
        kwargs: {}
    }
   // console.log("args del colector",args)
   client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                
            return callback(err,false);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
                if (err) {
                    
                    call(false, err);
                    return false;
                }
                
                if (response) {
                    if (response.errores && response.errores.id) {
                        const err = {
                            table: "Errors",
                            product:{
                                id: response.errores.id
                            }
                        }
                        getElementByIdDataBase(err).then( results =>{
                            if(results){             
                                Alert.alert(Error, results.comment);
                            }else{
                                Alert.alert(Error, "Movilgo no ha parametrizado el error, Comunicate con nosotros");
                            }
                            
                        }).catch(error => console.log(error));
                        call(false, response);
                        return false;
                    }
                    /*
                    ToastAndroid.showWithGravity(
                        "Transacción realizada.",
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                    );*/
                    call(true, response);
                    return true;
                }
                return false;
            });
        }
    })
    
}

export const paySeller = async (data, call) => {
    console.log("paso subirPagoFactura",data.amount,data.descripcion)
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const args = [
        0, data
    ]

    const params = {
        model: "movilgo.webservice",
        method: "subirPagoFactura",
        args: args,
        kwargs: {}
    }
   // console.log("args del colector",args)
   client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                
            return call(false,err);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
                console.log("err",err)
                console.log("response",response)
                if (err) {
                    
                    call(false, err);
                    return false;
                }
                
                if (response) {
                    if (response.errores && response.errores.id) {
                        const err = {
                            table: "Errors",
                            product:{
                                id: response.errores.id
                            }
                        }
                        getElementByIdDataBase(err).then( results =>{
                            if(results){             
                                Alert.alert(Error, results.comment);
                            }else{
                                Alert.alert(Error, "Movilgo no ha parametrizado el error, Comunicate con nosotros");
                            }
                            
                        }).catch(error => console.log(error));
                        call(false, response);
                        return false;
                    }
                    /*
                    ToastAndroid.showWithGravity(
                        "Transacción realizada.",
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                    );*/
                    call(true, response);
                    return true;
                }
                return false;
            });
        }
    })
    
}