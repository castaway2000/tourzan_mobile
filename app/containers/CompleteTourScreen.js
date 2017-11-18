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

import ActionSheet from 'react-native-actionsheet'
import Rating from 'react-native-ratings';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux'
import { NavigationActions } from 'react-navigation'
import KeyEvent from 'react-native-keyevent';
import PercentageCircle from 'react-native-percentage-circle';
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


class CompleteTourScreen extends React.Component {
  static navigationOptions = {
      title: 'Complete Tour',
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

// function for ratingview
  ratingCompleted(rating) {
     console.log("Rating is: " + rating)
  }

  onWriteReviewBtnClick(){
      
  }

  onAddFeedbackBtnClick(){
      this.props.navigation.navigate('Profile');
  }

  render() {
      return (
        <View style={styles.container}>  
            <View  style={styles.navigationbar}>
                    <View style={styles.backButton}>
                    </View>
                    <Text style={styles.centerText}>Complete Tour</Text>
                    <View style={styles.rightView}>
                    </View>
            </View>
            <ScrollView style={styles.scroll_view}>
                <View style={styles.scroll_content_view}>

                    <View style={styles.guide_info_view}>
                        <View style={styles.row}>
                            <View style={styles.avatar_view}>
                                <Image resizeMode='cover' source={require("../assets/images/guide_avatar.png")}  style={styles.avatar_img}/>
                            </View>
                            <View style={styles.info_view}>
                                <Text style={styles.name_text}>Brandon Delgado</Text>
                                <View style={styles.location_view}>
                                    <Image resizeMode='contain' source={require("../assets/images/location_maps.png")}  style={styles.location_icon}/>
                                    <Text style={styles.location_text}>Jewellborough</Text>
                                </View>
                            </View>
                            <View style={styles.guide_info_right_view}>                      
                                <Text style={styles.guide_info_right_text}>$367</Text>
                            </View>
                        </View>
                        <View style={styles.guide_rating_view}>
                            <Text style={styles.rating_title_text}>Please Rate Tour Guide! </Text> 
                            <View style={styles.rating_view}>
                                <Rating style={styles.list_info_ratingbar} ratingCount={5} imageSize={35} onFinishRating={this.ratingCompleted} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.tour_detail_view}>
                        <View style={styles.tour_detail_title_view}>
                            <Text style={styles.tour_detail_title_text}>Tour Details</Text>
                        </View>
                        <View style={styles.row_setting_btn_view}>
                            <Image resizeMode='contain' source={require("../assets/images/trip_item_location_icon.png")}  style={styles.row_setting_btn_icon}/>
                            <Text style={styles.row_setting_btn_text}>053 Maggio Road Apt. 016</Text>
                        </View>
                         <View style={styles.row_setting_btn_view}>
                            <Image resizeMode='contain' source={require("../assets/images/time_icon_black.png")}  style={styles.row_setting_btn_icon}/>
                            <Text style={styles.row_setting_btn_text}>06 Hours 20 Minutes</Text>
                        </View>
                         <View style={styles.row_setting_btn_view}>
                            <Image resizeMode='contain' source={require("../assets/images/wallet_icon.png")}  style={styles.row_setting_btn_icon}/>
                            <Text style={styles.row_setting_btn_text}>Total: $367</Text>
                        </View>
                    </View>

                    <View style={styles.main_bottom_view}>
                        <TouchableOpacity style={styles.write_review_view} onPress={() => this.onWriteReviewBtnClick()} title='Extend Time'>
                                <Text style={styles.write_review_btn} >Write Review </Text>
                        </TouchableOpacity>
                        <ApplyButton onPress={() => this.onAddFeedbackBtnClick()} name={'Add Feedback'} style={styles.add_feedback_btn}/>
                    </View>
                </View>
            </ScrollView>
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
    scroll_view:{
        // height : 500,
    },
    scroll_content_view:{
        flexDirection:'column',
        alignItems:'center',
        width:width,
        height:700,
        backgroundColor:'white',
        justifyContent:'flex-start',
    },

    guide_info_view:{
        width: width-40,
        marginTop: 30,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection:'column',
        justifyContent:'flex-start',
    },
    row:{
        marginTop: 20,
        marginLeft:20,
        marginBottom:20,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between',
    },
    avatar_view:{
        flexDirection:'column',
        alignItems:'center',
    },
    avatar_img:{
        width:50,
        height:50,
        borderRadius: 20,
        borderWidth: 1,
        borderColor:'transparent',
    },
    info_view: {
        width:(width-40)*50/100,
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
    guide_info_right_view:{
        width:60,
        alignItems:'center',
        borderLeftWidth:1,
        borderColor: "#ddd",
    },
    guide_info_right_text:{
        margin:10,
    },
    guide_rating_view:{
        alignItems:'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    rating_title_text:{
        marginTop: 20,
        fontSize: 15,
        color:'#999',
    },
    rating_view:{
        marginTop:20,
        marginBottom:20,
    },

    tour_detail_view:{
        width:width,
        height: 250,
        marginTop:30,
        backgroundColor: 'white',
        flexDirection:'column',
        justifyContent:'flex-start',
    },
    tour_detail_title_view:{
        paddingVertical:7,
        paddingLeft:20,
        width:width,
        marginTop:30,
        backgroundColor:'#f9fbfc',
        borderTopWidth:1,
        borderColor:'#ddd',
    },
    tour_detail_title_text:{
        fontSize:13,
        color:'#555'
    },
    row_setting_btn_view:{
        width:width,
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:15,
        paddingLeft:20,
        borderBottomWidth:1,
        borderColor:'#ddd',
        backgroundColor:'white',
    },
    row_setting_btn_icon:{
        height:15,
        width:15,
    },
    row_setting_btn_text:{
        marginLeft:10,
        fontSize:15,
        color:'black',
    },

    // --- main bottom view -- //
    main_bottom_view:{
        width:width,
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:'white',
    },
    add_feedback_btn:{
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
    write_review_view:{
        marginTop:20,
    },
    write_review_btn:{
        color:'black',
        paddingTop:10,
        textAlign:'center',
        fontSize: 18,
        height:50,
        width:width-60,
        backgroundColor:'white',
        borderWidth:1,
        borderRadius:5,
        borderColor: '#ddd'
    },
});

export default CompleteTourScreen;
