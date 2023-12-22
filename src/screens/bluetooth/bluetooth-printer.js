import React from 'react';
import { StyleSheet, View, Text, Alert, Switch, ToastAndroid } from 'react-native';
import { Button } from 'react-native-elements';
import { Header } from '../../components/UI/header';
import AsyncStorage from '@react-native-community/async-storage';
import BluetoothSerial, { withSubscription } from "react-native-bluetooth-serial-next";
import {SafeAreaView} from 'react-native-safe-area-context';
import DeviceList from "./components/DeviceList";
const texto_prefactura = "         .:MOVILGO:.         \r\nBuenas e inteligentes ideas \r\nNIT: 901.330.856-1 \r\nCarrera 23#62-39(AV.Santander)\r\nED.Capitalia OF. 404B \r\nTelefono: 316 819 4210 \r\n"

class ScreenPrinter extends React.Component {
  constructor() {
    super();
    this.events = null;
    this.state = {
      paired: [],
      loading: false,

      isEnabled: false,
      device: BluetoothSerial,
      devices: [],
      scanning: false,
      processing: false,
      timer: 10
    };
  }

  async componentDidMount() {
    this.events = this.props.events;

    try {
      const [isEnabled, devices] = await Promise.all([
        BluetoothSerial.isEnabled(),
        BluetoothSerial.list()
      ]);

      this.setState({
        isEnabled,
        devices: devices.map(device => ({
          ...device,
          paired: true,
          connected: false
        }))
      });
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
    this.events.on("bluetoothEnabled", () => {
      ToastAndroid.show("Bluetooth Prendido", ToastAndroid.SHORT);
      this.setState({ isEnabled: true });
    });

    this.events.on("bluetoothDisabled", () => {
      ToastAndroid.show("Bluetooth Apagado", ToastAndroid.SHORT);
      this.setState({ isEnabled: false });
    });

    this.events.on("connectionSuccess", ({ device }) => {
      if (device) {
        ToastAndroid.show(`Dispositivo ${device.name}<${device.id}> se a conectado`, ToastAndroid.SHORT);
      }
    });

    this.events.on("connectionFailed", ({ device }) => {
      if (device) {
        ToastAndroid.show(`Falla la conexion con el dispositivo ${device.name}<${device.id}>`, ToastAndroid.SHORT);
      }
    });

    this.events.on("connectionLost", ({ device }) => {
      if (device) {
        ToastAndroid.show(`Device ${device.name}<${device.id}> conneccion perdida`, ToastAndroid.SHORT);
      }
    });

    this.events.on("data", result => {
      if (result) {
        const { id, data } = result;
        console.log(`Data from device ${id} : ${data}`);
      }
    });

    this.events.on("error", e => {
      if (e) {
        console.log(`Error: ${e.message}`);
        ToastAndroid.show(e.message, ToastAndroid.SHORT);
      }
    });
  }

  enableBluetooth = () => {
    this.setState({ paired: [] });
  }

  discoverUnpairedDevices = async () => {
    this.setState({ scanning: true });
    ToastAndroid.show("Buscando...", ToastAndroid.SHORT);
    try {
      const unpairedDevices = await BluetoothSerial.listUnpaired();
      this.setState(({ devices }) => ({
        scanning: false,
        devices: devices.map(device => {
          const found = unpairedDevices.find(d => d.id === device.id);
          if (found) {
            return {
              ...device,
              ...found,
              connected: false,
              paired: false
            };
          }
          return device.paired || device.connected ? device : null;
        })
          .map(v => v)
      }));
      let x = setInterval(() => {
        console.log(this.state.timer);
        this.setState({ timer: this.state.timer - 1 });
        if (this.state.timer < 0) {
          clearInterval(x);
          this.cancelDiscovery();
          ToastAndroid.show("Terminado", ToastAndroid.SHORT);
        }
      }, 1000);
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
      this.setState(({ devices }) => ({
        scanning: false,
        devices: devices.filter(device => device.paired || device.connected)
      }));
    }
  };

  cancelDiscovery = () => async () => {
    try {
      await BluetoothSerial.cancelDiscovery();
      this.setState({ scanning: false });
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  };
  connectDevice = async (address) => {
    await this.state.device.connect(address);
    console.log('Selected ', address);
    this.setState({
      loading: true
    })
    await AsyncStorage.setItem("Printer", address);
    await AsyncStorage.setItem("WithPrinter", "IMPRESORA");
    Alert.alert("¡Conectado!");

  }

  testPrinter = async () => {
    const flag = await AsyncStorage.getItem("WithPrinter");
    console.log("testPrinter",flag)
    if (!flag) {
      Alert.alert("¡Espera!", "No has configurado una impresora.")
    } else {
      try {
        
        const address = await AsyncStorage.getItem("Printer");
        try {
          
          await this.state.device.connect(address);
          
          await this.state.device.write(texto_prefactura + "\r\n\r\n\r\n\r\n");
          
          await this.state.device.disconnect();
          
        } catch (e) {
         
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  toggleBluetooth = async value => {
    try {
      if (value) {
        await BluetoothSerial.enable();
        
      } else {
        await BluetoothSerial.disable();
        
      }
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{ width: "100%", height: "100%" }}>
          <Header title="IMPRESORA" onPressBack={() => { this.props.navigation.goBack() }}></Header>
          <View style={styles.topBar}>
            <Text style={styles.heading}>Bluetooth</Text>
            <View style={styles.enableInfoWrapper}>
              <Text style={{ fontSize: 14, color: "#fff", paddingRight: 10 }}>
                {this.state.isEnabled ? "PRENDIDO" : "APAGADO"}
              </Text>
              <Switch onValueChange={this.toggleBluetooth} value={this.state.isEnabled}></Switch>
            </View>
          </View>
          <Button buttonStyle={styles.button}
            title="Buscar dispositivos"
            onPress={this.discoverUnpairedDevices}
            titleStyle={{ fontSize: 25 }}></Button>
          <Button buttonStyle={styles.button}
            title="Terminal MovilGO"
            onPress={() => { this.connectDevice("00:11:22:33:44:55") }}
            titleStyle={{ fontSize: 25 }}></Button>
          <Button buttonStyle={styles.button}
            title="Probar impresión"
            onPress={this.testPrinter}
            titleStyle={{ fontSize: 25 }}></Button>
          <Text style={{ fontSize: 20, fontWeight: "bold", alignSelf: "center" }}>Dispositivos</Text>
          <React.Fragment>
            <DeviceList
              devices={this.state.devices}
              onDevicePressed={device => {
                Alert.alert("Atención", "¿Desea conectarse a este dispositivo?",
                  [
                    {
                      text: "No",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    { text: "Si", onPress: () => this.connectDevice(device.address) }
                  ],
                ),
                  { cancelable: false }
              }}
              onRefresh={this.listDevices}
            />
          </React.Fragment>
          <View style={{ borderBottomWidth: 1, marginHorizontal: 10 }}></View>
          {
            this.state.paired.map((i, key) => {
              return (
                <View key={key} style={{ borderBottomWidth: 1, marginHorizontal: 10 }}>
                  <Text style={styles.labelList} onPress={() => this.connectDevice(i.macAddress)}>{i.name + " " + i.macAddress}</Text>
                </View>
              )
            })
          }
        </View>
      </SafeAreaView>
    );
  }
}

export default withSubscription({ subscriptionName: "events", destroyOnWillUnmount: true, })(ScreenPrinter);

export const getPrintConfig = async (call) => {
  
  const flag = await AsyncStorage.getItem("WithPrinter");
  console.log("getPrintConfig",flag)
  if (!flag) {
    Alert.alert("¡Espera!", "No has configurado una impresora.", [
      {
        text: "Continuar sin impresora",
        onPress: async () => {
          await AsyncStorage.setItem("WithPrinter", "NO");
          call(false);
        }
      },
      {
        text: "Configurar impresora",
        onPress: () => call(true),
        style: "cancel"
      }
    ]);
  } else {
    call(false);
  }
}

export const printBill = async (data) => {

  /* try{
    await GenerateInvoice(data,true)
  }catch(err){
    console.error("error del generar pdf",err)
  } */


  const mac = await AsyncStorage.getItem("Printer");
  let factura = texto_prefactura
  if (mac) {
    try {
      await BluetoothSerial.connect(mac);
      data.forEach(midata => {
        factura = factura + "\r\n" + midata
      });
      await BluetoothSerial.write(factura + "\r\n\r\n\r\n\r\n");
      await BluetoothSerial.disconnect();
    } catch (error) {
      console.error(error);
    }
  }
}


const styles = StyleSheet.create({
  labelList: {
    fontSize: 18
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: 'rgba(7,162,186,0.7)',
    marginVertical: '1%',
    borderRadius: 10
  },
  topBar: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 6,
    backgroundColor: "#22509d"
  },
  heading: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
    color: "#fff"
  },

});

