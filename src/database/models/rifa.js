export const RIFA_SCHEMA = "Rifas";
//export default class Paquete extends Realm.Object { }
export default Rifa = {
    name: RIFA_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        fecha_sorteo: { type: 'string', indexed: true },
        name: { type: 'string' },
        reference: { type: 'string', default: '' },
        image_medium: { type: 'string', default: '' },
        precio: { type: 'float' },
        porcentaje_recaudo: { type: 'float' },
        numero_resolucion_rifa: { type: 'string' },
    }
}