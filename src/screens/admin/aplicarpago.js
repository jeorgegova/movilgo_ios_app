import React, {PureComponent} from 'react';
import {Text, View,Alert,ImageBackground,ActivityIndicator,Image,ScrollView, Dimensions, Animated} from 'react-native';
import {GetAplicarpagos,applyPayment,GetUsuarios} from '../../services/admin.service'
import { ButtonImage } from '../../components/UI/buttons';
import {StyleSheet} from 'react-native';
import { Header } from '../../components/UI/header';
import Modal from "react-native-modal";
import {Button,Input } from 'react-native-elements';
import { Capitalize } from '../../shared/utilities/formats';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {PinchableBox} from'../../shared/utilities/pichImage'
import { StartSync } from '../../shared/utilities/cronaplicarpago';


export class ScreenUserAPlicarPago extends PureComponent {
    constructor() {
        super();
        this.state = {
            buttonImage:[<View key={'key' + 1}></View>],
            loading:false,
            userSelecyed:{},
            searchUser:''

        }}
    
    componentDidMount() {
        this.setState({loading:true})
        
       
        //this.loadNotification(this.props.navigation)
        //this.createChannels()
        GetAplicarpagos(false,this.getApli)
        //StartSync(300,this.getApli)
        
         
     }
     getApli=(flag,res)=>{
        console.log("flag del aplicar pago",flag)
        console.log("res del aplicar pago",res.length)
        
        this.setState({loading:false})
        if(flag){
            if(res.length===0){
                this.loadPagos([])
                Alert.alert("","No tiene pagos por aplicar")
                
            }else{
                /* if(res.length>0){
                    this.testPush(res.length)
                }
                this.testPush(res.length) */
                this.loadPagos(res)
            }
        }else{
            Alert.alert("Error","algo salio mal aplicar pago")
        }
        //StartSync(300,this.getApli)
        
     }
     
     loadPagos=(data)=>{
        
        let buttons = []
        for (let k = 0; k < data.length; k = k + 1) {
            if(data[k].foto_id!==false){
            
                buttons.push(
                    <Button
                    key={"package" + k}
                    buttonStyle={styles.buttonPrice}
                    titleStyle={{ color: "white", shadowColor: "black", shadowRadius: 2 }}
                    type="outline"
                    title={
                        <Text style={{
                            flexDirection: "row",
                            justifyContent: "space-around"
                        }}>
                            <Text style={styles.label}>{Capitalize(data[k].name + "\n")}</Text>
                            <Text style={styles.label}>{"Valor= " + data[k].valor + "\n"}</Text>
                            <Text style={styles.label}>{"Descripcion= "+ data[k].descrpcion}</Text>
                        </Text>
                    }
                    onPress={() => {
                        this.setState({
                                userSelecyed:data[k],
                                modalInfoVisible:true
                            });
                        
                    }}
                >
                </Button>
                ) 
            }
        } 
        this.setState({ buttonImage: buttons,allUsers:data,showSearch:true});
     }
     AplicarPago=async(estado)=>{
        const data={
            "id":this.state.userSelecyed.id,
            "estado":estado,
        }
        console.log("data de envio",data)
        this.setState({loading:true})
        await applyPayment(data,estado,this.navigateNext)
     }

