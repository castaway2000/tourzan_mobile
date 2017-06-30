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
import Rating from 'react-native-ratings';

import NavigationBar from '../../components/NavigationBar'
import ApplyButton from '../../components/ApplyButton'

var { width, height } = Dimensions.get('window');
const backAction = NavigationActions.back({
    
})

class BookingGuideSettingScreen extends React.Component {
  static navigationOptions = {
      title: 'Booking Guide Setting',
      header : null,
  };

 constructor(props) {
    super(props);
    this.state = { isExtendTerm : false, isHourlyOrManual : false, isCheckHoulryOrManual:false }; // default hourly : isHourlyOrManual = false.  houlry checked - isCheckHourlyOrManual = false.
    this.navigate = this.props.navigation;
  }

  onConfirm(){

  }

  onPaymentSetting(){
      this.navigate.navigate('PaymentMethod');
  }

  onTimeLimitSetting(){
      this.navigate.navigate('TimeLimit');
  }

  onExtendTerm(){
     this.setState(previousState => {
        return { isExtendTerm: true,};
      });
  }

  onUnExtendTerm(){
       this.setState(previousState => {
        return { isExtendTerm: false,};
      });
  }

  onDone(){
    this.setState(previousState => {
          return { isHourlyOrManual : previousState.isCheckHoulryOrManual ? true : false}
    });

    this.onUnExtendTerm();
  }

  onCheckHourly(){
       this.setState(previousState => {
        return { isCheckHoulryOrManual: false,};
      });
  }

  onCheckManual(){
        this.setState(previousState => {
        return { isCheckHoulryOrManual: true,};
      });
  }

