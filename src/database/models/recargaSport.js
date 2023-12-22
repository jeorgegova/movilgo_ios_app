import Realm from 'realm';

export const RECARGASPORT_SCHEMA = "RecargasSport";

//models
//export default class Pin extends Realm.Object { }
export default RecargaSport = {
    name: RECARGASPORT_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: { type: 'string', indexed: true },
        image_medium: { type: 'string', default: '' }
    }
};