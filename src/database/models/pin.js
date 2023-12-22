import Realm from 'realm';

export const PIN_SCHEMA = "Pines";

//models
//export default class Pin extends Realm.Object { }
export default Pin = {
    name: PIN_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        operador: { type: 'string'},
        name: { type: 'string', indexed: true },
        image_medium: { type: 'string', default: '' }
   
    }
};
