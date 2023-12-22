import AsyncStorage from '@react-native-community/async-storage';
export const OdooConfig = async () => {
  const config = {
    //pruebas
    host: (await AsyncStorage.getItem('host')) ?? 'pruebasmovilgo.movilgo.com.co',
    port: (await AsyncStorage.getItem('port')) ?? '8069',
    database: (await AsyncStorage.getItem('database')) ?? 'pruebasmovilgo',  //Recordar cambiar la url en rifa.js, puerto 8098

    //maquina de don ads
    /* host: (await AsyncStorage.getItem('host')) ?? '192.168.1.57',
    port: (await AsyncStorage.getItem('port')) ?? '8069',
    database: (await AsyncStorage.getItem('database')) ?? 'movilgosss', */

    //produccion
    /* host: (await AsyncStorage.getItem('host')) ?? '23.239.29.133',
    port: (await AsyncStorage.getItem('port')) ?? '8069',
    database: (await AsyncStorage.getItem('database')) ?? 'movilgo', */  //Recordar cambiar la url en rifa.js https://movilgo.com.co/...
  };
  console.log("Configuración de Odoo:", config);
  return config; 
  
};
//Pruebas
export const Url_pago = 'http://45.79.43.96:8098/'

//produccion
/* export const Url_pago = 'https://movilgo.com.co/' */

export const version = '1.9';
 