    navigateNext = (response,flag,estado) => {
        
        console.log("flag aplicar pago jeje", flag)
        console.log("response de aplicar pago jeje", response)
        if (flag) {
            if(estado==="aplicado"){
                Alert.alert('Movilgo', "¡Su pago fue exitosa!", [
                    {text: 'Ok', onPress: () => {GetAplicarpagos(false,this.getApli),
                        this.setState({ loading: false,modalInfoVisible:false,showSearch:false,buttonImage:[] });}},
                  ])
                
                
            }else{
                Alert.alert('Movilgo', "¡Su pago fue cancelado correctamente!", [
                    {text: 'Ok', onPress: () => {GetAplicarpagos(false,this.getApli),
                        this.setState({ loading: false,modalInfoVisible:false,showSearch:false ,buttonImage:[]});}},
                  ])
            }
            
        } else {
            if(response.data.arguments){
                Alert.alert(
                  'Error',
                  response.data.arguments[0],
                  [{text: 'Volver', onPress: () =>this.setState({loading: false,modalCargaBolsa:false,resumen:false}) }],
                );
              }else if(response.errores){
                
                Alert.alert('Movilgo', response.errores.observacion, [
                    {text: 'Ok', onPress: () => {GetAplicarpagos(false,this.getApli),
                        this.setState({ loading: false,modalInfoVisible:false,showSearch:false,buttonImage:[] });}},
                  ])
            }else{
                Alert.alert('Movilgo', "Se ha presentado un error, Comunicate con MovilGo", [
                    {text: 'Ok', onPress: () => {GetAplicarpagos(false,this.getApli),
                        this.setState({ loading: false,modalInfoVisible:false,showSearch:false ,buttonImage:[]});}},
                  ])
            }    
            this.setState({ loading: false, modalInfoVisible: false});

        }

    }
    searchUser=(user)=>{
        let newUsers = [];
        if (user.trim() === '') {
            for (let k = 0; k < this.state.allUsers.length; k = k + 1) {
                if(this.state.allUsers[k].foto_id!==false){
                    newUsers.push(
                        <Button
                        key={"package" + k}
                        buttonStyle={styles.buttonPrice}
                        titleStyle={{ color: "white", shadowColor: "black", shadowRadius: 2 }}
                        type="outline"
                        title={
                            <Text style={{
                                flexDirection: "row",
                                justifyContent: "space-around"
                            }}>
                                <Text style={styles.label}>{Capitalize(this.state.allUsers[k].name + "\n")}</Text>
                                <Text style={styles.label}>{"Valor= " + this.state.allUsers[k].valor + "\n"}</Text>
                                <Text style={styles.label}>{"Descripcion= "+ this.state.allUsers[k].descrpcion}</Text>
                            </Text>
                        }
                        onPress={() => {
                            this.setState({
                                    userSelecyed:this.state.allUsers[k],
                                    modalInfoVisible:true
                                });
                            
                        }}
                    >
                    </Button>
                    ) 
                }
            }
        }else{
            for (let k = 0; k < this.state.allUsers.length; k = k + 1) {
                if(this.state.allUsers[k].name&&(this.state.allUsers[k].name.toLowerCase().includes(user.toLowerCase()))&&this.state.allUsers[k].foto_id!==false){
                    newUsers.push(
                        <Button
                        key={"package" + k}
                        buttonStyle={styles.buttonPrice}
                        titleStyle={{ color: "white", shadowColor: "black", shadowRadius: 2 }}
                        type="outline"
                        title={
                            <Text style={{
                                flexDirection: "row",
                                justifyContent: "space-around"
                            }}>
                                <Text style={styles.label}>{Capitalize(this.state.allUsers[k].name + "\n")}</Text>
                                <Text style={styles.label}>{"Valor= " + this.state.allUsers[k].valor + "\n"}</Text>
                                <Text style={styles.label}>{"Descripcion= "+ this.state.allUsers[k].descrpcion}</Text>
                            </Text>
                        }
                        onPress={() => {
                            this.setState({
                                    userSelecyed:this.state.allUsers[k],
                                    modalInfoVisible:true
                                });
                            
                        }}
                    >
                    </Button>
                    ) 
                }
            }
        }
        this.setState({ buttonImage:newUsers});
    }
    
    render(){
        return(
            <SafeAreaView style={{flex: 1}}>
                <View>
                <ImageBackground style={styles.background} source={require('../../assets/login/f.png')} >
                        <Header title="Aplicar pagos" onPressBack={() => { this.props.navigation.goBack() }}></Header>
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
                            <ScrollView>
                                <View style={{width:'100%',height:'80%',margin: '1%',justifyContent: "space-around"}}>
                                    {this.state.buttonImage}
                                </View>    
                            </ScrollView>
                            <Image style={styles.footer} source={require('../../assets/login/footer.png')} resizeMode="stretch"></Image>
                    </ImageBackground>
                    <Modal
                        style={{ flex: 1 }}
                        isVisible={this.state.modalInfoVisible}
                        onRequestClose={() => { this.setState({modalInfoVisible: false});}}
                        onBackButtonPress={() => {this.setState({modalInfoVisible: false});}}
                        onBackdropPress={() => {this.setState({modalInfoVisible: false});}}
                    >
                            <View style={{ backgroundColor: 'rgba(7,162,186,0.7)', padding: 6, borderRadius: 10, }}>
                                <Text style={styles.title}>Aplicar Pago</Text>
                                <View>
                                    <View>
                                        {/*<PinchableBox imageUri={'data:image/png;base64,' + this.state.userSelecyed.foto_id}/> */}
                                        <Image
                                            style={{ height: 320, width:'100%', alignSelf: "center"}} source={{ uri: 'data:image/png;base64,' + this.state.userSelecyed.foto_id }} resizeMode='center'/>
                                    </View>
                                    <View style={{alignSelf: "center"}}>
                                        <Text>{"Nombre= "+ this.state.userSelecyed.name}</Text>
                                        <Text>{"Valor= "+ this.state.userSelecyed.valor}</Text>
                                        <Text>{"Descripcion= "+ this.state.userSelecyed.descrpcion}</Text>
                                    </View>
                                    
                                    <View style={{flexDirection: "row",justifyContent: "space-around"}}>
                                        <Button /*disabled={this.state.loading || !this.state.checkPhone}*/
                                        title="Aplicar Pago"
                                        buttonStyle={styles.buttonBuy}
                                        onPress={()=>{this.AplicarPago("aplicado")}}
                                        titleStyle={styles.titleButton}>
                                        </Button>
                                        <Button /*disabled={this.state.loading || !this.state.checkPhone}*/
                                            title="Cancelar Pago"
                                            buttonStyle={styles.buttonBuy}
                                            onPress={()=>{this.AplicarPago("cancelado")}}
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
    },
    buttonImage: {
        alignItems: "center",
        margin: '1%',
        aspectRatio: 1,
        backgroundColor:'black',
        marginVertical: -13
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
    buttonBuy: {
        backgroundColor: 'rgba(7,162,186,0.7)',
        padding: 10,
        minHeight: 70,
        marginVertical: 20
    },
})