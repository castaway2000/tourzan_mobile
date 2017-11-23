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

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux'
import { Colors } from '../constants'
import { NavigationActions } from 'react-navigation'
import MapView from 'react-native-maps';

import Switch from '../components/Switch';
import NavigationBar from '../components/NavigationBar';
import * as Actions from '../actions/map'

import flagImg from '../assets/images/flag-blue_small.png';

// var Switch = require('react-native-material-switch');

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({

});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(Actions, dispatch)
};

const  mapStateToProps = (state) => {
    return {
        isbooked: state.isbooked,
    }
 };

class MapsScreen extends React.Component {
    static navigationOptions = {
        header : null,
        tabBarLabel: 'Maps',
        tabBarIcon: ({ tintColor }) => (
            <Image resizeMode='contain' source={require('../assets/images/Maps_Bottom_icon.png')} style={[styles.icon, {tintColor: tintColor}]} />
        ),
    };

    constructor(props) {
        super(props);
        this.state = {
            region:{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            isSettingTime:false,
            hour: '09',
            minute: '18',
            trueSwitchIsOn: true,
        };
    }

    getInitialState() {
        return {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }

    onRegionChange(region) {
        () => this.onRegionChange.bind(this);
    }

    onSettingTime(){
        this.setState({ isSettingTime: true })
    }

    onUnSettingTime(){
        this.setState({ isSettingTime: false })
    }

    setHour(text){
        this.setState({ hour: text })
    }

    setMinute(text){
        this.setState({ minute: text })
    }

    render() {
        const { navigate } = this.props.navigation;
        console.log('map_debug', this.props.isbooked);
        return (
            <View style={styles.container}> 
                <View style = {styles.statusbar}/>
                    <View style={styles.top_container}>
                    <View style={styles.backButton}>
                    </View>
                    <Text style={styles.centerText}>TOURZAN</Text>
                    <TouchableOpacity onPress={() => {navigate('Profile')}}>
                        <Image resizeMode='cover' source={require("../assets/images/person1.png")}  style={styles.rightView} />
                    </TouchableOpacity>
                </View>
                <View style={styles.map_container}>
                    <MapView style={styles.map_view}
                        region={this.state.region}
                        onRegionChange={this.onRegionChange}>
                        <MapView.Marker
                            coordinate={this.state.region}
                            centerOffset={{ x: -18, y: -60 }}
                            anchor={{ x: 0.69, y: 1 }}
                            image={flagImg}/>
                        </MapView>
                    <View style={styles.locationInfo_view}>
                        <View style={styles.location_address_view}>
                            <Image resizeMode='contain' source={require("../assets/images/location_maps.png")} style={styles.icon_image}/>
                            <Text style={styles.row_text}>052 Maggio Road Apt. o16</Text>
                        </View>
                        <View style={styles.devide_line}/>
                        {this.state.isSettingTime ? (
                            <View style={styles.setting_time_view}>
                                <View style={styles.setting_time_top_view}>
                                    <Image resizeMode='contain' source={require("../assets/images/time_icon.png")} style={styles.icon_image}/>
                                    <Text  style={styles.row_text}>{this. state.hour} : {this.state.minute} {this.state.trueSwitchIsOn? 'AM': 'PM'}</Text>
                                </View>
                                <View style={styles.setting_time_main_view}>
                                    <View style={styles.setting_time_lb_view}>
                                        <Text  style={styles.setting_time_lb}>Set your time schedule</Text>
                                        <TouchableOpacity onPress={() => this.onUnSettingTime()}>
                                            <Image resizeMode='contain' source={require("../assets/images/checked_gray.png")} style={styles.setting_time_check_icon}/>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.setting_time_picker_view}>
                                        <View style={styles.setting_time_picker_main_view}>
                                            <View style={styles.hour_view}>
                                                <TouchableOpacity onPress={() => {navigate('')}}>
                                                    <Image resizeMode='contain' source={require("../assets/images/caret-arrow-up.png")}  style={styles.up_down_arrow_view} />
                                                </TouchableOpacity>
                                                <TextInput
                                                    style={styles.hour_text}
                                                    underlineColorAndroid = 'transparent'
                                                    value = {this.state.hour}
                                                    keyboardType = 'numeric'
                                                    maxLength = {2}
                                                    onChangeText = {(text) => this.setHour(text)}
                                                    onSubmitEditing={this._onLogin}
                                                />
                                                <TouchableOpacity onPress={() => {navigate('')}}>
                                                    <Image resizeMode='contain' source={require("../assets/images/caret-arrow-down.png")}  style={styles.up_down_arrow_view} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.double_dut_view}>   
                                                <Text style={styles.double_dut_symbol}>:</Text>
                                            </View>
                                            <View style={styles.minute_view}>
                                                <TouchableOpacity onPress={() => {navigate('')}}>
                                                    <Image resizeMode='contain' source={require("../assets/images/caret-arrow-up.png")}  style={styles.up_down_arrow_view} />
                                                </TouchableOpacity>
                                                <TextInput
                                                    style={styles.hour_text}
                                                    underlineColorAndroid = 'transparent'
                                                    value = {this.state.minute}
                                                    keyboardType = 'numeric'
                                                    maxLength = {2}
                                                    onChangeText = {(text) => this.setMinute(text)}
                                                    onSubmitEditing={this._onLogin}
                                                />
                                                <TouchableOpacity onPress={() => {navigate('')}}>
                                                    <Image resizeMode='contain' source={require("../assets/images/caret-arrow-down.png")}  style={styles.up_down_arrow_view} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <Switch
                                            value={true}
                                            onValueChange={(val) => this.setState({ trueSwitchIsOn: val })}
                                            disabled={false}
                                            activeText={'AM'}
                                            inActiveText={'PM'}        
                                            backgroundActive={'#31dd73'}
                                            backgroundInactive={'#c2c3c9'}
                                            circleActiveColor={'white'}
                                            circleInActiveColor={'white'}
                                        />
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.location_time_touchable_view} onPress={() => this.onSettingTime()}>
                                <View style={styles.location_time_view}>
                                    <View style={styles.location_time_left_child}>
                                        <Image resizeMode='contain' source={require("../assets/images/time_icon.png")} style={styles.icon_image}/>
                                        <Text style={styles.row_text}>{this. state.hour} : {this.state.minute} {this.state.trueSwitchIsOn? 'AM': 'PM'}</Text>
                                    </View>
                                    <Image resizeMode='contain' source={require("../assets/images/edit_time.png")} style={styles.edit_time}/>
                                </View>
                            </TouchableOpacity>
                            )}
                        </View>
                        {
                            !this.props.isbooked ? (
                            <TouchableOpacity style={styles.booking_view} onPress={() => {navigate('BookingSearching')}}>
                            <Image resizeMode='cover' source={require("../assets/images/book.png")} style={styles.booking_green_btn} />
                        </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.booking_view} onPress={() => {navigate('CurrentTimeLimit')}}>
                            <Image resizeMode='cover' source={require("../assets/images/book_time.png")} style={styles.booking_green_btn} />
                        </TouchableOpacity>
                        )}
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
  top_container:{
      marginTop: (Platform.OS == 'ios')? 20 : 0,
      height:44,
      backgroundColor: Colors.main,
      width:width,
      alignItems:'center',
      flexDirection:'row',
      justifyContent:'space-between',
  },
    backButton:{
        marginLeft:20,
        height:20,
        width:20,
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
        height:35,
        width:35
    },
    map_container:{
         flex: 1,
         width:width,
         alignItems:'center',
         backgroundColor:'transparent',
    },
    map_view:{
        flex: 1,
        width: width,
    },
    locationInfo_view: {
        position: 'absolute',
        width: width-60,
        top: 25,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection:'column',
        justifyContent:'flex-start',
    },
    location_address_view:{
        height:55,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        width:width-60,
        paddingHorizontal:20,
    },
    devide_line:{
        backgroundColor:'#c2c3c9',
        height: 1,
        width: width-60,
    },
    location_time_touchable_view:{
        height:45,
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:20,
    },
    location_time_view:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        height: 30,
        width:width-120,
    },
    location_time_left_child:{
        flexDirection:'row',
        alignItems:'center',
        height: 30,
        // width:width-90,
    },
    booking_view:{
        position: 'absolute',
        width: 85,
        height: 85,
        bottom: 20,
        backgroundColor:'transparent',
    },
    booking_green_btn: {
        backgroundColor: 'transparent',
        width: 85,
        height: 85,
    },
    icon_image:{
        marginLeft:10,
        height:15,
        width:15,
    },
    row_text:{
        marginLeft:15,
    },
    edit_time:{
        height:15,
        width:15,
    },

