import React, {PureComponent} from 'react';
import {Text, View,Alert,ImageBackground,ActivityIndicator,ScrollView,Image} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {StyleSheet} from 'react-native';
import {printBill, getPrintConfig} from '../bluetooth/bluetooth-printer';
import { USERS_SCHEMA } from '../../database/models/usersAdmin';
import {FormatMoney,Capitalize} from '../../shared/utilities/formats';
import {getTableFromDB} from '../../database/allSchemas';
import {Header} from '../../components/UI/header';
import {InputMoney} from '../../components/UI/input';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Transaction} from '../../services/products.service';
import { Camera } from '../../components/UI/camera';
import {SafeAreaView} from 'react-native-safe-area-context';
import { GetUsuarios } from '../../services/admin.service';
import NumberFormat from 'react-number-format';
import { GenerateInvoice } from '../../shared/utilities/GenerateInvoice';
export class ScreenPaySupplier extends PureComponent {
  constructor() {
    super();
    this.state = {
        allUsers: <></>,
        loading:false,
        showAnotherValueInput:false,
        stateButtons: [false, false, false, false, false],
        searchedValue:'',
        searchUsers:<></>,
        selectedPrice:'',
        resumen:false,
        foto:false,
        price:false,
        modalCamera:false,
        showSearch:false,
        dataBill: {
          amount: '',
          description: '',
        },
        modalShared:false,
        dataResponse:[]
    };
    this.users={};
    this.priceList = [10000, 20000, 30000, 50000, 'Otro'];
  }

  componentDidMount() {
    this.setState({loading:true})
    GetUsuarios(this.getUsers)
  }
  getUsers=(flag,res)=>{
    //this.setState({})
    if(flag){
            this.loadUsers(res.usuarios)
    }else{
        Alert.alert("Error","algo salio mal carga bolsa")
    }
    
 }
  loadUsers(data){
    //console.log("data de loadDatad",data)
    let row=[]
    data.forEach(element => {
      //el customer false es para los proveedores segun ads
        if(element.customer===false){
          row.push(
            <Button
                key={"package" }
                buttonStyle={styles.buttonPrice}
                titleStyle={{ color: "white", shadowColor: "black", shadowRadius: 2 }}
                type="outline"
                title={
                    <Text style={{
                        flexDirection: "row",
                        justifyContent: "space-around"
                    }}>
                        <Text style={styles.label}>{Capitalize(element.nombre + "\n")}</Text>
                        <Text style={styles.label}>{"Saldo=" + FormatMoney(element.saldo)}</Text>
                    </Text>
                }
                onPress={() => {
                    this.setState({
                        modalCargaBolsa: true,
                        idUserSelect:element.partner_id,
                        username:element.nombre
                    });
                }}
                    >
            </Button>
        )}
        
    });
    this.setState({searchUsers:row,allUsers:data,showSearch:true,loading:false})

  }

