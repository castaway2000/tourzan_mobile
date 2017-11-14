import React, { Component } from 'react';

import {
  Button,
  ScrollView,
  Dimensions,
  StatusBar,
  Navigator,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { NavigationActions } from 'react-navigation'
import Checkbox  from 'react-native-custom-checkbox'

import ApplyButton from '../components/ApplyButton'
import NavigationBar from '../components/NavigationBar'

var { width, height } = Dimensions.get('window');

const onButtonPress = () => { Alert.alert('Button has been pressed!'); }; 
const backAction = NavigationActions.back({
    // key: 'WelcomeScreen'
})

class ForgotPasswordScreen extends React.Component {
  static navigationOptions = {
      title: 'Forgot Password',
      header : null,
  };

 constructor(props) {
    super(props);
  
  }

  onLogin(){
        
  }

  render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.container}>  
            <View  style={styles.top_container}>
                  <NavigationBar title={'Forgot Password'} bgColor={'#31dd73'} onPress={() => {this.props.navigation.dispatch(backAction)}}/>
                  <View style={styles.view_logo}>
                        <Image resizeMode='contain' style={styles.icon_logo}  source={require("../assets/images/Tourzan_Logo.png")}/>
                        <Text style={styles.txt_welcome}>Recover Password</Text>
                        <Text style={styles.txt_bottom}>Enter your email to receive intructions on how to reset your password</Text>
                  </View>
            </View>
            <View style={styles.bottom_container}>
                  <TextInput placeholder="Email" style={styles.inputText} underlineColorAndroid={'gray'}/>
                  <ApplyButton name={'Recover'} style={styles.button_recover}/>
                  <TouchableOpacity  onPress={() => {this.props.navigation.dispatch(backAction)}} title="Cancel">
                      <Text style={styles.button_cancel} >Cancel</Text>
                  </TouchableOpacity>
            </View>
        </View>
      );
   }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-between'
  },
  top_container: {
      width: width,
      height : height*40/100,
      flexDirection:'column',
      justifyContent:'flex-start'
  },
  view_logo:{
      width: width,
      height : height*40/100 - 44,
      alignItems:'center',
      flexDirection:'column',
      justifyContent:'center',
      backgroundColor: '#fff',
  },
  icon_logo:{
      height:70,
      width:70
  },
  txt_welcome: {
      fontSize: 17,
      fontWeight : 'bold',
      textAlign: 'center',
      color : '#000',
  },
  txt_bottom:{
      width: width-60,
      fontSize: 15,
      textAlign: 'center',
      color : '#999999'
  },
  bottom_container:{
      width: width,
      height:height-height*40/100,
      alignItems:'center'
  },
  inputText: {
      width: width-60, 
      marginTop: 50,
      height: 40,
      borderColor: 'gray'
  },

  button_recover:{
      marginTop: 35,
  },
  button_cancel:{
      marginTop:40,
      marginBottom: 30,
      color: '#000',
      textAlign:'center',
      fontSize:18,
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
      textDecorationColor: "#000"
  }
});

export default ForgotPasswordScreen;

