import Realm from 'realm';

export const BINGO_SCHEMA = "Bingos";

//models
//export default class Recarga extends Realm.Object { }
export default Bingo = {
    name: BINGO_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        image: { type: 'string', default: '' },
        precio: { type: 'float' },
        active: { type: 'bool'}
    }
};
