import React, { Component } from 'react';
// import { createStore } from 'redux';
// import { Provider } from 'react-redux';
// import tourzan from './reducers';
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

import MapsScreen from './containers/MapsScreen';
import DashboardScreen from './containers/DashboardScreen';
import ChatScreen from './containers/ChatScreen';
import MarketplaceScreen from './containers/MarketplaceScreen';
import MoreScreen from './containers/MoreScreen';

import TripsScreen from './containers/DashboardTabs/TripsScreen';
import GuidesScreen from './containers/DashboardTabs/GuidesScreen';
import TransactionsScreen from './containers/DashboardTabs/TransactionsScreen';

import TripItemDetailScreen from './containers/ItemDetailScreens/TripItemDetailScreen';
import ChatRoomScreen from './containers/ChatRoomScreen';
import ProfileScreen from './containers/ProfileScreen';
import PaymentMethodScreen from './containers/PaymentMethodScreen';
import SetTimeLimitScreen from './containers/SetTimeLimitScreen';
import CurrentTimeLimitScreen from './containers/CurrentTimeLimitScreen';
import BookingSearchingScreen from './containers/BookingScreens/BookingSearchingScreen';
import BookingGuideSettingScreen from './containers/BookingScreens/BookingGuideSettingScreen';

import SettingsScreen from './containers/SettingsScreen';
import ChangePasswordScreen from './containers/ChangePasswordScreen';

import ApplyButton from './components/ApplyButton';

var { width, height } = Dimensions.get('window');
const onButtonPress = () => { Alert.alert('Button has been pressed!'); }; 

class WelcomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
    header : null,
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      
      <View style={styles.container}>  
          <Image resizeMode='cover' source={require("../app/assets/images/welcome_bg.png")} style={styles.bg_img}>
                <View style={styles.top_container}>
                    <Image resizeMode='center' source={require("../app/assets/images/Tourzan_Logo.png")}/>
                    <Text style={styles.txt_welcome}>WELCOME!</Text>
                    <View style={styles.line}></View>
                    <Text style={styles.txt_bottom}>Wine Tours La Dolce Vita</Text>
                </View>
                <View style={styles.bottom_container}>
                    <ApplyButton  onPress={() => navigate('LoginTourist')} name="Login Tourist"/>
                    <TouchableOpacity onPress={() => navigate('LoginGuide')} title="Login Guide">
                        <Text style={styles.button_guide}>Tour Guide</Text>
                    </TouchableOpacity>
                </View>
          </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
  },
  bg_img: {
    width: width,
    height : height,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  top_container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt_welcome: {
    marginTop : -20,
    fontSize: 25,
    fontWeight : 'bold',
    textAlign: 'center',
    color : '#ffffff',
  },
  line: {
    marginTop:7,
    height: 1,
    width: '50%',
    backgroundColor: '#ffffff',
  },
  txt_bottom:{
    marginTop: 7,
    fontSize: 17,
    textAlign: 'center',
    color : '#eeeeee',
  },

  bottom_container:{
    width: width,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:30,
  },
  button_guide:{
    paddingTop:10,
    color:'#000',
    textAlign:'center',
    fontSize: 18,
    marginTop : 20,
    height:50,
    width:width-60,
    backgroundColor:'#ffffff',
    borderRadius:5,
    borderColor: '#555555'
  },
});

// const TripsStackNavigator = StackNavigator({
//     Trips: { screen: TripsScreen, },
//     TripItemDetail : {screen: TripItemDetailScreen},
// },{ 
//     headerMode: 'screen', 
//     initialRouteName: 'Trips',
//   },
// );


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
    headerMode: 'screen', 
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
},{ 
    headerMode: 'screen' 
  },
);

AppRegistry.registerComponent('Tourzan', () => App);
