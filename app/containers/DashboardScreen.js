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

import { TabNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation'
import { StackNavigator } from 'react-navigation';

import NavigationBar from '../components/NavigationBar'

// import TripsScreen from './DashboardTabs/TripsScreen';
// import GuidesScreen from './DashboardTabs/GuidesScreen';
// import TransactionsScreen from './DashboardTabs/TransactionsScreen';

// import TripItemDetailScreen from './ItemDetailScreens/TripItemDetailScreen';

var { width, height } = Dimensions.get('window');

// const DashboardTapNavigator = TabNavigator({
//   Trips: { screen: TripsScreen, },
//   Guides: { screen: GuidesScreen, },
//   Transactions: { screen: TransactionsScreen, },
// }, {
//   tabBarPosition:'top',
//   tabBarOptions: {
//     activeTintColor: '#fff',
//     inactiveTintColor:'#555',
//     labelStyle:{fontSize:9},
//     showIcon:'true',
//     style: {backgroundColor: '#31dd73'},
//   },
// });

// const DashBoardStackNavigator = StackNavigator({
//     Dashboard: { screen: DashboardTapNavigator },
//     TripItemDetail : {screen: TripItemDetailScreen},
// },{ 
//     headerMode: 'screen', 
//     initialRouteName: 'Dashboard',
//   },
// );

class DashboardScreen extends React.Component {
    static navigationOptions = {
        header : null,
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ tintColor }) => (
             <Image resizeMode='contain' source={require('../assets/images/Dashboard_Bottom_icon.png')} style={[styles.icon, {tintColor: tintColor}]} />
        ),
     };
    constructor(props) {
        super(props);
    
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>  
                  <View style={styles.top_container}>
                        <View style={styles.backButton}>
                        </View>
                        <Text style={styles.centerText}>DASHBOARD</Text>
                        <TouchableOpacity>
                            <Image resizeMode='cover' source={require("../assets/images/person1.png")}  style={styles.rightView} />
                        </TouchableOpacity>
                 </View>
                 <View style={styles.tabbar_view_container}>
                        <DashboardTapNavigator />
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
        color:'#fff',
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
    tabbar_view_container : {
         marginTop:1,
         height:height-120,
         width:width,
    },

});


export default DashboardScreen;

