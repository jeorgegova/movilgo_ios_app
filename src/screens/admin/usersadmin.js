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
import { GetUsuarios,GetClient,GetMembers,GetTarifa } from '../../services/admin.service';
import { ButtonImage } from '../../components/UI/buttons';
import { GenerateInvoice } from '../../shared/utilities/GenerateInvoice';
import {SafeAreaView} from 'react-native-safe-area-context';
export class ScreenUserAdmin extends PureComponent {
  constructor() {
    super();
    this.state = {
        allUsers: <></>,
        loading:false,
        showAnotherValueInput:false,
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
  }

  componentDidMount() {
    this.setState({loading:true})
    console.log("this.props.route.params.usuario",this.props.route.params.usuario)
    if(this.props.route.params.usuario){
      //movilgo traera sus hijos
        GetUsuarios(this.getUsers)
    }else{
      // perfil de administrador traera sus hijos
        GetMembers(this.getUsers)
    }
    
  }
  getUsers=(flag,res)=>{

    if(flag){
        if(this.props.route.params.usuario){
          this.loadUsers(res.usuarios)
        }else{
          this.loadUsers(res.team_members_ids)
        }    
        
    }else{
        Alert.alert("Error","algo salio mal useradmin")
    }
    
 }
  loadUsers(data){
    console.log("data del loadUsers",data)
    let row=[]
    data.forEach(element => {
      //la primer validacion solo ingrsara los hijos de movilgo que no sean proveedores
        if(this.props.route.params.usuario=="movilgo"&&element.customer===true){
          console.log("this.props.route.params.usuario==&&element.customer===true",element)
          row.push(
            <Button
                key={"package" }
                buttonStyle={styles.button}
                titleStyle={{ color: "white", shadowColor: "black", shadowRadius: 2 }}
                type="outline"
                title={
                    <Text style={{
                        flexDirection: "row",
                        justifyContent: "space-around"
                    }}>
                        <Text style={styles.label}>{Capitalize(element.nombre + "\n")}</Text>    
                    </Text>
                }
                onPress={() => {
                    GetClient(element.id,this.getClient)
                    this.setState({
                        loading:true
                    });
                }}
                    >
            </Button>
        )}else{
          //este solo cargara los hijos de los distribuidores
          console.log("hijos",element)
          row.push(
            <Button
                key={"package" }
                buttonStyle={styles.button}
                titleStyle={{ color: "white", shadowColor: "black", shadowRadius: 2 }}
                type="outline"
                title={
                    <Text style={{
                        flexDirection: "row",
                        justifyContent: "space-around"
                    }}>
                        <Text style={styles.label}>{Capitalize(element.nombre + "\n")}</Text>    
                    </Text>
                }
                onPress={() => {
                    GetClient(element.id,this.getClient)
                    this.setState({
                        loading:true
                    });
                }}
                    >
            </Button>
        )
        }
        
    });
    this.setState({searchUsers:row,allUsers:data,showSearch:true,loading:false})

  }
  getClient=(flag,response)=>{
    console.log("getClient ",flag,response)
    this.setState({loading:false})
    if(flag){
        GetTarifa((fla,res)=>{
          if(fla){
            this.props.navigation.navigate('RegisterAdmin',{data:response,tarifa:res.product_pricelist});
          }else {
            Alert.alert('Error', 'Error al obtener las tarifas');
          }
        })

    }else{
      Alert.alert('Error', 'Error al obtener los datos del cliente');
    }
   
    
  }



  navigateToPrintConfig = (flag) => {
    if (flag) {
      this.setState({loading: false});
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
            [{text: 'Volver', onPress: () =>this.setState({loading: false}) }],
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
      this.setState({modalShared:true,dataResponse:data})
            
      
    } else {
      if(response.errores.observacion){
          Alert.alert(
                  'Error',
                  response.errores.observacion,
                  [{text: 'Volver', onPress: () =>this.setState({loading: false,resumen:false}) }],
                );
      }else {
          Alert.alert(
            'Error',
            'Algo salio mal Comunicate con movilgo',
            [{text: 'Volver', onPress: () =>this.setState({loading: false,resumen:false}) }],
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
                            buttonStyle={styles.button}
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
                              GetClient(element.id,this.getClient)
                              this.setState({
                                  loading:true
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
                                    buttonStyle={styles.button}
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
                                      GetClient(element.id,this.getClient)
                                      this.setState({
                                          loading:true
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

  render() {
    return (<>
      <SafeAreaView style={{flex: 1}}>
        <ImageBackground style={styles.background}source={require('../../assets/login/background.png')}>
            
              <Header title="Mis Usuarios" onPressBack={() => {this.props.navigation.goBack();}}></Header>
                  <View style={{width:'40%',marginLeft:'60%'}}>
                  <Button
                      buttonStyle={styles.button}
                      onPress={() => {
                        this.setState({loading:true})
                        GetTarifa((fla,res)=>{
                          if(fla){
                            this.props.navigation.navigate('RegisterAdmin',{data:"",tarifa:res.product_pricelist});
                          }else {
                            Alert.alert('Error', 'Error al obtener las tarifas');
                          }
                        })
                      }}
                      title="Nuevo Usuario"
                      titleStyle={styles.titleButton}>
                      </Button>
                  </View>
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
                {this.state.modalShared&&<GenerateInvoice isVisible={this.state.modalShared} data={this.state.dataResponse} closeModal={(flag)=>{this.setState({modalShared:flag})
                                                                                                                              this.props.navigation.navigate('Home');}} title="Tu recarga fue exitosa!"/>}
   
                <ScrollView>
                    {this.state.searchUsers}
                    <View style={{height: 100}}>
                    {/* Este view permite darle mas pixeles al scroll para desplazarse  */}
                    </View>
                </ScrollView>
            
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