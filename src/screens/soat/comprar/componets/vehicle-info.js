import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, ScrollView, View, Alert} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import {SearchPicker} from '../../../../shared/picker/picker';

export const VehicleInfo = (props) => {
  const {data, dataVehicle, infoVehicle, closeAction, confirmAction} = props;
  const fuelType = require('../../../../assets/data/fuel-type');
  const country = require('../../../../assets/data/country');
  const vehicle = data.soat.respuesta_vehiculo;
  const contactVehicle = data.soat.respuesta_vehiculo.Contact;
  //  console.log("data.soat.respuesta_tarifa.Law2161Discount",data.soat.respuesta_tarifa.Law2161Discount)
  //console.log("data.soat.respuesta_tarifa",data.soat.respuesta_tarifa)
 
  const [Contacto, setContacto] = useState({FirstName: '',LastName: '',DocumentTypeId: '',DocumentNumber: ''});
  const [flagPropietario, setFlagPropietario] = useState(false);
  const [flagMotorNumberEdit, setFlagMotorNumberEdit] = useState(false);
  const [flagChasisNumberEdit, setFlagChasisNumberEdit] = useState(false);
  const [flagVinEdit, setFlagVinEdit] = useState(false);
  const [flagPassengersEdit, setFlagPassengersEdit] = useState(false);
  const [flagMotorNumberNotEdit, setFlagMotorNumberNotEdit] = useState(true);
  const [flagChasisNumberNotEdit, setFlagChasisNumberNotEdit] = useState(true);
  const [flagVinNotEdit, setFlagVinNotEdit] = useState(true);
  const [flagPassengersNotEdit, setFlagPassengersNotEdit] = useState(true);
  const [selectDocumento, setSelectDocumento] = useState({label: '-- Seleccione una opcion --',value: ''});
  const tipoDocumento = [{label: 'Cedula Ciudadania', value: 1},{label: 'Cedula de Extranjeria', value: 2},{label: 'Nit', value: 3},{label: 'Tarjeta de identidad', value: 4},{label: 'Pasaporte', value: 5}];
  const [InfoVehicle, setInfoVehicle] = useState({ChasisNumber: vehicle.ChasisNumber,MotorNumber: vehicle.MotorNumber,PassengerCapacity: vehicle.PassengerCapacity,Vin: vehicle.Vin,VehicleBodyTypeName:vehicle.VehicleBodyTypeName});
  const [flagVehicleBodyTypeName, setFlagVehicleBodyTypeName] = useState(false);
  const [flagVehicleBodyTypeNameNotEdit, setFlagVehicleBodyTypeNameNotEdit] = useState(true);
  

  const isObjEmpty = (obj) => {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
  };

  const loadData = () => {
    //console.log("contactVehicle",contactVehicle)
    if (isObjEmpty(dataVehicle) === false) {
        console.log("esto no entro entro ")
          setInfoVehicle({
          ChasisNumber: dataVehicle.ChasisNumber,
          MotorNumber: dataVehicle.MotorNumber,
          PassengerCapacity: dataVehicle.PassengerCapacity,
          Vin: dataVehicle.Vin,
          VehicleBodyTypeName:dataVehicle.VehicleBodyTypeName
        })
    }else if(isObjEmpty(dataVehicle) ===true&&(InfoVehicle.ChasisNumber === ''||parseInt(InfoVehicle.ChasisNumber) === 0)&&parseInt(vehicle.VehicleYear)<2011){
        console.log("esto entro ")
        setInfoVehicle({
          ChasisNumber: 'NA',
          MotorNumber: dataVehicle.MotorNumber,
          PassengerCapacity: dataVehicle.PassengerCapacity,
          Vin: dataVehicle.Vin,
          VehicleBodyTypeName:dataVehicle.VehicleBodyTypeName
        })
     
    }
    if (contactVehicle !== null) {
      setFlagPropietario(true);
      setContacto({
        ...Contacto,
        FirstName: contactVehicle.FirstName,
        LastName: contactVehicle.LastName,
        DocumentTypeId: contactVehicle.DocumentTypeId,
        DocumentNumber: contactVehicle.DocumentNumber,
      });
    }
  };

  const verifyFields = () => {
    //console.log("Enviando datos del vehiculo", vehicle)
    if (
      (InfoVehicle.ChasisNumber === ''&&parseInt(vehicle.VehicleYear)>=2011) ||
      InfoVehicle.MotorNumber === '' ||
      InfoVehicle.PassengerCapacity === '' ||
      ((InfoVehicle.Vin === null||InfoVehicle.Vin === '')&&parseInt(vehicle.VehicleYear)>=2011)
    ) {
      Alert.alert('Alerta', 'Todos los campos son requerido')
    } else {
      confirmAction
      sendData();
    }
  };

  const changeTypes = () => {
    //console.log("jeje vehiculo ",vehicle.ChasisNumber,vehicle.MotorNumber,vehicle.VehicleBodyTypeName,vehicle.PassengerCapacity)
    console.log("jeje vehiculo ",InfoVehicle)
    
    if (InfoVehicle.ChasisNumber === "" || InfoVehicle.ChasisNumber === null) {
      setFlagChasisNumberEdit(true)
      setFlagChasisNumberNotEdit(false)
    }
    if (InfoVehicle.MotorNumber === "" || InfoVehicle.MotorNumber === null) {
      setFlagMotorNumberEdit(true)
      setFlagMotorNumberNotEdit(false)
    }
    if (InfoVehicle.VehicleBodyTypeName === "" || InfoVehicle.VehicleBodyTypeName === null) {
      setFlagVehicleBodyTypeName(true)
      setFlagVehicleBodyTypeNameNotEdit(false)
    }
    if (InfoVehicle.PassengerCapacity === "" || InfoVehicle.PassengerCapacity === null || InfoVehicle.PassengerCapacity == 0) {
      setFlagPassengersEdit(true)
      setFlagPassengersNotEdit(false)
    }
    if ((InfoVehicle.Vin === "" || InfoVehicle.Vin === null)&&parseInt(vehicle.VehicleYear)>=2011) {
      setFlagVinEdit(true)
      setFlagVinNotEdit(false)
    }
  }

  const sendData = () => {
    infoVehicle({
      ChasisNumber: InfoVehicle.ChasisNumber,
      MotorNumber: InfoVehicle.MotorNumber,
      PassengerCapacity: InfoVehicle.PassengerCapacity,
      Vin: InfoVehicle.Vin,
      VehicleBodyTypeName:InfoVehicle.VehicleBodyTypeName
    }) 
    confirmAction(false);
  };

  useEffect(() => {
    //verifyFields();
    const descuento=data.soat.respuesta_tarifa.Law2161Discount


    setTimeout(() => {
      if (descuento) {
          if(descuento.HasDiscount){
              Alert.alert('Aviso', `Esta placa tiene un descuento aplicado.`);
          }
        
      }
    }, 1000);
    changeTypes();
    loadData();
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
        <View style={{width: '20%'}}></View>
        <View style={{width: '60%', height: '100%', justifyContent: 'center'}}>
          <Text style={styles.titleSummary}>Datos del vechiculo</Text>
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
          <View>
            <View style={{borderBottomWidth: 1, borderColor: '#078FA5'}}>
              <Text style={[styles.title, {alignSelf: 'center'}]}>
                Vehiculo
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.colContainer}>
                <Text style={styles.title}>Placa</Text>
                <Text>{vehicle.NumberPlate}</Text>
              </View>
              <View style={styles.colContainer}>
                <Text style={styles.title}>Modelo</Text>
                <Text>{vehicle.VehicleYear}</Text>
              </View>
              <View style={styles.colContainer}>
                <Text style={styles.title}>Cilindraje</Text>
                <Text>{vehicle.CylinderCapacity}</Text>
              </View>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.colContainer}>
                <Text style={styles.title}>Pais</Text>
                <Text>{country[vehicle.CountryId]}</Text>
              </View>
              <View style={styles.colContainer}>
                <Text style={styles.title}>Ciudad</Text>
                <Text>{vehicle.CityName}</Text>
              </View>
            </View>
            <View style={styles.rowContainer}>
              {flagMotorNumberEdit && (
                <View style={styles.colContainer}>
                  <Text style={styles.title}>N.º motor</Text>
                  <Input
                    keyboardType="default"
                    value={InfoVehicle.MotorNumber}
                    onChangeText={(value) =>
                      setInfoVehicle({...InfoVehicle, MotorNumber: value})
                    }
                  />
                </View>
              )}
              {flagMotorNumberNotEdit && (
                <View style={styles.colContainer}>
                  <Text style={styles.title}>N.º motor</Text>
                  <Text>{vehicle.MotorNumber}</Text>
                </View>
              )}

              {flagChasisNumberEdit && (
                <View style={styles.colContainer}>
                  <Text style={[styles.title]}>N.º de chasis</Text>
                  <Input
                    value={InfoVehicle.ChasisNumber}
                    onChangeText={(value) =>
                      setInfoVehicle({...InfoVehicle, ChasisNumber: value})
                    }
                  />
                </View>
              )}
              {flagChasisNumberNotEdit && (
                <View style={styles.colContainer}>
                  <Text style={[styles.title]}>N.º de chasis</Text>
                  {InfoVehicle.ChasisNumber.toString() === 'NA'&& (<Text>NA</Text>)}
                  {InfoVehicle.ChasisNumber.toString() !== 'NA' && (<Text>{InfoVehicle.ChasisNumber}</Text>)}
                 
                </View>
              )}

              {flagVinEdit && (
                <View style={styles.colContainer}>
                  <Text style={[styles.title]}>VIN</Text>
                  <Input
                    keyboardType="default"
                    value={InfoVehicle.Vin}
                    onChangeText={(value) =>
                      setInfoVehicle({...InfoVehicle, Vin: value})
                    }
                  />
                </View>
              )}
              {flagVinNotEdit && (
                <View style={styles.colContainer}>
                  <Text style={[styles.title]}>VIN</Text>
                    <Text>{InfoVehicle.Vin}</Text>
                </View>
              )}
            </View>
            <View style={styles.rowContainer}>
              {flagPassengersEdit && (
                <View style={styles.colContainer}>
                  <Text style={styles.title}>Pasajeros</Text>
                  <Input
                    keyboardType="numeric"
                    value={InfoVehicle.PassengerCapacity}
                    onChangeText={(value) =>
                      setInfoVehicle({...InfoVehicle, PassengerCapacity: value})
                    }
                  />
                </View>
              )}
              {flagPassengersNotEdit && (
                <View style={styles.colContainer}>
                  <Text style={styles.title}>Pasajeros</Text>
                  <Text>{vehicle.PassengerCapacity}</Text>
                </View>
              )}
              <View style={styles.colContainer}>
                <Text style={styles.title}>Tarjeta Op</Text>
                <Text>{vehicle.ActionRadio ?? '--'}</Text>
              </View>
              <View style={styles.colContainer}>
                <Text style={styles.title}>Carga</Text>
                <Text>{vehicle.LoadCapacity}</Text>
              </View>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.colContainer}>
                <Text style={styles.title}>Marca</Text>
                <Text>{vehicle.BrandName}</Text>
              </View>
              <View style={styles.colContainer}>
                <Text style={styles.title}>Linea</Text>
                <Text>{vehicle.VehicleLineDescription}</Text>
              </View>
              <View style={styles.colContainer}>
                <Text style={styles.title}>Clase</Text>
                <Text>{vehicle.VehicleClassName}</Text>
              </View>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.colContainer}>
                <Text style={styles.title}>Combustible</Text>
                <Text>
                  {fuelType ? fuelType[vehicle.FuelTypeId] : vehicle.FuelTypeId}
                </Text>
              </View>
              {flagVehicleBodyTypeNameNotEdit&&<View style={styles.colContainer}>
                <Text style={styles.title}>Carroceria</Text>
                <Text>{vehicle.VehicleBodyTypeName}</Text>
              </View>}
              {flagVehicleBodyTypeName&&<View style={styles.colContainer}>
                <Text style={styles.title}>Carroceria</Text>
                <Input
                    value={InfoVehicle.VehicleBodyTypeName}
                    onChangeText={(value) =>
                      setInfoVehicle({...InfoVehicle, VehicleBodyTypeName: value})
                    }
                  />
              </View>}
              <View style={styles.colContainer}>
                <Text style={styles.title}>Servicio</Text>
                <Text>{vehicle.ServiceTypeName}</Text>
              </View>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.colContainer}></View>
            </View>
            {flagPropietario && (
              <View>
                <View style={{borderBottomWidth: 1, borderColor: '#078FA5'}}>
                  <Text style={[styles.title, {alignSelf: 'center'}]}>
                    Propietario del Vehiculo
                  </Text>
                </View>
                <View style={styles.rowContainer}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.title}>Nombre</Text>
                    <Input
                      style={{fontSize: 15}}
                      value={Contacto.FirstName}
                      onChangeText={(value) =>
                        setContacto({...Contacto, FirstName: value})
                      }
                    />
                  </View>
                  <View style={{width: '48%'}}>
                    <Text style={styles.title}>Apellido</Text>
                    <Input
                      style={{fontSize: 15}}
                      value={Contacto.LastName}
                      onChangeText={(value) =>
                        setContacto({...Contacto, LastName: value})
                      }
                    />
                  </View>
                  <View style={styles.colContainer}></View>
                </View>
                <View style={styles.rowContainer}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.title}>Tipos de Documento</Text>
                   <SearchPicker
                      style={{button: {marginHorizontal: 0}}}
                      value={selectDocumento}
                      items={tipoDocumento}
                      onChange={(value) => {
                        setSelectDocumento(value);
                      }}
                    />
                    
                  </View>

                  <View style={{width: '48%'}}>
                    <Text style={[styles.title]}>N.º de Documento</Text>
                    <Input
                      style={{fontSize: 15}}
                      value={Contacto.DocumentNumber}
                      onChangeText={(value) =>
                        setContacto({...Contacto, DocumentNumber: value})
                      }
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
          <Button
            title="Siguiente"
            onPress={verifyFields}
            buttonStyle={{backgroundColor: '#07A2BA', marginTop: '2%'}}
          />
        </View>
      </ScrollView>
    </View>
  );
};

VehicleInfo.propTypes = {
  vehicle: PropTypes.object,
  closeAction: PropTypes.func,
};
VehicleInfo.defaultProps = {
  vehicle: {},
  closeAction: () => {},
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
  },
});
