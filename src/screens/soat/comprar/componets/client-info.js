import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, ScrollView, View, Alert} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import {
  SearchPicker,
  SearchPickerEconomi,
} from '../../../../shared/picker/picker';

export const ClientInfo = (props) => {
  const {data, back, dataContact, closeAction, infoContact, confirmAction} =props;

  const [optionsDepartamentos, setOptionsDepartamentos] = useState([]);
  const [optionsActividades, setOptionsActividades] = useState([]);
  const [opcionesCiudades, setOpcionesCiudades] = useState([]);
  const [opcionesTipoDocument, setOpcionesTipoDocument] = useState([]);
  let ciudades = data.soat.ciudadesSoat;
  let departamentos = data.soat.deptosSoat;
  let actividades = data.soat.actividadSoat;
  let tipoDocumentoCliente = [{label: 'Cedula Ciudadania', value: 1},{label: 'Cedula de Extranjeria', value: 2},{label: 'Nit', value: 3},{label: 'Tarjeta de identidad', value: 4},{label: 'Pasaporte', value: 5}];

  const [tipoDepartamento, setTipoDepartamento] = useState({label: '-- Departamento --',value: -1});
  const [tipoCiudad, setTipoCiudad] = useState({label: '-- Ciudad --',value: -1,stateId: -1});
  const [Contacto, setContacto] = useState({FirstNames: '',LastNames: '',DocumentNumber: '',});
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [documentError, setDocumentError] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAdressError] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState({label: '-- Tipo de Documento --',value: -1});
  const [actividadesEconomicas, setActividadesEconomicas] = useState({label: '-- Tipo de Actividad --', value: -1});
  const [flagMunicipio, setFlagMunicipio] = useState(false);
  const [flagDepartamento, setFlagDepartamento] = useState(false);
  const [flagActividad, setFlagActividad] = useState(false);
  const [flagDocument, setFlagDocument] = useState(false);
  const [flagDocumentEdit, setFlagDocumentEdit] = useState(false);
  const [flagDocumentNotEdit, setFlagDocumentNotEdit] = useState(false);
  function isObjEmpty(obj) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
  }

  const loadData = () => {
    if (isObjEmpty(dataContact) === false) {
      //aqui se inicialiazan los valores en caso que se regresen del modal sendPolice
      setContacto({
        ...Contacto,
        FirstNames: dataContact.firstName,
        Contacto,
        LastNames: dataContact.lastName,
        Contacto,
        DocumentNumber: dataContact.document,
      });
      setAddress(dataContact.adress);
      let documentoSeleccionado = {label: '', value: ''};
      let documentoslist = [];
      tipoDocumentoCliente.forEach((elements) => {
        if (parseInt(dataContact.DocumentTypeId) === parseInt(elements.value)) {
          documentoSeleccionado = {
            label: elements.label,
            value: elements.value,
          };
        }
        documentoslist.push({label: elements.label, value: elements.value});
      });
      setTipoDocumento(documentoSeleccionado);
      setOpcionesTipoDocument(documentoslist);
      let departamentoSeleccionado = {label: '', value: ''};
      let opcionesDepartamentoslist = [];
      departamentos.forEach((elements) => {
        if (parseInt(dataContact.StateId) === parseInt(elements.stateId)) {
          departamentoSeleccionado = {
            label: elements.nombre,
            value: elements.stateId,
          };
        }
        opcionesDepartamentoslist.push({
          label: elements.nombre,
          value: elements.stateId,
        });
        opcionesDepartamentoslist.sort((a, b) => {
          return a.label < b.label ? -1 : 1;
        });
      });
      setTipoDepartamento(departamentoSeleccionado);
      setOptionsDepartamentos(opcionesDepartamentoslist);
      let actividadSeleccionada = {label: '', value: ''};
      let opcionesActividadList = [];
      actividades.forEach((elements) => {
        if (parseInt(dataContact.CiiuId) === parseInt(elements.ciiuId)) {
          actividadSeleccionada = {
            label: ' ' + elements.descripcion + ' ',
            value: elements.ciiuId,
          };
        }
        opcionesActividadList.push({
          label: elements.descripcion,
          value: elements.ciiuId,
        });
        opcionesActividadList.sort((a, b) => {
          return a.label < b.label ? -1 : 1;
        });
      });
      setActividadesEconomicas(actividadSeleccionada);
      setOptionsActividades(opcionesActividadList);
      let ciudadSelecionada = {label: '', value: ''};
      let opcionesCiudades = [];
      ciudades.forEach((elements) => {
        if (
          parseInt(dataContact.StateId) === parseInt(elements.stateId) &&
          parseInt(dataContact.city) === parseInt(elements.cityId)
        ) {
          ciudadSelecionada = {
            label: elements.cityName,
            value: elements.cityId,
            stateId: elements.stateId,
          };
        }
        if (parseInt(dataContact.StateId) === parseInt(elements.stateId)) {
          opcionesCiudades.push({
            label: elements.cityName,
            value: elements.cityId,
            stateId: elements.stateId,
          });
          opcionesCiudades.sort((a, b) => {
            return a.label < b.label ? -1 : 1;
          });
        }
      });
      setTipoCiudad(ciudadSelecionada);
      setOpcionesCiudades(opcionesCiudades);
    } else if (data.soat.respuesta_cliente) {
      tipoDepartamento;
      // se inicilizan datos en caso que vengan datos del soat
      setContacto(data.soat.respuesta_cliente);
      setAddress(data.soat.respuesta_cliente.Address.Name);
      let documentoSeleccionado = {label: '', value: ''};
      let documentoslist = [];
      tipoDocumentoCliente.forEach((elements) => {
        if (
          parseInt(data.soat.respuesta_cliente.DocumentTypeId) ===
          parseInt(elements.value)
        ) {
          documentoSeleccionado = {
            label: elements.label,
            value: elements.value,
          };
        }
        documentoslist.push({label: elements.label, value: elements.value});
      });
      setTipoDocumento(documentoSeleccionado);
      setOpcionesTipoDocument(documentoslist);
      let departamentoSeleccionado = {label: '', value: ''};
      let opcionesDepartamentoslist = [];
      departamentos.forEach((elements) => {
        if(data.soat.respuesta_cliente.Address.StateId===null){
          departamentoSeleccionado = {
            label:'-- Departamento --',
            value: -1,
          };
        }else if (parseInt(data.soat.respuesta_cliente.Address.StateId) ===parseInt(elements.stateId)) {
          departamentoSeleccionado = {
            label: elements.nombre,
            value: elements.stateId,
          };
        }
        opcionesDepartamentoslist.push({
          label: elements.nombre,
          value: elements.stateId,
        });
        opcionesDepartamentoslist.sort((a, b) => {
          return a.label < b.label ? -1 : 1;
        });
      });
      setTipoDepartamento(departamentoSeleccionado);
      setOptionsDepartamentos(opcionesDepartamentoslist);
      let actividadSeleccionada = {label: '', value: ''};
      let opcionesActividadList = [];
      actividades.forEach((elements) => {

        if(data.soat.respuesta_cliente.CiiuId===null||parseInt(data.soat.respuesta_cliente.CiiuId)===0){
          actividadSeleccionada = {
            label:'-- Tipo de Actividad --',
            value: -1,
          };
        }else if (
          parseInt(data.soat.respuesta_cliente.CiiuId) ===
          parseInt(elements.ciiuId)
        ) {
          actividadSeleccionada = {
            label: ' ' + elements.descripcion + ' ',
            value: elements.ciiuId,
          };
        }
        opcionesActividadList.push({
          label: elements.descripcion,
          value: elements.ciiuId,
        });
        opcionesActividadList.sort((a, b) => {
          return a.label < b.label ? -1 : 1;
        });
      });
      setActividadesEconomicas(actividadSeleccionada);
      setOptionsActividades(opcionesActividadList);
      let ciudadSelecionada = {label: '', value: ''};
      let opcionesCiudades = [];

      ciudades.forEach((elements) => {

        if(data.soat.respuesta_cliente.Address.StateId===null){
          ciudadSelecionada = {
            label:'-- Ciudad --',
            value: -1,
            stateId: -1
          };
        }else if (
          parseInt(data.soat.respuesta_cliente.Address.StateId) ===
            parseInt(elements.stateId) &&
          parseInt(data.soat.respuesta_cliente.Address.CityId) ===
            parseInt(elements.cityId)
        ) {
          ciudadSelecionada = {
            label: elements.cityName,
            value: elements.cityId,
            stateId: elements.stateId,
          };
        }
        if (
          parseInt(data.soat.respuesta_cliente.Address.StateId) ===
          parseInt(elements.stateId)
        ) {
          opcionesCiudades.push({
            label: elements.cityName,
            value: elements.cityId,
            stateId: elements.stateId,
          });
          opcionesCiudades.sort((a, b) => {
            return a.label < b.label ? -1 : 1;
          });
        }
      });
      setTipoCiudad(ciudadSelecionada);
      setOpcionesCiudades(opcionesCiudades);
    } else {
      // se inicilizan datos en caso que NO vengan datos del soat
      let documentoslist = [];
      tipoDocumentoCliente.forEach((elements) => {
        documentoslist.push({label: elements.label, value: elements.value});
      });
      setOpcionesTipoDocument(documentoslist);
      let opcionesDepartamentoslist = [];
      departamentos.forEach((elements) => {
        opcionesDepartamentoslist.push({
          label: elements.nombre,
          value: elements.stateId,
        });
        opcionesDepartamentoslist.sort((a, b) => {
          return a.label < b.label ? -1 : 1;
        });
      });
      setOptionsDepartamentos(opcionesDepartamentoslist);
      let opcionesActividadList = [];
      actividades.forEach((elements) => {
        opcionesActividadList.push({
          label: elements.descripcion,
          value: elements.ciiuId,
        });
        opcionesActividadList.sort((a, b) => {
          return a.label < b.label ? -1 : 1;
        });
      });
      setOptionsActividades(opcionesActividadList);
    }

    if (data.soat.respuesta_cliente) {
      setFlagDocumentNotEdit(true);
    } else {
      setFlagDocumentEdit(true);
    }
   console.log("tipo de documento",tipoDocumento)
  };

  const verifyFields = () => {   
    

    if ((Contacto.FirstNames !== "" || !!Contacto.FirstNames ) &&
      (Contacto.LastNames !== "" || !!Contacto.LastNames) &&
      (parseInt(tipoCiudad.value) !== -1 || !!tipoCiudad.value) &&
      (Contacto.DocumentNumber !== "" || !!Contacto.DocumentNumber) && (address !== "" || !!address) &&
      (parseInt(actividadesEconomicas.value) !== -1 ||actividadesEconomicas.value !== "" ||actividadesEconomicas.value !== undefined) &&
      (parseInt(tipoDepartamento.value) !== -1 || !!tipoDepartamento.value) &&
      (parseInt(tipoDocumento.value) !== -1 || !!tipoDocumento.value ) &&
      Contacto.FirstNames.match(/[^a-zA-Z0-9\s/]/) === null &&
      Contacto.LastNames.match(/[^a-zA-Z0-9\s/]/) === null &&
      parseInt(tipoCiudad.stateId) === parseInt(tipoDepartamento.value)
    ) {
    
      console.log("esto pa")      
      sendData(); 
      
    } else {
        console.log("validacion")
        if (Contacto.FirstNames === "") {
          setFirstNameError('Este campo es obligatorio');
        } else if (Contacto.FirstNames.match(/[^a-zA-Z0-9\s/]/) ) {
          setFirstNameError('No puede contener Carateres especiales');
        } else {
          setFirstNameError('');
        }
        if (Contacto.LastNames === '') {
          setLastNameError('Este campo es obligatorio');
        } else if (Contacto.LastNames.match(/[^a-zA-Z0-9\s/]/) ) {
          setLastNameError('No puede contener Carateres especiales');
        } else {
          setLastNameError('');
        }

        if (
          Contacto.DocumentNumber === '' ||
          Contacto.DocumentNumber.length > 10
        ) {
          setDocumentError('El documento es incorrecto');
        } else {
          setDocumentError('');
        }

        if (address === '' || address === null) {
          setAdressError('Este campo es obligatorio');
        } else if (address.match(/[^a-zA-Z0-9\s/-]/) ) {
          setAdressError('No puede contener Carateres especiales');
        } else {
          setAdressError('');
        }

        if (tipoDepartamento.value === -1) {
          setFlagDepartamento(true);
        } else {
          setFlagDepartamento(false);
        }
        if (tipoCiudad.value === -1) {
          setFlagMunicipio(true);
        } else {
          setFlagMunicipio(false);
        }
        if (actividadesEconomicas.value === -1 ||actividadesEconomicas.value === ''||actividadesEconomicas.value === undefined) {
          setFlagActividad(true); 
        } else {
          setFlagActividad(false);
        }
        if (tipoDocumento.value === -1) {
          setFlagDocument(true);
        } else {
          setFlagDocument(false);
        }
        if (parseInt(tipoCiudad.stateId) !== parseInt(tipoDepartamento.value)) {
          Alert.alert('¡Error!', 'La ciudad no coincide con el departamento.');
        }
    }
  };

  const sendData = () => {
    console.log("ENTRA A sendData")
    infoContact({
      firstName: Contacto.FirstNames,
      lastName: Contacto.LastNames,
      city: tipoCiudad.value,
      document: Contacto.DocumentNumber,
      adress: address,
      CiiuId: actividadesEconomicas.value,
      StateId: tipoDepartamento.value,
      DocumentTypeId: tipoDocumento.value,
    });
    confirmAction(false);
    
  };

  const initialiceMunicipio = (selectedDepto) => {
    setOpcionesCiudades([]);
    let opcionesCiudades = [];
    ciudades.forEach((elements) => {
      if (parseInt(selectedDepto.value) === parseInt(elements.stateId)) {
        opcionesCiudades.push({
          label: elements.cityName,
          value: elements.cityId,
          stateId: elements.stateId,
        });
        opcionesCiudades.sort((a, b) => {
          return a.label < b.label ? -1 : 1;
        });
      }
    });
    setOpcionesCiudades(opcionesCiudades);
  };
  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={{backgroundColor: 'white'}}>
      <View
        style={{
          width: '100%',
          height: 80,
          borderBottomWidth: 2,
          borderBottomColor: '#078FA5',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <View style={{width: '20%', marginTop: 30}}>
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
        <View
          style={{
            width: '60%',
            height: '100%',
            justifyContent: 'center',
            marginTop: 30,
          }}>
          <Text style={styles.titleSummary}>Datos del Cliente</Text>
        </View>
        <View
          style={{
            width: '20%',
            height: '100%',
            justifyContent: 'center',
            marginTop: 30,
          }}>
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
      <ScrollView
        style={{paddingHorizontal: 10, maxHeight: '100%', marginBottom: 30}}>
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
              <Text style={[styles.title, {alignSelf: 'center'}]}>Cliente</Text>
            </View>
            <View style={styles.rowContainer}>
              <View style={{width: '50%'}}>
                <Text style={styles.title}>Nombre</Text>
                <Input
                  value={Contacto.FirstNames}
                  errorMessage={firstNameError}
                  onChangeText={(value) =>
                    setContacto({...Contacto, FirstNames: value})
                  }
                />
              </View>
              <View style={{width: '50%'}}>
                <Text style={styles.title}>Apellidos</Text>
                <Input
                  errorMessage={lastNameError}
                  value={Contacto.LastNames}
                  onChangeText={(value) =>
                    setContacto({...Contacto, LastNames: value})
                  }
                />
              </View>
            </View>

            {flagDocumentNotEdit && (
              <View>
                <View style={styles.rowContainer}>
                  <View style={{width: '100%'}}>
                    <Text style={styles.title}>Tipo de Documento</Text>
                    <Text style={styles.text}>{tipoDocumento.label}</Text>
                  </View>
                </View>
                <View style={styles.rowContainer}>
                  <View style={{width: '100%'}}>
                    <Text style={styles.title}>Documento</Text>
                    <Text style={styles.text}>{Contacto.DocumentNumber}</Text>
                  </View>
                </View>
              </View>
            )}
            {flagDocumentEdit && (
              <View>
                <View style={styles.rowContainer}>
                  <View style={{width: '100%'}}>
                    <Text style={styles.title}>Tipo de Documento</Text>
                    <View>
                      <SearchPicker
                        style={{button: {marginHorizontal: 0}}}
                        value={tipoDocumento}
                        items={opcionesTipoDocument}
                        onChange={(value) => {
                          setTipoDocumento(value);
                        }}
                      />
                    </View>
                    {flagDocument && (
                      <Text style={{color: 'red'}}>
                        Este campo es Obligatorio
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.rowContainer}>
                  <View style={{width: '100%'}}>
                    <Text style={styles.title}>Documento</Text>
                    <Input
                      keyboardType="numeric"
                      value={Contacto.DocumentNumber}
                      errorMessage={documentError}
                      onChangeText={(value) =>
                        setContacto({...Contacto, DocumentNumber: value})
                      }
                    />
                  </View>
                </View>
              </View>
            )}

            <View>
              <View style={{width: '100%'}}>
                <Text style={styles.title}>Departamento</Text>
                <View>
                  <SearchPicker
                    style={{button: {marginHorizontal: 0}}}
                    value={tipoDepartamento}
                    items={optionsDepartamentos}
                    onChange={(value) => {
                      setTipoDepartamento(value);
                      initialiceMunicipio(value);
                    }}
                  />
                </View>
              </View>
              {flagDepartamento && (
                <Text style={{color: 'red'}}>Este campo es obligatorio</Text>
              )}
              <View style={{width: '100%'}}>
                <Text style={styles.title}>Ciudad</Text>
                <View>
                  <SearchPicker
                    style={{button: {marginHorizontal: 0}}}
                    value={tipoCiudad}
                    items={opcionesCiudades}
                    onChange={(value) => {
                      setTipoCiudad(value);
                    }}
                  />
                </View>
              </View>
              {flagMunicipio && (
                <Text style={{color: 'red'}}>Este campo es Obligatorio</Text>
              )}
              <View style={{width: '100%'}}>
                <Text style={styles.title}>Actividad Economica</Text>
                <View>
                  <SearchPickerEconomi
                    style={{button: {marginHorizontal: 0}}}
                    value={actividadesEconomicas}
                    items={optionsActividades}
                    onChange={(value) => {
                      setActividadesEconomicas(value);
                    }}
                  />
                </View>
              </View>
              {flagActividad && (
                <Text style={{color: 'red'}}>Este campo es obligatorio</Text>
              )}
            </View>
            <View>
              <Text style={styles.title}>Direccion</Text>
              <Input
                value={address}
                errorMessage={addressError}
                onChangeText={(value) => setAddress(value)}
              />
            </View>
          </View>

          <Button
            title="Confirmar"
            onPress={verifyFields}
            buttonStyle={{backgroundColor: '#07A2BA', marginTop: '2%'}}
          />
        </View>
      </ScrollView>
    </View>
  );
};

ClientInfo.propTypes = {
  vehicle: PropTypes.object,
  closeAction: PropTypes.func,
};
ClientInfo.defaultProps = {
  vehicle: {},
  closeAction: () => {},
};
const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
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
