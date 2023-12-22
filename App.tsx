
import React from 'react';
import { ScreenLogin } from './src/screens/login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ScreenHome } from './src/screens/home';
import { ScreenRecarga } from './src/screens/recarga';
import { ScreenPaquete } from './src/screens/paquetes';
import { ScreenRifas } from './src/screens/rifas/list-rifas';
import { ScreenRifa } from './src/screens/rifas/rifa';
import { ScreenBox } from './src/screens/box/box';
import { ScreenBoxDate } from './src/screens/boxdate/box';
/* import withSubscription from './src/screens/bluetooth/bluetooth-printer'; */
import { ScreenConfig } from './src/screens/config';
import { ScreenPaymentRifa } from './src/screens/rifas/payment-rifa';
import { ScreenCollector } from './src/screens/collector/collector';
import { ScreenSoat } from './src/screens/soat/soat';
import { ScreenSoatCompar } from './src/screens/soat/comprar/compra';
import { ScreenSoatBuscar } from './src/screens/soat/buscar/busca';
import { ScreenIPTV } from './src/screens/iptv';
import { ScreenPines } from './src/screens/pines';
import { ScreenRecargaSport } from './src/screens/recargaSport';
import { GanaBingo } from './src/screens/gana-bingo/gana-bingo';
import {ScreenPrestamos} from './src/screens/prestamos/prestamos'
import {ScreenPrestamosBuscar} from './src/screens/prestamos/components/busca'
import {ScreenCertification}from './src/screens/certification/certification'
import { ScreenUserAPlicarPago } from './src/screens/admin/aplicarpago';
import { ScreenPaySupplier } from './src/screens/movilgo/cargabolsaproveedores';
import { ScreenUserPonerSacar } from './src/screens/movilgo/ponerDinero';
import { ScreenRegister } from './src/screens/admin/register';
import { ScreenUserGasto } from './src/screens/movilgo/gastos';
//declare var global: {HermesInternal: null | {}};
import { ScreenUserAdmin } from './src/screens/admin/usersadmin';
const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={ScreenLogin} options={{headerShown: false}}/>
        <Stack.Screen name="UserAdmin" component={ScreenUserAdmin} options={{headerShown: false}}/>
        <Stack.Screen name="RegisterAdmin" component={ScreenRegister} options={{headerShown: false}}/>
        <Stack.Screen name="PagosProveedor" component={ScreenPaySupplier} options={{headerShown: false}}/>
        <Stack.Screen name="AplicarPago" component={ScreenUserAPlicarPago} options={{headerShown: false}}/>
        <Stack.Screen name="PonerDinero" component={ScreenUserPonerSacar} options={{headerShown: false}}/>
        <Stack.Screen name="Gasto" component={ScreenUserGasto} options={{headerShown:false}} />
        <Stack.Screen name="Home" component={ScreenHome} options={{headerShown: false}}/>
        <Stack.Screen name="Recargas" component={ScreenRecarga} options={{headerShown:false}}/>
        <Stack.Screen name="Paquetes" component={ScreenPaquete} options={{headerShown:false}}/>
        <Stack.Screen name="Rifas" component={ScreenRifas} options={{headerShown:false}}/>
        <Stack.Screen name="Rifa" component={ScreenRifa} options={{headerShown:false}}/>
        <Stack.Screen name="Box" component={ScreenBox} options={{headerShown:false}}/>
        <Stack.Screen name="BoxDate" component={ScreenBoxDate} options={{headerShown:false}}/>
        {/* <Stack.Screen name="Printer" component={withSubscription} options={{headerShown:false}}/> */}
        <Stack.Screen name="Config" component={ScreenConfig} options={{headerShown:false}}/>
        <Stack.Screen name="PaymentRifa" component={ScreenPaymentRifa} options={{headerShown:false}}/>
        <Stack.Screen name="Collector" component={ScreenCollector} options={{headerShown:false}}/>
        <Stack.Screen name="Soat" component={ScreenSoat} options={{headerShown:false}}/>
        <Stack.Screen name="SoatBuscar" component={ScreenSoatBuscar} options={{headerShown:false}}/>
        <Stack.Screen name="SoatComprar" component={ScreenSoatCompar} options={{headerShown:false}}/>
        <Stack.Screen name="Prestamos" component={ScreenPrestamos} options={{headerShown:false}}/>
        <Stack.Screen name="PrestamosBuscar" component={ScreenPrestamosBuscar} options={{headerShown:false}} />
        <Stack.Screen name="Tv" component={ScreenIPTV} options={{headerShown:false}} />
        <Stack.Screen name="Pines" component={ScreenPines} options={{headerShown:false}} />
        <Stack.Screen name="RecargasDeportivas" component={ScreenRecargaSport} options={{headerShown:false}} />
        <Stack.Screen name="Certificate" component={ScreenCertification} options={{headerShown:false}} />
        
        <Stack.Screen name="GanaBingo" component={GanaBingo} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;