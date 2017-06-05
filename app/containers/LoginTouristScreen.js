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
import CheckBox from 'react-native-checkbox';

import ApplyButton from '../components/ApplyButton'
import NavigationBar from '../components/NavigationBar'

var { width, height } = Dimensions.get('window');

const onButtonPress = () => { Alert.alert('Button has been pressed!'); }; 
const backAction = NavigationActions.back({
    // key: 'WelcomeScreen'
})

class LoginTouristScreen extends React.Component {
  static navigationOptions = {
      title: 'Login Tourist',
      header : null,
  };

 constructor(props) {
    super(props);
    this.state = { checked: false };
  }

  onLogin(){
        
  }

  render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.container}>  
            <Image resizeMode='cover' source={require("../assets/images/login_bg.png")} style={styles.top_container}>
                  <NavigationBar title={'Tourist Login'} onPress={() => {this.props.navigation.dispatch(backAction)}}/>
                  <Image resizeMode='center' source={require("../assets/images/Tourzan_Logo.png")}/>
                  <Text style={styles.txt_welcome}>TOURZAN</Text>
                  <Text style={styles.txt_bottom}>Wine Tours La Dolce Vita</Text>
            </Image>
            <View style={styles.bottom_container}>
                  <TextInput placeholder="Email" style={styles.inputText} underlineColorAndroid={'gray'}/>
                  <TextInput placeholder="Password" secureTextEntry={true} style={styles.inputText} underlineColorAndroid={'gray'}/>
                  <View style={styles.view_remember}>
                      <CheckBox
                            checked={this.state.checked}
                            label='Remember me'
                            checkedImage={require("../assets/images/checkbox.png")}
                            uncheckedImage={require("../assets/images/uncheck.png")}
                            onChange={(checked) =>  this.setState({
                                checked: !this.state.checked
                            })}
                       />
                     <TouchableOpacity   title="Forgot Password?">
                         <Text>Forgot Password?</Text>
                     </TouchableOpacity>
                  </View>
                  <ApplyButton name={'Login'} style={styles.button_login}/>
                  <TouchableOpacity   title="SING UP">
                      <Text style={styles.button_signup} >SIGN UP</Text>
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
      height : height*30/100,
      alignItems: 'center',
      justifyContent: 'center'
  },
  txt_welcome: {
      marginTop : -20,
      fontSize: 30,
      textAlign: 'center',
      color : '#ffffff'
  },
  line: {
      marginTop:7,
      height: 1,
      width: '50%',
      backgroundColor: '#ffffff'
  },
  txt_bottom:{
      marginTop: 7,
      fontSize: 20,
      textAlign: 'center',
      color : '#eeeeee'
  },
  bottom_container:{
      width: width,
      height:height-height*30/100,
      alignItems:'center'
  },
  inputText: {
      width: width-60, 
      marginTop: 25,
      height: 40,
      borderColor: 'gray'
  },
  view_remember: {
      width: width-60,
      marginTop: 40,
      justifyContent:'space-between',
      flexDirection: 'row'
  },
  button_login:{
      marginTop: 40,
  },
  button_signup:{
      marginTop:40,
      color: '#000',
      textAlign:'center',
      fontSize:18,
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
      textDecorationColor: "#000"
  }
});

export default LoginTouristScreen;

