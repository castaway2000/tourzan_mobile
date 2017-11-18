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
import ApplyButton from '../components/ApplyButton'

var Toast = require('react-native-toast');

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({
});

const resetRootAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'Home' }),
        ],
        key: null
 });

class OfferScreen extends React.Component {
  static navigationOptions = {
      title: 'Offer',
      header : null,
  };

 constructor(props) {
    super(props);
    this.navigate = this.props.navigation;
  }

  componentDidMount() {
  
  } 

  onAccept(){
     console.log("clicked on Accept Button!");
      this.navigate.dispatch(resetRootAction);
  }

  onCancel(){
      console.log("clicked on Cancel Button!");
      this.navigate.dispatch(resetRootAction);
  }

  onChat(){
      console.log("clicked on Chat Button!");
      this.navigate.navigation('Chat');
  }

  render() {
      return (
        <View style={styles.container}>  
            <View  style={styles.navigationbar}>
                    <View style={styles.backButton}>
                    </View>
                    <Text style={styles.centerText}>Offer</Text>
                    <View style={styles.rightView}>
                    </View>
            </View>
             <View style={styles.title_description_view}>
                    <Text style={styles.offer_text}> Offer </Text>
                    <Text style={styles.title_description_text}>Hey! You have received new time limit offer.
                                                             Please respond to this offer.</Text>
            </View>
            <View style={styles.main_view}>
                <View style={styles.main_info_view}>
        
                    <View style={styles.user_info_view}>
                        <View style={styles.avatar_view}>
                            <Image resizeMode='cover' source={require("../assets/images/guide_avatar.png")}  style={styles.avatar_img}/>
                            <View style={styles.rate_view} pointerEvents="none">
                                    <Rating ratingCount={5} imageSize={8} onFinishRating={this.ratingCompleted}/>
                                    <Text style={styles.rating_text}>(12)</Text>
                            </View>
                        </View>
                        <View style={styles.info_view}>
                            <Text style={styles.name_text}>Trevor Riley</Text>
                            <View style={styles.location_view}>
                                <Image resizeMode='contain' source={require("../assets/images/location_maps.png")}  style={styles.location_icon}/>
                                <Text style={styles.location_text}>Lake Elta</Text>
                            </View>
                            <Text style={styles.description_text}>Conventry City Guide Including Conventry Hotels</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.onChat()} style={styles.chat_view}>
                            <Image resizeMode='contain' source={require("../assets/images/chat_blue.png")}  style={styles.chat_btn} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.devide_line}/> 
                    <View style={styles.location_info_view}>
                        <Image resizeMode='contain' source={require("../assets/images/location_maps.png")} style={styles.icon_image}/>
                        <Text style={styles.row_text}>052 Maggio Road Apt. o16</Text>
                    </View>
                    <View style={styles.devide_line}/>
                    <View style={styles.time_info_view}>
                        <Image resizeMode='contain' source={require("../assets/images/time_icon.png")} style={styles.icon_image}/>
                        <Text  style={styles.row_text}>09:18 pm</Text>
                    </View>
                </View>
                 <View style={styles.main_bottom_view}>
                    <ApplyButton onPress={() => this.onAccept()} name={'Accept'} style={styles.accept_btn}/>
                    <TouchableOpacity   onPress={() => this.onCancel()} title="Cancel">
                        <Text style={styles.button_cancel}> Cancel </Text>
                    </TouchableOpacity>
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

    /// ----- description view --- ///
    title_description_view:{
        flexDirection:'column',
        alignItems:'center',
        width:width,
        height: 100,
        marginTop:20,
    },
    title_description_text:{
        width: width - 2*40,
        textAlign:'center',
        color:'#979797',
        fontSize: 15,
    },
    offer_text:{
        width:100,
        textAlign:'center',
        color:'black',
        fontWeight:'bold',
        fontSize: 25,
    },
    /// ------- main view -------///
    main_view:{
        flexDirection:'column',
        alignItems:'center',
        width:width,
        height:height-144,
    },
    main_info_view:{
        width: width - 2*30,
        height: 200,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection:'column',
        justifyContent:'flex-start',
        marginTop:30,
    },
    devide_line:{
        backgroundColor:'#c2c3c9',
        height: 1,
        width: width-60,
    },

    // ----  user info view  --- //
    user_info_view:{
        width: width - 2*30,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding: 10,
    },
    avatar_view:{
      flexDirection:'column',
      alignItems:'center',
    },
    avatar_img:{
        width:40,
        height:40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor:'transparent',
    },
    rate_view:{
        marginTop:5,
        height: 20,
        flexDirection:'row',
        alignItems:'center',
    },
    ratingbar:{
        height:10,
        width: 50,
    },
    rating_text:{
        marginLeft:5,
        fontSize: 8,
        color: '#999',
    },
    info_view: {
        width:width*50/100,
        marginLeft:10,
        flexDirection:'column',
        justifyContent: 'center',
    },
    location_view:{
        marginTop:5,
        height:15,
        flexDirection:'row',
        alignItems:'center',
    },
    location_icon:{
        width:10,
        height:10,
    },
    name_text:{
        fontSize:15,
        color:'#000',
        textAlign:'left',
        fontWeight:'bold',
    },
    location_text:{
        marginLeft:5,
        fontSize:12,
        color:'#999',
        textAlign:'left',
        fontWeight:'bold',
    },
    description_text:{
        marginTop:5,
        fontSize:12,
        color:'#999',
        textAlign:'left',
    },
    chat_view:{
        width:width*10/100,
        alignItems:'center',
        borderLeftWidth:1,
        borderColor: "#ddd",
    },
    chat_btn:{
        width: 20,
        height: 20,
    },

// --- location info view --- //
    location_info_view:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        width:width- 2*30,
        height:50,
        paddingHorizontal:20,
    },
    time_info_view:{
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10,
        width:width-2*30,
        paddingHorizontal:20,
    },
    icon_image:{
        marginLeft:10,
        height:15,
        width:15,
    },
    row_text:{
        marginLeft:15,
    },
    main_bottom_view:{
        width:width,
        flex:0.5,
        flexDirection:'column',
        alignItems:'center',
        marginTop: 50,
    },
    accept_btn:{
        marginTop:20,
        width:width-60,
    },
    button_cancel:{
      marginTop:30,
      color: '#000',
      textAlign:'center',
      fontSize:18,
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
      textDecorationColor: "#000"
  },
});

export default OfferScreen;

