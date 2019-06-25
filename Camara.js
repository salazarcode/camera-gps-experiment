import React from 'react';
import { Text, View, TouchableOpacity, Dimensions,ScrollView, Image, Platform, SafeAreaView } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

export default class Camara extends React.Component {
    constructor(props){
        super(props)
    }
    
    static navigationOptions = {
        header: null
    }

    state = {
        hasCameraPermission: null,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        textoCamara:"Tomar",
        foto:null
    };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

  }

  renderImagen(foto){
    let newW = foto.width /(foto.width / this.state.width);
    let newH = (newW / 3) * 4;
    return <Image source={{uri:foto.uri}} style={{width:newW, height:newH}}/>
  }

  render() {
    const { hasCameraPermission, width, height } = this.state;

    const base = width / 3;
    w = width;
    h = base * 4; 

    if (hasCameraPermission === null) {
      return <View />;
    } 
    else 
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } 
    else 
    {
        if(this.state.foto == null)
        {
            return (
                <SafeAreaView style={{flex: 1, marginTop: Platform.OS == "android" ? 24 : 0}}>
                    <ScrollView style={{ flex: 1}}>
                        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
                            <Camera ref={ref => this.camera = ref} style={{ height:h, width: w }} type={Camera.Constants.Type.back} ratio="4:3"/>
                            <TouchableOpacity
                                style={{
                                height:60,
                                width:60,
                                borderRadius:30,
                                marginTop:5,
                                backgroundColor:"navy",
                                alignItems: 'center',
                                justifyContent:"center"
                            }}
                            onPress={async() => {
                                this.setState({textoCamara: "Tomando..."});
                                const foto = await this.camera.takePictureAsync();
                                this.setState({foto: foto, textoCamara: "Tomar"});
                            }}>
                                <Text style={{ fontSize: 12, color: 'white' }}>{this.state.textoCamara}</Text>
                            </TouchableOpacity>   
                        </View>         
                    </ScrollView>
                </SafeAreaView>
            );            
        }
        else
        {
            return (
                <SafeAreaView style={{flex: 1, marginTop: Platform.OS == "android" ? 24 : 0}}>
                    <ScrollView style={{ flex: 1}}>
                        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
                            <Image
                                source={{uri: this.state.foto.uri}}
                                style={{height: h, width: w}} 
                            /> 
                            <View style={{widht: "100%", flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                                <TouchableOpacity
                                    style={{
                                    height:60,
                                    width:60,
                                    borderRadius:30,
                                    marginTop:5,
                                    backgroundColor:"red",
                                    alignItems: 'center',
                                    justifyContent:"center"
                                }}
                                onPress={async() => {
                                    this.setState({foto:null});
                                }}>
                                    <Text style={{ fontSize: 12, color: 'white' }}>Descartar</Text>
                                </TouchableOpacity>  

                                <TouchableOpacity
                                    style={{
                                    height:60,
                                    width:60,
                                    borderRadius:30,
                                    marginTop:5,
                                    backgroundColor:"green",
                                    alignItems: 'center',
                                    justifyContent:"center"
                                }}
                                onPress={async() => {
                                    this.props.handlePicture(this.state.foto);
                                }}>
                                    <Text style={{ fontSize: 12, color: 'white' }}>Conservar</Text>
                                </TouchableOpacity> 
                            </View>

                        </View>         
                    </ScrollView>
                </SafeAreaView>
            );      
        }


    }
  }
}