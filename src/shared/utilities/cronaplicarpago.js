import { useEffect } from "react";
import _BackgroundTimer from "react-native-background-timer";
import { GetAplicarpagos } from "../../services/admin.service";
import AsyncStorage from '@react-native-community/async-storage';
import { getDateOdoo } from "../reactiva";
import { useNavigation } from '@react-navigation/native';
import PushNotification from "react-native-push-notification";
export const StartSync = async(navigation) => {
    console.log("ingreso al StartSync")
    
    setInterval(async() => { 
        const date =await AsyncStorage.getItem('factura_pago_write_date');
        GetAplicarpagos(date,async(flag,res)=>{
            console.log("bandera y response de GetAplicarpagos",flag,res.length)
            if(flag){
                await AsyncStorage.setItem('factura_pago_write_date', getDateOdoo());
                if(res.length>0){
                    console.log("navigation")
                    generateNotification(navigation,res.length)
                }

            }
            //call(flag,res)
        })
    }, 50000);
}


export const generateNotification=(navigation,leng)=>{
    PushNotification.createChannel({
        channelId:"aplicarpago",
        channelName:" test chanel"
    })
    PushNotification.configure({
        onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        notification.finish(navigation.navigate('AplicarPago'))
        },
        onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);
        }, onRegistrationError: function(err) {
        console.error(err.message, err);
        },
        permissions: {
        alert: true,
        badge: true,
        sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
    });
    PushNotification.localNotification({
        channelId:"aplicarpago",
        //color: '#07a2bab3', // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        title: "Movilgo", // (optional)
        message: "Tienes facturas "+leng +" pendientes", // (required)
    });
}

