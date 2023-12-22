export const ERROS_SCHEMA = "Errors";
//export default class Paquete extends Realm.Object { }
export default Errors = {
    name: ERROS_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        comment: { type: 'string', indexed: true }
    }
}