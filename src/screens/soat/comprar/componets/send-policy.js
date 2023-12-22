import React, {useState,useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {Alert} from 'react-native';
import {StyleSheet, View, Text, ScrollView, CheckBox} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import {Transaction} from '../../../../services/products.service';
import {FormatMoney, Capitalize} from '../../../../shared/utilities/formats';
import {printBill, getPrintConfig} from '../../../bluetooth/bluetooth-printer';
import {SearchPickerEconomi} from '../../../../shared/picker/picker';
import { DateToString } from '../../../../shared/utilities/formats';
export const SendPolicy = (props) => {
  const {data,date,back,dataContact,infoVehicle,closeAction,productId,navigation,loading,setLoading} = props;
  const [cellular, setCellular] = useState('');
  const [email, setEmail] = useState('');
  const [cellularError, setCellularError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [iva, setIva] = useState(false);
  const [tipoCiud, setTipoCiud] = useState({label: '-- Seleccione una opcion --',value: ''});
  const vehicle = data.soat.respuesta_vehiculo;
  const tarifa = data.soat.respuesta_tarifa;
  const ciudOption = [{label: 'Gran Contribuyente', value: 1},{label: 'Autorretenedor', value: 2},{label: 'Agente de retencion Iva', value: 3},{label: 'Regimen simple de tributacion', value: 4},{label: 'No aplica', value: 5},{label: 'Contribuyente - Autorretenedor - Agente de Retencion Iva',value: 6},{label: 'Autorretenedor-Agente de Retencion Iva', value: 7},{label: 'Gran Contribuyente-Agente de Retencion Iva', value: 8}];
  const [descuento,setDescuento]=useState({Amount:0 ,Percentage:0})
  console.log("vehicle del sendpolice",vehicle)
  console.log("tarifa del sendpolice",tarifa)

  const clearData = () => {
    setEmail('');
    setCellular('');
    setLoading(false);
  };
  const pressPay = () => {
    const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    /* console.log("emailvalid",emailValid) */
   
    if (cellular.trim() === '') {
      setCellularError('Este campo es obligatorio');
      return;
    }
    if (email.trim() === '') {
      setEmailError('Este campo es obligatorio');
      return;
    }else if (!emailValid) {
      setEmailError('Error', 'El Email es incorrecto')
    }
    ////
    setLoading(true);
    getPrintConfig(navigateToPrintConfig);
  };

  const verifyFields = (isMovil = true, isEmail = true) => {
    let ok = true;
   
    if (isMovil) {
      if (cellular.trim() === '') {//no se puede meter un OR para validar en un solo IF
          setCellularError('Este campo es obligatorio');
          ok = false;
      }else if (cellular.length !== 10) {
          setCellularError('El numero de telefono es invalido');
          ok = false;
      }
    }

    if (isEmail) {
      if (email === '') {
        setEmailError('Este campo es obligatorio');
        ok = false;
        ok = false;
      }
    }
    console.log("ENTRA verifyF", isEmail, isMovil, cellular, email)
    return ok;
  };

  const navigateToPrintConfig = (flag) => {
    console.log("LLEGA AL navigattopc flag" , flag)
    if (flag) {
      setLoading(false);
      navigation.navigate('Printer');
    } else {
      if (verifyFields) {
        let numIva = '2';
        if (iva) {
          numIva = '1';
        }
        if (tipoCiud.value === '') {
          tipoCiud.value = 5;
        }
        const preparedData = {  /* Datos del JSON */
          Contact: {
            Address: {
              CityId: dataContact.city,
              Name: dataContact.adress.replace('.', ''),
              StateId: dataContact.StateId,
            },
            CiiuId: dataContact.CiiuId,
            Cellular: cellular,
            DocumentNumber: dataContact.document,
            DocumentTypeId: dataContact.DocumentTypeId,
            Email: email.trim(),
            FirstName: Capitalize(dataContact.firstName.split(' ')[0] ?? ''),
            FirstName1: Capitalize(dataContact.firstName.split(' ')[1] ?? ''),
            LastName: Capitalize(dataContact.lastName.split(' ')[0] ?? ''),
            LastName1: Capitalize(dataContact.lastName.split(' ')[1] ?? ''),
            Phone: cellular,
          },
          FromValidateDate: DateToString(date, true, 0, 0, -1),
          RegimenTypeId: numIva,
          Rutid: tipoCiud.value, //Preguntar
          SendPolicy: {
            Address: dataContact.city,
            Cellular: cellular,
            CityId: '17001',
            Email: email.trim(),
          },
          SystemSource: 10,
          ChangeEmisionType: 1,
          Vehicle: {
            BrandId: vehicle.BrandId,
            ChasisNumber: infoVehicle.ChasisNumber,
            CylinderCapacity: vehicle.CylinderCapacity,
            LoadCapacity: vehicle.LoadCapacity,
            MotorNumber: infoVehicle.MotorNumber,
            NumberPlate: vehicle.NumberPlate,
            PassengerCapacity: infoVehicle.PassengerCapacity,
            ServiceTypeId: vehicle.ServiceTypeId,
            VIN: infoVehicle.Vin,
            VehicleClassId: vehicle.VehicleClassId,
            VehicleClassMinistryId: vehicle.VehicleClassMinistryId,
            VehicleLineDescription: vehicle.VehicleLineDescription,
            VehicleLineId: vehicle.VehicleLineId,
            VehicleYear: vehicle.VehicleYear,
            VehicleBodyTypeId: vehicle.VehicleBodyTypeId,
            FuelTypeId: vehicle.FuelTypeId,
            EnginePowerTypeId:vehicle.EnginePowerTypeId,
          },
          Payments: [
            {
              MethodOfPaymentId: 1,
              ReferenceNumber1: null,
              ReferenceNumber2: null,
              PaymentAmount: tarifa.TotalWithDiscountAmount,
              Observation: null,
            },
          ],
        }; 
        console.log("preparedData",preparedData) 
        Transaction(
          {product_id: productId, atributes: preparedData},
          navigateNext,
        ); 
      }
    }
  };

  const navigateNext = (flag, response) => {
    console.log("response",flag,response)
    if (flag) {
      const data = [
        'Factura No: ' + response.valida.id,
        'Fecha:' + response.valida.fecha,
        'No. Aprobación: ' + response.valida.numero_aprobacion,
        'Producto: Soat',
        'Celular: ' + cellular,
        'Cedula: ' + dataContact.document,
        'Cliente: ' + dataContact.firstName + ' ' + dataContact.lastName,
        'Placa: ' + vehicle.NumberPlate,
        'Valor: ' + FormatMoney(tarifa.TotalWithDiscountAmount),
      ];

      printBill(data);
      setLoading(false);
      navigation.navigate('Home', {balance: response.valida.balanceFinal});
      Alert.alert('Movilgo', '¡Tu compra fue exitosa!');
    } else {
      if (response) {
        if (response.errores) {
          Alert.alert('Error', response.errores.observacion, [
            {text: 'Volver', onPress: () => clearData()},
          ]);
        } else {
          Alert.alert('Error', 'Error en la transaccion ', [
            {text: 'Volver', onPress: () => clearData()},
          ]);
        }
      }
    }
  };
  useEffect(() => {
    console.log("ENTRA 5: ",data.soat.respuesta_tarifa.Law2161Discount)
    if(data.soat.respuesta_tarifa.Law2161Discount){
      setDescuento(data.soat.respuesta_tarifa.Law2161Discount)
    }
  }, []);
  return (
    <View style={{backgroundColor: 'white'}}>
      <View
        style={{
          width: '100%',
          height: 65,
          borderBottomWidth: 2,
          borderBottomColor: '#078FA5',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <View style={{width: '20%'}}>
          <Button
            onPress={back}
            buttonStyle={{backgroundColor: 'transparent', height: '100%'}}
            icon={
              <Icon
                type="font-awesome-5"
                name="arrow-left"
                size={25}
                color="#07A2BA"></Icon>
            }></Button>
        </View>
        <View style={{width: '60%', height: '100%', justifyContent: 'center'}}>
          <Text style={styles.titleSummary}>Datos compra</Text>
        </View>
        <View style={{width: '20%', height: '100%', justifyContent: 'center'}}>
          <Button
            onPress={closeAction}
            buttonStyle={{backgroundColor: 'transparent', height: '100%'}}
            icon={
              <Icon
                type="font-awesome-5"
                name="times"
                size={25}
                color="#07A2BA"></Icon>
            }></Button>
        </View>
      </View>
      <ScrollView style={styles.container}>
        <View
          style={{
            margin: 5,
            borderWidth: 1,
            padding: 5,
            borderColor: '#078FA5',
            borderRadius: 10,
          }}>
          <View style={{borderBottomWidth: 1, borderColor: '#078FA5'}}>
            <Text style={[styles.title, {alignSelf: 'center'}]}>Tarifa</Text>
          </View>
          <View style={styles.rowContainer}>
            <View>
              <Text style={styles.title}>V Prima</Text>
              <Text>$ {tarifa.InsurancePremium}</Text>
            </View>
            <View>
              <Text style={styles.title}>Contribucion</Text>
              <Text> {tarifa.InsuranceTaxFormatted}</Text>
            </View>
            <View>
              <Text style={styles.title}>RUNT</Text>
              <Text> {tarifa.InsuranceFineFormatted}</Text>
            </View>
          </View>
          <View style={styles.rowContainer2}>
            {/*<View>
              <Text style={styles.title}>Descuento</Text>
              <Text>
                {tarifa.ElectricDiscount > 0 ? '-' : ''}$ {tarifa.ElectricDiscount}
              </Text>
            </View>*/}
            
            <View>
              <Text style={[styles.title, {alignSelf: 'center'}]}>Total Soat</Text>
              <Text style={{alignSelf: 'center'}}>$ {tarifa.Total + tarifa.ElectricDiscount}</Text>
            </View>
            <View>
              <Text style={styles.title}>T. Combustible</Text>
              <Text style={[styles.title, {alignSelf: 'center'}]}> {vehicle.FuelTypeId}
              </Text>
            </View>
            {/*
            <View>
              <Text style={[styles.title, {alignSelf: 'center'}]}>% desc</Text>
              <Text style={{alignSelf: 'center'}}>{tarifa.PercentageElectricDiscount}%</Text>
          </View>*/}
          </View>
          <View style={styles.rowContainer2}>
            
            
            <View>
              <Text style={[styles.title, {alignSelf: 'center'}]}>Dto. ley 2161</Text>
              <Text style={{alignSelf: 'center'}}>$ {descuento.Amount}</Text>
            </View>
            <View>
              <Text style={[styles.title, {alignSelf: 'center'}]}>% desc por ley</Text>
              <Text style={{alignSelf: 'center'}}>$ {descuento.Percentage}%</Text>
            </View>
            
          </View>
          <View style={styles.rowContainer2}>
            <View>
                <Text style={[styles.title, {alignSelf: 'center'}]}>
                  Dto. por Gas
                </Text>
                <Text style={{alignSelf: 'center'}}>$ {tarifa.GasDiscount}
                </Text>
            </View>
            <View>
                <Text style={styles.title}>% Dto. por Gas</Text>
                <Text style={{alignSelf: 'center'}}>
                  {tarifa.PercentageGasDiscount}%
                </Text>
            </View>
        </View>
          <View style={styles.rowContainer2}>
            <View>
              <Text style={[styles.title, {alignSelf: 'center'}]}>Total de Dto</Text>
              <Text style={{alignSelf: 'center'}}>{vehicle.TotalLawDiscount? vehicle.TotalLawDiscount:0}</Text>
            </View>
            <View>
              <Text style={[styles.title, {alignSelf: 'center'}]}>
                Total de Dto a Gas
              </Text>
              <Text style={{alignSelf: 'center'}}> {tarifa.GasDiscountFormatted}
              </Text>
            </View>
          </View>
         
          <View style={styles.rowContainer2}>
            <View>
              <Text style={[styles.title, {alignSelf: 'center'}]}>
                Total con desct
              </Text>
              <Text style={{alignSelf: 'center'}}> {tarifa.TotalWithDiscountAmountFormatted}
              </Text>
            </View>
           <View></View>
           <View>
              <Text style={[styles.title, {alignSelf: 'center'}]}>
                Total todos desct
              </Text>
              <Text style={{alignSelf: 'center'}}>{tarifa.TotalLawDiscountFormatted}
              </Text>
            </View>
          </View>
        </View>
        {/*<Input
                    label="Dirección"
                    placeholder=""
                    leftIcon={{
                        type: "font-awesome-5",
                        name: 'map-marker-alt',
                        size: 24,
                        color: 'black',
                    }}
                    inputStyle={{ borderWidth: 1, borderRadius: 5 }}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    containerStyle={{ width: '75%', alignSelf: 'center' }}
                    value={address}
                    onChangeText={value => setAddress(value)}
                />*/}

        <View style={{width: '75%', alignSelf: 'center', flexDirection: 'row'}}>
          <CheckBox value={iva} onValueChange={setIva} />
          <Text style={{marginTop: 5, marginLeft: 15}}>Responsable de IVA</Text>
        </View>
        {iva && (
          <View>
            <SearchPickerEconomi
              style={{button: {marginHorizontal: 0}}}
              value={tipoCiud}
              items={ciudOption}
              onChange={(value) => {
                setTipoCiud(value);
              }}
            />
          </View>
        )}

        <Input
          label="Celular"
          placeholder=""
          leftIcon={{
            type: 'font-awesome-5',
            name: 'mobile-alt',
            size: 24,
            color: 'black',
          }}
          onBlur={() => verifyFields(true, false)}
          inputStyle={{borderWidth: 1, borderRadius: 5}}
          inputContainerStyle={{borderBottomWidth: 0}}
          containerStyle={{width: '75%', alignSelf: 'center'}}
          errorMessage={cellularError}
          value={cellular}
          keyboardType="phone-pad"
          onChangeText={(value) => {
            setCellular(value), setCellularError('');
          }}
        />
        <Input
          label="Email"
          placeholder=""
          leftIcon={{
            type: 'font-awesome-5',
            name: 'envelope',
            size: 24,
            color: 'black',
          }}
          onBlur={() => verifyFields(false, true)}
          inputStyle={{borderWidth: 1, borderRadius: 5}}
          inputContainerStyle={{borderBottomWidth: 0}}
          containerStyle={{width: '75%', alignSelf: 'center'}}
          value={email}
          errorMessage={emailError}
          onChangeText={(value) => {
            setEmail(value);
            setEmailError('');
          }}
        />
        <Button
          title="Comprar"
          disabled={loading}
          onPress={pressPay}
          buttonStyle={{backgroundColor: '#07A2BA'}}
          containerStyle={{marginVertical: 10}}
        />
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="#0000ff"
            animating={loading}>
            </ActivityIndicator>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
  container: {
    paddingHorizontal: 10,
    maxHeight: '100%',
    //backgroundColor: '#078FA5'
  },
  titleSummary: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#07A2BA',
  },
  colContainer: {
    width: '32%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  rowContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 25,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 6,
  },
});
