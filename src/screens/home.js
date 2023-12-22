import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Text,
  Alert,
  BackHandler,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {ButtonImage} from '../components/UI/buttons';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Footer} from '../components/UI/footer';
import AsyncStorage from '@react-native-community/async-storage';
import {getBox} from '../services/box.service';
import NetInfo from '@react-native-community/netinfo';
import Odoo from 'react-native-odoo';
import {deleteAllDatabase} from '../database/allSchemas';
import {FormatMoney} from '../shared/utilities/formats';
import {StartSync} from '../shared/utilities/cronaplicarpago';
import _BackgroundTimer from 'react-native-background-timer';

export class ScreenHome extends PureComponent {
  constructor() {
    super();
    this.state = {
      balance: 0,
      home: false,
      seller: true,
      collector: false,
      loading: false,
      admin: true,
      internet: false,
      caja: {estado: 'No disponible'},
      username: '',
      aplicadatosmoviles: false,
      movilgo: true,
    };
    this._isMounted = false;
    this.styles = getStyles();
  }

  backHandler = () => {
    const close = async () => {
      const keys = await AsyncStorage.getAllKeys();
      console.log('keys', keys);
      newKes = [];
      //esto permite que elimine todo menos los datos de la impresora
      keys.forEach(element => {
        if (element != 'Printer' && element != 'WithPrinter') {
          newKes.push(element);
        }
      });
      console.log('newKes', newKes);
      await AsyncStorage.multiRemove(newKes);
      this.props.navigation.navigate('Login');
      _BackgroundTimer.stopBackgroundTimer();
      await deleteAllDatabase();
    };
    if (this.state.home) {
      Alert.alert('¡Espera!', '¿Deseas dejar de trabajar ahora?', [
        {text: 'Salir', onPress: () => close()},
        {
          text: 'Quedarme',
          onPress: () => null,
          style: 'cancel',
        },
      ]);
    } else {
      this.props.navigation.goBack();
    }
    return true;
  };

  /* loadAplicarPagos=()=>{
    console.log("ingreso al load aplicarpagos")
    try{
      StartSync(this.props.navigation)
    }catch(err){
      console.log("error del loadAplicarPagos",err)
    }
    
  } */
  checkPermission = async () => {
    const keys = await AsyncStorage.getAllKeys();
    console.log('keys del home', keys);
    //this.loadAplicarPagos()
    try {
      const permission = await AsyncStorage.getItem('Permission');
      const session = await AsyncStorage.getItem('session');
      const client = new Odoo(JSON.parse(session));
      const aplicadatosmoviles = await AsyncStorage.getItem(
        'aplicadatosmoviles',
      );

      if (aplicadatosmoviles === 'true') {
        this.setState({aplicadatosmoviles: true});
      }
      if (permission === 'cobrador') {
        this.setState({collector: true});
      } else if (permission === 'administrador') {
        this.setState({admin: true, seller: true});
      } else {
        this.setState({seller: true});
      }

      NetInfo.fetch().then(state => {
        if (state.isConnected && state.type === 'wifi') {
          this.setState({internet: true});
        }
      });
      //
      if (client.username === 'movilgo') {
        this.setState({movilgo: true, username: client.username});
      }

      //console.log("cleitne.username",client.username)/*  */
    } catch (error) {
      this.setState({seller: false});
      Alert.alert(
        'Error',
        'No se encontraron permisos, si el problema persiste comuniquese con MovilGo',
      );
    }
  };

