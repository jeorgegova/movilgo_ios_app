import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, ScrollView, View,ActivityIndicator,Alert} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import {printBill, getPrintConfig} from '../../bluetooth/bluetooth-printer';
import {FormatMoney} from '../../../shared/utilities/formats';
import {ERROS_SCHEMA} from '../../../database/models/error';
import {getTableFromDB} from '../../../database/allSchemas'
import {InputMoney} from '../../../components/UI/input';
import { Transaction } from '../../../services/products.service';
import { GenerateInvoice } from '../../../shared/utilities/GenerateInvoice';
export const Pago = (props) => {
  const {data,loading ,productId,document,closeAction,navigation,setLoading } = props;
  const [ valorPago, setValorPago ] = useState('');
  const [valorPagoError, setValorPagoError] = useState('');
  const [flagButton,setFlagButton]=useState(false)//esta asociado a la desactivación del botón de pago
  const [flagError,setFlagError]=useState(false)
  const [modalShared, setModalShared] = useState(false);
  const [dataResponse, setDataResponse] = useState([]);
  const clearData = () => {
  };
  const deuda=()=>{
    if(parseInt(data.valor_deuda)===0){
        Alert.alert('MovilGO','Estos  datos no tienen deuda pendiente',
        [{text: 'Ok', onPress: () => {closeAction()}}])
    }
  }
  

  const verifyFields = () => {
/*     console.log("esto tiene PAGO",valorPago ) */
      if (valorPago.trim() === '') {
        setValorPagoError('Este campo es obligatorio');
        setFlagError(true)
        
      } else if (parseInt(valorPago.length ) <4 ||parseInt(valorPago) === 0) {
        setValorPagoError('El valor no es valido');
        setFlagError(true)
      }else if (valorPago>data.valor_deuda) {
        setValorPagoError('El valor no debe superar el saldo pendiente');
        setFlagError(true)
      }else{
        getPrintConfig(navigateToPrintConfig);
      }

  };
  const navigateToPrintConfig = (flag) => {
    setLoading(true);
    setFlagButton(true) 
    if (flag) {
      setLoading(false);
      navigation.navigate('Printer');
    } else {
      /* console.log("esto tiene la data", data.valor_deuda,valorPago) */
      
          /* confirmarDesembolso(
            productId,
            valorPago,
            data.account_move_id,
            document,
            data.partner_name,
            'pago',

            navigateNext ); */
            try {
              const product = {
                product_id: productId,
                atributes: {
                  valorPagar: valorPago,
                  idsolicitud:data.account_move_id,
                  cedula:document,
                  cliente_nombre:data.partner_name,
                  tipo:'pago'
                }
              }
          /*     console.log("Variable product PAGO",product) */
              //await 
              Transaction(product,navigateNext); 
            } catch (error) {
                Alert.alert("Error", "Problemas al obtener datos de sesión");
                this.setState({ "loading": false });
            }
    }
  };

  const Error = (id) => {
    /* console.log("esto ingreso al error") */
    getTableFromDB(ERROS_SCHEMA, true)
      .then((response) => {

        response.forEach(element => {
          /* console.log("response de los errores",element) */
          if(element.id===id){
            Alert.alert('Error ',element.comment);

          }
          
        });
        //this.setState({soats: response});        
      })
      .catch((err) => console.error(err));

  };

  const navigateNext = (flag,response) => {
   /*  console.log("respuesta del PAGO ",response)
    console.log("flag del pago ",flag) */
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
          'Id de la Factura: '+data.account_move_id,
          'Documento: '+document,
          'Valor: '+valorPago
        ]; 
       /*  console.log("data de impresion",datas) */
        printBill(data);
        setLoading(false);
        navigation.navigate('Home');
        setDataResponse(data)
        setModalShared(true)
      }
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
    deuda();
  }, []);
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
            <Text style={styles.titleSummary}>Datos del pago</Text>
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
          
          {/* Modal con la información del pago a realizar */}
          <View  style={styles.marco} /* {margin: 5, borderWidth: 1, padding: 5, borderColor: '#078fa4', borderRadius: 10}} */
            >
            <View>

              <View style={{borderBottomWidth: 1, borderColor: '#078FA5'}}>
                <Text style={[styles.title, {alignSelf: 'center'}]}>
                  Pago
                </Text>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.colContainer}>
                  <Text style={styles.title}>Cliente</Text>
                  <Text>{data.partner_name}</Text>
                </View>
                <View style={styles.colContainer}>
                  <Text style={styles.title}>Solicitud</Text>
                  <Text>{data.account_move_id}</Text>
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.colContainer}>
                  <Text style={styles.title}>Documento</Text>
                  <Text>{document}</Text>
                </View>
                <View style={styles.colContainer}>
                  <Text style={styles.title}>Saldo pendiente</Text>
                  <Text>{FormatMoney(data.valor_deuda)}</Text>
                </View>                
              </View>

              {<View style={styles.rowContainer}>
                <View style={styles.colContainer}>
                  
                </View>
                <View style={styles.colContainer}>
                </View>                
              </View>}

              <View>
              {/*   <Input
                  label="Valor a pagar"
                  placeholder=""
                  leftIcon={{  type: 'font-awesome-5', name: 'dollar-sign', size: 24, color: 'black', }}
                  inputStyle={{borderWidth: 1, borderRadius: 5}}
                  inputContainerStyle={{borderBottomWidth: 0}}
                  containerStyle={{width: '75%', alignSelf: 'center'}}
                  errorMessage={valorPagoError}                  
                  value = {valorPago}
                  keyboardType="phone-pad"
                  onChangeText={(value) => {
                    setValorPago(value);
                  }}
                /> */}
                <InputMoney
                  value={'' + valorPago}
                  keyboardType="phone-pad"
                  handleChange={(name, value) => {
                    setValorPago(value);
                   /*  console.log("pago",valorPago) */
                  }}
                  ></InputMoney>
                  {flagError && (
                    <Text style={{color: 'red'}}>{valorPagoError}</Text>
                  )}
              </View>
              
            </View>

            <Button
              disabled={flagButton}
              title="Pagar"
              onPress={verifyFields}
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

Pago.propTypes = {
  vehicle: PropTypes.object,
  closeAction: PropTypes.func,
};
Pago.defaultProps = {
  vehicle: {},
  closeAction: () => {},
};

const styles = StyleSheet.create({
  
  marco:{
    margin: 5,
    borderWidth: 1,
    padding: 5,
    borderColor: '#078fa4',
    borderRadius: 10
  },
  
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