  render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.container}>  
             <View  style={styles.navigationbar}>
                    <TouchableOpacity  onPress={() => {this.props.navigation.dispatch(backAction)}}>
                        <Image resizeMode='cover' source={require("../../assets/images/back.png")} style={styles.nav_back_btn} />
                    </TouchableOpacity>
                    <Text style={styles.nav_center_text}></Text>
                    <TouchableOpacity onPress={() => {navigate('ProfileCharRoomFromBooking')}}>
                        <Image resizeMode='cover' source={require("../../assets/images/profile_chat_icon.png")}  style={styles.nav_right_view} />
                    </TouchableOpacity>
             </View>
             <ScrollView style={styles.scrollview}>
                <View style={styles.content_view}>
                    <View style={styles.top_container}>
                        <View  style={styles.top_container_bg_view}>
                        </View>
                        <View style={styles.top_info_view} pointerEvents="none">
                                <Text style={styles.top_name_text}>Bradon Delgado</Text>
                                <View style={styles.top_location_view}>
                                    <Image resizeMode='contain' source={require("../../assets/images/location_maps.png")}  style={styles.top_location_icon}/>
                                    <Text style={styles.top_location_text}>Jewellborough</Text>
                                </View>
                                <Rating ratingCount={5} imageSize={12} style={{marginTop:5}} onFinishRating={this.ratingCompleted}/>
                        </View>
                    </View>
                    <View style={styles.setting_container}>
                        <View style={styles.row_setting_view}>
                            <View style={styles.setting_text_view}>
                                <Text style={styles.setting_text}>Payment Method</Text>
                            </View>
                            <TouchableOpacity  onPress={() => this.onPaymentSetting()} style={styles.row_setting_btn_view}>
                                 <View style={styles.row_setting_btn_left_view}>
                                    <Image resizeMode='contain' source={require("../../assets/images/cash_icon.png")}  style={styles.row_setting_btn_icon}/>
                                    <Text style={styles.row_setting_btn_text}>Set Credit Card</Text>
                                 </View>
                                 <Image resizeMode='contain' source={require("../../assets/images/item_arrow.png")}  style={styles.row_setting_btn_right_icon}/>
                            </TouchableOpacity>
                        </View>
                         <View style={styles.row_setting_view}>
                            <View style={styles.setting_text_view_term}>
                                <Text style={styles.setting_text}>Payment Term</Text>
                                { this.state.isExtendTerm ? (
                                     <TouchableOpacity onPress={() => this.onDone()}>
                                        <Text style={styles.done_text}>DONE</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity pointerEvents='none'>
                                        <Text style={styles.done_text}></Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            {this.state.isExtendTerm ? (
                                !this.state.isHourlyOrManual ? (
                                    <View style={styles.setting_term_extend_view}>
                                        <TouchableOpacity style={styles.hourly_setting_view} onPress={() => this.onCheckHourly()}>
                                            <View style={styles.row_setting_btn_left_view}>
                                                <Image resizeMode='contain' source={require("../../assets/images/time_icon_black.png")}  style={styles.row_setting_btn_icon}/>
                                                <Text style={styles.row_setting_btn_text}>Hourly</Text>
                                            </View>
                                            { this.state.isCheckHoulryOrManual ? (
                                                <Image resizeMode='contain' source={require("../../assets/images/unchecked_gray_badge.png")}  style={styles.row_setting_btn_right_icon}/>
                                            ) : (
                                                <Image resizeMode='contain' source={require("../../assets/images/checked_green_badge.png")}  style={styles.row_setting_btn_right_icon}/>
                                            )}
                                            
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.manual_setting_view} onPress={() => this.onCheckManual()}>
                                            <View style={styles.row_setting_btn_left_view}>
                                                <Image resizeMode='contain' source={require("../../assets/images/forms.png")}  style={styles.row_setting_btn_icon}/>
                                                <Text style={styles.row_setting_btn_text}>Manual Time</Text>
                                            </View>
                                            { this.state.isCheckHoulryOrManual ? (
                                                <Image resizeMode='contain' source={require("../../assets/images/checked_green_badge.png")}  style={styles.row_setting_btn_right_icon}/>
                                            ) : (
                                                <Image resizeMode='contain' source={require("../../assets/images/unchecked_gray_badge.png")}  style={styles.row_setting_btn_right_icon}/>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.setting_term_extend_view}>
                                        <TouchableOpacity style={styles.manual_setting_view} onPress={() => this.onCheckManual()}>
                                            <View style={styles.row_setting_btn_left_view}>
                                                <Image resizeMode='contain' source={require("../../assets/images/forms.png")}  style={styles.row_setting_btn_icon}/>
                                                <Text style={styles.row_setting_btn_text}>Manual Time</Text>
                                            </View>
                                             { this.state.isCheckHoulryOrManual ? (
                                                <Image resizeMode='contain' source={require("../../assets/images/checked_green_badge.png")}  style={styles.row_setting_btn_right_icon}/>
                                            ) : (
                                                <Image resizeMode='contain' source={require("../../assets/images/unchecked_gray_badge.png")}  style={styles.row_setting_btn_right_icon}/>
                                            )}
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.hourly_setting_view} onPress={() => this.onCheckHourly()}>
                                            <View style={styles.row_setting_btn_left_view}>
                                                <Image resizeMode='contain' source={require("../../assets/images/time_icon_black.png")}  style={styles.row_setting_btn_icon}/>
                                                <Text style={styles.row_setting_btn_text}>Hourly</Text>
                                            </View>
                                             { this.state.isCheckHoulryOrManual ? (
                                                <Image resizeMode='contain' source={require("../../assets/images/unchecked_gray_badge.png")}  style={styles.row_setting_btn_right_icon}/>
                                            ) : (
                                                <Image resizeMode='contain' source={require("../../assets/images/checked_green_badge.png")}  style={styles.row_setting_btn_right_icon}/>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )                
                            ) : ( 
                                !this.state.isHourlyOrManual ? (  
                                    <TouchableOpacity  onPress={() => this.onExtendTerm()} style={styles.row_setting_btn_view}>
                                        <View style={styles.row_setting_btn_left_view}>
                                            <Image resizeMode='contain' source={require("../../assets/images/time_icon_black.png")}  style={styles.row_setting_btn_icon}/>
                                            <Text style={styles.row_setting_btn_text}>Hourly</Text>
                                        </View>
                                        <Image resizeMode='contain' source={require("../../assets/images/edit_icon.png")}  style={styles.row_setting_btn_right_icon}/>
                                    </TouchableOpacity>
                                ):(
                                    <TouchableOpacity  onPress={() => this.onExtendTerm()} style={styles.row_setting_btn_view}>
                                        <View style={styles.row_setting_btn_left_view}>
                                            <Image resizeMode='contain' source={require("../../assets/images/forms.png")}  style={styles.row_setting_btn_icon}/>
                                            <Text style={styles.row_setting_btn_text}>Manual Time</Text>
                                        </View>
                                        <Image resizeMode='contain' source={require("../../assets/images/edit_icon.png")}  style={styles.row_setting_btn_right_icon}/>
                                    </TouchableOpacity>
                                )
                            )}
                           
                        </View>
                         <View style={styles.row_setting_view}>
                            <View style={styles.setting_text_view}>
                                <Text style={styles.setting_text}>Time Limit</Text>
                            </View>
                            <TouchableOpacity  onPress={() => this.onTimeLimitSetting()} style={styles.row_setting_btn_view}>
                                 <View style={styles.row_setting_btn_left_view}>
                                    <Text style={styles.row_setting_btn_time_text}>Set Time Limit</Text>
                                 </View>
                                 <Image resizeMode='contain' source={require("../../assets/images/item_arrow.png")}  style={styles.row_setting_btn_right_icon}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bottom_container}>
                        <ApplyButton onPress={() => this.onConfirm()} name={'Confirm'} style={styles.confirm_btn}/>
                    </View>
                    <Image resizeMode='cover' source={require("../../assets/images/person1.png")} style={styles.top_avatar_icon}/> 
                </View>
             </ScrollView>
            
        </View>
      );
   }
}

