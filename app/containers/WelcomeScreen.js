import React, { Component } from 'react';

import {
  AppRegistry,
  Button,
  ScrollView,
  Dimensions,
  StatusBar,
  Navigator,
  StyleSheet,
  Image,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ImageBackground
} from 'react-native';

import ApplyButton from '../components/ApplyButton';
import { Colors } from '../constants'

var { width, height } = Dimensions.get('window');
//const onButtonPress = () => { Alert.alert('Button has been pressed!'); }; 

class WelcomeScreen extends React.Component {
    static navigationOptions = {
      title: 'Welcome',
      header : null,
    };

    render() {
      const { navigate } = this.props.navigation;
      return (
          <View style={styles.container}>
              <ImageBackground resizeMode='cover' source={require("../assets/images/welcome_bg.png")} style={styles.bg_img}>
                    <View style={styles.top_container}>
                        <Image resizeMode='cover' source={require("../assets/images/grey_logo.png")} style={styles.logo}/>
                        <Text style={styles.txt_welcome}>WELCOME!</Text>
                        <View style={styles.line}></View>
                        <Text style={styles.txt_bottom}>Wine Tours La Dolce Vita </Text>
                    </View>
                    <View style={styles.bottom_container}>
                        <ApplyButton  
                          onPress={() => navigate('LoginTourist')} 
                          name="Login Tourist"/>
                        <TouchableOpacity onPress={() => navigate('LoginGuide')} title="Login Guide">
                            <Text style={styles.button_guide}>Tour Guide</Text>
                        </TouchableOpacity>
                    </View>
              </ImageBackground>
          </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bg_img: {
        width: width,
        height : height,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    top_container: {
        marginTop:40,
        alignItems: 'center',
        justifyContent:'flex-start',
    },
    logo:{
        width:60,
        height:60,
    },
    txt_welcome: {
        fontSize: 25,
        fontWeight : 'bold',
        textAlign: 'center',
        color : 'white',
        backgroundColor : 'transparent',
    },
    line: {
        marginTop:7,
        height: 1,
        width: '50%',
        backgroundColor: 'white',
    },
    txt_bottom:{
        marginTop: 7,
        fontSize: 17,
        textAlign: 'center',
        color : Colors.textBottomColor,
        backgroundColor : 'transparent',
    },

    bottom_container:{
        width: width,
        alignItems:'center',
        justifyContent:'center',
        marginBottom:30,
    },
    button_guide:{
        paddingTop:13,
        color:'black',
        textAlign:'center',
        fontSize: 18,
        marginTop : 20,
        height:50,
        width:width-60,
        backgroundColor:'white',
        borderRadius:5,
        borderColor: Colors.tintColor,
        overflow:'hidden',
    },
});

export default WelcomeScreen