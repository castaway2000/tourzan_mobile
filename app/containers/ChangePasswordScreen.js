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

import NavigationBar from '../components/NavigationBar'

var { width, height } = Dimensions.get('window');
const backAction = NavigationActions.back({
    
})

class ChangePasswordScreen extends React.Component {
  static navigationOptions = {
        header : null,
        tabBarLabel: 'More',
        tabBarIcon: ({ tintColor }) => (
                <Image resizeMode='contain' source={require('../assets/images/More_Bottom_icon.png')} style={[styles.icon, {tintColor: tintColor}]} />
        ),
  };

 constructor(props) {
    super(props);
    this.state = {};
    this.navigate = this.props.navigation;
  }

  onDone(){
  this.navigate.dispatch(backAction);
  }

  render() {
      return (
        <View style={styles.container}>  
             <View  style={styles.navigationbar}>
                    <TouchableOpacity  onPress={() => {this.props.navigation.dispatch(backAction)}}>
                        <Image resizeMode='cover' source={require("../assets/images/back.png")} style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.centerText}>Password</Text>
                    <TouchableOpacity  onPress={() => this.onDone()}>
                        <Text  style={styles.rightView}>DONE</Text>
                    </TouchableOpacity>
            </View>
            <View style={styles.main_view}>
                    <View style={styles.blank_row_view}>
                    </View>
                    <View style={styles.row_icon_view}>
                        <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon}/>
                        <TextInput underlineColorAndroid='transparent' placeholder='Current Password' style={styles.row_icon_lb}/>
                    </View>
                    <View style={styles.blank_row_view}>
                    </View>
                    <View style={styles.row_icon_view}>
                        <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon}/>
                        <TextInput underlineColorAndroid='transparent' placeholder='New Password' style={styles.row_icon_lb}/>
                    </View>
                    <View style={styles.row_icon_view}>
                        <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon}/>
                        <TextInput underlineColorAndroid='transparent' placeholder='Confirm Password' style={styles.row_icon_lb}/>
                    </View>
            </View>
        </View>
      );
   }
}

const styles = StyleSheet.create({
    icon: {
        width: 20,
        height: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
    },

     // --- navigation bar --- //
   navigationbar:{
      paddingTop:20,
      height:64,
      backgroundColor: '#31dd73',
      width:width,
      alignItems:'center',
      flexDirection:'row',
      justifyContent:'space-between',
   },
   backButton:{
        marginLeft:20,
        height:15,
        width:10,
    },
    centerText:{
        color:'white',
        textAlign:'center',
        fontSize:17,
        width:width-160,
        fontWeight:'bold',
    },
    rightView:{
        marginRight:20,
        color:'white',
        fontSize:17,
    },

    // --- main view --- //
    main_view:{
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:'#f9fbfe',
    },
    blank_row_view:{
         width:width,
         height:30,
         backgroundColor:'#f9fbfe',
         borderBottomWidth:1,
         borderColor:'#c2c3c9',
    },
    row_icon_view:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:30,
        width:width,
        height:50,
        borderBottomWidth:1,
        borderColor:'#c2c3c9',
        backgroundColor:'white',
    },
    row_icon_lb:{
        marginLeft:10,
        color:'#6e7478',
        fontSize:13,
        width:width-100,
        marginTop:10,
    },
     row_icon:{
        height:15,
        width:15,
    },
    row_small_icon:{
        width:15,
        height:15,
    },

});

export default ChangePasswordScreen;

