import Realm from 'realm';
import Recarga, { RECARGA_SCHEMA } from './models/recarga';
import Paquete from './models/paquete';
import Errors from './models/error';
import Rifa from './models/rifa';
import Pin,{PIN_SCHEMA} from './models/pin';
import PinItems from './models/pinitems'
import RecargasSport from './models/recargaSport';
import Bingo from './models/bingo';
import Soat from './models/soat';
import UserAdmin from './models/usersAdmin';
import Certificado from './models/certificado'
import Prestamos from './models/prestamos';
import AsyncStorage from '@react-native-community/async-storage';
import { OdooDateToReact } from '../shared/utilities/formats';

//models

const databaseOptions = {
    path: "movilgoApp.realm",
    schema: [Recarga, Paquete, Rifa,UserAdmin,Errors, Pin, PinItems,RecargasSport,Certificado,Bingo, Soat, Prestamos],
    schemaVersion: 0
}

//functions
export const insertDataBase = (newProduct) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(newProduct.table, newProduct.product);
            resolve(newProduct);
        });
    }).catch((error) => reject(error))
});

export const deleteAllDatabase = () => new Promise((resolve, reject) => {
    console.log("resolve",resolve)
    console.log("reject",reject)
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.deleteAll();
        })
    })
})

export const deleteDataBase = table => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deleteObject = realm.objects(table);
            realm.delete(deleteObject);
            resolve();
        });
    }).catch((error) => reject(error))
});

export const deleteObjectDataBase = product => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deleteObject = realm.objectForPrimaryKey(product.table, product.product.id);
            realm.delete(deleteObject);
            resolve();
        });
    }).catch((error) => reject(error))
});

export const allDataBase = (table) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        //console.log("realm de pines",realm)
        let allObjects = realm.objects(table);
        resolve(allObjects);
    }).catch((error) => reject(error))
        
});

export const getElementByIdDataBase = (product) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allObjects = realm.objectForPrimaryKey(product.table, product.product.id);
        resolve(allObjects);
    }).catch((error) => reject(error))
});


export const getElementByOperator = (operators,SCHEMA) => new Promise((resolve, reject) => {
    console.log('operador',operators)
    Realm.open(databaseOptions).then(realm => {
        let objects = realm.objects(SCHEMA);
        let results = [];
        operators.forEach(element => {
            let object = objects.filtered('operador = "' + element + '"');
            results.push(object["0"]);
        });
        
        resolve(results);
    }).catch((error) => reject(error))
});

export const updateDataBase = product => new Promise((resolve, reject) => {
    
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let updateObject = realm.objectForPrimaryKey(product.table, product.product.id);
            realm.delete(updateObject);
            realm.create(product.table, product.product);
        });
        resolve();
    }).catch((error) => reject(error))
});

export const realm = new Realm(databaseOptions);


/**
 * Inserta varios elementos en la base de datos.
 * @param insertions Un arreglo con todas las inserciones.
 * @param nameWriteDate El nombre del registro del write_date
 * @tutorial insertions = {"table_name":[<model>]}
 * @returns el id del objeto insertado.
 * 
*/

export const insertProductsToDB = (insertions, nameWriteDate = null, primaryKeyName = "id") => new Promise((resolve, reject) => {
    //console.log("insertProductsToDB",insertions)
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            const keys = Object.keys(insertions);
            keys.forEach(table => {
                insertions[table].forEach(element => {
                    
                    const newInsertion = element;
                    
                    if (newInsertion['image_medium'] === false) {
                        newInsertion['image_medium'] = '';
                    }
                    
                    let foundObject = realm.objectForPrimaryKey(table, newInsertion[primaryKeyName]);
                    
                    
                    if (foundObject) {
                        for (const key in foundObject) {
                            
                            if (newInsertion[key] && key !== primaryKeyName) {
                                foundObject[key] = newInsertion[key];
                            }
                        }
                    } else {
                        
                        realm.create(table, newInsertion);
                    }
                    if (nameWriteDate) {
                        SaveWriteDate(nameWriteDate, newInsertion.write_date)
                    }
                });
            });
            resolve(true);
        });
    }).catch((error) => reject(error))
})

/**
 * Trae todos los registros de una tabla de la base de datos.
 * @param table Un string que contiene el nombre de la tabla.
 * @param clone El resultado sera una lista de clones de la base de datos.
 * @param filter Un filtro de busqueda basado en SQL.
 * @param sort Un string con el nombre del campo por el que se desea ordernar.
 * 
 * @returns Los registros de una tabla.
*/

export const getTableFromDB = (table, clone = null, filter = null, sort = null) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allObjects;
        if (filter) {
            allObjects = realm.objects(table).filtered(filter);
        } else {
            allObjects = realm.objects(table);
        }
        if (sort) {
            allObjects.sorted(sort);
        }
        
        
        if (clone) {
            const listResults = []
            allObjects.forEach(element => {
                let clone = {};
                for (const key in element) {
                    clone[key] = element[key];
                }
                listResults.push(clone)
            });
            
            resolve(listResults);
        } else {
            resolve(allObjects);
        }
    }).catch(err => {
        
    }); 
    
});

/**
 * Actualiza un write con respecto al ultimo.
 * @param writeDateName Un string que contiene el nombre del registro del write_date a actualizar.
 * @param newWriteDate El valor nuevo del write_date que se actualiza.
*/

const SaveWriteDate = async (writeDateName, newWriteDate) => {
    if (!newWriteDate) {
        await AsyncStorage.setItem(writeDateName, "2000-07-21 13:22:07");
        return;
    }
    const oldWriteDate = await AsyncStorage.getItem(writeDateName);
    const _writeDate = OdooDateToReact(oldWriteDate ?? "2000-07-21 13:22:07")
    const dateCompare = OdooDateToReact(newWriteDate ?? "2000-07-21 13:22:07");
    if (_writeDate) {
        if (_writeDate < dateCompare) {
            await AsyncStorage.setItem(writeDateName, newWriteDate)
        }
    } else {
        await AsyncStorage.setItem(writeDateName, newWriteDate)
    }
}