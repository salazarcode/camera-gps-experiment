import React from 'React';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import * as Facebook from 'expo-facebook';
import * as FileSystem from 'expo-file-system';
import {Google} from 'expo';

class Login extends React.Component{
    constructor(props)
    {
        super(props)
        this.state = {
            info: null,
            infoGoogle: null,
            localPicture: null,
            uploadedFile: null,
            imageName: null,
            apiUrlImage: null
        }
    }
    static navigationOptions = {
        header: null
    }

    async logIn() {
      try {
        const {
          type,
          token,
          expires,
          permissions,
          declinedPermissions,
        } = await Facebook.logInWithReadPermissionsAsync('401931543750381', {
          permissions: ['public_profile', 'email'],
        });
        if (type === 'success') {
          // Get the user's name using Facebook's Graph API
          let route = `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.type(large)`;
          const response = await fetch(route);
          let info = await response.json();
          this.setState({info});

        let name = this.state.info.id + "_" + Date.now() + "_profile_picture.jpg";
        this.setState({imageName: name});
        let fileName = FileSystem.documentDirectory + name;
        FileSystem.downloadAsync(
            this.state.info.picture.data.url,
            fileName
        )
        .then( async ({ uri }) => {
            await this.setState({localUri:uri});

            const file = {
                uri: this.state.localUri,
                name: this.state.imageName, 
                type: "image/jpg"     
              }
              
              const body = new FormData()
              body.append('file', file)
              body.append('width', this.state.info.picture.data.width)
              body.append('height', this.state.info.picture.data.height)
              body.append('extension', "jpg")
              body.append('local_uri', this.state.localUri)
              
              fetch("https://ivorystack.com/mainbk/public/api/files", {
                method: 'POST',
                body
              })
              .then(res => res.json())
              .then(res => this.setState({apiUrlImage: res.data.uri}))
              .catch(err => console.log(err))
        })
        .catch(error => {
            console.error(error);
        });          

        } else {
            this.setState({info: "El usuario canceló"})
        }
      } catch ({ message }) {
        console.log(message);
      }
    }
    logInGoogle = async () => {
        const result = await Google.logInAsync({
            androidClientId: "797683055907-qbfbsiiv856qqgk827hsg93nirvtnu4a.apps.googleusercontent.com",
            iosClientId: "797683055907-6ftmuc5rnkg0isfc7s0dfbju35bj96r6.apps.googleusercontent.com",
            scopes: ['profile', 'email'],
          });
          this.setState({infoGoogle: result.user});//hij
        //av paseo a rep, 2577, la victoria, detras de la torre de interbank en el edif de quimica suiza, pregunta por PabloÁvila
    };    

    render(){
        const resultado = "Haz click para loggearte";//jaerora
        let url, width, height;
        if(this.state.info){
            url = this.state.info.picture.data.url;     
            width = this.state.info.picture.data.width;     
            height = this.state.info.picture.data.height;           
        }


        
        return(
            
            <ScrollView contentContainerStyle={{height:"auto", width: "100%"}}>
                <View style={{flex:1, paddingTop:30, backgroundColor:"#f2efef", alignItems:"center", justifyContent:"flex-start"}}>
                    <View style={{
                        flexDirection:"row", 
                        width:"100%", 
                        alignItems:"center", 
                        justifyContent:"space-between", 
                        padding: 20}
                    }>
                        <TouchableOpacity
                            style={{backgroundColor:"navy", height: 50, widht: 300, padding:10, borderRadius:10, alignItems:"center", justifyContent:"center"}}
                            onPress={this.logIn.bind(this)}
                        >
                            <Text style={{flexWrap:"wrap", color:"white"}}>Login con Facebook</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{backgroundColor:"red", height: 50, widht: 300, padding:10, borderRadius:10, alignItems:"center", justifyContent:"center"}}
                            onPress={this.logInGoogle.bind(this)}
                        >
                            <Text style={{flexWrap:"wrap", color:"white"}}>Login con Google</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={{backgroundColor:"navy", maxWidth:300, elevation:7, borderRadius:20, alignItems:"center", justifyContent:"center", padding: "10%"}}>
                        {this.state.apiUrlImage ? <Image source={{uri:this.state.apiUrlImage}} style={{position:"absolute", top:0, right:0, borderTopRightRadius :20,height:100, width: 100}} /> : null}    
                        <Text style={{marginTop:110, color:"white", alignSelf:"flex-start", textAlign:"left"}}>{JSON.stringify(this.state.info)}</Text>

                    </View>

                    <View  style={{backgroundColor:"red", maxWidth:300, elevation:7, borderRadius:20, alignItems:"center", justifyContent:"center", padding: "10%"}}>
                        {this.state.infoGoogle ? <Image source={{uri:this.state.infoGoogle.photoUrl}} style={{position:"absolute", top:0, right:0, borderTopRightRadius :20,height:100, width: 100}} /> : null} 
                        {this.state.infoGoogle ? <Text style={{marginTop:110, color:"white", alignSelf:"flex-start", textAlign:"left"}}>{JSON.stringify(this.state.infoGoogle)}</Text> : null}
                    </View>
                    

                </View>                
            </ScrollView>

        )
    }
}

export default Login;