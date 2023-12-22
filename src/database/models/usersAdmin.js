import Realm from 'realm';

export const USERS_SCHEMA = "UserAdmin";

export default UserAdmin = {
    name: USERS_SCHEMA,
    primaryKey: 'partner_id',
    properties: {
        partner_id: 'int',
        nombre:{ type: 'string', indexed: true },
        saldo:'int'
    }
};
