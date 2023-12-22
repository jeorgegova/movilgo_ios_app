import { Linking, Alert, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { FormatDateComplete, OdooDateToReact } from '../shared/utilities/formats';
import { OdooConfig, version } from '../shared/utilities/odoo-config';
import Odoo from 'react-native-odoo';
import { UpdateApp } from './update.service';
import { RECARGA_SCHEMA } from '../database/models/recarga';
import { PAQUETE_SCHEMA } from '../database/models/paquete';
import { RIFA_SCHEMA } from '../database/models/rifa';
import { BINGO_SCHEMA } from '../database/models/bingo';
import { ERROS_SCHEMA } from '../database/models/error';
import { PIN_SCHEMA } from '../database/models/pin'
import { getElementByIdDataBase, insertDataBase, insertProductsToDB, updateDataBase, deleteObjectDataBase, } from '../database/allSchemas';
import { SOAT_SCHEMA } from '../database/models/soat';
import { RECARGASPORT_SCHEMA } from '../database/models/recargaSport';
import { PRESTAMOS_SCHEMA } from '../database/models/prestamos';
import { CERTIFICADO_SCHEMA } from '../database/models/certificado'
import { PINITEMS_SCHEMA } from '../database/models/pinitems'
import { allDataBase, getElementByOperator } from '../database/allSchemas';
import { USERS_SCHEMA } from '../database/models/usersAdmin';
const _storeData = async (key, session) => {
  try {
    await AsyncStorage.setItem(key, session); //guarda la sesion
  } catch (error) {
    Alert.alert('Error', 'Error al almacenar datos de sesión.');
  }
};

const _getDates = async () => {
  try {
    product_write_date = await AsyncStorage.getItem('product_write_date');
    error_write_date = await AsyncStorage.getItem('error_write_date');
    documento_write_date = await AsyncStorage.getItem('documento_write_date');
    return [
      product_write_date ? product_write_date : null,
      error_write_date ? error_write_date : null,
      documento_write_date ? documento_write_date : null,
    ];
  } catch (error) {
    Alert.alert('Error', 'Error al obtener fechas');
  }
};

const _storeDates = async () => {
  try {
    const write_date = FormatDateComplete(null);
    documento_write_date = await AsyncStorage.setItem(
      'documento_write_date',
      write_date,
    );
  } catch (error) {
    Alert.alert('Error', 'Error al almacenar fechas');
  }
};

/**
 * Consume los servicios de autenticación de odoo mediante xmlrpc.
 * @param user Un objeto con las credenciales del usuario.
 * @param user.username Un string con el nombre de usuario.
 * @param user.password Un string con el la contraseña del usuario.
 * @param callback Un metodo que se ejecutara al finalizar el metodo de autenticación.
 *
 */

//AuthService
export const AuthService = async (user, callBack) => {
  return new Promise(async (resolve, reject) => {
    try {
      const config = await OdooConfig();
      const client = new Odoo({
        host: config.host,
        port: config.port,
        database: config.database,
        username: user.username,
        password: user.password,
      });

      client.connect(async (err, response) => {
        if (err) {
          if (err.data && err.data.arguments[0] === 'The user needs to be logged-in to initialize his context') {
            // Intentar reautenticación en caso de sesión expirada
            resolve(await AuthService(user, callBack));
            return;
          }

          // Manejar otros errores de conexión
          Alert.alert('Error', 'No se pudo conectar al servidor Odoo');
          callBack(false, 0);
          reject(err);
          return;
        }

        // Verificar la autenticación (puedes personalizar esto según tus necesidades)
        if (response && response.uid) {
          // Autenticación exitosa
          const ids = { uid: response.uid, partner_id: response.partner_id };
          await InitializeData(client, ids, callBack);
          resolve(response);
        } else {
          Alert.alert('Error', 'Usuario y/o contraseña incorrectos');
          callBack(false, 0);
          reject(new Error('Error de autenticación'));
        }
      });
    } catch (error) {
      // Manejar errores inesperados
      Alert.alert('Error', 'Ocurrió un error inesperado');
      callBack(false, 0);
      reject(error);
    }
  });
};

//InitializeData
//_---------------------------------------------------------------------------
export const InitializeData = async (client, ids, call) => {

  const dates = await _getDates();
  console.log("_getDates------", dates)

  let finish = false;

  const args = [
    0,
    {
      version: version,
      product_write_date: dates[0],
      error_write_date: dates[1],
      documento_write_date: dates[2],
    },
  ];

  const params = {
    model: "movilgo.webservice",
        method: "listarProductos",
    args: args,
    kwargs: {},
  };

  setTimeout(() => {
    if (finish) {
      return;
    }
    Alert.alert('Tiempo limite excedido, intentelo más tarde');
    call(false, 0);
    return;
  }, 30000);
  console.log("client del pedir datos movilgo_react", client)
  return client.rpc_call('/web/dataset/call_kw', params, async (err, response) => {
    console.log("errod el pedir datos", err)
    console.log("response del pedir datos", response)
    finish = true;
    if (err) {
      call(false, 0);
      return false;
    }

    if (response.apklocation) {
      Alert.alert(
        'Actualización',
        'Existe una nueva versión del software, desea actualizarlo ahora',
        [
          {
            text: 'Cancelar',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Actualizar',
            onPress: () => UpdateApp(response.apklocation),
          },
        ],
        { cancelable: false },
      );
      call(false, 0);
      return false;
    }
    console.log("respond  de pedir datos ", response.aplicadatosmoviles)
    console.log("respond  linkPayu", response.aplicagenerarlink)
    await AsyncStorage.setItem("aplicadatosmoviles", JSON.stringify(response.aplicadatosmoviles));
    await AsyncStorage.setItem("linkPayu", JSON.stringify(response.aplicagenerarlink));
    if (response.productos) {
      await SaveProducts(response.productos, call);
    }
    if (response.productosnovender) {
      await UPdateProductos(response.productosnovender, call);
    }
    if (response.errores) {
      await SaveErrors(response.errores);
    }


    if (response.permiso) {
      //console.log("response.permiso",response.permiso)
      _storeData('Permission', '' + response.permiso);
    }
    console.log("session", client)
    await _storeData('session', JSON.stringify(client));
    ToastAndroid.show('¡Bienvenido!', ToastAndroid.SHORT);
    await _storeData('session_ids', JSON.stringify(ids));
    await _storeDates();
    call(true, response.balanceFinal);
    return true;
  },
  );
};

//-----------------------------------------------------------------------
const UPdateProductos = (data) => {
  const update = {};
  //console.log("productos no vender",data)

  data.forEach((element) => {
    if (element.categ_id_name === 'Recargas') {
      if (!update[[RECARGA_SCHEMA]]) {
        update[[RECARGA_SCHEMA]] = [];
      }

      update[[RECARGA_SCHEMA]].push(element);

    } else if (element.categ_id_name === 'Todo incluido' ||
      element.categ_id_name === 'Voz' ||
      element.categ_id_name === 'Datos' ||
      element.categ_id_name === 'Voz y Datos' ||
      element.categ_id_name === 'TV' ||
      element.categ_id_name === 'Aplicaciones') {
      if (!update[[PAQUETE_SCHEMA]]) {
        update[[PAQUETE_SCHEMA]] = [];
      }

      //console.log("element de paquetes",element)
      update[[PAQUETE_SCHEMA]].push(element);


    } else if (element.categ_id_name === 'Recargas deportivas') {
      if (!update[[RECARGASPORT_SCHEMA]]) {
        update[[RECARGASPORT_SCHEMA]] = [];
      }
      update[[RECARGASPORT_SCHEMA]].push(element);

    } else if (element.categ_id_name === 'Pines') {
      if (!update[[PIN_SCHEMA]]) {
        update[[PIN_SCHEMA]] = [];
      }
      update[[PIN_SCHEMA]].push(element);

    } else if (element.categ_id_name == 'Free Fire' || element.categ_id_name === 'Xbox Plata' ||
      element.categ_id_name === 'Xbox Suscripciones' ||
      element.categ_id_name === 'Netflix' ||
      element.categ_id_name === 'Play Station' ||
      element.categ_id_name === 'Play Station Suscripciones' ||
      element.categ_id_name === 'Xbox Suscripciones') {

      if (!update[[PINITEMS_SCHEMA]]) {
        update[[PINITEMS_SCHEMA]] = [];
      }

      //console.log("element de PINITEMS_SCHEMA",element)
      update[[PINITEMS_SCHEMA]].push(element);


    }
  })
  //console.log("deleteProduct de Recargas",update.Recargas)
  //console.log("deleteProduct de Pines",update.Pines)
  //console.log("deleteProduct de PinesItems",update.PinesItems)
  deleteProduct(update);
}

const SaveProducts = async (data) => {
  //console.log("CONTENIDO",data)
  const products = {};
  if (!data) {
    Alert.alert(
      'Error al obtener datos',
      'No se encontraron datos en el servidor, por favor intentelo otra vez, si el problema persiste comuniquese con su empresa.',
    );
    return false;
  }
  data.forEach((element) => {

    if (element.categ_id_name === 'Recargas') {
      //console.log("RECARGAS ID",element)
      if (!products[[RECARGA_SCHEMA]]) {
        products[[RECARGA_SCHEMA]] = [];
      }
      products[[RECARGA_SCHEMA]].push(element);
    }

    else if (
      element.categ_id_name === 'Todo incluido' ||
      element.categ_id_name === 'Voz' ||
      element.categ_id_name === 'Datos' ||
      element.categ_id_name === 'Voz y Datos' ||
      element.categ_id_name === 'TV' ||
      element.categ_id_name === 'Aplicaciones'
    ) {
      if (!products[[PAQUETE_SCHEMA]]) {
        products[[PAQUETE_SCHEMA]] = [];
      }
      products[[PAQUETE_SCHEMA]].push(element);
    }

    else if (element.categ_id_name === 'Rifas' && element.numero_resolucion_rifa != false) {
      if (!products[[RIFA_SCHEMA]]) {
        products[[RIFA_SCHEMA]] = [];
      }
      products[[RIFA_SCHEMA]].push(element);
    }
    else if (element.categ_id_name === 'Rifas' && element.numero_resolucion_rifa == false) {
      console.log("este es el producto quemado", element.id)
    }

    else if (element.categ_id_name === 'Bingo') {
      if (!products[[BINGO_SCHEMA]]) {
        products[[BINGO_SCHEMA]] = [];
      }
      products[[BINGO_SCHEMA]].push(element);
    }

    else if (element.categ_id_name === 'Soat') {
      if (!products[[SOAT_SCHEMA]]) {
        products[[SOAT_SCHEMA]] = [];
      }
      products[[SOAT_SCHEMA]].push(element);
    }

    else if (element.categ_id_name === 'Recargas deportivas' ||
      element.categ_id_name === 'Rushbet') {
      if (!products[[RECARGASPORT_SCHEMA]]) {
        products[[RECARGASPORT_SCHEMA]] = [];
      }

      products[[RECARGASPORT_SCHEMA]].push(element);
    }

    else if (element.name === 'Carga Bolsa') {
      _storeData('CargaBolsa', '' + element.id);
    } else if (element.categ_id_name === 'Mitecnova') {
      if (!products[[PRESTAMOS_SCHEMA]]) {
        products[[PRESTAMOS_SCHEMA]] = [];
      }
      products[[PRESTAMOS_SCHEMA]].push(element);
    }
    else if (element.categ_id_name == 'Free Fire' ||
      element.categ_id_name === 'Xbox Plata' ||
      element.categ_id_name === 'Xbox Suscripciones' ||
      element.categ_id_name === 'Netflix' ||
      element.categ_id_name === 'Play Station' ||
      element.categ_id_name === 'Play Station Suscripciones' ||
      element.categ_id_name === 'Xbox Suscripciones') {
      //console.log("cagada de eliana",element.id,element.categ_id_name,"operador = "+element.operador)
      if (!products[[PINITEMS_SCHEMA]]) {
        products[[PINITEMS_SCHEMA]] = [];
      }
      products[[PINITEMS_SCHEMA]].push(element);
    }
    else if (element.categ_id_name === 'Pines') {
      //console.log("cagada de eliana",element.name)
      if (!products[[PIN_SCHEMA]]) {
        products[[PIN_SCHEMA]] = [];
      }
      products[[PIN_SCHEMA]].push(element);
    } else if (element.categ_id_name === 'Certificados') {
      if (!products[[CERTIFICADO_SCHEMA]]) {
        products[[CERTIFICADO_SCHEMA]] = [];
      }
      products[[CERTIFICADO_SCHEMA]].push(element)
    }




  });

  //console.log("element de products.Pines",products.Recargas)
  await insertProductsToDB(products, 'product_write_date')
    .then((response) => {
      //console.log("response del sabe produc",response)
    })
    .catch((err) => {
      console.log("err de sabe product", err)
      //Alert.alert('Error', 'No se obtuvieron datos del servidor');
    });


  return true;
};

//deleteProduct
const deleteProduct = async (update) => {
  const opedador = []
  const pines = []

  //console.log("update.Pines.length",update.Pines)

  if ((update.Recargas && update.Recargas.length > 0) ||
    (update.Paquetes && update.Paquetes.length > 0) ||
    (update.RecargasSport && update.RecargasSport.length > 0) ||
    (update.Pines && update.Pines.length > 0) ||
    (update.PinesItems && update.PinesItems.length > 0)) {

    await update.Pines.forEach((element) => {
      // este update tiene como proposito eliminar primero todos los paquetes o itemspines que esten 
      //asociados a los pines
      opedador.push(element.operador)
      for (let k = 0; k < opedador.length; k++) {
        allDataBase('PinesItems').then((results) => {
          results.forEach(element => {
            if (opedador[k] === element.operador) {
              //console.log('opedador[k]===element.operador',opedador[k],element.operador) 
              pines.push(element);
            }

          })
          pines.forEach((element) => {
            //console.log("pines",element) 
            const user = {
              table: 'PinesItems',
              product: {
                id: element.id,
              },
            };

            deleteObjectDataBase(user)
              .then()
              .catch((error) => {
                //console.log('no se elimino nada Pines', error);
              });
          })
        }).catch((err) => { /* console.log("Pines", err) */ });

      }

    });




    await update.Pines.forEach((element) => {
      //console.log("pines por each",element.operador,element.tipo)
      //itemsPines.push(element.operador)
      const user = {
        table: 'Pines',
        product: {
          id: element.id,
        },
      };

      deleteObjectDataBase(user)
        .then()
        .catch((error) => {
          //console.log('no se elimino nada Pines', error);
        });
    });
    await update.PinesItems.forEach((element) => {

      const user = {
        table: 'PinesItems',
        product: {
          id: element.id,
        },
      };

      deleteObjectDataBase(user)
        .then()
        .catch((error) => {
          //console.log('no se elimino nada PinesItems', error);
        });
    });
    await update.Recargas.forEach((element) => {
      const user = {
        table: 'Recargas',
        product: {
          id: element.id,
        },
      };

      deleteObjectDataBase(user)
        .then()
        .catch((error) => {
          //console.log('no se elimino nada Recargas', error);
        });
    });
    await update.RecargasSport.forEach((element) => {
      const user = {
        table: 'RecargasSport',
        product: {
          id: element.id,
        },
      };

      deleteObjectDataBase(user)
        .then()
        .catch((error) => {
          //console.log('no se elimino el paquete', error)
        });
    });

    await update.Paquetes.forEach((element) => {
      const user = {
        table: 'Paquetes',
        product: {
          id: element.id,
        },
      };

      deleteObjectDataBase(user)
        .then()
        .catch((error) => {
          //console.log('no se elimino el paquete', error)
        });
    });


  }
  return true;
};


//SaveErrors
const SaveErrors = async (errors) => {
  let dateNow = new Date(2001, 1, 2);
  let finallyDate = '2000-07-21 13:24:12';
  errors.forEach((element) => {
    const dateCompare = OdooDateToReact(
      element.write_date ?? '2000-07-21 13:22:07',
    );
    if (dateCompare > dateNow) {
      dateNow = dateCompare;
      finallyDate = element.write_date;
    }

    SaveError(element);
  });
  await AsyncStorage.setItem('error_write_date', finallyDate);
};

//SaveError
const SaveError = (error) => {
  let newError = {
    table: 'Errors',
    product: {
      id: error.id,
      comment: error.descripcion,
    },
  };
  getElementByIdDataBase(newError).then((product) => {
    if (product) {
      updateDataBase(newError)
        .then()
        .catch((error) => {
          console.log('Error -> error al actualizar', error);
        });
    } else {
      insertDataBase(newError)
        .then()
        .catch((error) => {
          console.log('Error -> error al guardar', error);
        });
    }
  });
};
