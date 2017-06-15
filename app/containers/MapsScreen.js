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
                        <Image resizeMode='cover' source={require("../assets/images/person1.png")} style={styles.map_container} style={styles.rightView} />
                    </TouchableOpacity>
            </View>
            <View style={styles.map_container}>
                <MapView style={styles.map_view}
                     region={this.state.region}
                     onRegionChange={this.onRegionChange}
                />
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
        height:44,
        width:44
    },
    map_container:{
         height:height-44,
    },
    map_view:{
        height:height-44,
        // width: width,
    },
});

export default MapsScreen;

