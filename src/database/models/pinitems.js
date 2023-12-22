import Realm from 'realm';

export const PINITEMS_SCHEMA = "PinesItems";

//models
//export default class Pin extends Realm.Object { }
export default PinItems = {
    name: PINITEMS_SCHEMA,
    primaryKey: 'id',
    properties: {
        active:{type:'bool'},
        categ_id_name:{ type: 'string', default: '' },
        id: 'int',
        image_medium: { type: 'string', default: '' },
        name: { type: 'string', indexed: true },
        operador: { type: 'string'},
        precio: 'int',
        tipo: { type: 'string', default:'' },
        vigencia: { type: 'int' },
   
    }
};
