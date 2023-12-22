import React, { useState,useEffect } from 'react';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import { ToastAndroid, View,Text,Image, StyleSheet,TouchableOpacity,PermissionsAndroid} from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import Modal from "react-native-modal";
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ButtonImage } from '../../components/UI/buttons';
import Share from 'react-native-share';
export const GenerateInvoice = (props) => {
  const { isVisible, data,closeModal,title} = props;
  useEffect(()=>{
    console.log("ingreso algenerate invoice")
    getPermition()
  },[])
  const loadData=async(tipo)=>{
    //await getPermition()
    const pathImpresion = `${RNFS.DownloadDirectoryPath}/Movilgo/Facturas`;
    //const pathImpresion = `/storage/emulated/0/Movilgo/Facturas`;
    console.log("jojoj",pathImpresion)
    RNFS.mkdir(pathImpresion).then((success) => {
      console.log('pathImpresion ',success);
    })
    .catch(err => {
      console.log("error del pathImpregetAllExternalFilesDirssion ",err.message);
    });;
     try{
      let html = `
              <html>

                <head>
                  <style>
                    body {
                      font-family: 'Helvetica';
                      font-size: 12px;
                    }dataer, footer {
                      height: 50px;
                      background-color: #fff;
                      color: #000;
                      display: flex;
                      justify-content: center;
                      padding: 0 20px;
                    }
                    table {
                      width: 100%;
                      border-collapse: collapse;
                    }
                    th, td {
                      border: 1px solid #000;
                      padding: 5px;
                    }
                    th {
                      background-color: #ccc;
                    }
                  </style>
                </head>
                <body>
                  <h1>'MóvilGo S.A.S'</h1>
                  <h5>Buenas e inteligentes ideas</h5>
                  <h5>NIT: 901.330.856-1</h5>
                  <h5>Carrera 23#62-39(AV.Santander)</h5>
                  <h5>ED.Capitalia OF-404B</h5>
                  <h5>606 879 3340</h5> `

                  for (const item of data) {
                    html+= item +"<br>";
                  }
              html+=   `</body>
              </html>
            `;
            //console.log("julian",html)
            const options = {
              html,
              fileName: `FacturaMovilgo`,
              directory: '/',
            };

            const file = await RNHTMLtoPDF.convert(options);
            console.log("file ",file.filePath)


            if(tipo=='share'){
              sendMessage(file.filePath,pathImpresion)
            }else{
              generatPdf(file.filePath,pathImpresion)

            }
            
     }catch(err){

     }  

  }
  const generatPdf=async(filePath,pathImpresion)=>{
      
     try{
          RNFS.exists(filePath).then(status => {
              if (status) {
                console.log('Si Existe el PDF');
                RNFS.copyFile(
                  filePath,
                  pathImpresion + '/Factura.pdf',
                ).then(async success => {
                 // await PdfScreen(pathImpresion + '/Factura.pdf')
                  try{
                    SendIntentAndroid.openFileChooser({
                    fileUrl:pathImpresion + '/Factura.pdf',
                    type: "application/pdf"
                    });
                }catch(err){
                    console.log("erro del senditenb",err)
                  }
                      ToastAndroid.show("Pdf fenerado en /Download/Movilgo/Facturas", ToastAndroid.LONG);
                      closeModal(false)
                  })
                  .catch(err => {
                    console.log('Error: ' + err.message); // <--- but copyFile returns "doesn't exists" error for temp.jpg
                    alert('Error Creando el PDF');
                  }).finally(() => {
                    RNFS.unlink(filePath)
                      .then(() => {
                        console.log('Pdf original eliminado');
                      })
                      .catch(err => {
                        console.log(err.message);
                      });
                  });
              } else {
                console.log('File not exists');
              }
            });
            
    }catch(err){
      console.log("erro del crear el pdf",err)
      //return false
    }
  }
  
  const sendMessage=async(filePath,pathImpresion)=>{
      
       try{
        
            RNFS.exists(filePath).then(status => {
                if (status) {
                  console.log('Si Existe el PDF');
                  RNFS.copyFile(
                    filePath,
                    pathImpresion + '/Factura.pdf',
                  ).then(async success => {
                    console.log("success del copifile",success)
                        try{
                          closeModal(false)
                            const shareJCC = await Share.open({type:'application/pdf',url:'file://'+pathImpresion + '/Factura.pdf'}); 
                      }catch(err){
                          console.log("erro del senditenb",err)
                        }
                    })
                    .catch(err => {
                      console.log('Error: ' + err.message); // <--- but copyFile returns "doesn't exists" error for temp.jpg
                      alert('Error Creando el PDF');
                    }).finally(() => {
                      RNFS.unlink(filePath)
                        .then(() => {
                          console.log('Pdf original eliminado');
                        })
                        .catch(err => {
                          console.log(err.message);
                        });
                    });
                } else {
                  console.log('File not exists');
                }
              });
              
      }catch(err){
        console.log("erro del crear el pdf",err)
        //return false
      }

  }
  const getPermition=async()=>{
    console.log("ingreso al getPermition")
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      console.log("granted",granted)
    } catch (err) {
      console.error("la cagamos",err);
    }
    const readGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    const writeGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    console.log("readGranted,writeGranted",readGranted,writeGranted)
    if (!readGranted || !writeGranted) {
      console.log('Sin permisos de lectura y escritura');
      return;
    }
  }
  
  return(
        <Modal
            style={{ flex: 1 }}
            isVisible={isVisible}
            onRequestClose={() => closeModal(false)}
            onBackButtonPress={() => closeModal(false)}
            onBackdropPress={() => closeModal(false)}
        >
            <View style={{backgroundColor:'white',borderRadius:20}}>
            <View style={{  paddingVertical: 10,borderTopEndRadius:20,borderTopStartRadius:20 }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: '20%' }}></View>
                    <View style={{ width: '60%' }}>
                        <Text style={{ fontSize: 20,color:'#1EAAC1', fontWeight: 'bold', alignSelf: 'center', marginVertical: 10 }}>{title}</Text>
                    </View>
                    <View style={{ width: '20%' }}>
                        <Button
                            buttonStyle={{ width: 40, alignSelf: "flex-end", marginRight: 10 }}
                            type="clear"
                            icon={<Icon name="close" size={24} color='#1EAAC1' ></Icon>}
                            onPress={() => closeModal(false)}
                        ></Button>
                    </View>
                </View>
            </View>
              <View style={{flexDirection:'row',height:'20%' ,justifyContent:'space-between',width:'50%',alignSelf:'center',marginTop:'10%'}}>
                    {/* <Icon onPress={()=>loadData("file")} name="file" size={50} color='black' ></Icon>
                    <Icon onPress={()=>loadData("share")} name="share" size={50} color='black' ></Icon> */}
                    {/* <ButtonImage
                    onPress={() => loadData("file")}
                    styleButton={{width:'100%'}}
                    image={require('../../assets/pagos/pdf.png')}></ButtonImage>
                    <ButtonImage
                    onPress={() => loadData("share")}
                    styleButton={{width:'100%'}}
                    image={require('../../assets/pagos/compartir.png')}></ButtonImage> */}

                    <TouchableOpacity onPress={() => loadData("file")} style={{width:60,height:60}}>
                        <Image style={styles.image} source={require('../../assets/pagos/pdf.png')} resizeMode='center'></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => loadData("share")} style={{width:60,height:60}}>
                        <Image style={styles.image} source={require('../../assets/pagos/compartir.png')} resizeMode='center'></Image>
                    </TouchableOpacity>
              </View>
             
            </View>
        </Modal>
  )
    

}

const styles = StyleSheet.create({
  image: {
      height: 60,
      width: 60
  }
});