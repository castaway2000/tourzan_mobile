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

class RegisterGuideScreen extends React.Component {
  static navigationOptions = {
      title: 'Login Tourist',
      header : null,
  };

 constructor(props) {
    super(props);
    isIntestExtend : {false};
  }

  onIntestExtention(){
      isIntestExtend = !isIntestExtend;
  }

  onSignup(){
    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'Home'})
        ]
    })
    this.props.navigation.dispatch(resetAction)
  }

  render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.container}>  
            <Image resizeMode='cover' source={require("../assets/images/login_bg.png")} style={styles.top_container}>
                  <NavigationBar title={''} bgColor={'transparent'} onPress={() => {this.props.navigation.dispatch(backAction)}}/>
                  <View style={styles.view_title}>
                        <Text style={styles.txt_bottom}>Create an account to Tourist</Text>
                         <Text style={styles.txt_welcome}>REGISTER</Text>
                  </View>
            </Image>
            <ScrollView style={styles.scrollview_container}>
                <View style={styles.bottom_container}>
                    <View style={{borderBottomWidth:1, borderColor:'grey'}}>
                        <TextInput placeholder="Username" style={styles.inputText} underlineColorAndroid='rgba(0,0,0,0)'/>
                    </View>
                    <View style={{borderBottomWidth:1, borderColor:'grey'}}>
                        <TextInput placeholder="Email" style={styles.inputText} underlineColorAndroid='rgba(0,0,0,0)'/>
                    </View>
                    <View style={{borderBottomWidth:1, borderColor:'grey'}}>
                    <TextInput placeholder="Password" secureTextEntry={true} style={styles.inputText} underlineColorAndroid='rgba(0,0,0,0)'/>
                    </View>
                    <View style={{borderBottomWidth:1, borderColor:'grey'}}>
                    <TextInput placeholder="Confirm Password" secureTextEntry={true} style={styles.inputText} underlineColorAndroid='rgba(0,0,0,0)'/>
                    </View>
                    <View style={{borderBottomWidth:1, borderColor:'grey'}}>
                        <TextInput placeholder="Address" style={styles.inputText} underlineColorAndroid='rgba(0,0,0,0)'/>
                    </View>
                    <View style={{borderBottomWidth:1, borderColor:'grey'}}>
                        <TextInput placeholder="Company Name" style={styles.inputText} underlineColorAndroid='rgba(0,0,0,0)'/>
                    </View>
                    <View style={{borderBottomWidth:1, borderColor:'grey'}}>
                        <TextInput placeholder="Phone Number" style={styles.inputText} underlineColorAndroid='rgba(0,0,0,0)'/>
                    </View>
                    <View style={{borderBottomWidth:1, borderColor:'grey'}}>
                        <TextInput defaultValue="Intests" editable={false} onFocus={this.onIntestExtention}  style={styles.interest_text} underlineColorAndroid='rgba(0,0,0,0)' />
                    </View>
                
                    <ApplyButton name={'Sign Up'} onPress={() => this.onSignup()} style={styles.button_login}/>
                    <TouchableOpacity  onPress={() => {this.props.navigation.dispatch(backAction)}} title="SING IN">
                        <Text style={styles.button_signin} >SIGN IN</Text>
                    </TouchableOpacity>
                    </View>
            </ScrollView>
        </View>
      );
   }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start'
  },
  top_container: {
      width: width,
      height : height*40/100,
      flexDirection:'column',
  },
  view_title:{
      width: width,
      height : height*40/100 - 44,
      alignItems:'flex-start',
      flexDirection:'column',
      justifyContent:'flex-end',
      marginLeft:40,
      marginBottom:30,
  },
  txt_welcome: {   
      marginTop:5,
      fontSize: 24,
      fontWeight : 'bold',
      textAlign: 'center',
      color : '#ffffff',
      backgroundColor:'transparent',
  },
  txt_bottom:{
      fontSize: 17,
      textAlign: 'center',
      color : '#eeeeee',
      backgroundColor:'transparent',
  },
  scrollview_container: {
     flex:1,
     height : 1000,
  },
  bottom_container:{
      width: width,
      alignItems:'center'
  },
  inputText: {
      width: width-60, 
      marginTop: 20,
      height: 40,
      borderColor: 'gray'
  },
  interest_text: {
      width: width-60, 
      marginTop: 20,
      height: 40,
      borderColor: 'gray',
  },
  txt_checkbox:{
      marginLeft:10,
      fontSize:12,    
  },
  txt_forgot:{
      fontSize:12,    
  },
  view_remember: {
      width: width-60,
      marginTop: 20,
      justifyContent:'space-between',
      flexDirection: 'row'
  },
  view_checkbox:{
      width:100,
      justifyContent:'flex-start',
      flexDirection: 'row',
      alignItems:'center'
  },
  button_login:{
      marginTop: 25,
  },
  button_signin:{
      marginTop:30,
      marginBottom:20,
      color: '#000',
      textAlign:'center',
      fontSize:18,
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
      textDecorationColor: "#000"
  }
});


export default RegisterGuideScreen;

