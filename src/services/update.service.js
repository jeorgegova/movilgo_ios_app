import AsyncStorage from "@react-native-community/async-storage";
import { Linking, Alert, ToastAndroid} from "react-native";
import { getElementByIdDataBase, deleteAllDatabase } from "../database/allSchemas";
import Odoo from 'react-native-odoo';
export const updateVersion = async (version) => {
    const session = await AsyncStorage.getItem("session");
    const client = new Odoo(JSON.parse(session));
    let finish = false;
    const args = [
        0, {}
    ]
    const params = {
        model: "movilgo.webservice",
        method: "actualizarAplicacion",
        args: args,
        kwargs: {}
    }
    setTimeout(() => {
        if (finish) {
            return;
        }
        Alert.alert("Tiempo espera excedido, revise su conexión a internet y vuelva a intentarlo más tarde.");
        return;
    }, 30000)

    client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
        finish = true;
        if (err) {
            
            return false;
        }
        if (response) {
            if (response.errores && response.errores.id) {
                const err = {
                    table: "Errors",
                    product: {
                        id: response.errores.id
                    }
                }
                getElementByIdDataBase(err).then(results => {
                    if (results) {
                        Alert.alert(Error, results.comment);
                    } else {
                        Alert.alert(Error, "Movilgo no ha parametrizado el error, Comunicate con nosotros");
                    }

                }).catch(error => console.log(error));
                return false;
            }
            if (parseFloat(version) < parseFloat(response.version)) {
                if (response.apklocation) {
                    Alert.alert(
                        "Actualización",
                        "Existe una nueva versión de este software ¿desea actualizarlo ahora?",
                        [
                            {
                                text: "Cancelar",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            { text: "Actualizar", onPress: () => UpdateApp(response.apklocation) }
                        ],
                        { cancelable: false }
                    );
                    return false;
                }
            } else {
                ToastAndroid.showWithGravity(
                    "Usted ya posee la ultima versión",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
            }
            return true;
        }
        return false;
    });
}

const OpenURL = async (url) => {
   
    const supported = await Linking.canOpenURL(url);
 
    if (supported) {
        await Linking.openURL(url);
    } else {
        Alert.alert('La descarga no esta disponible');
    }
};

export const UpdateApp = (url)=>{
    ClearAppData();
    OpenURL(url);
}

const ClearAppData = async () =>{
    try {
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
        await deleteAllDatabase();
    } catch (error) {
        console.log('Error clearing app data.')
    }
}