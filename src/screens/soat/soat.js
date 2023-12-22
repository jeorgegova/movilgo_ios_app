import React, {PureComponent} from 'react';
import {Text, View,Alert, Image, ImageBackground} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {StyleSheet} from 'react-native';
import {SOAT_SCHEMA} from '../../database/models/soat';
import {getTableFromDB} from '../../database/allSchemas';
import {Header} from '../../components/UI/header';
import {ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export class ScreenSoat extends PureComponent {
  constructor() {
    super();
    this.state = {
      habilit:false
    };
  }

  componentDidMount() {
    getTableFromDB(SOAT_SCHEMA, true)
      .then((response) => {
        if(response.length===0){
          Alert.alert("Lo sentimos", "No tienes habilitado este producto en el momento");
        }else{
          this.setState({ habilit:true,soats: response })
        }
        //this.setState({soats: response});
      })
      .catch((err) => console.error(err));
  }

  render() {
    return (
      <>
        <SafeAreaView style={{ flex: 1 }}>
        <View>
        <ImageBackground
            style={styles.background}
            source={require('../../assets/login/f.png')}>
          <Header
            title="SOAT"
            onPressBack={() => {this.props.navigation.goBack();}}
            >
          </Header>

          {this.state.habilit&&<ScrollView>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>¿Que desea realizar?</Text>
            </View>

            <Button
              title="Buscar"
              disabled={this.state.loading}
              containerStyle={styles.button}
              /* containerStyle={{width: '70%',padding: 5, alignSelf: 'center',marginVertical: 10,marginHorizontal: 10,marginTop: 150,marginBottom: 30,paddingBottom: 60,}} */
              onPress={() => {
                this.props.navigation.navigate('SoatBuscar', {
                  soats: this.state.soats[0].id,
                });
              }}
              buttonStyle={{backgroundColor: '#07A2BA', marginTop: '2%'}}
            />
            <Button
              title="Comprar"
              disabled={this.state.loading}
              containerStyle={styles.button}
              /* containerStyle={{width: '70%',padding: 5,alignSelf: 'center', marginVertical: 10,marginHorizontal: 10,marginBottom: 30, paddingBottom: 60,}} */
              onPress={() => {
                this.props.navigation.navigate('SoatComprar', {
                  soats: this.state.soats[0].id,
                });
              }}
              buttonStyle={{backgroundColor: '#07A2BA', marginTop: '2%'}}
            />
          </ScrollView>}
          </ImageBackground>
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
    justifyContent: 'center',
  },
  
  button:{
    width: '70%',
    padding: 5,
    alignSelf: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    marginBottom: 30,
    paddingBottom: 60,
    marginTop: 60
  },
  background: {
    height: '100%',
    width: '100%',
  }

});
