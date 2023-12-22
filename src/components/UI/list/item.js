import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { FormatMoney } from '../../../shared/utilities/formats';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  printBill,
  getPrintConfig,
} from '../../../screens/bluetooth/bluetooth-printer';
import { getElementByIdDataBase } from '../../../database/allSchemas';
import { Button } from 'react-native-elements';
import { BINGO_SCHEMA } from '../../../database/models/bingo';
import { SOAT_SCHEMA } from '../../../database/models/soat';
import {PRESTAMOS_SCHEMA} from '../../../database/models/prestamos'
import {PINITEMS_SCHEMA} from '../../../database/models/pinitems'
import { GenerateInvoice } from '../../../shared/utilities/GenerateInvoice';

export const ItemMoves = (props) => {
  const { item, styles = getStyles() } = props;
  const [modal,setModal]=useState(false)
  const [dataPDF,setDataPDF]=useState([])
  let num = {
    title: '--',
    numero: '--',
  };
  if (item.recarga_numero_celular) {
    num.title = 'Celular';
    num.numero = item.recarga_numero_celular;
  }

  const tipo = () => {
    let mitabla = '';
    let categflag = false;
    if (item.categ_id_name === 'Recargas') {
      mitabla = 'Recargas';
      categflag = true;
    } else if (
      item.categ_id_name === 'Todo incluido' ||
      item.categ_id_name === 'Voz' ||
      item.categ_id_name === 'Datos' ||
      item.categ_id_name === 'Voz y Datos' ||
      item.categ_id_name === 'Aplicaciones'
    ) {
      mitabla = 'Paquetes';
      categflag = true;
    } else if (item.categ_id_name === 'Rifas') {
      mitabla = 'Rifas';
      categflag = true;
    } else if (item.categ_id_name === 'TV') {
      mitabla = 'Tv';
      categflag = true;
    } else if (item.categ_id_name === 'Recargas deportivas') {
      mitabla = 'RecargasSport';
      categflag = true;
    }
    else if (item.categ_id_name === 'Bingo') {
      mitabla = BINGO_SCHEMA;
      categflag = true;
    }
    else if (item.categ_id_name === 'Soat') {
      mitabla = SOAT_SCHEMA;
      categflag = true;
    }else if (item.categ_id_name === 'Mitecnova') {
      mitabla = PRESTAMOS_SCHEMA;
      categflag = true;
    }else if(item.categ_id_name=='Free Fire'||
      item.categ_id_name === 'Xbox Plata'||
      item.categ_id_name === 'Xbox Suscripciones'||
      item.categ_id_name === 'Netflix'||
      item.categ_id_name === 'Play Station'||
      item.categ_id_name === 'Play Station Suscripciones'||
      item.categ_id_name === 'Xbox Suscripciones'){
        mitabla = PINITEMS_SCHEMA;
      categflag = true;
    }
    return { mitabla: mitabla, categflag: categflag };
  };
  let data = tipo();

  const imprimirMovimiento = (flag) => {
    const itemSearched = { table: data.mitabla, product: { id: item.producto_id } };
        
    getElementByIdDataBase(itemSearched)
      .then(async(results) => {
        if (results) {
       /*    console.log("item.categ_id_name",item.categ_id_name)    */
          let data = [];
          if (item.categ_id_name === SOAT_SCHEMA) {
            
            let str = JSON.stringify(item.soat_datos).replace(/\\/g, '');
              str = str.replace('""""', '""');
              str = str.replace('"{', '{');
              str = str.replace('}"', '}');
              str = str.replace('""""', '""');
              str = str.replace('"{', '{');
              str = str.replace('}"', '}');
            const jsondataSoat = JSON.parse(str);
            data = [
              'Factura No: ' + item.id + ' COPIA',
              'Fecha:' + item.fecha,
              "No. Aprobación: "+ item.recarga_aprobacion,
              'Producto: ' + item.categ_id_name,
              'Celular:' + jsondataSoat.Contact.Phone,
              'Cedula:'+jsondataSoat.Contact.DocumentNumber,
              'Cliente: ' + jsondataSoat.Contact.FirstName+" "+jsondataSoat.Contact.FirstName1+" "+jsondataSoat.Contact.LastName+" "+jsondataSoat.Contact.LastName1,
              'Placa: ' + item.soat_placa,
              'Valor: ' + FormatMoney(item.valor.toFixed(2)),
            ];
          }
          else if (item.categ_id_name === "Bingo") {
            data = [
              "Factura No:"  + item.id + ' COPIA',
              "Fecha:" + item.fecha,
              "No.Aprobacion:" + item.bingo_aprobacion,
              "Producto: GANA BINGO",                          
              "Cedula: "+ item.bingo_cedula,
              "Cliente: " + item.bingo_cliente_nombre + " " +item.bingo_apellido_cliente,
              "Celular: " + item.bingo_numero_celular,
              "Valor: " + FormatMoney(item.valor.toFixed(2)),
            ];
          } else if (item.categ_id_name === 'Rifas') {
            data = [
              'Factura No: ' + item.id + ' COPIA',
              'Fecha:' + item.fecha,
              'Producto: ' + item.descripcion,
              'No.Aprobacion:' + item.rifa_aprobacion,
              'Fecha del sorteo: ' + results.fecha_sorteo,
              'Resolucion: ' + results.numero_resolucion_rifa,
              'Numero de boleta: ' + item.rifa_numero_boleta,
              'Cliente: ' + item.nombre_cliente,
              'Valor: ' + FormatMoney(item.valor.toFixed(2)),
            ];
          } else if (
            item.categ_id_name === 'Recargas' ||
            item.categ_id_name === 'Voz' ||
            item.categ_id_name === 'Voz y Datos' ||
            item.categ_id_name === 'Aplicaciones' ||
            item.categ_id_name === 'Datos' ||
            item.categ_id_name === 'Todo incluido'
          ) {
            data = [
              'Factura No: ' + item.id + ' COPIA',
              'Fecha:' + item.fecha,
              'No.Aprobacion:' + item.recarga_aprobacion,
              'Producto: ' + item.descripcion,
              'Celular: ' + item.recarga_numero_celular,
              'Valor: ' + FormatMoney(item.valor.toFixed(2)),
            ];
          } else if (item.categ_id_name === 'Recargas deportivas') {
            data = [
              'Factura No: ' + item.id + ' COPIA',
              'Fecha:' + item.fecha,
              'No.Aprobacion:' + item.recarga_aprobacion,
              'Producto: ' + results.name,
              'Celular: ' + item.recarga_numero_celular,
              'Valor: ' + FormatMoney(item.valor.toFixed(2)),
            ];
          }else if(item.categ_id_name==='Mitecnova'){
           /*  console.log("esto entro ",item) */
            data = [
              'Factura No: '+item.id+' COPIA',
              'Fecha:' + item.fecha,
              'Cliente: '+item.partner_name,              
              'Id Mitecnova: '+item.mitecNova_id_credito,
              'Valor: '+ FormatMoney(item.valor.toFixed(2)),
              
            ];
          }else if(item.categ_id_name=='Free Fire'||
          item.categ_id_name === 'Xbox Plata'||
          item.categ_id_name === 'Xbox Suscripciones'||
          item.categ_id_name === 'Netflix'||
          item.categ_id_name === 'Play Station'||
          item.categ_id_name === 'Play Station Suscripciones'||
          item.categ_id_name === 'Xbox Suscripciones'){
            data = [
              'Factura No: ' + item.id + ' COPIA',
              'Fecha:' + item.fecha,
              'No.Aprobacion:' + item.recarga_aprobacion,
              'Producto: ' + results.category,
              'Celular: ' + item.recarga_numero_celular,
              'Valor: ' + FormatMoney(item.valor.toFixed(2)),
            ];

          }
          /* console.log("DATA: Datos a imprimir",data) */ //comprobar lo que se iria a imprimir en la tpl, en caso de no tenerla al alcance y al hacer las pruebas desde un movil diferente
          printBill(data);
          //await generateInvoice(data,true)
        }
      })
      .catch((error) => console.log(error));
  };
  const generatPdf = (flag) => {
    const itemSearched = { table: data.mitabla, product: { id: item.producto_id } };
        
    getElementByIdDataBase(itemSearched)
      .then(async(results) => {
        if (results) {
       /*    console.log("item.categ_id_name",item.categ_id_name)    */
          let data = [];
          if (item.categ_id_name === SOAT_SCHEMA) {
            
            let str = JSON.stringify(item.soat_datos).replace(/\\/g, '');
              str = str.replace('""""', '""');
              str = str.replace('"{', '{');
              str = str.replace('}"', '}');
              str = str.replace('""""', '""');
              str = str.replace('"{', '{');
              str = str.replace('}"', '}');
            const jsondataSoat = JSON.parse(str);
            data = [
              'Factura No: ' + item.id + ' COPIA',
              'Fecha:' + item.fecha,
              "No. Aprobación: "+ item.recarga_aprobacion,
              'Producto: ' + item.categ_id_name,
              'Celular:' + jsondataSoat.Contact.Phone,
              'Cedula:'+jsondataSoat.Contact.DocumentNumber,
              'Cliente: ' + jsondataSoat.Contact.FirstName+" "+jsondataSoat.Contact.FirstName1+" "+jsondataSoat.Contact.LastName+" "+jsondataSoat.Contact.LastName1,
              'Placa: ' + item.soat_placa,
              'Valor: ' + FormatMoney(item.valor.toFixed(2)),
            ];
          }
          else if (item.categ_id_name === "Bingo") {
            data = [
              "Factura No:"  + item.id + ' COPIA',
              "Fecha:" + item.fecha,
              "No.Aprobacion:" + item.bingo_aprobacion,
              "Producto: GANA BINGO",                          
              "Cedula: "+ item.bingo_cedula,
              "Cliente: " + item.bingo_cliente_nombre + " " +item.bingo_apellido_cliente,
              "Celular: " + item.bingo_numero_celular,
              "Valor: " + FormatMoney(item.valor.toFixed(2)),
            ];
          } else if (item.categ_id_name === 'Rifas') {
            data = [
              'Factura No: ' + item.id + ' COPIA',
              'Fecha:' + item.fecha,
              'Producto: ' + item.descripcion,
              'No.Aprobacion:' + item.rifa_aprobacion,
              'Fecha del sorteo: ' + results.fecha_sorteo,
              'Resolucion: ' + results.numero_resolucion_rifa,
              'Numero de boleta: ' + item.rifa_numero_boleta,
              'Cliente: ' + item.nombre_cliente,
              'Valor: ' + FormatMoney(item.valor.toFixed(2)),
            ];
          } else if (
            item.categ_id_name === 'Recargas' ||
            item.categ_id_name === 'Voz' ||
            item.categ_id_name === 'Voz y Datos' ||
            item.categ_id_name === 'Aplicaciones' ||
            item.categ_id_name === 'Datos' ||
            item.categ_id_name === 'Todo incluido'
          ) {
            data = [
              'Factura No: ' + item.id + ' COPIA',
              'Fecha:' + item.fecha,
              'No.Aprobacion:' + item.recarga_aprobacion,
              'Producto: ' + item.descripcion,
              'Celular: ' + item.recarga_numero_celular,
              'Valor: ' + FormatMoney(item.valor.toFixed(2)),
            ];
          } else if (item.categ_id_name === 'Recargas deportivas') {
            data = [
              'Factura No: ' + item.id + ' COPIA',
              'Fecha:' + item.fecha,
              'No.Aprobacion:' + item.recarga_aprobacion,
              'Producto: ' + results.name,
              'Celular: ' + item.recarga_numero_celular,
              'Valor: ' + FormatMoney(item.valor.toFixed(2)),
            ];
          }else if(item.categ_id_name==='Mitecnova'){
           /*  console.log("esto entro ",item) */
            data = [
              'Factura No: '+item.id+' COPIA',
              'Fecha:' + item.fecha,
              'Cliente: '+item.partner_name,              
              'Id Mitecnova: '+item.mitecNova_id_credito,
              'Valor: '+ FormatMoney(item.valor.toFixed(2)),
              
            ];
          }else if(item.categ_id_name=='Free Fire'||
          item.categ_id_name === 'Xbox Plata'||
          item.categ_id_name === 'Xbox Suscripciones'||
          item.categ_id_name === 'Netflix'||
          item.categ_id_name === 'Play Station'||
          item.categ_id_name === 'Play Station Suscripciones'||
          item.categ_id_name === 'Xbox Suscripciones'){
            data = [
              'Factura No: ' + item.id + ' COPIA',
              'Fecha:' + item.fecha,
              'No.Aprobacion:' + item.recarga_aprobacion,
              'Producto: ' + results.category,
              'Celular: ' + item.recarga_numero_celular,
              'Valor: ' + FormatMoney(item.valor.toFixed(2)),
            ];

          }
          setDataPDF(data)
          setModal(true)
        }
      })
      .catch((error) => console.log("esete error",error));
  };
  return (
    <View styles={styles.container}>
      <View style={styles.containerHorizontal}>
        <View style={[styles.containerText, { width: '14%' }]}>
          <Text style={styles.title}>ID</Text>
          <Text style={styles.text}>{item.id}</Text>
        </View>

        <View style={[styles.containerText, { width: '24%' }]}>
          <Text style={styles.title}>Descripción</Text>
          <Text style={styles.text}>{item.descripcion}</Text>
        </View>
        <View style={[styles.containerText, { width: '28%' }]}>
          <Text style={styles.title}>{num.title}</Text>
          <Text style={styles.text}>{num.numero}</Text>
        </View>
        <View
          style={[
            styles.containerHorizontal,
            styles.containerText,
            { width: '20%' },
          ]}>
          <View>
            <Text style={styles.title}>Valor</Text>
            <Text style={styles.text}>{FormatMoney(item.valor.toFixed(2))}</Text>
          </View>
          <View>
            <View>
              {data.categflag && (
                <Button
                  icon={<Icon name="print" size={25}></Icon>}
                  buttonStyle={styles.button}
                  onPress={() => {
                    getPrintConfig(imprimirMovimiento);
                    generatPdf()
                  }}></Button>
              )}
            </View>
          </View>
        </View>
      </View>
      <View style={styles.containerHorizontal}>
        <View style={[styles.containerText, { width: '14%' }]}>
          <Text style={styles.title}>Tipo</Text>
          <Text style={styles.text}>{item.tipo}</Text>
        </View>
        <View style={[styles.containerText, { width: '24%' }]}>
          <Text style={styles.title}>Aprobacion</Text>
          <Text style={styles.text}>
            {item.recarga_aprobacion ? item.recarga_aprobacion : '--'}
          </Text>
        </View>
        <View style={[styles.containerText, { width: '28%' }]}>
          <Text style={styles.title}>Comisión</Text>
          <Text style={styles.text}>{FormatMoney(item.comision)}</Text>
        </View>
        <View style={[styles.containerText, { width: '24%' }]}>
          <Text style={styles.title}>Hora</Text>
          <Text style={styles.text}>{item.fecha}</Text>
        </View>
      </View>
      {modal&&<GenerateInvoice isVisible={modal} data={dataPDF} closeModal={(flag)=>setModal(flag)} title="Genere Su factura"/>}
    </View>
  );
};

