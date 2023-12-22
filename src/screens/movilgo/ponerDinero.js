import React, {PureComponent} from 'react';
import {Text, View,Alert,ImageBackground,ActivityIndicator,Image,ScrollView} from 'react-native';
import {GetAplicarpagos,GetUsuarios} from '../../services/admin.service'
import {StyleSheet} from 'react-native';
import { Header } from '../../components/UI/header';
import Modal from "react-native-modal";
import {Button,Input } from 'react-native-elements';
import {FormatMoney, Capitalize } from '../../shared/utilities/formats';
import Icon from 'react-native-vector-icons/FontAwesome';
import { InputMoney } from '../../components/UI/input';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Transaction } from '../../services/products.service';
import AsyncStorage from '@react-native-community/async-storage';

export class ScreenUserPonerSacar extends PureComponent {
    constructor() {
        super();
        this.state = {
            loading:false,
            userSelected:{},
            allBottons:[],
            showAnotherValueInput:false,
            selectedPrice:'',
            stateButtons: [false, false, false, false, false],
            observation:''
        };
        this.priceList = [10000, 20000, 30000, 50000, 'Otro'];
    }
    
    componentDidMount() {
        this.setState({loading:true})
        GetUsuarios(this.getUsers) 
         
     }

     getUsers=(flag,res)=>{

        if(flag){
            this.loadUsers(res.usuarios)
              
            
        }else{
            Alert.alert("Error","algo salio mal useradmin")
        }
        
     }
     loadUsers(data){
        //console.log("data del loadUsers",data)
        let row=[]
        data.forEach(element => {
            if(element.customer===true){
              //console.log("this.props.route.params.usuario==&&element.customer===true",element)
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
                        //console.log("user selecionado element",element)
                        this.setState({
                            modalInfoVisible:true,
                            userSelected:element
                        });
                    }}
                        >
                </Button>
            )}
            
        });
        this.setState({allBottons:row,allUsers:data,showSearch:true,loading:false})
    
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
    clearData=()=>{
        this.setState({
            selectedPrice:'',
            stateButtons: [false, false, false, false, false],
            observation:'',
            modalInfoVisible: false 
        })
    }  
    verifyData=async(estado)=>{
        if(this.state.selectedPrice<1000){
            Alert.alert("Error","El valor debe ser superior a $1000")
        }else if(this.state.observation===''){
            Alert.alert("Error","La observacion es obligatoria")
        }else{
            try {
               
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
                    this.sendToOdoo(estado,idProduct)
                    
                }
                
              } catch (error) {
                Alert.alert('Error', 'Error inesperado.');
                this.setState({loading: false});
              }
        }
    }  
   
    sendToOdoo=async(estado,idProduct)=>{
        this.setState({loading:true})
        const product = {
            product_id: idProduct,
            clienteexterno_user_id:this.state.userSelected.id,
            atributes: {              
              tipo:estado,  
              precio: parseInt(this.state.selectedPrice),
              descripcion:this.state.observation,
              estado:'pendiente'
            },
          };
          console.log("prodcuto de poner dinero",product)
          await Transaction(product, this.navigateNext);
    }

    navigateNext = (flag,response) => {
        
        console.log("flag aplicar pago jeje", flag)
        console.log("response de aplicar pago jeje", response)
        this.setState({loading:false})
        if (flag) {
          if(response.errores){
            Alert.alert('Error',response.errores.observacion , [
              {text: 'Ok', onPress: () => {this.clearData()}},
            ])
          }else{
            Alert.alert('Movilgo',"¡Su transaccion fue exitosa!")
            this.props.navigation.navigate("Home", { balance: response.valida.balanceFinal });
          }
            
        } else {
            if(response.data){
                Alert.alert(
                  'Error',
                  response.data.arguments[0],
                  [{text: 'Volver', onPress: () =>this.setState({loading: false,modalCargaBolsa:false,resumen:false}) }],
                );
              }else if(response.errores){
                
                Alert.alert('Movilgo', response.errores.observacion, [
                    {text: 'Ok', onPress: () => {GetAplicarpagos(this.getApli),
                        this.setState({ loading: false,modalInfoVisible:false,showSearch:false });}},
                  ])
            }else{
                Alert.alert('Movilgo', "Se ha presentado un error, Comunicate con MovilGo", [
                    {text: 'Ok', onPress: () => {GetAplicarpagos(this.getApli),
                        this.setState({ loading: false,modalInfoVisible:false,showSearch:false });}},
                  ])
            }    
            this.setState({ loading: false, modalInfoVisible: false});

        }

    }
    searchUser=(searchedValue)=>{
        //console.log("ccnsolde de allusers",this.state.allUsers)
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
                                  this.setState({
                                    modalInfoVisible:true,
                                    userSelected:element
                                  });
                              }}
                                    >
                            </Button>
                        )
                    })
                    this.setState({ allBottons: newUsers}); 
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
                                          this.setState({
                                            modalInfoVisible:true,
                                            userSelected:element
                                          });
                                      }}
                                            >
                                    </Button>
                                )
                            }
                        });
                        this.setState({ allBottons: newUsers});
                        return; 
            }
    }
    
    render(){
        const buttonsPrice = this.buildPrices();
        return(
          <SafeAreaView style={{flex: 1}}>
            <View>
               <ImageBackground style={styles.background} source={require('../../assets/login/f.png')} >
                    <Header title="Cargue y Retiro" onPressBack={() => { this.props.navigation.goBack() }}></Header>
                        {this.state.showSearch&&<View style={[styles.containerInput]}>
                            <Input
                                value={this.state.searchUser}
                                onChangeText={(searchUser) => { this.setState({ searchUser }); this.searchUser(searchUser) }}
                                placeholder="Búsqueda"
                                inputStyle={{ fontSize: 22, borderBottomWidth: 0 }}
                                inputContainerStyle={{ borderBottomWidth: 0, width: '100%' }}
                                errorStyle={{ height: 0 }}
                                rightIcon={<Icon name="search"
                                    size={34}></Icon>}>

                            </Input>

                        </View>}
                        <ActivityIndicator style={styles.loading} size="large" color="#0000ff" animating={this.state.loading}></ActivityIndicator>
                    
                        <ScrollView>
                                {this.state.allBottons}
                                <View style={{height: 100}}></View> 
                                
                                
                        </ScrollView>
                        <Image style={styles.footer} source={require('../../assets/login/footer.png')} resizeMode="stretch"></Image>
                </ImageBackground>
                <Modal
                    style={{ flex: 1 }}
                    isVisible={this.state.modalInfoVisible}
                    onRequestClose={() => { this.clearData();}}
                    onBackButtonPress={() => {this.clearData();}}
                    onBackdropPress={() => {this.clearData();}}
                >
                        <View style={{ backgroundColor: 'rgba(7,162,186,0.7)', padding: 6, borderRadius: 10, }}>
                            
                            <View>
                                <View>
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
                                </View>
                                <Input
                                    inputContainerStyle={styles.input}
                                    placeholder="Observacion"
                                    onChangeText={(observation) => this.setState({ observation })}
                                    >
                                </Input>
                                <View style={{alignSelf: "center"}}>
                                    <Text>{"Nombre= "+ this.state.userSelected.nombre}</Text>
                                </View>
                                
                                <View style={{flexDirection: "row",justifyContent: "space-around"}}>
                                    <Button /*disabled={this.state.loading || !this.state.checkPhone}*/
                                    title="Poner Dinero"
                                    buttonStyle={styles.buttonBuy}
                                    onPress={()=>{this.verifyData("ponerdinero")}}
                                    titleStyle={styles.titleButton}>
                                    </Button>
                                   
                                </View>                                
                            </View>

                        </View>
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}></ActivityIndicator>
                    </View>
                </Modal>
                
            </View>
          </SafeAreaView>
        )
    } 

}

