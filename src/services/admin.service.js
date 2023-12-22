import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
import Odoo from 'react-native-odoo';

export const GetAplicarpagos = async (date,call) => {
    const session = await AsyncStorage.getItem("session");
    let factura_pago_write_date = null

    if(date){
        factura_pago_write_date=date
    }
    const client = new Odoo(JSON.parse(session));
    let finish = false;
    //const fechajeje="2023-03-24 15:02:00"
    const args = [0,{write_date: factura_pago_write_date}]
    //const args = [0,{write_date:null}]
    const params = {
        model: "movilgo.webservice",
        method: "pagosSinAplicar",
        args: args,
        kwargs: {}
    }
    console.log("args de salida pagosSinAplicar",args)
    client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                   
            return call(false,err);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
            finish = true;
            if (err) {
                if(err?.data?.arguments[0]=="Session expired"){
                    GetAplicarpagos(call)
                }else{
                    return call(false, err);
                }
                
                
               
            }else if (response) {
                if (response.errores && response.errores.id) {
                    const err = {
                        table: "Errors",
                        product: {
                            id: response.errores.id
                        }
                    }
                    getElementByIdDataBase(err).then(results => {
                        if (results) {
                            
                            call(false, response);
                            return false;
                            //Alert.alert(Error, results.comment);
                        } else {
                            Alert.alert(Error, "Movilgo no ha parametrizado el error, Comunicate con nosotros");
                        }

                    }).catch(error => console.log(error));
                    call(false, response);
                    return false;
                }
                call(true, response);
                return true;
            }

            return false;
        });
        }
    })

    
}
export const GetUsuarios = async (call) => {
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    let finish = false;
    const args = [0]
    
    const params = {
        model: "movilgo.webservice",
        method: "retornarUsuario",
        args: args,
        kwargs: {}
    }
    console.log("salida de  GetAplicarpagos ",args)
    client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                   
            return call(false,err);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
            
                finish = true;
                if (err) {
                    
                    call(false, err);
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
                                
                                call(false, response);
                                return false;
                                //Alert.alert(Error, results.comment);
                            } else {
                                Alert.alert(Error, "Movilgo no ha parametrizado el error, Comunicate con nosotros");
                            }

                        }).catch(error => console.log(error));
                        call(false, response);
                        return false;
                    }
                    call(true, response);
                    return true;
                }

                return false;
            });
        }
    })
    
}

export const GetMembers = async (callback) => {
    const args = [0]
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "retornarHijos",
        args: args,
        kwargs: {}
    }
    client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                   
            return callback(false,err);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
                
                if (err) {
                    callback(false,err );
                
                    return false;
                }
                callback(true,response );
            });
        }
    })
    
}
export const getOdooGastos = async (id,callback) => {
    const args = [0,id]
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "listarProductos",
        args: args,
        kwargs: {}
    }
    console.log("args de aplicar pago",args)
    client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                   
            return callback(false,err);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
                console.log("err",err)
                console.log("response",response)
                if (err) {
                    callback(false,err );
                
                    return false;
                }
                callback(true,response );
        })
        }
    })
    ;
}

export const applyPayment = async (data,estado ,callback) => {
    const args = [
        0, data
    ]
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse());
    const params = {
        model: "movilgo.webservice",
        method: "aplicarPago",
        args: args,
        kwargs: {}
    }
    console.log("args de aplicar pago",args)
    client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                   
            return callback(false,err);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
                if (err) {
                    callback(err, false,estado);
                
                    return false;
                }
                callback(response, true,estado);
            });
        }
    })
    
}

export const registUser = async (data,  callback) => {

    const args = [ 0,[data]]

    console.log("informacion del cliente",args,callback)
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "registroCliente",
        args: args,
        kwargs: {}
    }
    client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                   
            return callback(false,err);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {

            if (err) {
                
                return callback(false,err);
            }
            return callback(true,response);
        }); 
        }
    })
      
}
export const GetClient = async (userid,  callback) => {

    const args = [ 0,{id:userid}]

    console.log("informacion del cliente",args,callback)
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "obtenerDatosCliente",
        args: args,
        kwargs: {}
    }
    client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                   
            return callback(false,err);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {

                console.log("response",response)
                console.log("err",err)
                if (err) {
                    callback(false,err);
                    //return false;
                }
                return callback(true,response);
            });
        }
    })
       
}
export const GetTarifa = async (callback) => {

    const args = [ 0]

    console.log("informacion del GetTarifa",args,callback)
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "retornarListaTarifas",
        args: args,
        kwargs: {}
    }
    client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                   
            return callback(false,err);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {

                console.log("response retornarListaTarifas",response)
                console.log("err retornarListaTarifas",err)
                if (err) {
                    callback(false,err);
                    //return false;
                }
                return callback(true,response);
            }); 
        }
    })
      
}
export const updateClient = async (id,data, callback) => {
    const args = [
        0, {id:id ,informacion:data }
    ]
    console.log("informacion del cliente",args,callback)
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "actualizarInformacion",
        args: args,
        kwargs: {}
    }
    client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                   
            return callback(false);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {

                console.log("response",response)
                console.log("err",err)
                if (err) {
                    callback(false);
                    return false;
                }
                return callback(true);
            });
        }
    })
    
}
export const updatePassword = async (id,password, callback) => {
    const args = [
        0, {id:id,password: password}
    ]
    console.log("args",args)
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    const params = {
        model: "movilgo.webservice",
        method: "cambiarContrasena",
        args: args,
        kwargs: {}
    }
    client.connect((err, response) => {

        if(err){
            console.log("El Error 1 es: ", JSON.stringify(err));  
                   
            return callback(false,err);            
        }else{
            client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
                if (err) {
                    callback(false,err);
                    //console.log("Error", err);
                    return false;
                }
                callback(true,response);
            });
        }
    })
    
}