const styles = StyleSheet.create({
  container: {
        alignItems: 'center',
        flexDirection: 'column',
  },

  // ---- top naviatgion bar ----//
  navigationbar:{
        height:44,
        backgroundColor: '#31dd73',
        width:width,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between',
  },
  nav_back_btn:{
        marginLeft:20,
        height:15,
        width:10,
    },
  nav_center_text:{
        color:'#000',
        textAlign:'center',
        fontSize:17,
        width:width-160,
        fontWeight:'bold',
  },
  nav_right_view:{
        marginRight:20,
        height:20,
        width:20
  },

  // --- scroll view --- //
  scrollview:{

  },
  content_view:{
    //   height:1000,
      alignItems:'center',
  },

  // --- top container ---//
  top_container:{
        flexDirection:'column',
        alignItems:'center',
  },
  top_container_bg_view:{
        height:50,
        width:width,
        backgroundColor:'#31dd73',
  },
  top_avatar_icon:{
        position:'absolute',
        width:60,
        height:60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop:10,
  },
  top_info_view:{
        backgroundColor:'white',
        width:width,
        height:100,
        borderBottomWidth:1,
        borderColor:'#ddd',
        flexDirection:'column',
        alignItems:'center',
  },
  top_name_text:{
        marginTop:30,
        fontSize:15,
        color:'#000',
        textAlign:'left',
  },
  top_location_view:{
        marginTop:5,
        height:15,
        flexDirection:'row',
        alignItems:'center',
  },
  top_location_icon:{
        width:10,
        height:10,
  },
  top_location_text:{
        marginLeft:5,
        fontSize:12,
        color:'#999',
        textAlign:'left',
  },

  //--- setting container ---//
  setting_container:{
        flexDirection:'column',
        alignItems:'center',
  },
  row_setting_view:{
      flexDirection:'column',
      alignItems:'center',
       borderBottomWidth:1,
      borderColor:'#ddd',
  },
  setting_text_view:{
      paddingVertical:7,
      paddingLeft:20,
      width:width,
      backgroundColor:'#f9fbfc',
      borderBottomWidth:1,
      borderColor:'#ddd',
  },
  setting_text:{
      fontSize:13,
      color:'#555'
  },
  row_setting_btn_view:{
      width:width,
      flexDirection:'row',
      alignItems:'center',
      paddingVertical:15,
      borderBottomWidth:1,
      borderColor:'#ddd',
      justifyContent:'space-between',
      backgroundColor:'white',
  },
  row_setting_btn_left_view:{
      flexDirection:'row',
      alignItems:'center',
      marginLeft:30,
  },
  row_setting_btn_icon:{
      height:20,
      width:20,
  },
  row_setting_btn_text:{
      marginLeft:10,
      fontSize:15,
      color:'black',
  },
  row_setting_btn_time_text:{
      fontSize:15,
      color:'black',
  },
  row_setting_btn_right_icon:{
      height:20,
      width:20,
      marginRight:30,
  },
  setting_term_extend_view:{
      flexDirection:'column',
      alignItems:'flex-start',
  },
  hourly_setting_view:{
      width:width,
      flexDirection:'row',
      alignItems:'center',
      paddingVertical:15,
      borderBottomWidth:1,
      borderColor:'#ddd',
      justifyContent:'space-between',
      backgroundColor:'white',
  },
  manual_setting_view:{
      width:width,
      flexDirection:'row',
      alignItems:'center',
      paddingVertical:15,
      borderBottomWidth:1,
      borderColor:'#ddd',
      justifyContent:'space-between',
      backgroundColor:'white',
  },
  done_text:{
      fontSize:15,
      color:'#31dd73',
      marginRight:20,
  },
  setting_text_view_term:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      paddingVertical:7,
      paddingLeft:20,
      width:width,
      backgroundColor:'#f9fbfc',
      borderBottomWidth:1,
      borderColor:'#ddd',
  },
  
  //--- bottom container ---//
  confirm_btn:{
      marginTop:30,
      marginBottom:200,
  }

});

export default BookingGuideSettingScreen;
