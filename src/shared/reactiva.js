//import PushNotification from "react-native-push-notification";
import { useEffect } from "react";
export const getDateOdoo=()=>{
    const d = new Date();
    let month=(d.getMonth()+1)
    let day=d.getDate()
    let horas=d.getHours()
    let min=d.getMinutes()
    let seg=d.getSeconds()
    if(month<10){
        month="0"+(d.getMonth()+1)
    }
    if(day<10){
        day="0"+d.getDate()
    }
    if(horas<10){
        horas="0"+d.getHours()
    }
    if(min<10){
        min="0"+d.getMinutes()
    }
    if(seg<10){
        seg="0"+d.getSeconds()
    }
    let fecha= d.getFullYear()+"-"+month+"-"+day
    let hora =horas + ':' + min + ':' + seg;
    let date = fecha+" "+hora
    return date
}

/* export const generateNotification=(navigation,leng)=>{
    const createChannels=(navigation,leng)=>{
        PushNotification.createChannel({
            channelId:"aplicarpago",
            channelName:" test chanel"
        })
        loadNotification(navigation,leng)

     }
    const loadNotification=(navigation,leng)=>{
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
          testPush(leng)
     }
    const testPush=(items)=>{
        
        PushNotification.localNotification({
            channelId:"aplicarpago",
            color: "gray", // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            title: "Movilgo", // (optional)
            message: "Tienes facturas "+items +" pendientes", // (required)
            });
     }

    useEffect(()=>{
        createChannels(navigation,leng)
    },[]) 

} */