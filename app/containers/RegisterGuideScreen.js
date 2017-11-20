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
import { Colors } from '../constants'
import ApplyButton from '../components/ApplyButton'
import NavigationBar from '../components/NavigationBar'



var { width, height } = Dimensions.get('window');

const onButtonPress = () => { Alert.alert('Button has been pressed!'); }; 
const backAction = NavigationActions.back({
    // key: 'WelcomeScreen'
})

let nextInput1;
let nextInput2;
let nextInput3;
let nextInput4;
let nextInput5;
let nextInput6;
 
class RegisterGuideScreen extends React.Component {
  static navigationOptions = {
      title: 'Login Tourist',
      header : null,
  };

 constructor(props) {
    super(props);
    this.state = {
        name: '',
        email: '',
        password: '',
        confirmpassword: '',
        address: '',
        company:'',
        phone:'',
        intests: '',
    };
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

  setUserName(text){
      this.setState({ name: text })
  }
  
  setUserEmail(text){
      this.setState({ email: text })
  }

  setUserPassword(text){
      this.setState({ password: text })
  }

  setUserConfirmPassword(text){
      this.setState({ confirmpassword: text })
  }

  setUserAddress(text){
      this.setState({ address: text })
  }

  setUserCompany(text){
      this.setState({ company: text })
  }

  setUserPhone(text){
      this.setState({ phone: text })
  }

  setUserIntests(text){
      this.setState({ intests: text })
  }

  getNextInput1(data) {
      nextInput1 = data;
  }

  getNextInput2(data) {
      nextInput2 = data;
  }

  getNextInput3(data) {
      nextInput3 = data;
  }

  getNextInput4(data) {
      nextInput4 = data;
  }

  getNextInput5(data) {
      nextInput5 = data;
  }

  getNextInput6(data) {
      nextInput6 = data;
  }

  changeFocus1() {
      if (nextInput1 !== undefined) {
		nextInput1.focus();
	  }
  }
  
  changeFocus2(){
      nextInput2.focus();
  }

  changeFocus3(){
      nextInput3.focus();
  }

  changeFocus4(){
      nextInput4.focus();
  }

  changeFocus5(){
      nextInput5.focus();
  }

  changeFocus6(){
      nextInput6.focus();
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
            <KeyboardAwareScrollView style = {styles.out_container}>
                <View style={styles.bottom_container}>
                    <View>
                        <TextInput 
                            placeholder="Username" 
                            style={styles.inputText}
                            underlineColorAndroid = 'transparent'
                            value = {this.state.name}
                            onChangeText = {(text) => this.setUserName(text)}
                            onSubmitEditing={this.changeFocus1.bind(this)}
                        />
                        <View style={styles.line}></View>
                    </View>
                    <View>
                        <TextInput
                            ref={this.getNextInput1.bind(this)}
                            placeholder="Email" 
                            style={styles.inputText}
                            underlineColorAndroid = 'transparent'
                            value = {this.state.email}
                            onChangeText = {(text) => this.setUserEmail(text)}
                            onSubmitEditing={this.changeFocus2.bind(this)}
                        />
                        <View style={styles.line}></View>
                    </View>
                    <View>
                        <TextInput
                            ref={this.getNextInput2.bind(this)}
                            placeholder="Password" 
                            style={styles.inputText}
                            underlineColorAndroid = 'transparent'
                            value = {this.state.password}
                            onChangeText = {(text) => this.setUserPassword(text)}
                            onSubmitEditing={this.changeFocus3.bind(this)}
                        />
                        <View style={styles.line}></View>
                    </View>
                    <View>
                        <TextInput
                            ref={this.getNextInput3.bind(this)}
                            placeholder="Confirm Password" 
                            style={styles.inputText}
                            underlineColorAndroid = 'transparent'
                            value = {this.state.confirmpassword}
                            onChangeText = {(text) => this.setUserConfirmPassword(text)}
                            onSubmitEditing={this.changeFocus4.bind(this)}
                        />
                        <View style={styles.line}></View>
                    </View>
                    <View>
                        <TextInput
                            ref={this.getNextInput4.bind(this)}
                            placeholder="Address" 
                            style={styles.inputText}
                            underlineColorAndroid = 'transparent'
                            value = {this.state.address}
                            onChangeText = {(text) => this.setUserAddress(text)}
                            onSubmitEditing={this.changeFocus5.bind(this)}
                        />
                        <View style={styles.line}></View>
                    </View>
                    <View>
                        <TextInput
                            ref={this.getNextInput5.bind(this)}
                            placeholder="Company Name" 
                            style={styles.inputText}
                            underlineColorAndroid = 'transparent'
                            value = {this.state.company}
                            onChangeText = {(text) => this.setUserCompany(text)}
                            onSubmitEditing={this.changeFocus6.bind(this)}
                        />
                        <View style={styles.line}></View>
                    </View>
                    <View>
                        <TextInput
                            ref={this.getNextInput6.bind(this)}
                            placeholder="Phone Number" 
                            style={styles.inputText}
                            underlineColorAndroid = 'transparent'
                            value = {this.state.phone}
                            onChangeText = {(text) => this.setUserPhone(text)}
                        />
                        <View style={styles.line}></View>
                    </View>
                    <View>
                        <TextInput
                            placeholder="Intests" 
                            style={styles.inputText}
                            editable={false}
                            underlineColorAndroid = 'transparent'
                            value = {this.state.intests}
                            onFocus={this.onIntestExtention}  style={styles.interest_text}
                            onChangeText = {(text) => this.setUserIntests(text)}
                        />
                        <View style={styles.line}></View>
                    </View>
                
                    <ApplyButton name={'Sign Up'} onPress={() => this.onSignup()} style={styles.button_login}/>
                    <TouchableOpacity  onPress={() => {this.props.navigation.dispatch(backAction)}} title="SING IN">
                       <Text style={styles.button_signin} >SIGN IN</Text>
                    </TouchableOpacity>
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
        justifyContent: 'flex-start'
    },
    out_container: {
        flex: 1
    },
    top_container: {
        width: width,
        height : height*0.4,
        flexDirection:'column',
    },
    view_title:{
        width: width,
        height : height*0.4 - 70,
        alignItems:'flex-start',
        flexDirection:'column',
        justifyContent:'flex-end',
        marginLeft:30,
    },
    txt_welcome: {   
        marginTop:5,
        fontSize: 24,
        fontWeight : 'bold',
        textAlign: 'center',
        color : 'white',
        backgroundColor: 'transparent'
    },
    txt_bottom:{
        fontSize: 17,
        textAlign: 'center',
        color : Colors.textBottomColor,
        backgroundColor: 'transparent'
    },
    scrollview_container: {
        flex:1,
        height : 1000,
    },
    bottom_container:{
        width: width,
        alignItems:'center',
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
    },
    line: {
        height: 1,
        width: width-60,
        backgroundColor: 'gray',
    },
});


export default RegisterGuideScreen;

