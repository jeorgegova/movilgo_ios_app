import React, { PureComponent } from 'react';
import { ToastAndroid, Image, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
export class Camera extends PureComponent {
    constructor(props) {
        super();
        this.state = {
            disableChec: true,
        }
        this.list = []
        this.setImage ="";
        this.modalCamera = "";
    }
  
    componentDidMount() {
        console.log("ENTRA A LA CAMARA", this.props)
        this.setImage = this.props.image;
        this.modalCamera = this.props.modalCamera;
    }
  
    takePictures =async () => {  
      this.setState({ cerrar: true })  
      const options = {
          title: 'Tomar Foto',
          storageOptions: { skipBackup: true, path: 'images', },
          quality: 0.5,
          base64: true,
          maxWidth: 700,
          maxHeight: 700,
      };
  
      ImagePicker.showImagePicker(options, response => {
         if (response.didCancel) {
              console.log('User cancelled image picker');
          } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
          } else {
              const source = { uri: 'data:image/jpeg;base64,' + response.data };
              //const source =response.uri;
              this.setState({ avatarSource: source });
              this.setState({ disableChec: false })
              this.setImage(response.data);
              this.modalCamera(false,response.data);
              ToastAndroid.show("Procesando foto", ToastAndroid.SHORT);
          } 
      });
    };
  
  
    render() {
        return (
            <View style={{alignSelf:'center'}}>
              {(this.state.avatarSource || this.state.cerrar) &&
                    <Image source={this.state.avatarSource}
                        style={{ alignSelf: 'center', height: 400, width: 300 }} />
                }
                <View style={{flexDirection:'row', width:'90%',alignSelf:'center'}}>
                  <Button title="Tomar Foto"
                      titleStyle={{ marginHorizontal: 10, color: 'white' }}
                      containerStyle={{ width: '50%', margin: 0,left:0,right:0 }}
                      buttonStyle={{ backgroundColor: '#02606e' }}
                      onPress={() => this.takePictures()
                      } /> 
                  
                </View>
                 
            </View>
        )
    }
  }

