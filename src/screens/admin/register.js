import React, {PureComponent} from 'react';
import {CheckBox ,View,ScrollView ,StyleSheet,Text,Picker,Alert,ActivityIndicator} from 'react-native';
import { Header } from '../../components/UI/header';
import { Button, Input } from 'react-native-elements';
//import { Picker } from '@react-native-community/picker';
import { registUser,updateClient } from '../../services/admin.service';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Capitalize } from '../../shared/utilities/formats';
import AsyncStorage from '@react-native-community/async-storage';
import { InputMoney } from '../../components/UI/input';
import { updatePassword } from '../../services/admin.service';
import {SafeAreaView} from 'react-native-safe-area-context';
import Modal from "react-native-modal";
export class ScreenRegister extends PureComponent{
    constructor() {
        super();
        this.state = 
         {  update:false,    
            nombre1: "",
            nombre2: "",
            apellido1: '',
            apellido2: '',      
            identificacion: '',
            email:'',
            celular: '',                   
            clave: '', 
            street:'',  
            idadmin:'',
            tope:'',
            group:'',
            username:'',
            newpassword:'',
            repeateClave:"",
            loading:false,
            tarifasoptions:[],
            errorsname: '',
            errorslastname: '',
            errorsmobile: '',
            errorsidentification:'',
            errorsemail:'',
            errorsmobil:'',
            errorsadress: '',
            errorspassword:'',
            errorsreppeatpasword:'',
            errorgroup:false,
            errorsusername:'',
            tarifa:-1,
            aplicadatosmoviles:false,
            aplicagenerarlink:false
        } 

    }
    componentDidMount = () => {//0
        //console.log("this.props.route.params.data",this.props.route.params.data)
        //console.log("this.props.route.params.tarifa",this.props.route.params.tarifa)
        this.get()
    }
    get=async()=>{
        console.log("esto ingreso 2",this.props.route.params.data)

        const session_ids = await AsyncStorage.getItem("session_ids");
        let _client = JSON.parse(session_ids);
        this.setState({idadmin:_client.uid})
        this.setState({tarifasoptions:this.props.route.params.tarifa})
        if(this.props.route.params.data!==''){
            this.setState({
            id:this.props.route.params.data.id,    
            update:true,    
            nombre1: this.props.route.params.data.x_name1,
            nombre2: this.props.route.params.data.x_name2,
            apellido1: this.props.route.params.data.x_lastname1,
            apellido2: this.props.route.params.data.x_lastname2,      
            identificacion: this.props.route.params.data.xidentification,
            email:this.props.route.params.data.email,            
            celular: this.props.route.params.data.mobile,                   
            clave: this.props.route.params.data.clave,
            street:this.props.route.params.data.street,  
            tope:this.props.route.params.data.tope,
            username:this.props.route.params.data.login,
            tarifa:this.props.route.params.data.property_product_pricelist_id,
            aplicadatosmoviles:this.props.route.params.data.aplicadatosmoviles,
            aplicagenerarlink:this.props.route.params.data.aplicagenerarlink,
        })

            if(this.props.route.params.data.permiso==="administrador"){
                this.setState({group:"in_group_55"})
            }else if(this.props.route.params.data.permiso==="vendedor"){
                this.setState({group:"in_group_56"})
            }else{
                this.setState({group:"in_group_57"})
            }  
            
        }

        //console.log("user id del clientte",userid)
    }
    verifyField = (name1,lasname,identification,email,mobil,adress,password,tarifa,username,tope) => {
        //console.log("this.state.group verifyField",this.state.group)
        if(name1===true){
            if (this.state.nombre1 === '') {
                this.setState({errorsname:"Campo obligatorio"})
                return false
            }else if (this.state.nombre1.length < 2 ) { 
                this.setState({errorsname:"Información incompleta"})
                return false
            }else{
                this.setState({errorsname:""})
            } 
        } 
        if(tope===true){
            if (this.state.tope === "") {
                console.log("esto ingreso al tope vacio")
                //Alert.alert("Error, ", "Campo obligatorio");
                this.setState({errorstope:"Campo obligatorio"})
                return false
            }else if (this.state.tope < 50000&& !this.state.update ) { 
                //Alert.alert("Error, ", "El valor debe de ser mayor a 50.000");
                this.setState({errorstope:"El valor debe de ser mayor a 50.000"})
                return false
            }else{
                this.setState({errorstope:""})
            } 
        } 
        if(lasname===true){
            if (this.state.apellido1 === '') {
                this.setState({errorslastname:"Campo obligatorio"})
                return false               
            }else if(this.state.apellido1.length < 1 ) { 
                this.setState({errorslastname:"Información incompleta"})
                return false               
            }else{
                this.setState({errorslastname:""})
            } 
        }
        if(identification===true){
            if (this.state.identificacion === '') { 
                this.setState({errorsidentification:"Campo obligatorio"})
                return false               
            }else if(this.state.identificacion.length < 2 ) { 
                this.setState({errorsidentification:"Información incompleta"})
                return false               
            }else{
                this.setState({errorsidentification:""})
            } 
        } 
        if(email===true){
            if (this.state.email=== '') { 
                this.setState({errorsemail:"Campo obligatorio"})
                return false               
            }else if(!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)  ) { 
                this.setState({errorsemail:"El formato del email es icorrecto"})
                return false               
            }else{
                this.setState({errorsemail:""})
            } 
        } 
        if(mobil===true){
            if (this.state.celular === '') { 
                this.setState({errorsmobile:"Campo obligatorio"})
                return false               
            }else if(this.state.celular.length ==="10"  ) {
                this.setState({errorsmobile:"Información incompleta"})
                return false               
            }else{
                this.setState({errorsmobile:""})
            } 
        }
        if(adress===true){
            if (this.state.street === '') { 
                this.setState({errorsadress:"Campo obligatorio" })
                return false               
            }else{
                this.setState({errorsadress:""})
            } 
        }
        if(password===true){
            if (this.state.clave === '') { 
                this.setState({errorspassword:"Campo obligatorio" })
                return false               
            }else if ( this.state.clave.length <"4") {
                this.setState({errorspassword:"Contraseña demasiado corta" })
                return false  
            }else{
                this.setState({errorspassword:""})
            } 
        }
        if(tarifa===true){
            if (this.state.tarifa ===-1) { 
                this.setState({errortarifa:true})
                return false               
            }else{
                this.setState({errortarifa:false})
            } 
        } 
        if(username==true){
            if (this.state.username === '') { 
                this.setState({errorsusername:"Campo obligatorio"})
                return false               
            }else if (this.state.username.length<2) {
                this.setState({errorsusername:"El usuario en demasiado corto"})
                return false  
            }else{
                this.setState({errorsusername:""})
            } 
        }
    