    /* componentDidMount = () => {
    
    this._isMounted = true;

    if (this._isMounted) {
      BackHandler.addEventListener('hardwareBackPress', this.backHandler);
      this.props.navigation.addListener('focus', () => {
        
      });
      this.checkPermission();
    }
  }; */

  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount = () => {
    
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
        this.setState({balance: this.props.route.params.balance, home: true});
        BackHandler.addEventListener('hardwareBackPress', this.backHandler);
        this.checkPermission();
    });
    
}
componentWillUnmount() {
    this._unsubscribe();
}

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View>
          <ImageBackground
            style={this.styles.background}
            source={require('../assets/login/background.png')}>
            <View style={this.styles.headerContainer}>
              <Image
                style={this.styles.header}
                source={require('../assets/login/header.png')}
                resizeMode="stretch"></Image>
              <View style={this.styles.headerLogoContainer}>
                <Image
                  style={this.styles.headerLogo}
                  source={require('../assets/login/logo.png')}
                  resizeMode="contain"></Image>
              </View>

              <View style={{flexDirection: 'row', maxHeight: 43}}>
                <View style={{width: '27%', flexDirection: 'row'}}>
                  <Button
                    title="Caja"
                    titleStyle={this.styles.buttonTitle}
                    buttonStyle={this.styles.button}
                    onPress={() =>
                      this.props.navigation.navigate('Box')
                    }></Button>
                  <Button
                    icon={
                      <Icon
                        name="print"
                        size={this.styles.icon.fontSize}></Icon>
                    }
                    buttonStyle={this.styles.button}
                    onPress={() =>
                      this.props.navigation.navigate('Printer')
                    }></Button>
                </View>

                <View style={{width: '38%'}}>
                  <Text style={this.styles.titleHeader}>SERVICIOS</Text>
                </View>

                <View style={{width: '35%'}}>
                  {this.state.aplicadatosmoviles && (
                    <Button
                      title="Caja Por Fecha"
                      titleStyle={this.styles.buttonTitle}
                      buttonStyle={this.styles.button}
                      onPress={() =>
                        this.props.navigation.navigate('BoxDate')
                      }></Button>
                  )}
                </View>
              </View>
            </View>

            <ScrollView>
              {this.state.seller && (
                  <View style={this.styles.containerContent}>
                    <View style={this.styles.containerButton}>
                      <ButtonImage
                        onPress={() => {
                          this.setState({home: false});
                          this.props.navigation.navigate('Rifas');
                        }}
                        styleButton={this.styles.buttonImage}
                        image={require('../assets/home/icons/botonrifas.png')}></ButtonImage>
                      <ButtonImage
                        onPress={() => {
                          this.setState({home: false});
                          this.props.navigation.navigate('Recargas');
                        }}
                        styleButton={this.styles.buttonImage}
                        image={require('../assets/home/icons/botonrecargas.png')}></ButtonImage>
                    </View>
                    <View style={this.styles.containerButton}>
                      <ButtonImage
                        onPress={() => {
                          this.setState({home: false});
                          this.props.navigation.navigate('Paquetes');
                        }}
                        styleButton={this.styles.buttonImage}
                        image={require('../assets/home/icons/botonpaquetes.png')}></ButtonImage>
                      <ButtonImage
                        /*onPress={() => { this.setState({ home: false }); this.props.navigation.navigate("Tv") }}*/ styleButton={
                          this.styles.buttonImage
                        }
                        image={require('../assets/home/icons/botontv.png')}></ButtonImage>
                    </View>
                    <View style={this.styles.containerButton}>
                      <ButtonImage
                        onPress={() => {
                          this.setState({home: false});
                          this.props.navigation.navigate('Soat');
                        }}
                        styleButton={this.styles.buttonImage}
                        image={require('../assets/home/icons/botonsoat.png')}></ButtonImage>
                        
                      <ButtonImage
                        onPress={() => {
                          this.setState({home: false});
                          this.props.navigation.navigate('Pines');
                        }}
                        styleButton={this.styles.buttonImage}
                        image={require('../assets/home/icons/botonpines.png')}></ButtonImage>
                    </View>
                    <View style={this.styles.containerButton}>
                      <ButtonImage
                        onPress={() => {
                          this.setState({home: false});
                          this.props.navigation.navigate('RecargasDeportivas');
                        }}
                        styleButton={this.styles.buttonImage}
                        image={require('../assets/home/icons/botondeportes.png')}></ButtonImage>
                      <ButtonImage
                        onPress={() => {
                          this.setState({home: false});
                          this.props.navigation.navigate('GanaBingo');
                        }}
                        styleButton={this.styles.buttonImage}
                        image={require('../assets/home/icons/botonbingo.png')}></ButtonImage>
                    </View>
                    <View style={this.styles.containerButton}>
                      <ButtonImage
                        onPress={() => {
                          this.setState({home: false});
                          this.props.navigation.navigate('Prestamos');
                        }}
                        styleButton={this.styles.buttonImage}
                        image={require('../assets/home/icons/mitecnova.png')}></ButtonImage>
                      <ButtonImage
                        onPress={() => {
                          this.setState({home: false});
                          this.props.navigation.navigate('Certificate');
                        }}
                        styleButton={this.styles.buttonImage}
                        image={require('../assets/home/icons/botones-certificado.png')}></ButtonImage>
                    </View>
                    {this.state.admin && (
                      <View style={{width: '100%', height: '100%'}}>
                        <View style={this.styles.containerButton}>
                          <ButtonImage
                            onPress={() => {
                              this.setState({home: false});
                              this.props.navigation.navigate('UserAdmin', {
                                usuario: this.state.username,
                              });
                            }}
                            styleButton={this.styles.buttonImage}
                            image={require('../assets/home/icons/usuario1.png')}></ButtonImage>
                          <ButtonImage
                            onPress={() => {
                              this.setState({home: false});
                              this.props.navigation.navigate('AplicarPago', {
                                balance: this.state.balance,
                              });
                            }}
                            styleButton={this.styles.buttonImage}
                            image={require('../assets/home/icons/Aplicarpago.png')}></ButtonImage>
                        </View>
                        {this.state.movilgo && (
                          <View style={{width: '100%', height: '100%'}}>
                            <View style={this.styles.containerButton}>
                              <ButtonImage
                                onPress={() => {
                                  this.setState({home: false});
                                  this.props.navigation.navigate(
                                    'PagosProveedor',
                                  );
                                }}
                                styleButton={this.styles.buttonImage}
                                image={require('../assets/home/icons/proveedor.png')}></ButtonImage>
                              <ButtonImage
                                onPress={() => {
                                  this.setState({home: false});
                                  this.props.navigation.navigate(
                                    'PonerDinero',
                                    {usuario: this.state.username},
                                  );
                                }}
                                styleButton={this.styles.buttonImage}
                                image={require('../assets/home/icons/ponerdinero.png')}></ButtonImage>
                            </View>
                            <View style={this.styles.containerButton}>
                              <ButtonImage
                                onPress={() => {
                                  this.setState({home: false});
                                  this.props.navigation.navigate('Gasto');
                                }}
                                styleButton={this.styles.buttonImage}
                                image={require('../assets/home/icons/gastos.png')}></ButtonImage>
                              {/* <ButtonImage
                                      onPress={() => {
                                        this.setState({home: false});
                                        this.props.navigation.navigate('PonerSacar',{usuario:this.state.username});
                                      }}
                                      styleButton={this.styles.buttonImage}
                                      image={require('../assets/home/icons/cargaryretirar.png')}>
                                      </ButtonImage>  */}
                            </View>
                          </View>
                        )}

                        <View style={this.styles.containerButton}></View>
                      </View>
                    )}
                  </View>
              )}
              {this.state.collector && (
                <View style={this.styles.containerContent}>
                  <View style={this.styles.containerButton}>
                    <ButtonImage
                      onPress={() => {
                        this.setState({home: false});
                        this.props.navigation.navigate('Collector', {
                          balance: this.state.balance,
                        });
                      }}
                      styleButton={this.styles.buttonImage}
                      image={require('../assets/home/icons/botoncobrador.png')}></ButtonImage>
                  </View>
                </View>
              )}

              <View style={{height: 1000}}>
                {/* Este view permite darle mas pixeles al scroll para desplazarse  */}
              </View>
            </ScrollView>
          </ImageBackground>
          <Footer></Footer>
        </View>
      </SafeAreaView>
    );
  }
}

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
  titleHeader: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  background: {
    height: '100%',
    width: '100%',
  },
  icon: {
    fontSize: 30,
  },
  containerContent: {
    width: '90%',
    height: '110%',//Math.round(Dimensions.get('window').height) * 0.6,
    marginHorizontal: '5%',
  },
  containerButton: {
    height: '10%',
    width: '100%',
    marginVertical: '1%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    height: '70%',
    width: '100%',
  },
  headerContainer: {
    backgroundColor: '#02606e',
    minHeight: '15%',
    maxHeight: '25%',
    width: '100%',
  },
  headerLogo: {
    marginHorizontal: '20%',
    width: '60%',
    aspectRatio: 1,
  },
  headerLogoContainer: {
    position: 'absolute',
    maxHeight: 55,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonImage: {
    alignItems: 'center',
    margin: '1%',
    aspectRatio: 1,
  },
  button: {
    marginLeft: 4,
    padding: 6,
    backgroundColor: 'rgba(7,162,186,0.7)',
    marginVertical: '1%',
    borderRadius: 10,
    minWidth: 80,
    minHeight: 40,
  },
  buttonTitle: {
    fontSize: 21,
  },
  loading: {
    left: 0,
    right: 0,
    top: '-50%',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

const stylesMedium = StyleSheet.create({
  titleHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  background: {
    height: '100%',
    width: '100%',
  },
  icon: {
    fontSize: 20,
  },
  containerContent: {
    width: '90%',
    height: '110%',//Math.round(Dimensions.get('window').height) * 0.4,
    marginHorizontal: '5%',
  },
  containerButton: {
    height: '10%',
    width: '100%',
    marginVertical: '1%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    //borderWidth:2
  },
  header: {
    height: '70%',
    width: '100%',
  },
  headerContainer: {
    backgroundColor: '#02606e',
    minHeight: '15%',
    maxHeight: '24%',
    width: '100%',
  },
  headerLogo: {
    marginHorizontal: '20%',
    width: '60%',
    aspectRatio: 1,
  },
  headerLogoContainer: {
    position: 'absolute',
    maxHeight: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonImage: {
    alignItems: 'center',
    margin: '1%',
    aspectRatio: 1,
  },
  button: {
    marginLeft: 4,
    padding: 6,
    backgroundColor: 'rgba(7,162,186,0.7)',
    marginVertical: '1%',
    borderRadius: 10,
    minWidth: 50,
    minHeight: 40,
  },
  buttonTitle: {
    fontSize: 14,
  },
  loading: {
    left: 0,
    right: 0,
    top: '-50%',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
