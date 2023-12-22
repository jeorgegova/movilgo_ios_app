import Realm from 'realm';

export const RECARGA_SCHEMA = "Recargas";

//models
//export default class Recarga extends Realm.Object { }
export default Recarga = {
    name: RECARGA_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        operador: { type: 'string', indexed: true },
        name: { type: 'string', indexed: true },
        image_medium: { type: 'string', default: '' }
    }
};

