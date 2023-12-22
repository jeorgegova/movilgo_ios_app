import React, {PureComponent} from 'react';
import {View, StyleSheet, Image, ImageBackground, Text} from 'react-native';
import {Header} from '../../components/UI/header';
import {FormatMoney} from '../../shared/utilities/formats';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {allDataBase} from '../../database/allSchemas';
import Icon from 'react-native-vector-icons/FontAwesome';
import {SafeAreaView} from 'react-native-safe-area-context';

export class ScreenRifas extends PureComponent {
  constructor() {
    super();
    this.state = {
      modalInfoVisible: false,
      listRifas: [],
    };
    this.rifas = [];
    this._isMounted = false;
  }
  loadRifas() {
    allDataBase('Rifas')
      .then(results => {
        this.rifas = results;
        this.buildListRifas();
      })
      .catch(err => {
        console.log(err);
      });
  }

  buildListRifas = () => {
    let row = [];
    let cloneRifas = [];
    this.rifas.forEach(element => {
      cloneRifas.push({
        id: element.id,
        fecha_sorteo: element.fecha_sorteo,
        name: element.name,
        reference: element.reference,
        image: element.image_medium,
        price: element.precio,
        porcentajeRecaudo: element.porcentaje_recaudo,
        numero_resolucion_rifa: element.numero_resolucion_rifa,
      });
    });
    for (let k = 0; k < cloneRifas.length; k++) {
      row.push(
        <View key={'rifa' + k} style={styles.containerInfoGreen}>
          <Image
            style={{
              height: 200,
              width: '95%',
              backgroundColor: 'black',
              alignSelf: 'center',
              marginTop: 10,
            }}
            source={{uri: 'data:image/png;base64,' + cloneRifas[k].image}}
            resizeMode="stretch"></Image>

          <View style={{flexDirection: 'row'}}>
            <View style={{width: '20%', justifyContent: 'center'}}>
              {cloneRifas[k].porcentajeRecaudo < 100 && (
                <TouchableOpacity
                  style={{alignSelf: 'center', alignItems: 'center'}}
                  onPress={() => {
                    this.props.navigation.navigate('PaymentRifa', {
                      rifa: cloneRifas[k],
                    });
                  }}>
                  <Icon name="dollar" size={30} color="white"></Icon>
                  <Text style={styles.label}>Abonar</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{width: '60%'}}>
              <Text style={styles.title}>{cloneRifas[k].name}</Text>
              <Text style={styles.label}>
                Sorteo: {cloneRifas[k].fecha_sorteo}
              </Text>
              <Text style={styles.label}>
                Valor: {FormatMoney(cloneRifas[k].price)}
              </Text>
            </View>
            <View style={{width: '20%', justifyContent: 'center'}}>
              <TouchableOpacity
                style={{alignSelf: 'center', alignItems: 'center'}}
                onPress={() => {
                  this.props.navigation.navigate('Rifa', {rifa: cloneRifas[k]});
                }}>
                <Icon name="shopping-cart" size={30} color="white"></Icon>
                <Text style={styles.label}>Comprar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>,
      );
    }
    row.push(<View key={'footer'} style={{height: 8}}></View>);
    this.setState({listRifas: row});
  };
  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.loadRifas();
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View>
          <ImageBackground
            style={styles.background}
            source={require('../../assets/login/f.png')}>
            <Header
              title="Rifas"
              onPressBack={() => {
                this.props.navigation.goBack();
              }}></Header>
            <ScrollView>{this.state.listRifas}</ScrollView>
            <View style={{height: '9%'}}></View>
            <Image
              style={styles.footer}
              source={require('../../assets/login/footer.png')}></Image>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }
}

var styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: 'white',
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
    marginVertical: 6,
  },
  containerInfoGreen: {
    backgroundColor: 'rgba(7, 162, 186, 0.8)',
    borderRadius: 6,
    margin: 6,
    alignItems: 'center',
    padding: 6,
  },
  background: {
    height: '100%',
    width: '100%',
  },
  containerButton: {
    height: '28%',
    width: '100%',
    marginVertical: '1%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footer: {
    bottom: 0,
    position: 'absolute',
    height: '14%',
    width: '100%',
  },
});
