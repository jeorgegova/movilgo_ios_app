import React, {PureComponent} from 'react';
import {Text, View,Alert} from 'react-native';
import {Button} from 'react-native-elements';
import {StyleSheet} from 'react-native';
import {PRESTAMOS_SCHEMA} from '../../database/models/prestamos';
import {getTableFromDB} from '../../database/allSchemas';
import {Header} from '../../components/UI/header';

import {ScrollView} from 'react-native';

export class ScreenPrestamos extends PureComponent {
  constructor() {
    super();
    this.state = {
      prestamo:{},
      habilit:false
    };
  }

  componentDidMount() {
    getTableFromDB(PRESTAMOS_SCHEMA, true)
      .then((response) => {
        if(response.length===0){
          Alert.alert("Lo sentimos", "No tienes habilitado este producto en el momento");
        }else{
          this.setState({ habilit:true,prestamo: response })
        }
        //this.setState({prestamo:response})
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <>
      <SafeAreaView style={{flex: 1}}>
        <View>
          <Header title="PRESTAMOS"
            onPressBack={() => {this.props.navigation.goBack();}}
          >              
          </Header>

          {this.state.habilit&&<ScrollView>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>¿Que desea realizar?</Text>
            </View>

            <Button
              title="Desembolso"
              disabled={this.state.loading}
              containerStyle={styles.button} onPress={() => {
                this.props.navigation.navigate('PrestamosBuscar', {
                  tipo: 'venta',produc_id:this.state.prestamo[0].id
                });
              }}
              buttonStyle={{backgroundColor: '#07A2BA', marginTop: '2%'}}
            />

            <Button
              title="Pago"
              disabled={this.state.loading}
              containerStyle={styles.button}onPress={() => {
                this.props.navigation.navigate('PrestamosBuscar', {
                  tipo: 'pago',produc_id:this.state.prestamo[0].id
                });
              }}
              buttonStyle={{backgroundColor: '#07A2BA', marginTop: '2%'}}
            />
          </ScrollView>}
        </View>
        </SafeAreaView>
      </>
    );
  }
}

/* estilos utilizados en el archivo */
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#c3c3c3',
    marginHorizontal: 10,
    padding: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#07A2BA',
  },
  loading: {
    left: 0,
    right: 0,
    top: '-50%',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button:{
    width: '70%',
    padding: 5,
    alignSelf: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    marginBottom: 30,
    paddingBottom: 60,
    marginTop: 75
  }
});
