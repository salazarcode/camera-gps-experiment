import * as React from 'react';
import { Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
    hasCameraPermission: false
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Seleccionar una foto"
          onPress={this._pickImage}
        />
        <Button
          title="Tomar una nueva"
          onPress={this._takePicture}
        />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }

    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  _takePicture = async () => {
    console.log(this.state);
    if(this.state.hasCameraPermission)
    {
        let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        });

        console.log(result);

        if (!result.cancelled) {
        this.setState({ image: result.uri });
        }        
    }
    else
    {
        console.log("No tienes acceso a la cámara");
    }
  };
}


