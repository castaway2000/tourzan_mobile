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
import MapView from 'react-native-maps';
import NavigationBar from '../components/NavigationBar'

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({

})

class MapsScreen extends React.Component {
  static navigationOptions = {
        header : null,
        tabBarLabel: 'Maps',
        tabBarIcon: ({ tintColor }) => (
             <Image source={require('../assets/images/Maps_Bottom_icon.png')} style={[styles.icon, {tintColor: tintColor}]} />
        ),
  };

 constructor(props) {
    super(props);
    this.state = { region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            },
         };
  }


  onRegionChange(region) {
      this.setState({ region });
  }

  render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.container}>  
             <View style={styles.top_container}>
                    <TouchableOpacity>
                        <Image resizeMode='cover' source={require("../assets/images/hambuger.png")} style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.centerText}>TOURZAN</Text>
                    <TouchableOpacity>
                        <Image resizeMode='cover' source={require("../assets/images/person1.png")}  style={styles.rightView} />
                    </TouchableOpacity>
            </View>
            <View style={styles.map_container}>
                <MapView style={styles.map_view}
                     region={this.state.region}
                     onRegionChange={this.onRegionChange}
                />
                <View style={styles.locationInfo_view}>
                    <View style={styles.location_address_view}>
                        <Image resizeMode='cover' source={require("../assets/images/location_maps.png")} style={styles.icon_image}/>
                        <Text style={styles.row_text}>052 Maggio Road Apt. o16</Text>
                    </View>
                    <View style={styles.devide_line}/>
                    <View style={styles.location_time_view}>
                        <View style={styles.location_time_left_child}>
                            <Image resizeMode='cover' source={require("../assets/images/time_icon.png")} style={styles.icon_image}/>
                            <Text  style={styles.row_text}>09:18 pm</Text>
                        </View>
                        <TouchableOpacity>
                            <Image resizeMode='cover' source={require("../assets/images/edit_time.png")} style={styles.edit_time}/>
                         </TouchableOpacity>
                    </View>
                </View>
                 <TouchableOpacity style={styles.booking_view}>
                    <Image resizeMode='cover' source={require("../assets/images/booking_green_btn.png")} style={styles.booking_green_btn} />
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
    //   justifyContent: 'flex-start'
  },
  top_container:{
      height:44,
      backgroundColor: '#31dd73',
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
        color:'#000',
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
         height:height-120,
         width:width,
         alignItems:'center'
    },
    map_view:{
        height:height-120,
        width: width,
    },
    locationInfo_view: {
        position: 'absolute',
        width: width-60,
        height: 100,
        top: 25,
        marginLeft:30,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection:'column',
        justifyContent:'flex-start',
    },
    location_address_view:{
        flex:0.55,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        height: 30,
        width:width-60,
    },
    devide_line:{
        backgroundColor:'#ccc',
        height: 1,
        width: width-60,
    },
    location_time_view:{
        flex:0.45,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        height: 30,
        width:width-60,
    },
    location_time_left_child:{
        flexDirection:'row',
        alignItems:'center',
        height: 30,
        width:width-90,
    },
    booking_view:{
        position: 'absolute',
        width: 100,
        height: 100,
        bottom: 20,
    },
    booking_green_btn: {
        backgroundColor: 'transparent',
        width: 100,
        height: 100,
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
        marginRight:20,
    },
});

export default MapsScreen;

