import React, { Component } from 'react';

import {
  AppRegistry,
  Button,
  ScrollView,
  Dimensions,
  StatusBar,
  Navigator,
  StyleSheet,
  Image,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from 'react-navigation';

import LoginGuideScreen from './containers/LoginGuideScreen';
import LoginTouristScreen from './containers/LoginTouristScreen';
import RegisterTourist from './containers/RegisterTouristScreen';
import RegisterGuide from './containers/RegisterGuideScreen';
import ForgotPassword from './containers/ForgotPasswordScreen';
import WelcomeScreen from './containers/WelcomeScreen';

import MapsScreen from './containers/MapsScreen';
import DashboardScreen from './containers/DashboardScreen';
import ChatScreen from './containers/ChatScreen';
import MarketplaceScreen from './containers/MarketplaceScreen';
import MoreScreen from './containers/MoreScreen';

import TripsScreen from './containers/DashboardTabs/TripsScreen';
import GuidesScreen from './containers/DashboardTabs/GuidesScreen';
import TransactionsScreen from './containers/DashboardTabs/TransactionsScreen';

import TripItemDetailScreen from './containers/ItemDetailScreens/TripItemDetailScreen';
import GuideItemDetailScreen from './containers/ItemDetailScreens/GuideItemDetailScreen';
import TransactionItemDetailScreen from './containers/ItemDetailScreens/TransactionItemDetailScreen';
import ChatRoomScreen from './containers/ChatRoomScreen';
import ProfileScreen from './containers/ProfileScreen';
import PaymentMethodScreen from './containers/PaymentMethodScreen';
import SetTimeLimitScreen from './containers/SetTimeLimitScreen';
import CurrentTimeLimitScreen from './containers/CurrentTimeLimitScreen';
import BookingSearchingScreen from './containers/BookingScreens/BookingSearchingScreen';
import BookingGuideSettingScreen from './containers/BookingScreens/BookingGuideSettingScreen';
import OfferScreen from './containers/OfferScreen';

import SettingsScreen from './containers/SettingsScreen';
import ChangePasswordScreen from './containers/ChangePasswordScreen';

var { width, height } = Dimensions.get('window');

// const TripsStackNavigator = StackNavigator({
//     Trips: { screen: TripsScreen, },
//     TripItemDetail : {screen: TripItemDetailScreen},
// },{ 
//     headerMode: 'screen', 
//     initialRouteName: 'Trips',
//   },
// );

// const DashboardTapNavigator = TabNavigator({
//   TripsNav: { screen: TripsScreen, },
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

// const DashboardStackNavigator = StackNavigator({
//   Dashboard:{screen: DashboardTapNavigator},
//   TripItemDetail:{screen: TripItemDetailScreen},
//   GuideItemDetail:{screen: GuideItemDetailScreen},
//   TransactionItemDetail: {screen: TransactionItemDetailScreen},
// },{ 
//    headerMode: 'screen',
//    mode: 'modal',
//    initialRouteName: 'Dashboard',
//    initalRouteParams: {
//        sample : 'test',
//    }
// })

const ChatStackNavigator = StackNavigator({
    Chats: { screen: ChatScreen, },
    ChatRoom : {screen: ChatRoomScreen},
},{ 
    headerMode: 'screen', 
    initialRouteName: 'Chats',
  },
);

const MapChatStackNavigator = StackNavigator({
    Maps: { screen: MapsScreen, },
    Profile : {screen: ProfileScreen},
    ProfileCharRoom : {screen: ChatRoomScreen},
},{ 
    navigationOptions:{
      header: null
    },
    initialRouteName: 'Maps',
  },
);

const MoreStackNavigator = StackNavigator({
    More : {screen: MoreScreen},
    Settings : {screen : SettingsScreen},
    ChangePassword : {screen : ChangePasswordScreen},
},{ 
    headerMode: 'screen', 
    initialRouteName: 'More',
  },
);

const MainTapNavigator = TabNavigator({
  MapsNav: { screen: MapChatStackNavigator, },
  Dashboard: { screen: DashboardScreen, },
  Chat: { screen: ChatStackNavigator, },
  Marketplace: { screen: MarketplaceScreen, },
  MoreNav:{screen: MoreStackNavigator,},
}, {
  navigationOptions:{
    header:null,
  },
  tabBarPosition:'bottom',
  lazy: true,
  tabBarOptions: {
    activeTintColor: '#31dd73',
    inactiveTintColor:'#999',
    labelStyle:{fontSize:9,marginTop:0, width:width/5-5,},
    showIcon:'true',
    style: {backgroundColor: 'white', marginBottom: -10},
    indicatorStyle:{opacity:0},
  },
});

const App = StackNavigator({
  Welcome: { screen: WelcomeScreen },
  LoginGuide : {screen: LoginGuideScreen},
  LoginTourist : {screen: LoginTouristScreen},
  RegisterTourist : {screen: RegisterTourist},
  RegisterGuide : {screen: RegisterGuide},
  ForgotPassword : {screen : ForgotPassword},
  Home: {screen:MainTapNavigator},
  BookingSearching: {screen:BookingSearchingScreen},
  BookingGuideSetting: {screen:BookingGuideSettingScreen},
  ProfileCharRoomFromBooking : {screen: ChatRoomScreen},
  PaymentMethod : {screen: PaymentMethodScreen},
  TimeLimit: {screen: SetTimeLimitScreen},
  CurrentTimeLimit:{screen: CurrentTimeLimitScreen},
  Offer:{screen: OfferScreen},
},{ 
    headerMode: 'screen' 
  },
);

export default App
