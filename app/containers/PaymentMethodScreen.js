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
import IconBadge from 'react-native-icon-badge';

import ApplyButton from '../components/ApplyButton'
import NavigationBar from '../components/NavigationBar'

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({
    // key: 'WelcomeScreen'
});

class PaymentMethodScreen extends React.Component {
  static navigationOptions = {
      title: 'Payment Method',
      header : null,
  };

 constructor(props) {
    super(props);
    this.state = { selectedPaymentItem: '', visaSelcted : false, mastercardSelected:false, expressSelected:false};
    this.navigate = this.props.navigation;
  }

  onContinue(){
      this.navigate.dispatch(backAction);
  }

  onVisaClick(){
      this.setState(previousState => {
        return { visaSelcted: !previousState.visaSelcted,
                 mastercardSelected : false,
                 expressSelected : false};
      });
  }

  onMastercardClick(){
     this.setState(previousState => {
        return { mastercardSelected: !previousState.mastercardSelected,
                 visaSelcted : false,
                 expressSelected : false };
     });
  }

  onExpressClick(){
     this.setState(previousState => {
        return { expressSelected: !previousState.expressSelected,
                 mastercardSelected : false,
                 visaSelcted : false };
     });
  }

  render() {
      return (
        <View style={styles.container}>  
            <View  style={styles.navigationbar}>
                    <TouchableOpacity  onPress={() => {this.props.navigation.dispatch(backAction)}}>
                        <Image resizeMode='cover' source={require("../assets/images/back.png")} style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.centerText}>Payment method</Text>
                    <View style={styles.rightView}>
                    </View>
            </View>
            <View style={styles.main_view}>
                <View style={styles.payment_selecting_view}>
                    <View style={styles.selecting_title_view}>
                        <Text style={styles.selecting_title_text}>Set a pay method</Text>
                    </View>
                    <View style={styles.card_list_view}>
                        {this.state.visaSelcted ? (
                            <TouchableOpacity style={styles.card_image_view} onPress={() => this.onVisaClick()}>
                                <IconBadge
                                    MainElement={
                                        <Image resizeMode='contain' source={require("../assets/images/visa-pay-logo_checked.png")} style={styles.card_image} />
                                    }
                                    BadgeElement={
                                        <Image resizeMode='cover' source={require("../assets/images/checked_green_badge.png")} style={styles.badge_icon}/>
                                    }                                    
                                    IconBadgeStyle={
                                        {   position:'absolute',
                                            width:15,
                                            height:15, 
                                            backgroundColor: '#31dd73'
                                        }
                                    }
                                 />
                            </TouchableOpacity>       
                         ) : (
                            <TouchableOpacity style={styles.card_image_view} activeOpacity={1} onPress={() => this.onVisaClick()}>
                                <Image resizeMode='contain' source={require("../assets/images/visa-pay-logo.png")} style={styles.card_image} />
                            </TouchableOpacity>     
                        )}
                        {this.state.mastercardSelected ? (
                            <TouchableOpacity style={styles.card_image_view} onPress={() => this.onMastercardClick()}>
                                <IconBadge
                                    MainElement={
                                        <Image resizeMode='contain' source={require("../assets/images/mastercard_checked.png")} style={styles.card_image} />
                                    }
                                    BadgeElement={
                                        <Image resizeMode='cover' source={require("../assets/images/checked_green_badge.png")} style={styles.badge_icon}/>
                                    }                                    
                                    IconBadgeStyle={
                                        {   position:'absolute',
                                            width:15,
                                            height:15, 
                                            backgroundColor: '#31dd73'
                                        }
                                    }
                                 />
                            </TouchableOpacity>       
                         ) : (
                            <TouchableOpacity style={styles.card_image_view} activeOpacity={1} onPress={() => this.onMastercardClick()}>
                                <Image resizeMode='contain' source={require("../assets/images/mastercard.png")} style={styles.card_image} />
                            </TouchableOpacity>     
                        )}
                        {this.state.expressSelected ? (
                            <TouchableOpacity style={styles.card_image_view} onPress={() => this.onExpressClick()}>
                                <IconBadge
                                    MainElement={
                                        <Image resizeMode='contain' source={require("../assets/images/american-express-logo_checked.png")} style={styles.card_image} />
                                    }
                                    BadgeElement={
                                        <Image resizeMode='cover' source={require("../assets/images/checked_green_badge.png")} style={styles.badge_icon}/>
                                    }                                    
                                    IconBadgeStyle={
                                        {   position:'absolute',
                                            width:15,
                                            height:15, 
                                            backgroundColor: '#31dd73'
                                        }
                                    }
                                 />
                            </TouchableOpacity>       
                         ) : (
                            <TouchableOpacity style={styles.card_image_view} activeOpacity={1} onPress={() => this.onExpressClick()}>
                                 <Image resizeMode='contain' source={require("../assets/images/american-express-logo.png")} style={styles.card_image} />
                            </TouchableOpacity>     
                        )}
                    </View>
                </View>
                <View style={styles.form_view}>
                     <TextInput placeholder="Card Holder Name" style={styles.inputText} underlineColorAndroid={'gray'}/>
                     <View style={styles.card_number_view}>
                        <TextInput placeholder="Card Number" keyboardType='numeric' style={styles.inputText_number} underlineColorAndroid={'gray'}/>
                        <Image resizeMode='contain' source={require("../assets/images/card_number_icon.png")} style={styles.card_number_icon} />
                     </View>
                     <View style={styles.card_number_view}>
                        <TextInput placeholder="Expire Date" style={styles.inputText_expire_date} underlineColorAndroid={'gray'}/>
                        <TextInput placeholder="CVV/CVC" secureTextEntry={true} style={styles.inputText_cvv} underlineColorAndroid={'gray'}/>
                     </View>
                     <View style={styles.encrypt_view}>
                        <Image resizeMode='contain' source={require("../assets/images/key_lock_icon.png")}  style={styles.key_lock_icon}/>
                        <Text style={styles.encrypt_text}>Your credit card information is encrypted</Text>
                     </View>
                     <View style={styles.continue_view}>
                        <ApplyButton onPress={() => this.onContinue()} name={'Continue'} style={styles.continue_btn}/>
                    </View>
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
        backgroundColor:'white',
    },