const styles = StyleSheet.create({
    containerButton: {
        height: '25%',
        width: '100%',
        marginVertical: '10%',
        flexDirection: "row",
        justifyContent: "space-around",
    },containerInput: {
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop:'10%',
        marginVertical: 14
    },labelPrice: {
        textAlign: "right",
        fontSize: 30,
        color: '#bedb02'
    },buttonPrice: {
        borderRadius: 10,
        marginVertical: '3%',
        width:'92%',
        borderBottomWidth: 0,
        marginHorizontal: 10,
        backgroundColor: 'rgba(7,162,186,0.7)'
    },input: {
        fontSize: 18,
        backgroundColor: 'white',
        borderRadius: 6,
        marginBottom: 10,
        marginTop: 20
    },
    containerContent: {
        width: '90%',
        height: '50%',
        marginHorizontal: '5%',
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        height: '6%',
        width: '100%'
    },background: {
        height: '100%',
        width: '100%'
    },loading: {
        left: 0,
        right: 0,
        top: '-50%',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 10,
        color: 'white'
    },
    titleButton: {
        fontSize: 16
    },
    containerPriceButton: {
        width: '33%',
    },
    buttonBuy: {
        backgroundColor: 'rgba(7,162,186,0.7)',
        padding: 10,
        minHeight: 70,
        marginVertical: 20
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: 'rgba(7,162,186,0.7)',
        marginVertical: '1%',
        borderRadius: 10,
      },
    containerButtonPrice: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
      },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 10,
        color: 'white',
      },
})