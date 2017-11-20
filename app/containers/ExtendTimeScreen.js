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
import KeyEvent from 'react-native-keyevent';
import { Colors } from '../constants'
import ApplyButton from '../components/ApplyButton'

var Toast = require('react-native-toast');
var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({
});

class ExtendTimeScreen extends React.Component {
  static navigationOptions = {
      title: 'Time Limit',
      header : null,
  };

 constructor(props) {
    super(props);
    this.navigate = this.props.navigation;
  }

  componentDidMount() {
    // if you want to react to keyDown 
    KeyEvent.onKeyDownListener((keyCode) => {
      console.log(`Key code pressed: key down`);
      Toast.show.bind(null, 'key code pressed');
    });
 
    // // if you want to react to keyUp 
    // KeyEvent.onKeyUpListener((keyCode) => {
    //   console.log(`Key code pressed: ${keyCode}`);
    // });
  } 

  onDone(){
     console.log("clicked on DoneButton!");
    //  this.navigate.dispatch(backAction);
  }

  render() {
      return (
        <View style={styles.container}>  
            <View  style={styles.navigationbar}>
                    <TouchableOpacity  onPress={() => {this.props.navigation.dispatch(backAction)}}>
                        <Image resizeMode='cover' source={require("../assets/images/back.png")} style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.centerText}>Extend Time</Text>
                    <View style={styles.rightView}>
                    </View>
            </View>
             <View style={styles.current_time_view}>
                    <Text style={styles.current_time_text}>Your time : 03 Hours 40 Minutes</Text>
            </View>
            <View style={styles.main_view}>
                <View style={styles.main_top_view}>
                    <View style={styles.hour_view}>
                        <TextInput underlineColorAndroid='transparent' keyboardType='numeric' style={styles.hour_text} value={'03'}></TextInput>
                        <Text style={styles.hour_lb}>Hours</Text>
                    </View>
                    <View style={styles.double_dut_view}>   
                        <Text style={styles.double_dut_symbol}>:</Text>
                    </View>
                    <View style={styles.minute_view}>
                        <TextInput underlineColorAndroid='transparent' keyboardType='numeric' style={styles.hour_text} value={'40'}></TextInput>
                        <Text style={styles.hour_lb}>Minutes</Text>
                    </View>
                </View>
                <View style={styles.main_bottom_view}>
                    <ApplyButton onPress={() => this.onDone()} name={'Extend Time'} style={styles.done_btn}/>
                </View>
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
        height:20,
        width:20
    },

    /// ------- main view -------///
    main_view:{
        flexDirection:'column',
        alignItems:'center',
        width:width,
        height:height-44,
    },

    // --- main top view -- //
    current_time_view:{
        backgroundColor:'white',
        width:width,
        paddingVertical:5,
        alignItems:'center',
        borderBottomWidth:1,
        borderColor:'#ddd',
    },
    current_time_text:{
        textAlign:'center',
        fontSize:15,
        color:'#979797',
    },
    main_top_view:{
        width:width,
        flex:0.5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#f9fbfe',
    },
    hour_view:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    },
    hour_text:{
        fontSize:45,
        fontWeight:'bold',
        color:'black',
        height:100,
        width:90,
        borderWidth:1,
        borderColor:'#979797',
        borderRadius:5,
        textAlign:'center',
    },
    hour_lb:{
        textAlign:'center',
        marginTop:10,
        fontSize:20,
        color:'#9fa0a2',
    },
    double_dut_view:{
        marginBottom:50,
        width:70,
        alignItems:'center',
    },
    double_dut_symbol:{
        fontSize:45,
        fontWeight:'bold',
        color:'black',
    },
    minute_view:{
        flexDirection:'column',
        alignItems:'center',
    },

    // --- main bottom view -- //
    main_bottom_view:{
        width:width,
        flex:0.5,
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:'white',
    },
    done_btn:{
        marginTop:20,
        width:width-60,
    },
    note_text:{
        marginTop:50,
        fontSize: 12,
        color:'black',
        width:200,
        textAlign:'center',
    },
});

export default ExtendTimeScreen;