// --- setting time view --- //
    setting_time_view:{
        flexDirection:'column',
        alignItems:'center',
    },
    setting_time_top_view:{
        backgroundColor:'#f9fbfe',
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10,
        width:width-62,
        borderBottomWidth:1,
        borderColor:'#c2c3c9',
        paddingHorizontal:20,
    },
    setting_time_main_view:{
        backgroundColor:'white',
        flexDirection:'column',
        alignItems:'center',
    },
    setting_time_lb_view:{
        paddingVertical:10,
        width:width-120,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderColor:'#c2c3c9',
    },
    setting_time_lb:{
        color:'black',
    },
    setting_time_check_icon:{
        height:15,
        width:15,
    },
    setting_time_picker_view:{
        width:width-120-20,
        paddingVertical:20,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    setting_time_picker_main_view:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    hour_view:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    },
    hour_text:{
        fontSize:25,
        fontWeight:'bold',
        color:'black',
        height:50,
        width:40,
        borderWidth:1,
        borderColor:'#979797',
        borderRadius:5,
        textAlign:'center',
    },
    hour_lb:{
        textAlign:'center',
        marginTop:10,
        fontSize:15,
        color:'#9fa0a2',
    },
    double_dut_view:{
        marginBottom:20,
        width:60,
        alignItems:'center',
    },
    double_dut_symbol:{
        textAlign:'center',
        fontSize:25,
        fontWeight:'bold',
        color:'black',
    },
    minute_view:{
        flexDirection:'column',
        alignItems:'center',
    },
    up_down_arrow_view:{
        width:40,
        height:40,
    },
    switch_view:{
    
    },
          
});

// export default MapsScreen;
export default connect(mapStateToProps,mapDispatchToProps)(MapsScreen);