  buildPrices = () => {
    let row = [];
    for (let k = 0; k < this.priceList.length; k = k + 3) {
      row.push(
        <View key={'key' + k} style={styles.containerButtonPrice}>
          <Button
            titleStyle={styles.titleButton}
            containerStyle={styles.containerPriceButton}
            buttonStyle={[
              styles.buttonPrice,
              {
                backgroundColor: this.state.stateButtons[k]
                  ? '#bedb02'
                  : 'rgba(7,162,186,0.7)',
              },
            ]}
            title={FormatMoney(this.priceList[k])}
            onPress={() => {
              this.pressPrice(k);
            }}></Button>
          {k + 1 < this.priceList.length && (
            <Button
              titleStyle={styles.titleButton}
              containerStyle={styles.containerPriceButton}
              buttonStyle={[
                styles.buttonPrice,
                {
                  backgroundColor: this.state.stateButtons[k + 1]
                    ? '#bedb02'
                    : 'rgba(7,162,186,0.7)',
                },
              ]}
              title={FormatMoney(this.priceList[k + 1])}
              onPress={() => {
                this.pressPrice(k + 1);
              }}></Button>
          )}
          {k + 2 < this.priceList.length && (
            <Button
              titleStyle={styles.titleButton}
              containerStyle={styles.containerPriceButton}
              buttonStyle={[
                styles.buttonPrice,
                {
                  backgroundColor: this.state.stateButtons[k + 2]
                    ? '#bedb02'
                    : 'rgba(7,162,186,0.7)',
                },
              ]}
              title={FormatMoney(this.priceList[k + 2])}
              onPress={() => {
                this.pressPrice(k + 2);
              }}></Button>
          )}
        </View>,
      );
    }
    return row;
  };
  pressPrice = (index) => {
    const price = this.priceList[index];
    let stateButtons = [];
    for (let i = 0; i < this.state.stateButtons.length; i++) {
      if (i === index) {
        stateButtons.push(true);
      } else {
        stateButtons.push(false);
      }
    }
    if (price === 'Otro') {
      this.setState({
        showAnotherValueInput: true,
        selectedPrice: '',
        stateButtons: stateButtons,
      });
    } else {
      this.setState({
        showAnotherValueInput: false,
        selectedPrice: price,
        stateButtons: stateButtons,
        price:true
      });
    }
  };
  pressBuy=()=>{
    if (this.state.selectedPrice >= 10000) {
      this.setState({resumen:true})
        /* this.setState({loading: true});
        getPrintConfig(this.navigateToPrintConfig); */
      
    } else {
      Alert.alert('Atención', 'El valor debe ser mayor a $10.000');
    }
  }
  navigateToPrintConfig = (flag) => {
    if (flag) {
      this.setState({loading: false,modalCargaBolsa: false});
      this.props.navigation.navigate('Printer');
    } else {
      this.sendToOdoo();
    }
  };
  sendToOdoo=async()=>{
    try {
        this.setState({loading: true});
        let idProduct = -1;
        id = await AsyncStorage.getItem('CargaBolsa');
        idProduct = parseInt(id);
        console.log("idProduct",idProduct)
        if(!idProduct){
          Alert.alert(
            'Error',
            'Usted no tiene el ID de carga bolsa.',
            [{text: 'Volver', onPress: () =>this.setState({loading: false,modalCargaBolsa:false}) }],
          );
        }else{
            const product = {
            product_id: idProduct,
            atributes: {
              partner_id:this.state.idUserSelect,
              consignacion: this.state.image,
              tipo:'gasto',  
              precio: parseInt(this.state.selectedPrice),
            },
          };
          console.log("prodcuto de carga bolsa",product)
          await Transaction(product, this.navigateNext);
        }
        
        
      } catch (error) {
        Alert.alert('Error', 'Error inesperado.');
        this.setState({loading: false});
      }
  }
  navigateNext = (flag, response) => {
    console.log("flag del cargar bolsa jje",flag)
    console.log("response del cargar bolsa ejeje",response)
    if (flag) {
      this.setState({loading: false});
      const data = [
        'Factura No: ' + response.valida.id,
        'Producto: Carga Bolsa',
        'Fecha:' + response.valida.fecha,
        'Valor: ' + FormatMoney(this.state.selectedPrice),
      ];
      console.log("data de cargabolda",data)
      printBill(data);
      this.props.navigation.navigate('Home')
      Alert.alert('Movilgo',"¡Su transaccion fue exitosa!")
      
    } else {
      if(response.errores.observacion){
          Alert.alert(
                  'Error',
                  response.errores.observacion,
                  [{text: 'Volver', onPress: () =>this.setState({loading: false,modalCargaBolsa:false,resumen:false}) }],
                );
      }else {
          Alert.alert(
            'Error',
            'Algo salio mal Comunicate con movilgo',
            [{text: 'Volver', onPress: () =>this.setState({loading: false,modalCargaBolsa:false,resumen:false}) }],
          );
        
        
      }
      
      //this.setState({loading: false});
    }
  };
  searchUser=(searchedValue)=>{
    console.log("ccnsolde de allusers",this.state.allUsers)
     let newUsers = [];
        if (searchedValue.trim() === '') {
                this.state.allUsers.forEach(element => {
                    newUsers.push(
                        <Button
                            key={"package" }
                            buttonStyle={styles.buttonPrice}
                            titleStyle={{ color: "white", shadowColor: "black", shadowRadius: 2 }}
                            type="outline"
                            title={
                                <Text style={{
                                    flexDirection: "row",
                                    justifyContent: "space-around"
                                }}>
                                    <Text style={styles.label}>{Capitalize(element.nombre + "\n")}</Text>
                                    <Text style={styles.label}>{"Saldo=" + FormatMoney(element.saldo)}</Text>
                                </Text>
                            }
                            onPress={() => {
                                this.setState({
                                    modalCargaBolsa: true,
                                    idUserSelect:element.partner_id,
                                    username:element.nombre 
                                });
                            }}
                                >
                        </Button>
                    )
                })
                this.setState({ searchUsers: newUsers}); 
                return;
        }else{
            this.state.allUsers.forEach(element => {
                        if (element.nombre && (element.nombre.toLowerCase().includes(searchedValue.toLowerCase()))) {
                            //newUsers.push(element);
                            newUsers.push(
                                <Button
                                    key={"package" }
                                    buttonStyle={styles.buttonPrice}
                                    titleStyle={{ color: "white", shadowColor: "black", shadowRadius: 2 }}
                                    type="outline"
                                    title={
                                        <Text style={{
                                            flexDirection: "row",
                                            justifyContent: "space-around"
                                        }}>
                                            <Text style={styles.label}>{Capitalize(element.nombre + "\n")}</Text>
                                            <Text style={styles.label}>{"Saldo=" + FormatMoney(element.saldo)}</Text>
                                        </Text>
                                    }
                                    onPress={() => {
                                        this.setState({
                                            modalCargaBolsa: true,
                                            idUserSelect:element.partner_id,
                                            username:element.nombre
                                        });
                                    }}
                                        >
                                </Button>
                            )
                        }
                    });
                    this.setState({ searchUsers: newUsers});
                    return; 
        }
  }
  modalCamera = (flag, data) => {
    this.setState({modalCamera: flag, dataBill: data, modalBill: !flag,foto:true});
  };
  render() {
    const buttonsPrice = this.buildPrices();
    return (<>
      <SafeAreaView style={{flex: 1}}>
        <ImageBackground style={styles.background}source={require('../../assets/login/background.png')}>
            
              <Header title="PROVEEDORES DE MOVILGO" onPressBack={() => {this.props.navigation.goBack();}}></Header>
                  {this.state.showSearch&&<View style={[styles.containerInput]}>
                      <Input
                        value={this.state.searchedValue}
                        onChangeText={(searchedValue) => { this.setState({ searchedValue }); this.searchUser(searchedValue) }}
                        placeholder="Búsqueda"
                        inputStyle={{ fontSize: 22, borderBottomWidth: 0 }}
                        inputContainerStyle={{ borderBottomWidth: 0, width: '100%' }}
                        errorStyle={{ height: 0 }}
                        rightIcon={<Icon name="search"
                            size={34}></Icon>}>

                      </Input>
                  </View>}
                 
                <View style={styles.loading}>
                        <ActivityIndicator
                        size="large"
                        color="#0000ff"
                        animating={this.state.loading}>
                        </ActivityIndicator>
                </View>
                <ScrollView>
                    {this.state.searchUsers}
                </ScrollView>
                
                <Modal
                style={{flex: 1}}
                isVisible={this.state.modalCargaBolsa}
                onRequestClose={() => {this.setState({modalCargaBolsa: false,});}}
                onBackButtonPress={() => {this.setState({modalCargaBolsa: false,});}}
                onBackdropPress={() => {this.setState({modalCargaBolsa: false,});}}>
                <View style={{backgroundColor: '#02606e', borderRadius: 10}}>
                    <Text style={styles.label}>¿Cuanto desea cargar?</Text>
                    {this.state.image != '' && <Image style={{ height: 200, width: "90%", alignSelf: "center" }} 
                    source={{ uri: 'data:image/png;base64,' + this.state.image }} />}
                    {buttonsPrice}
                    {this.state.showAnotherValueInput && (
                    <InputMoney
                        value={'' + this.state.selectedPrice}
                        keyboardType="phone-pad"
                        handleChange={(name, selectedPrice) => {
                        
                        this.setState({selectedPrice,price:true});
                        }}
                        inputStyle={styles.input}
                        placeholder="Otro Valor"></InputMoney>
                    )}
                    <Button
                      buttonStyle={styles.button}
                      onPress={() => {
                        this.setState({
                          modalCamera: true,
                          image: '',
                          dataBill: {
                            amount: '',
                            description: '',
                          },
                        });
                      }}
                      title="Evidencia"
                      titleStyle={styles.titleButton}>
                      </Button>
                    <Button
                    disabled={!this.state.foto}
                    buttonStyle={[
                        styles.button,
                        {marginVertical: 30, padding: 10, minHeight: 70},
                    ]}
                    title="Resumen"
                    onPress={this.pressBuy}
                    //onPress={()=>{this.setState({resumen:true})}}
                    titleStyle={styles.titleButton}></Button>
                    <View style={styles.loading}>
                    </View>
                </View>
                </Modal>
                <Modal
                style={{flex: 1}}
                isVisible={this.state.resumen}
                onRequestClose={() => {this.setState({resumen: false,});}}
                onBackButtonPress={() => {this.setState({resumen: false,});}}
                onBackdropPress={() => {this.setState({resumen: false,});}}>
                <View style={{backgroundColor: '#02606e', borderRadius: 10}}>
                    <Text style={styles.label}>Resumen del carga bolsa</Text>
                    <View style={{ backgroundColor: 'rgb(2,96,110, 0.5)', borderRadius: 6, marginHorizontal: 10, marginVertical: 6, paddingBottom: 10, paddingTop: 6, paddingHorizontal: 10 }}>

                        <Text style={styles.label}>Nombre del usuario</Text>
                        <Text style={styles.label}>{Capitalize(this.state.username + "\n")}</Text>
                        <Text style={styles.label}>{"Precio: "+FormatMoney(this.state.selectedPrice)}</Text>
                        
                        
                    </View>
                    <Button
                    buttonStyle={[
                        styles.button,
                        {marginVertical: 30, padding: 10, minHeight: 70},
                    ]}
                    title="Cargar"
                    //onPress={this.pressBuy}
                    onPress={()=>{this.setState({loading: true})
                                  getPrintConfig(this.navigateToPrintConfig)}}
                    titleStyle={styles.titleButton}></Button>
                    
                    
                </View>
                
                </Modal>
                <Modal
                  style={{flex: 1}}
                  isVisible={this.state.modalCamera}
                  onRequestClose={() => {this.setState({modalCamera: false});}}
                  onBackButtonPress={() => {this.setState({modalCamera: false,});}}
                  onBackdropPress={() => {this.setState({modalCamera: false,});}}>
                    <Camera
                      data={this.state.dataBill}
                      modalCamera={(flag, data) => {
                        this.modalCamera(flag, data);
                      }}
                      image={(value) => {
                        this.setState({image: value});
                      }}
                    />
                </Modal>
                
   
          </ImageBackground>
        </SafeAreaView>
        </>)}

}
/* const getStyles = () => {
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);
    if (screenWidth === 480 && screenHeight === 805) {
        return stylesLarge;
    } else {
        return stylesMedium;
    }
} */
const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 8,
        color: 'white'
    },
    background: {
        height: '100%',
        width: '100%'
    },
    containerInput: {
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop:'10%',
        marginVertical: 14
    },
    inputPhone: {
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 6
    },buttonPrice: {
        borderRadius: 10,
        marginVertical: '1%',
        borderBottomWidth: 0,
        marginHorizontal: 10,
      },
      containerButtonPrice: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
      },
    containerContent: {
        width: '90%',
        height: '50%',
        marginHorizontal: '5%',
    },
    containerButton: {
        height: '38%',
        width: '100%',
        marginVertical: '1%',
        flexDirection: "row",
        justifyContent: "space-around",
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        height: '8%',
        width: '100%'
    },
    buttonImage: {
        alignItems: "center",
        margin: '30%',
        marginVertical: 0
    },
    containerPriceButton: {
        width: '33%',
    },
    input: {
        fontSize: 18,
        backgroundColor: 'white',
        borderRadius: 6,
        marginBottom: 10,
        marginTop: 20
    },
    buttonBuy: {
        backgroundColor: 'rgba(7,162,186,0.7)',
        padding: 10,
        marginVertical: 20
    },
    buttonPrice: {
        borderRadius: 10,
        marginVertical: '1%',
        borderBottomWidth: 0,
        marginHorizontal: 10,
        backgroundColor: '#02606e'
    },
    containerButtonPrice: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10
    },
    loading: {
        left: 0,
        right: 0,
        top: '-50%',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 10,
        color: 'white',
      },
    titleButton: {
        fontSize: 16
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: 'rgba(7,162,186,0.7)',
        marginVertical: '1%',
        borderRadius: 10,
      },
});