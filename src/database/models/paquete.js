import Realm from 'realm';

export const PAQUETE_SCHEMA = "Paquetes";
//export default class Paquete extends Realm.Object { }
export default Paquete = {
    name: PAQUETE_SCHEMA,
    primaryKey: 'id',
    properties: {
        active:{type:'bool'},
        categ_id_name:{ type: 'string', default: '' },
        id: 'int',
        image_medium:{ type: 'string', default:'' },
        name:{ type: 'string', indexed: true },
        operador: { type: 'string', indexed: true },
        precio: 'int',
        tipo: { type: 'string', default:'' },
        vigencia: { type: 'int' },
      
    }
}