export const ItemError = (props) => {
  const { item, styles = getStyles() } = props;
  let num = {
    title: '--',
    numero: '--',
  };
  if (item.recarga_numero_celular) {
    num.title = 'Celular';
    num.numero = item.recarga_numero_celular;
  } else if (item.pines_numero_celular) {
    num.title = 'Celular';
    num.numero = item.pines_numero_celular;
  } else if (item.apuestadeportiva_numero_celular) {
    num.title = 'Celular';
    num.numero = item.apuestadeportiva_numero_celular;
  }
  return (
    <View styles={styles.container}>
      <View style={styles.containerHorizontal}>
        <View style={[styles.containerText, { width: '16%' }]}>
          <Text style={styles.title}>Id</Text>
          <Text style={styles.text}>{item.id}</Text>
        </View>
        <View style={[styles.containerText, { width: '34%' }]}>
          <Text style={styles.title}>{num.title}</Text>
          <Text style={styles.text}>{num.numero}</Text>
        </View>
        <View style={[styles.containerText, { width: '26%' }]}>
          <Text style={styles.title}>Valor</Text>
          <Text style={styles.text}>{FormatMoney(item.valor.toFixed(2))}</Text>
        </View>
        <View style={[styles.containerText, { width: '20%' }]}>
          <Text style={styles.title}>Hora</Text>
          <Text style={styles.text}>{item.fecha}</Text>
        </View>
      </View>
      <View style={styles.containerHorizontal}>
        <View style={[styles.containerText, { width: '20%' }]}>
          <Text style={styles.title}>Tipo</Text>
          <Text style={styles.text}>{item.tipo}</Text>
        </View>
        <View style={[styles.containerText, { width: '78%' }]}>
          <Text style={styles.title}>Observación</Text>
          <Text style={styles.text}>{item.observacion}</Text>
        </View>
      </View>
      
    </View>
  );
};