        return true        
        
     }
    sendDatos=()=>{
        //console.log("this.state.tope",this.state.tope)
        //console.log("loading",this.state.loading)
        let group={in_group_55:false,in_group_56:false,in_group_57:false}
        this.setState({errorgroup:false})
        if(this.state.group==="in_group_55"){
            group={in_group_55:true,in_group_56:false,in_group_57:false}
        }else if(this.state.group==="in_group_56"){
            group={in_group_55:false,in_group_56:true,in_group_57:false}
            this.setState({errorgroup:false})
        }else if(this.state.group==="in_group_57"){
            group={in_group_55:false,in_group_56:false,in_group_57:true}
            this.setState({errorgroup:false})
        }else{
            this.setState({errorgroup:true})
            return
        }
        
        if(this.verifyField(true,true,true,true,true,true,true,true,true,true)&&!this.state.update){
            this.setState({loading:true})
            
            let strNumber = this.state.identificacion.substr(this.state.identificacion.length - 4,this.state.identificacion.length);
            let sendData={
                        id:this.state.idadmin,
                        cliente:{
                            team_members_ids:[[0,this.state.idadmin,{
                                comment:false,
                                codigo:strNumber,
                                message_follower_ids:false,
                                create_date:false,
                                personType:1,
                                permiso:false,
                                team_papas:[],
                                property_product_pricelist_id:this.state.tarifa,
                                team_hijos:[],
                                x_name1 : this.state.nombre1,
                                in_group_70: false,
                                x_name2 : this.state.nombre2,
                                x_lastname1:this.state.apellido1,
                                x_lastname2:this.state.apellido2,
                                in_group_55: group.in_group_55,
                                in_group_56: group.in_group_56,
                                in_group_57: group.in_group_57,
                                xidentification:this.state.identificacion,
                                message_ids:false,
                                email:this.state.email,
                                child_ids:[],
                                aplicadatosmoviles:this.state.aplicadatosmoviles,
                                aplicagenerarlink:this.state.aplicagenerarlink,
                                phone:false,
                                active:true,
                                tope:this.state.tope,
                                mobile:this.state.celular,
                                doctype:13,
                                street:this.state.street,
                                caja_id:false,
                                login:this.state.username,
                                clave:this.state.clave,
                            }]]
                        }
                        
                        
                    }
            console.log("esto tiene sendData",sendData)
            console.log("esto tiene sendData.cliente.team_members_ids",sendData.cliente.team_members_ids)
            console.log("esto tiene this.state.identificacion.substr",this.state.identificacion.substr(0,-4))
            registUser(sendData,this.recibedata)
        }else if(this.verifyField(true,true,true,true,true,true,true,true,true,true)&&this.state.update){
            this.setState({loading:true})
            let data={
                    codigo:this.state.identificacion,
                    personType:1,
                    x_name1 : this.state.nombre1,
                    in_group_70: false,
                    x_name2 : this.state.nombre2,
                    x_lastname1:this.state.apellido1,
                    x_lastname2:this.state.apellido2,
                    in_group_55: group.in_group_55,
                    in_group_56: group.in_group_56,
                    in_group_57: group.in_group_57,
                    xidentification:this.state.identificacion,
                    email:this.state.email,
                    active:true,
                    tope:this.state.tope,
                    mobile:this.state.celular,
                    street:this.state.street,
                    login:this.state.username,
                    property_product_pricelist_id:this.state.tarifa,
                    aplicadatosmoviles:this.state.aplicadatosmoviles,
                    aplicagenerarlink:this.state.aplicagenerarlink
            }
            console.log("datos a acutlaizar ",data)
            updateClient(this.props.route.params.data.id,data,this.recibedata)
        }else{
            console.log("no entro")
        }
        
    }
    recibedata=(flag,res)=>{
        this.setState({loading:false})
        console.log("recibedata flag:", flag)
        console.log("recibedata  res:",  res)
        if(this.state.update&&flag){
            this.props.navigation.navigate('Home')
            Alert.alert('Movilgo', '¡Tu Actualizacion fue exitoso!');
        }else if(flag){
            if(res.errores){
                if(res.errores.observacion){
                    Alert.alert("Error, ", res.errores.observacion);
                }else if(res.errores.error){
                    Alert.alert("Error, ", res.errores.error);
                }else{
                    Alert.alert("Error, ", "Algo salio mal al momento del registro");
                }
                
            }else {
                //esta cochinada se puso por que no se pudo insertar la tarifa desde el registro 
                let data={
                    property_product_pricelist_id:this.state.tarifa
                }
                updateClient(res[0],data,(flag,res)=>{
                    if(flag){
                        this.props.navigation.navigate('Home')
                        Alert.alert('Movilgo', '¡Tu registro fue exitos0!');
                    }
                })
                
            }
        } else { 
            
            Alert.alert("Error","Por favor verifique los datos. Si el error persiste comuniquese con MovilGo");
        }
    }
    upPassword=async()=>{
        //console.log("this.state.repeateClave===this.state.newpassword",this.state.repeateClave,this.state.newpassword)
        if(this.state.clave!==""){
            this.setState({loading:true})
            updatePassword(this.props.route.params.data.id,this.state.newpassword,this.responseUPdatePassword)
        }else{
            Alert.alert("Error", "Las contraseñas con coinciden");
        
        }
        
    }
    responseUPdatePassword=(flag,res)=>{
        this.setState({loading:true})
        if(flag){
            if(res.errores){
                if(res.errores.observacion){
                    Alert.alert("Error, ", res.errores.observacion);
                }else{
                    Alert.alert("Error, ", "Algo salio mal al momento del registro");
                }
                
            }else{
                this.props.navigation.navigate('Home')
                //navigation.navigate('Home', {balance: response.valida.balanceFinal});
                Alert.alert('Movilgo', '¡Tu Contraseña fue cambia correctamente!');
            }
        }
    }
    render(){
        return(
        <>
        <SafeAreaView style={{flex: 1}}>
            <View>
               <Header
                title="Nuevo Usuario"
                onPressBack={() => {this.props.navigation.goBack();}}
                >
                </Header> 
                {this.state.update&&<View style={{width:'50%',marginLeft:'50%'}}>
                    <Button
                        buttonStyle={{marginHorizontal: 10,backgroundColor: 'rgba(7,162,186,0.7)',marginVertical: '1%',borderRadius: 10,}}
                        onPress={() => {
                            this.setState({showmodalpassword:true})
                            
                        }}
                        title="Cambiar contraseña"
                        titleStyle={{fontSize: 16}}>
                        </Button>
                  </View>}
                <ScrollView>
                        <View style={styles.Container}>                               
                        <View style={{ alignItems: 'center', width: '80%' }}>                                                
                        <Input 
                                label='Primer Nombre'
                                onBlur={()=>this.verifyField(true,false,false,false,false,false,false,false,false,false)} 
                                inputContainerStyle={{ height: 50 }}
                                placeholder='' 
                                style={{ fontSize: 14 }}  
                                leftIcon={{ type: 'font-awesome-5', name: 'user', size: 20 }}
                                onChangeText={(nombre1) =>  this.setState({nombre1})}
                                value={this.state.nombre1}
                                errorMessage={this.state.errorsname}
                            />
                                
                            <Input label='Segundo Nombre' inputContainerStyle={{ height: 50 }}
                                placeholder='' style={{ fontSize: 14 }} leftIcon={{ type: 'font-awesome', name: 'user', size: 20 }}
                                onChangeText={(nombre2) => this.setState({ nombre2})}
                                value={this.state.nombre2}

                            />

                            <Input 
                                label='Primer Apellido' inputContainerStyle={{ height: 50 }}
                                onBlur={()=>this.verifyField(false,true,false,false,false,false,false,false,false,false)} 
                                placeholder='' style={{ fontSize: 14 }} leftIcon={{ type: 'font-awesome-5', name: 'user', size: 20 }}
                                onChangeText={(apellido1) =>  this.setState({ apellido1 })}
                                value={this.state.apellido1}
                                errorMessage={this.state.errorslastname}
                            />
        
                            <Input  
                                label='Segundo Apellido' inputContainerStyle={{ height: 50 }}
                                placeholder='' style={{ fontSize: 14 }} leftIcon={{ type: 'font-awesome', name: 'user', size: 20 }}
                                onChangeText={(apellido2) =>  this.setState({ apellido2 })}
                                value={this.state.apellido2}
                            />
                            
                            <Input label='Identificación' inputContainerStyle={{ height: 50 }}
                                onBlur={()=>this.verifyField(false,false,true,false,false,false,false,false,false,false)} 
                                placeholder='' 
                                style={{ fontSize: 14 }} 
                                leftIcon={{ type: 'font-awesome', name: 'address-card', size: 20 }}
                                onChangeText={(identificacion) =>  this.setState({identificacion})}/* this.inputNumbers({identificacion})} */
                                keyboardType="number-pad"
                                value={this.state.identificacion}
                                errorMessage={this.state.errorsidentification}
                            />
                           <View style={{ marginHorizontal: 10, marginBottom: 10 ,width:'95%'}}>
                                <View style={{ borderWidth: 1, borderRadius: 10 }}>
                                        <Picker
                                            selectedValue={this.state.group}
                                            style={{ height: 50,justifyContent: "center" }}
                                            onValueChange={(itemValue, itemIndex) =>
                                                this.setState({ group: itemValue })
                                            }>
                                            <Picker.Item label="Tipo de Perfil del Usuario" value="" />    
                                            <Picker.Item label="Admin" value="in_group_55" />
                                            <Picker.Item label="Vendedor" value="in_group_56" />
                                            <Picker.Item label="Cobrador" value="in_group_57" />
                                        </Picker>
                                        
                                </View> 
                                {this.state.errorgroup&&<Text style={{ fontSize: 16,alignItems:'center',color:'red'}}>Este campo es obligatorio</Text>}
                            </View>
                            <View style={{width: '90%',height:'3%',marginTop:7, alignSelf: 'center', flexDirection: 'row'}}>
                                <CheckBox value={this.state.aplicadatosmoviles} onValueChange={(aplicadatosmoviles)=>this.setState({aplicadatosmoviles})}  />
                                <Text style={{marginTop: 5, marginLeft: 15}}>Habilitar subir factura y caja por fecha</Text>
                            </View>
                            <View style={{width: '90%',height:'5%',marginTop:1, alignSelf: 'center', flexDirection: 'row'}}>
                                <CheckBox value={this.state.aplicagenerarlink} onValueChange={(aplicagenerarlink)=>this.setState({aplicagenerarlink})}  />
                                <Text style={{marginTop: 5, marginLeft: 15}}>Generar Link PayU</Text>
                            </View>
                            <View style={{ marginHorizontal: 10, marginBottom: 10 ,width:'95%'}}>
                                <View style={{ borderWidth: 1, borderRadius: 10 }}>
                                        <Picker
                                            selectedValue={this.state.tarifa}
                                            style={{ height: 50,justifyContent: "center" }}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ tarifa: itemValue }) }>
                                            <Picker.Item label="-- Seleccione un Tipo de Tarifa--" value="-1" /> 
                                            {this.state.tarifasoptions.map((element,indes)=>{
                                                return <Picker.Item key={'key' + element.id} label={Capitalize(element.nombre)} value={element.id} />
                                            })

                                            }
                                        </Picker>
                                        
                                </View> 
                                {this.state.errortarifa&&<Text style={{ fontSize: 16,alignItems:'center',color:'red'}}>Este campo es obligatorio</Text>}
                            </View>
                            <Input 
                                label='E-mail' inputContainerStyle={{ height: 50 }} name='email'
                                onBlur={()=>this.verifyField(false,false,false,true,false,false,false,false,false,false)} 
                                placeholder='' style={{ fontSize: 14 }} leftIcon={{ type: 'font-awesome', name: 'envelope', size: 20 }}                                        
                                onChangeText={(email) =>  this.setState({ email})}
                                value={this.state.email}
                                errorMessage={this.state.errorsemail}
                            />
                            <View  style={{width:'95%'}}>
                            <InputMoney
                                value={this.state.tope}
                                keyboardType="phone-pad"
                                onBlur={()=>this.verifyField(false,false,false,false,false,false,false,false,false,true)}
                                handleChange={(name, tope) => {
                                
                                this.setState({tope});
                                }}
                                placeholder="Tope"
                                field={this.state.errorstope}></InputMoney>
                            </View>
                            
                            <Input 
                                label='Usuario' inputContainerStyle={{ height: 50 }} name='usuario'
                                onBlur={()=>this.verifyField(false,false,false,false,false,false,false,false,true,false)} 
                                placeholder='' style={{ fontSize: 14 }} leftIcon={{ type: 'font-awesome', name: 'user', size: 20 }}                                        
                                onChangeText={(username) =>  this.setState({ username})}
                                value={this.state.username}
                                errorMessage={this.state.errorsusername}
                            />
                            {this.state.update&&<View style={{borderBottomWidth:1,width:'95%',borderBottomColor:'gray'}}>
                                <Text style={{ fontSize: 16, color:'gray' /*textAlign:'left',color:'red' */}}>Constraseña</Text>
                                <View style={{flexDirection:'row', marginTop:5,marginBottom:10}}>
                                    <Icon name="lock" size={20} color='black' ></Icon>
                                <Text style={{ marginLeft:10,fontSize: 14,/*alignItems:'center' ,color:'red' */}}>{this.state.clave}</Text>
                                </View>
                                
                            </View>}
                            
                            <Input 
                                label='Teléfono' inputContainerStyle={{ height: 50 }}
                                onBlur={()=>this.verifyField(false,false,false,false,true,false,false,false,false,false)} 
                                placeholder='' style={{ fontSize: 14 }} leftIcon={{ type: 'font-awesome', name: 'mobile', size: 30 }}
                                onChangeText={(celular) => this.setState({celular})} /* this.inputNumbers({celular})} */
                                keyboardType="phone-pad"
                                value={this.state.celular}
                                maxLength={10}
                                errorMessage={this.state.errorsmobil}
                            />
                            <Input  
                                label='Direccion' inputContainerStyle={{ height: 50 }}
                                onBlur={()=>this.verifyField(false,false,false,false,false,true,false,false,false,false)} 
                                placeholder='' style={{ fontSize: 14 }} leftIcon={{ type: 'font-awesome', name: 'home', size: 20 }}
                                onChangeText={(street) =>  this.setState({ street })}
                                value={this.state.street}
                                errorMessage={this.state.errorsadress}
                            />
                            {!this.state.update&&<Input 
                                label='Contraseña' inputContainerStyle={{ height: 40 }}
                                onBlur={()=>this.verifyField(false,false,false,false,false,false,true,false,false,false)} 
                                placeholder='' style={{ fontSize: 14 }}
                                leftIcon={{ type: 'font-awesome-5', name: 'key', size: 20 }}
                                onChangeText={(clave) => this.setState({ clave})}
                                value={this.state.clave}
                                errorMessage={this.state.errorspassword}
                            />}

                                                      
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: '2%' }}>
                        {this.state.update&&<Button /* disabled = {!this.state.CheckBoxATC || !this.state.CheckBoxAPP}  */
                            title="Actualizar"
                            buttonStyle={{ borderColor: '#61987B', backgroundColor: 'white', marginTop: '2%', width: '100%' }}
                            titleStyle={{ color: '#61987B' }}
                            type="outline"
                            onPress={this.sendDatos}
                        />}
                        {!this.state.update&&<Button /* disabled = {!this.state.CheckBoxATC || !this.state.CheckBoxAPP}  */
                            title="Registrar"
                            buttonStyle={{ borderColor: '#61987B', backgroundColor: 'white', marginTop: '2%', width: '100%' }}
                            titleStyle={{ color: '#61987B' }}
                            type="outline"
                            onPress={this.sendDatos}
                        />}
                    </View>
                    <View style={{ height: 300 }}>
                    </View> 
                    
                    <Modal style={{ flex: 1 }}
                        isVisible={this.state.showmodalpassword}
                        onRequestClose={() => {this.setState({showmodalpassword:false,newpassword:"",repeateClave:""})}}
                        onBackButtonPress={() => {this.setState({showmodalpassword:false})}}
                        onBackdropPress={() => {this.setState({showmodalpassword:false})}}
                        >
                        <View style={{ backgroundColor: 'rgba(7,162,186,0.7)', padding: 6, borderRadius: 10 }}>
                            <Text style={{fontSize: 18,fontWeight: 'bold',alignSelf: 'center',marginVertical: 8,color: 'white'}}>Cambiar Contraseña</Text>
                            
                            <View style={{flexDirection: 'row',justifyContent: 'space-between',marginVertical: 5}}>
                                <View style={{alignSelf: 'center',justifyContent: 'center',width:'90%'}}>
                                    <Text style={{ fontSize: 16,alignItems:'center',color:'black',marginLeft:"3%",marginBottom:'4%'}}>{"Clave Actual:   "+this.props.route.params.data.clave}</Text>
                                 
                                    <Input
                                    label='Nueva contraseña'
                                    labelStyle={{color:'black'}}
                                    value= {this.state.newpassword}
                                    onChangeText={(newpassword) =>
                                        this.setState({newpassword})
                                    }                           
                                    leftIcon={{ type: 'font-awesome', name: 'user', size: 20 }}
                                    />
                                    
                                </View>
                            </View>
                            
                            <Button 
                                title="Cambiar Contraseña"
                                buttonStyle={{backgroundColor: 'rgba(7,162,186,0.7)',padding: 10,marginVertical: 20}}                                                                    
                                    onPress={()=>this.upPassword()}
                                titleStyle={{fontSize: 16}}>
                            </Button>
                            <View style={styles.loading}>
                            <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}></ActivityIndicator>
                            </View>
                        </View>

                        </Modal>
                        <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}></ActivityIndicator>
                        </View>

                </ScrollView> 
            </View>
        </SafeAreaView>
        </>)
    }
}

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        justifyContent: "space-around",
        paddingTop: '10%',
        width: '100%',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        width: 290
    },

    TextURL:{
        textDecorationLine: 'underline',
        color: '#42A5F5'
    },
    /* ESTILOS DEL MODAL */
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
        
      },loading: {
        left: 0,
        right: 0,
        top: '-50%',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
        
    },button: {
        borderRadius: 20,
        padding: 8,
        elevation: 0
        
      },
      buttonOpen: {
        backgroundColor: "#07A2BA",
        marginBottom: 5,
      },
      buttonClose: {
        backgroundColor: "#07A2BA",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
})