import React, { Component } from "react";

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
  TouchableOpacity
} from "react-native";

import { TabNavigator } from "react-navigation";
import { NavigationActions } from "react-navigation";
import { StackNavigator } from "react-navigation";
import NavigationBar from "../components/NavigationBar";
import TripsScreen from "./DashboardTabs/TripsScreen";
import GuidesScreen from "./DashboardTabs/GuidesScreen";
import TransactionsScreen from "./DashboardTabs/TransactionsScreen";
import TripItemDetailScreen from "./ItemDetailScreens/TripItemDetailScreen";
import GuideItemDetailScreen from "./ItemDetailScreens/GuideItemDetailScreen";
import TransactionItemDetailScreen from "./ItemDetailScreens/TransactionItemDetailScreen";
import DashboardTapNavigator from "./DashboardTabs/DashboardTapNavigator";
import ProfileScreen from "./ProfileScreen";

//Store
import { connect } from "react-redux";
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser } from "../actions/userActions";

//Utilities
import { Storage, isIphoneX } from "../global/Utilities";
import { Colors, API, Paymentrails, Braintree, DefaultFont  } from "../constants";

var { width, height } = Dimensions.get("window");

// const DashboardTapNavigator = TabNavigator({
//     TripsNav: { screen: TripsScreen, },
//     Guides: { screen: GuidesScreen, },
//     Transactions: { screen: TransactionsScreen, },
//   }, {
//     tabBarPosition:'top',
//     tabBarOptions: {
//         activeTintColor: '#fff',
//         inactiveTintColor:'#555',
//         labelStyle:{fontSize:9},
//         showIcon:'true',
//         style: {backgroundColor: '#31dd73'},
//     },
// });

const DashboardStackNavigator = StackNavigator(
  {
    DashboardTapNavigator: { screen: DashboardTapNavigator },
    TripItemDetail: { screen: TripItemDetailScreen },
    GuideItemDetail: { screen: GuideItemDetailScreen },
    TransactionItemDetail: { screen: TransactionItemDetailScreen },
    Profile: { screen: ProfileScreen }
  },
  {
    headerMode: "screen",
    initialRouteName: "DashboardTapNavigator"
  }
);

class DashboardScreen extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: "Dashboard",
    tabBarIcon: ({ tintColor }) => (
      <Image
        resizeMode="contain"
        source={require("../assets/images/Dashboard_Bottom_icon.png")}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    )
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.tabbar_view_container_full}>
          <DashboardStackNavigator />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20
  },
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column"
    //   justifyContent: 'flex-start'
  },
  tabbar_view_container_full: {
    width: width,
    flex: 1
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(DashboardScreen);
