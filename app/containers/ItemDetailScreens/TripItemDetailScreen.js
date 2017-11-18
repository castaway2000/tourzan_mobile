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
import Rating from 'react-native-ratings';
import ReadMore from '@expo/react-native-read-more-text';

import NavigationBar from '../../components/NavigationBar'

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({
    
})

class TripItemDetailScreen extends React.Component {
  static navigationOptions = {
      title: 'List of Trips',
      header : null,
  };

 constructor(props) {
    super(props);
    this.state = {  };
  }

  // Read More funtions
   _renderTruncatedFooter = (handlePress) => {
    return (
       <View style={styles.downarrow_view}>
            <TouchableOpacity onPress={handlePress}>
                <Image resizeMode='stretch' source={require("../../assets/images/down_arrow.png")} style={styles.downarrow_btn} />
            </TouchableOpacity>
        </View>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <View style={styles.downarrow_view}>
            <TouchableOpacity onPress={handlePress}>
                <Image resizeMode='stretch' source={require("../../assets/images/up_arrow.png")} style={styles.downarrow_btn} />
            </TouchableOpacity>
        </View>
    );
  }

  _handleTextReady = () => {
    // ...
  }



  render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.container}>  
            <Image resizeMode='cover' source={require("../../assets/images/trips_detail_bg.png")} style={styles.top_container}>
                  <NavigationBar title={'List of Trips'} bgColor={'transparent'} onPress={() => {this.props.navigation.dispatch(backAction)}}/>
                  <View style={styles.top_location_view}>
                         <Image resizeMode='contain' source={require("../../assets/images/location_white.icon.png")} style={styles.top_location_icon}/>
                         <Text style={styles.top_location_lb}>Elmerburgh</Text>
                  </View>
            </Image>
            <ScrollView style={styles.scrollview_container}>
                <View style={styles.bottom_container}>
                     <View style ={styles.row}>
                        <Image resizeMode='cover' source={require("../../assets/images/guide_avatar.png")}  style={styles.avatar_img}/>
                        <View style={styles.info_view}>
                            <Text style={styles.name_text}>Glen Hale</Text>
                            <View style={styles.location_view}>
                                <Image resizeMode='contain' source={require("../../assets/images/location_maps.png")}  style={styles.location_icon}/>
                                <Text style={styles.location_text}>Lake Elta</Text>
                            </View>
                             <View style={styles.rate_view} pointerEvents="none">
                                    <Rating ratingCount={5} imageSize={8} onFinishRating={this.ratingCompleted}/>
                            </View>
                        </View>
                    </View>
                    <View style={styles.info_row_view}>
                        <View style={styles.info_icon_row_view}>
                                <Image resizeMode='contain' source={require("../../assets/images/calendar_icon.png")} style={styles.top_location_icon}/>
                                <Text style={styles.info_icon_row_lb}>27 Jan 2017</Text>
                        </View>
                        <View style={styles.info_icon_row_view}>
                                <Image resizeMode='contain' source={require("../../assets/images/time_icon_black.png")} style={styles.top_location_icon}/>
                                <Text style={styles.info_icon_row_lb}>05h 10m</Text>
                        </View>
                        <View style={styles.info_icon_row_view}>
                                <Image resizeMode='contain' source={require("../../assets/images/wallet_icon.png")} style={styles.top_location_icon}/>
                                <Text style={styles.info_icon_row_lb}>$321</Text>
                        </View>
                    </View>
                    <View style={styles.map_view}>
                    </View>
                    <View sytle={styles.overview_view}>
                        <Text style={styles.overview_title_lb}>Overview</Text>
                        <View style={{paddingLeft:20, paddingRight:20}}>
                            <ReadMore
                                numberOfLines={3} 
                                renderTruncatedFooter={this._renderTruncatedFooter}
                                renderRevealedFooter={this._renderRevealedFooter}
                                onReady={this._handleTextReady}>
                                <Text style={styles.overview_content_txt}>
                                    Your cheap internet-based banner advertising will become one of the sought for ads ther are. 
                                    Today, the world of internet advertising is rapidly.Your cheap internet-based banner advertising 
                                    will become one of the sought for ads ther are. 
                                    Today, the world of internet advertising is rapidly.
                                </Text>
                            </ReadMore>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
      );
   }
}

const styles = StyleSheet.create({
  container: {
        backgroundColor:'white',
        flexDirection: 'column',
  },
  top_container: {
        width: width,
        height : 180,
        flexDirection:'column',
        justifyContent:'space-between'
  },
  top_location_view:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:20,
        marginBottom:20,
  },
  top_location_icon:{
        width:15,
        height:15,
  },
  top_location_lb:{
        fontSize:15,
        color:'white',
        marginLeft:5,
        backgroundColor:'transparent',
  },

  // --- bottom container --- //
  scrollview_container: {
        height : height-100,
  },
  bottom_container:{
        width: width,
        height:1000,
        backgroundColor:'white',
  },
  row:{
        width:width,
        paddingTop:10,
        paddingBottom:10,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'flex-start',
        borderBottomWidth:1,
        borderColor:'#c7c6ca',
  },
  avatar_img:{
        marginLeft:30,
        width:50,
        height:50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor:'transparent',
  },
  info_view: {
        width:width*50/100,
        marginLeft:20,
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
  info_row_view:{
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:30,
        paddingRight:30,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderColor:'#c7c6ca',
  },
  info_icon_row_view:{
        flexDirection:'row',
        alignItems:'center',
  },
  info_icon_row_lb:{
        fontSize:15,
        color:'#5e6265',
        marginLeft:5,
        fontSize:12,
  },
  map_view:{
        height:80,
        width:width,
        borderBottomWidth:1,
        borderColor:'#c7c6ca',
  },
  overview_view:{
        width:width,
        flexDirection:'column',
  },
  overview_title_lb:{
        marginLeft:20,
        marginTop:20,
        fontSize:17,
        color:'black',
  },
  overview_content_txt:{
        marginTop:10,
        width:width-40,
        fontSize:15,
        color:'#999',
  },
  downarrow_view:{
        marginTop:5,
        alignItems:'center',
  },
  downarrow_btn:{
        width:30,
        height :15,
 },
});

export default TripItemDetailScreen;

