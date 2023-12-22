import React, {PureComponent} from 'react';
import { View,ImageBackground,StyleSheet, Alert,ActivityIndicator } from "react-native";
import { getOdooGastos } from "../../services/admin.service";
import { Header } from '../../components/UI/header';
import { SearchPicker } from '../../shared/picker/picker';
import { Transaction } from '../../services/products.service';
import AsyncStorage from '@react-native-community/async-storage';
import {Button,Input } from 'react-native-elements';
import {FormatMoney, Capitalize } from '../../shared/utilities/formats';
import {SafeAreaView} from 'react-native-safe-area-context';
import { InputMoney } from '../../components/UI/input';
export class ScreenUserGasto extends PureComponent {
    constructor() {
        super();
        this.state = {
            buttonImage:[<View key={'key' + 1}></View>],
            loading:false,
            listExpense:{},
            show:false,
            selectedExpense:{label:"selecione una opcion",value:-1},
            stateButtons: [false, false, false, false, false],
            loading:true
        },
        this.priceList = [10000, 20000, 30000, 50000, 'Otro'];
    }
    componentDidMount() {
        this.setState({loading:true})
        getOdooGastos(54,this.loadExpenses) 
         
     }
     loadExpenses=(flag,res)=>{
        
      if(flag){
        const row=[]
        res.productos.forEach(element => {
            row.push({label:element.name,value:element.id})
            
        });
        this.setState({listExpense:row,show:true,loading:false})
      }else{
        Alert.alert("Error","Se presneto un error consultando los datos")
        this.setState({loading:false})
      }

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
     sendToOdoo=async()=>{
      this.setState({loading:true})
        id = await AsyncStorage.getItem('CargaBolsa');
        const product = {
            product_id: parseInt(this.state.selectedExpense.value),
            atributes: {
              partner_id:this.state.idUserSelect,                
              tipo:"gasto",  
              precio: parseInt(this.state.selectedPrice),
              descripcion:this.state.observation,
              estado:'pendiente'
            },
          };
          console.log("jejejejeje",product)
        await Transaction(product, this.navigateNext)

     }
     navigateNext = (flag,response) => {
      this.setState({loading:false})  
      console.log("flag aplicar gastos ", flag)
      console.log("response de aplicar gastos ", response)
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
    render(){
        const buttonsPrice = this.buildPrices();
        return(
          <SafeAreaView style={{flex: 1}}>
            <View>
                <ImageBackground style={{height: '100%',width: '100%'}} source={require('../../assets/login/f.png')} >
                    <Header title="Gastos" onPressBack={() => { this.props.navigation.goBack() }}></Header>
                    {this.state.show&&<View style={{marginTop:40                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   ,justifyContent:'center',alignSelf:'center',width:'90%',borderColor:'rgba(7,162,186,0.7)',borderRadius:10,borderWidth: 2}}>
                        <View style={{width:'90%',height:'70%',justifyContent:'center',alignSelf:'center'}}>
                          <View style={{marginTop:'7%',height:'10%',marginBottom:this.state.showAnotherValueInput? '5%':'20%'}}>
                            <SearchPicker
                              style={{button: {marginHorizontal: 0}}}
                              value={this.state.selectedExpense}
                              items={this.state.listExpense}
                              onChange={(selectedExpense) => {
                              this.setState({selectedExpense});
                              }}
                          />
                          </View>
                            
                          {buttonsPrice}
                         {/*  {this.state.showAnotherValueInput &&
                            <Input
                                value={"" + this.state.selectedPrice}
                                keyboardType="phone-pad"
                                onChangeText={(selectedPrice) => {
                                    const re = /^[0-9\b]+$/
                                    if (selectedPrice === '' || re.test(selectedPrice)) {this.setState({ selectedPrice })
                                    }
                                }}

                                inputStyle={{fontSize: 18,backgroundColor: 'white',borderRadius: 6,marginBottom: 10,marginTop: 20}}
                                placeholder="Otro Valor">
                            </Input>
                        } */}
                        {this.state.showAnotherValueInput && (<View style={{height:'10%'}}>
                           <InputMoney
                            value={'' + this.state.selectedPrice}
                            keyboardType="phone-pad"
                            handleChange={(name, selectedPrice) => {
                            
                              this.setState({selectedPrice});
                            }}
                            inputStyle={{fontSize: 22,backgroundColor: 'white',borderRadius: 6,marginBottom: 10,height:'100%' }}
                            placeholder="Otro Valor"></InputMoney>
                        </View>
                         
                        )}
                          <Input
                                      inputContainerStyle={{fontSize: 18,backgroundColor: 'white',borderRadius: 6,marginTop:'20%',marginBottom:50}}
                                      placeholder="Observacion"
                                      onChangeText={(observation) => this.setState({ observation })}
                                      ></Input>
                          <Button /*disabled={this.state.loading || !this.state.checkPhone}*/
                              containerStyle={{height:'20%',marginTop:this.state.showAnotherValueInput ?'-20%':'0%'}}
                              title="Aplicar"
                              buttonStyle={{backgroundColor: 'rgba(7,162,186,0.7)',minHeight: 70,marginVertical: 20}}
                              onPress={this.sendToOdoo}
                              titleStyle={{fontSize:25,marginTop:'-5%'}}>
                          </Button>
                        </View>
                        

                        
                    </View>}
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}></ActivityIndicator>
                    </View>
                </ImageBackground>
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