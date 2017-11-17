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
  Platform,
} from 'react-native';

import { NavigationActions } from 'react-navigation'
import Checkbox  from 'react-native-custom-checkbox'
import { Colors } from '../constants'
import NavigationBar from '../components/NavigationBar'

var { width, height } = Dimensions.get('window');
const backAction = NavigationActions.back({
    
})

class SettingsScreen extends React.Component {
  static navigationOptions = {
        header : null,
        tabBarLabel: 'More',
        tabBarIcon: ({ tintColor }) => (
                <Image resizeMode='contain' source={require('../assets/images/hambuger.png')} style={[styles.icon, {tintColor: tintColor}]} />
        ),
  };

 constructor(props) {
    super(props);
    this.state = {};
    this.navigate = this.props.navigation;
  }

  render() {
      return (
        <View style={styles.container}>  
            <View style = {styles.statusbar}/>
            <View  style={styles.navigationbar}>
                <TouchableOpacity  onPress={() => {this.props.navigation.dispatch(backAction)}}>
                    <Image resizeMode='cover' source={require("../assets/images/back.png")} style={styles.backButton} />
                </TouchableOpacity>
                <Text style={styles.centerText}>Settings</Text>
                <View style={styles.rightView}>
                </View>
            </View>
            <View style={styles.main_view}>
                <View style={styles.main_top_view}>
                    <Image resizeMode='cover' source={require('../assets/images/person1.png')} style={styles.user_photo_img} />
                    <Text style={styles.profile_name_text}>Adam Parker</Text>
                    <Text style={styles.profile_email_text} >adamparker@gmail.com</Text>                
                </View>
                <View style={styles.main_info_view}>
                    <TouchableOpacity style={styles.row_view} onPress={() => {this.navigate.navigate('ChangePassword')}}>
                        <Text  style={styles.row_lb}>Update Password</Text>
                        <Image resizeMode='contain' source={require("../assets/images/item_arrow.png")} style={styles.row_icon}/>
                    </TouchableOpacity>
                     <View style={styles.blank_row_view}>
                    </View>
                     <View style={styles.row_icon_view}>
                        <Image resizeMode='contain' source={require("../assets/images/Icon_email.png")} style={styles.row_small_icon}/>
                        <TextInput underlineColorAndroid='transparent' style={styles.row_icon_lb} value={'adamparker@gmail.com'}></TextInput>
                    </View>
                    <View style={styles.row_icon_view}>
                        <Image resizeMode='contain' source={require("../assets/images/trip_item_location_icon.png")} style={styles.row_small_icon}/>
                        <Text  style={styles.row_icon_lb}>8763 Schultz Wall Suite 840</Text>
                    </View>
                     <TouchableOpacity style={styles.row_credit_view}>
                         <View style={styles.row_icon_small_view}>
                            <Image resizeMode='contain' source={require("../assets/images/wallet_icon.png")} style={styles.row_small_icon}/>
                            <Text  style={styles.row_icon_lb}>Credit Card</Text>
                        </View>
                        <Image resizeMode='contain' source={require("../assets/images/item_arrow.png")} style={styles.row_icon}/>
                    </TouchableOpacity>
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

    statusbar:{
        width: width,
        height: (Platform.OS == 'ios')? 20 : StatusBar.currentHeight,
        backgroundColor: Colors.main,
        position: 'absolute',
        top: 0,
        left: 0,
    },

     // --- navigation bar --- //
   navigationbar:{
      height:44,
      marginTop: (Platform.OS == 'ios')? 20:0,
      backgroundColor: Colors.main,
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
        height:20,
        width:20
    },

    // --- main view --- //
    main_view:{
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:'#f9fbfe',
    },

    // -- main top view -- //
    main_top_view:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent : 'center',
        width: width,
        height:180,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderColor:'#c2c3c9',
    },
   
    user_photo_img:{
        width:80,
        height:80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor:'transparent',
    },
    profile_name_text:{
        fontSize:17,
        color:'black',
        fontWeight:'bold',
    },
    profile_email_text:{
        fontSize:13,
        color:'#31dd73',
    },

    // -- main info view -- //
    main_info_view:{
        flexDirection:'column',
        alignItems:'center',
        width:width,
    },
    row_view:{
        height:40,
        paddingVertical:13,
        paddingHorizontal:30,
        width:width,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderColor:'#c2c3c9',
        backgroundColor:'white',
    },
    row_credit_view:{
        height:40,
        paddingVertical:13,
        paddingHorizontal:30,
        width:width,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',
    },
    row_lb:{
        color:'#6e7478',
        fontSize:13,
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
        height:40,
        borderBottomWidth:1,
        borderColor:'#c2c3c9',
        backgroundColor:'white',
    },
    row_icon_lb:{
        marginLeft:10,
        color:'#6e7478',
        fontSize:13,
        width:width-100,
        marginTop:5,
    },
     row_icon:{
        height:15,
        width:15,
    },
    row_small_icon:{
        width:15,
        height:10,
    },
    row_icon_small_view:{
        flexDirection:'row',
        alignItems:'center',
        width:width-60,
        height:40,
        backgroundColor:'white',
    }

});

export default SettingsScreen;

