import Realm from 'realm';

export const PRESTAMOS_SCHEMA = 'Prestamos';
//export default class Paquete extends Realm.Object { }
export default Prestamos = {
  name: PRESTAMOS_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    active: {type: 'bool'},
    categ_id_name: {type: 'string', default: ''},
    name: {type: 'string', indexed: true},
    tipo: {type: 'string', default: ''},
  },
};
