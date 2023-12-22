export const SOAT_SCHEMA = "Soat";
//export default class Paquete extends Realm.Object { }
export default Soat = {
    name: SOAT_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        active:{type:'bool'},
        categ_id_name:{ type: 'string', default: '' },
        name:{ type: 'string', indexed: true },
        tipo: { type: 'string', default:'' }      
    }
}