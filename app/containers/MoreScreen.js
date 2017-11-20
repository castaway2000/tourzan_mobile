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
  Platform
} from 'react-native';

import { NavigationActions } from 'react-navigation'
import Checkbox  from 'react-native-custom-checkbox'
import { Colors } from '../constants'
import NavigationBar from '../components/NavigationBar'

var { width, height } = Dimensions.get('window');
const backAction = NavigationActions.back({
    
});

const resetRootAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Welcome' }),
    ],
    key: null
});

class MoreScreen extends React.Component {
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

    onLogout(){
        this.props.navigation.dispatch(resetRootAction);
    }

    render() {
        return (
            <View style={styles.container}> 
                <View style = {styles.statusbar}/>
                <View  style={styles.navigationbar}>
                    <View style={styles.backButton}>
                    </View>
                    <Text style={styles.centerText}>TOUZAN</Text>
                    <View style={styles.rightView}>
                    </View>
                </View>
                <View style={styles.main_view}>
                    <View style={styles.blank_row_view}>
                    </View>
                    <TouchableOpacity style={styles.row_view} onPress={() => this.navigate.navigate('Settings')}>
                        <Text  style={styles.row_lb}>Settings</Text>
                        <Image resizeMode='contain' source={require("../assets/images/item_arrow.png")} style={styles.row_icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row_view}>
                        <Text  style={styles.row_lb}>FAQ</Text>
                        <Image resizeMode='contain' source={require("../assets/images/item_arrow.png")} style={styles.row_icon}/>
                    </TouchableOpacity>
                    <View style={styles.blank_row_view}>
                    </View>
                        <TouchableOpacity style={styles.row_view}>
                        <Text  style={styles.row_lb}>Privacy Policy</Text>
                        <Image resizeMode='contain' source={require("../assets/images/item_arrow.png")} style={styles.row_icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row_view}>
                        <Text  style={styles.row_lb}>Terms of Use</Text>
                        <Image resizeMode='contain' source={require("../assets/images/item_arrow.png")} style={styles.row_icon}/>
                    </TouchableOpacity>
                        <View style={styles.blank_logout_view}>
                    </View>
                    <TouchableOpacity style={styles.row_view} onPress={() => this.onLogout()}>
                        <Text  style={styles.row_logout_lb}>LOGOUT</Text>
                        <Image resizeMode='contain' source={require("../assets/images/Logout_icon.png")} style={styles.row_icon}/>
                    </TouchableOpacity>
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
    blank_row_view:{
         width:width,
         height:40,
         backgroundColor:'#f9fbfe',
         borderBottomWidth:1,
         borderColor:'#c2c3c9',
    },
    blank_logout_view:{
         width:width,
         height:60,
         backgroundColor:'#f9fbfe',
         borderBottomWidth:1,
         borderColor:'#c2c3c9',
    },
    row_view:{
        height:50,
        paddingVertical:15,
        paddingHorizontal:30,
        width:width,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderColor:'#c2c3c9',
        backgroundColor:'white',
    },
    row_lb:{
        color:'black',
        fontSize:17,
    },
    row_logout_lb:{
        color:'red',
        fontSize:17,
    },
    row_icon:{
        height:15,
        width:15,
    },
});

export default MoreScreen;

