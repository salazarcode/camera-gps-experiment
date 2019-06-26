import React from 'react';
import { Platform, Text, View, StyleSheet, Button, TextInput, KeyboardAvoidingView, Image, Modal, TouchableHighlight, Dimensions,ScrollView } from 'react-native';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps';

import * as ImagePicker from 'expo-image-picker';

import Camara from './Camara';


class Position extends React.Component{
    static navigationOptions = {
        header: null
    }
    constructor(props){
        super(props);
        this.state = {
            latitude: null,
            longitude: null,
            errorMessage: null,
            isLoading: false,
            factor: 0.01,
            modalVisible:false,
            foto:null
        };
        this._handlePicture = this._handlePicture.bind(this)
        this._renderModal = this._renderModal.bind(this)
    }

  
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    
    this.setState({ 
      latitude: location.coords.latitude, 
      longitude: location.coords.longitude, 
      isLoading: false 
    });
  };

  _handlePicture(picture){
      this.setState({
          foto:picture,
          modalVisible:false
      })
  }

  _renderModal(){
    return(
        <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}>
            <View style={{flex:1, backgroundColor:"white"}}>
                <Camara handlePicture={this._handlePicture}/>
            </View>
        </Modal>        
    )
  }

  render(){
    let mapa = (lat, long) => (
      <MapView
        style={{ width: "80%", height:300 }}
        initialRegion={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: this.state.factor,
          longitudeDelta: this.state.factor,
        }}
      >
        <Marker
          coordinate={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
          }}
          title="Mi posición"
          description="Descripción de mi posición"
        />
      </MapView>
    )

    let foto = (foto) => {
        let newW = foto.width /(foto.width / Dimensions.get("window").width);
        let newH = (newW / 3) * 4;
        return(
            <View>
                <Image
                    source={{uri:foto.uri}}
                    style={{height:newH/2, width:newW/2, flexWrap: "wrap"}}
                />                
            </View>

        )
    }
    return(
        <ScrollView contentContainerStyle={styles.container}>
            {this._renderModal()}

            {this.state.longitude ? mapa() : null}

            <Text>{this.state.isLoading ? "Cargando..." : null}</Text>

            <View style={{height:5}}/>

            <Button title="Mi posición" color="red" onPress={()=>{
                this._getLocationAsync();
                this.setState({isLoading: true});
            }}/>

            <Text>Latitud: {this.state.latitude ? this.state.latitude : "Sin definir" }</Text> 
            <Text>Longitude: {this.state.longitude ? this.state.longitude : "Sin definir" }</Text>  

            <Button title="Tomar foto" onPress={()=>{
                this.setState({modalVisible: true});
            }}/>

            {this.state.foto != null ? foto(this.state.foto) : <Text>Preview vacío</Text>}

            

            <Button title="Tomar foto con api del teléfono" onPress={async ()=>{
                this.props.navigation.navigate("CamaraAPI")

            }}/>
        </ScrollView>
    )
  }
}

export default Position;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  }
});
