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

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavigationActions } from 'react-navigation'
import Checkbox  from 'react-native-custom-checkbox'

import ApplyButton from '../components/ApplyButton'
import NavigationBar from '../components/NavigationBar'

var { width, height } = Dimensions.get('window');

const onButtonPress = () => { Alert.alert('Button has been pressed!'); }; 
const backAction = NavigationActions.back({
    // key: 'WelcomeScreen'
});

let nextInput;

class LoginGuideScreen extends React.Component {
  static navigationOptions = {
      title: 'Tour Guide Login ',
      header : null,
  };

 constructor(props) {
    super(props);
    this.state = { 
        checked: false,
        email: '',
        password: '' 
    };
    this.navigate = this.props.navigation;
  }

  onLogin(){
    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'Home'})
        ]
    });
    this.navigate.dispatch(resetAction)
  }

  setUserEmail(text){
      this.setState({ email: text })
  }
  
  setPassword(text){
      this.setState({ password: text })
  }
  
  getNextInput(data) {
      nextInput = data;
  }

  changeFocus() {
      if (nextInput !== undefined) {
		nextInput.focus();
	  }
  }


  render() {
      return (
        <View style = {styles.container} >
            <Image resizeMode='cover' source={require("../assets/images/login_bg.png")} style={styles.top_container}>
                  <NavigationBar title={'Tour Guide Login'} bgColor={'transparent'} onPress={() => {this.props.navigation.dispatch(backAction)}}/>
                  <View style={styles.view_logo}>
                        <Image resizeMode='contain' style={styles.icon_logo}  source={require("../assets/images/Tourzan_Logo.png")}/>
                        <Text style={styles.txt_welcome}>TOURZAN</Text>
                        <Text style={styles.txt_bottom}>Wine Tours La Dolce Vita</Text>
                  </View>
            </Image>
            <KeyboardAwareScrollView >
                <View style={styles.bottom_container}>
                    <View style={styles.bottom_container}>
                        <View>
                            <TextInput 
                                placeholder="Email" 
                                style={styles.inputText}
                                underlineColorAndroid = 'transparent'
                                value = {this.state.email}
                                onChangeText = {(text) => this.setUserEmail(text)}
                                onSubmitEditing={this.changeFocus.bind(this)}
                            />
                            <View style={styles.line}></View>
                        </View>
                        <View>
                            <TextInput 
                                ref={this.getNextInput.bind(this)}
                                placeholder="Password" 
                                secureTextEntry={true}
                                style={styles.inputText}
                                underlineColorAndroid = 'transparent'
                                value = {this.state.password}
                                onChangeText = {(text) => this.setPassword(text)}
                                onSubmitEditing={this._onLogin}
                            />
                            <View style={styles.line}></View>
                        </View>
                        <View style={styles.view_remember}>
                            <View style={styles.view_checkbox}>
                                <Checkbox
                                        checked={true}
                                        style={{backgroundColor: '#f2f2f2', color:'#31dd73', borderRadius: 2}}
                                        size={15}
                                />
                                <Text style={styles.txt_checkbox}>Remember me</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.navigate.navigate('ForgotPassword')}>
                                <Text style={styles.txt_forgot}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        <ApplyButton name={'Login'} onPress={() => this.onLogin()} style={styles.button_login}/>
                        <TouchableOpacity  onPress={() => this.navigate.navigate('RegisterGuide')} title="SING UP">
                            <Text style={styles.button_signup} >SIGN UP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
      );
   }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'column',
  },
  top_container: {
      width: width,
      height : height*40/100,
      flexDirection:'column',
      justifyContent:'space-between'
  },
  view_logo:{
      width: width,
      height : height*40/100 - 44,
      alignItems:'center',
      flexDirection:'column',
      justifyContent:'center',
  },
  icon_logo:{
      height:70,
      width:70
  },
  txt_welcome: {
        fontSize: 17,
        fontWeight : 'bold',
        textAlign: 'center',
        color : 'white',
        backgroundColor: 'transparent'
    },
  txt_bottom:{
        fontSize: 17,
        textAlign: 'center',
        color : '#eeeeee',
        backgroundColor: 'transparent'
    },
  bottom_container:{
      width: width,
      height:height-height*40/100,
      alignItems:'center'
  },
  inputText: {
      width: width-60, 
      marginTop: 20,
      height: 40,
      borderColor: 'gray'
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
  button_signup:{
      marginTop:30,
      color: '#000',
      textAlign:'center',
      fontSize:18,
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
      textDecorationColor: "#000"
  },
  line: {
      height: 1,
      width: width-60,
      backgroundColor: 'gray',
  },
});

export default LoginGuideScreen;