    // --- payment selecting title view --- //
    payment_selecting_view:{
        flexDirection:'column',
        width: width,
        borderBottomWidth:1,
        borderColor:'#ddd',
        backgroundColor:'#f9fbfe',
    },
    selecting_title_view:{
        paddingVertical:15,
        paddingLeft:20,
        width:width,
        borderBottomWidth:1,
        borderColor:'#ddd',
    },
    selecting_title_text:{
        fontSize:13,
        color:'#555'
    },
    card_list_view:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:width,
        paddingHorizontal:30,
    },
    card_image_view:{
        width:40*256/166 + 10, // 40 is height of card image
        height: 40+10,
        marginVertical:30,
    },
    card_image:{
        width:40*256/166, // 40 is height of card image
        height: 40,
        marginTop:5,
        marginRight:10,
    },
    badge_icon:{
        height: 15,
        width:15,
        borderRadius:8,
    },

    // --- form view --- //
    form_view:{
        width:width - 60,
        height:height-190,
        alignItems:'center',
    },
    inputText: {
        width: width-60, 
        marginTop: 20,
        height: 40,
        borderColor: 'gray'
    },
    card_number_view:{
        flexDirection:'row',
        alignItems:'center',
        width:width-60,
        justifyContent:'space-between',
    },
    inputText_number:{
        width: width-90, 
        marginTop: 20,
        height: 40,
        borderColor: 'gray'
    },
    card_number_icon:{
        marginTop:10,
        width : 20,
        height: 15,
    },
    inputText_expire_date:{
        width: 150, 
        marginTop: 20,
        height: 40,
        borderColor: 'gray'
    },
    inputText_cvv:{
        width: 100, 
        marginTop: 20,
        height: 40,
        borderColor: 'gray'
    },
    encrypt_view:{
        marginTop:30,
        height:15,
        flexDirection:'row',
        alignItems:'center',
    },
    key_lock_icon:{
        width:10,
        height:10,
    },
    encrypt_text:{
        marginLeft:5,
        fontSize:12,
        color:'#999',
        textAlign:'left',
    },
    continue_view:{
        marginTop:30,
        width:width-60,
        height: 100,
    },
    continue_btn:{
        marginTop:30,
        marginBottom:200,
    }

});

export default PaymentMethodScreen;

