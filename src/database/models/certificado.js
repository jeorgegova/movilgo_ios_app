export const CERTIFICADO_SCHEMA = "Certificado";
//export default class Paquete extends Realm.Object { }
export default Certificado = {
    name: CERTIFICADO_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: { type: 'string', indexed: true },
        image_medium: { type: 'string', default: '' },
        active: { type: 'bool'},
        tipo:{type:'string',default:''}
    }
}