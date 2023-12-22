import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, ScrollView, View, Alert,ActivityIndicator, PanResponder} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import {printBill, getPrintConfig} from '../../bluetooth/bluetooth-printer';
import {FormatMoney} from '../../../shared/utilities/formats';
import {ERROS_SCHEMA} from '../../../database/models/error';
import {getTableFromDB} from '../../../database/allSchemas'
import {Transaction} from '../../../services/products.service';
import { GenerateInvoice } from '../../../shared/utilities/GenerateInvoice';
export const Desembolso = (props) => {  
  
  const [flagButton,setFlagButton]=useState(false)//esta asociado a la desactivación del botón de pago  
  
  const {data,loading ,productId,document,closeAction,navigation,setLoading } = props;
  const [modalShared, setModalShared] = useState(false);
  const [dataResponse, setDataResponse] = useState([]);
  const pressPay = () => {    
    setLoading(true);
    setFlagButton(true) //esta asociado a la desactivación del botón de pago
    getPrintConfig(navigateToPrintConfig);
  };





  const navigateToPrintConfig = (flag) => {
    if (flag) {
      setLoading(false);
      navigation.navigate('Printer');

    } else {
      try {
        const product = {
          product_id: productId,
          atributes: {
            valorPagar: data.solicitud_valoraprobado,
            idsolicitud:data.id,
            cedula:document,
            cliente_nombre:data.partner_name,
            tipo:'venta'
          }
          
        }
        Transaction(product,navigateNext); 
      } catch (error) {
          Alert.alert("Error", "Problemas al obtener datos de sesión");
          this.setState({ "loading": false });
      }
      
    }
  };

  const clearData = () => {
  };

  const Error = (id) => {
    //console.log("esto ingreso al error",id)
    getTableFromDB(ERROS_SCHEMA, true)
      .then((response) => {

        response.forEach(element => {
          //console.log("response de los errores",element)
          if(element.id===id){
            Alert.alert('Error ',element.comment);
          }
          
        });
        //this.setState({soats: response});        
      })
      .catch((err) => console.error(err));

  };


  const navigateNext = (flag,response) => {
  /* const navigateNext = (response,flag) => { */
  /*  console.log("esto es el repsonde del DESEMBOLSO ",response)
   console.log("esto es la FLAG del DESEMBOLSO ",flag) */

    if (flag) {
      if(response.errores){
          if(response.errores.observacion){
            Alert.alert('Error ',response.errores.observacion);
            setLoading(false);
          }else{
            setLoading(false);
            Error(response.errores.id)
          }        
      }else{
       const datas = [
                'Factura No: '+response.valida.numero_aprobacion,
                'Cliente: '+data.partner_name,
                'Id de la solicitud: '+data.id,
                'Documento: '+document,
                'Valor: '+data.solicitud_valoraprobado
              ]; 
      /*   console.log("data de impresion",datas) */
       
        printBill(datas);
        setLoading(false);
        navigation.navigate('Home');
        setDataResponse(data)
        setModalShared(true)
      }  
      
    } else {
          Alert.alert('Error', 'Error en la transaccion ', [
            {text: 'Volver', onPress: () => clearData()},
          ]);
    }
  };

  return (
    <>
      <View style={{backgroundColor: 'white'}}>
        <View
          style={{
            width: '100%',
            height: 60,
            borderBottomWidth: 2,
            borderBottomColor: '#078fa5',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <View
            style={{width: '80%', height: '100%', justifyContent: 'center'}}>
            <Text style={styles.titleSummary}>Datos del credito</Text>
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
              borderColor: '#078fa4',
              borderRadius: 10
            }}
            >
            <View>
              <View style={{borderBottomWidth: 1, borderColor: '#078FA5'}}>
                <Text style={[styles.title, {alignSelf: 'center'}]}>
                  Desembolso
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.colContainer}>
                  <Text style={styles.title}>Cliente</Text>
                  <Text>{data.partner_name}</Text>
                </View>
                <View style={styles.colContainer}>
                  <Text style={styles.title}>Solicitud</Text>
                  <Text>{data.id}</Text>
                </View>
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.colContainer}>
                  <Text style={styles.title}>Valor aprobado</Text>
                  <Text>{FormatMoney(data.solicitud_valoraprobado)}</Text>
                </View>
                <View style={styles.colContainer}>
                  <Text style={styles.title}>Fecha de la solicitud</Text>
                  <Text>{data.fecha_solicitud}</Text>
                </View>
              </View>
            </View>

            <Button
            disabled={flagButton} //Se tiene que deshabilitar el botton para evitar que se vaya varias veces el desembolso 
              title="Desembolso"
              onPress={pressPay}
              buttonStyle={{backgroundColor: '#07A2BA', marginTop: '2%'}}
            />

            <View style={styles.loading}>
              <ActivityIndicator
                size="large"
                color="#0000ff"
                animating={loading}>
                </ActivityIndicator>
            </View>
            {modalShared&&<GenerateInvoice isVisible={modalShared} data={dataResponse} closeModal={(flag)=>setModalShared(flag)} title="Tu recarga fue exitosa!"/>}
       
          </View>
        </ScrollView>
      </View>
    </>
  );
};

/* Desembolso.propTypes = {
  vehicle: PropTypes.object,
  closeAction: PropTypes.func,
};
Desembolso.defaultProps = {
  vehicle: {},
  closeAction: () => {},
};
 */
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
    width: '42%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});