export const ItemReport = (props) => {
  const { item, styles = getStyles() } = props;

  return (
    <View styles={styles.container}>
      <View style={styles.containerHorizontal}>
        <View style={[styles.containerText, { width: '34%' }]}>
          <Text style={[styles.text, { alignSelf: 'flex-start' }]}>
            {item.product_id}
          </Text>
        </View>
        <View style={[styles.containerText, { width: '32%' }]}>
          <Text style={[styles.text, { alignSelf: 'center' }]}>
            {item.cantidad}
          </Text>
        </View>
        <View style={[styles.containerText, { width: '34%' }]}>
          <Text style={styles.text}>{FormatMoney(item.valor.toFixed(2))}</Text>
        </View>
      </View>
    </View>
  );
};

const getStyles = () => {
  const screenWidth = Math.round(Dimensions.get('window').width);
  const screenHeight = Math.round(Dimensions.get('window').height);
  if (screenWidth === 480 && screenHeight === 805) {
    return stylesLarge;
  } else {
    return stylesMedium;
  }
};

const stylesLarge = StyleSheet.create({
  container: {},
  containerHorizontal: {
    flexDirection: 'row',
  },
  icon: {
    fontSize: 30,
  },
  containerText: {
    width: '32%',
    marginLeft: '1%',
  },
  text: {
    alignSelf: 'center',
    fontSize: 16,
    margin: 4,
  },
  title: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 0,
  },
  titleSoat: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 0,
    color: 'white',
  },

  buttonIcon: {
    marginTop: 4,
    marginHorizontal: 10,
    backgroundColor: 'rgba(7,162,186,0.7)',
    marginVertical: '1%',
    borderRadius: 10,
  },
  input: {
    fontSize: 40,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
  inputSoat: {
    fontSize: 20,
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
  textInfo: {
    color: 'white',
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 22,
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: 'rgba(7,162,186,0.7)',
    marginVertical: '1%',
    borderRadius: 10,
  },
  buttonLabel: {
    fontSize: 22,
  },
  containerInput: {
    width: '100%',
    backgroundColor: 'white',
    marginVertical: '1%',
    borderRadius: 10,
    borderBottomWidth: 0,
  },
});

const stylesMedium = StyleSheet.create({
  container: {},
  containerHorizontal: {
    flexDirection: 'row',
  },
  containerText: {
    marginVertical: 4,
    width: '32%',
    marginLeft: '1%',
  },
  icon: {
    fontSize: 20,
  },
  text: {
    alignSelf: 'center',
    fontSize: 14,
    margin: 4,
  },
  title: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 0,
  },
  titleSoat: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 0,
    color: 'white',
  },

  buttonIcon: {
    marginHorizontal: 10,
    backgroundColor: 'rgba(7,162,186,0.7)',
    marginVertical: '1%',
    borderRadius: 10,
  },
  input: {
    fontSize: 18,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 20,
    marginHorizontal: 20,
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
  textInfo: {
    color: 'white',
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 18,
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: 'rgba(7,162,186,0.7)',
    marginVertical: '1%',
    borderRadius: 10,
  },
  buttonLabel: {
    fontSize: 18,
  },
  containerInput: {
    width: '100%',
    backgroundColor: 'white',
    marginVertical: '1%',
    borderRadius: 10,
    borderBottomWidth: 0,
  },
});
