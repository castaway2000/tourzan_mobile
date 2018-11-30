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
  TouchableOpacity,
  Platform,
  ActivityIndicator
} from "react-native";

import { NavigationActions } from "react-navigation";
import Checkbox from "react-native-custom-checkbox";
import NavigationBar from "../components/NavigationBar";

//Store
import { connect } from "react-redux";
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser, updateOrder } from "../actions/userActions";

//Utilities
import { Storage, isIphoneX } from "../global/Utilities";
import {
  Colors,
  API,
  Paymentrails,
  Braintree,
  DefaultFont
} from "../constants";

//Webservice
import {
  updateClockInOutStatus,
  acceptTrip,
  declineTrip,
  cancelTrip,
  updateTrip,
  loginAndUpdateTrip,
  getnearbyguides,
  gettripstatus
} from "../actions";

var { width, height } = Dimensions.get("window");
const backAction = NavigationActions.back({});

const resetRootAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Welcome" })],
  key: null
});

class MoreScreen extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: "More",
    tabBarIcon: ({ tintColor }) => (
      <Image
        resizeMode="contain"
        source={require("../assets/images/hambuger.png")}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    )
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
    this.navigate = this.props.navigation;
  }

  onLogout() {
    Alert.alert(
      "Tourzan",
      "Are you sure you want to logout?",
      [
        {
          text: "OK",
          onPress: () => {
            if (this.props.userdata.user.isLoggedInAsGuide) {
              this.updateClockOutStatusWS(
                this.props.userdata.user.userid,
                this.props.currentlocation.lat,
                this.props.currentlocation.long
              );
            }

            //Reset Trip
            let storestate = store.getState();
            storestate.tour.bookingdata.isTripInProgress = false;
            storestate.tour.bookingdata.tripid = 0;
            storestate.tour.bookingdata.isAutomatic = true;
            store.dispatch(updatebooking(storestate.tour.bookingdata));

            //Reste order
            store.dispatch(updateOrder([]));

            //Remove User data
            Storage.removeItem("currentuser");

            store.dispatch(updateuser({}));

            this.props.navigation.dispatch(resetRootAction);
          }
        },
        {
          text: "Cancel",
          onPress: () => {}
        }
      ],
      { cancelable: false }
    );
  }

  updateClockOutStatusWS(user_id, lat, long) {
    this.setState({
      isLoading: true
    });

    var { dispatch } = this.props;

    var params = {
      userid: this.props.userdata.user.userid,
      status: "clockout",
      latitude: this.props.currentlocation.lat,
      longitude: this.props.currentlocation.long
    };

    updateClockInOutStatus(params)
      .then(data => {
        this.setState({
          isLoading: false
        });

        Alert.alert("Tourzan", "You are successfully clocked out");
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  showLoading() {
    if (this.state.isLoading) {
      return (
        <ActivityIndicator
          color={"black"}
          size={"large"}
          style={styles.loadingView}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusbar} />
        <View style={styles.navigationbar}>
          <View style={styles.backButton} />
          <Text style={styles.centerText}>TOUZAN</Text>
          <View style={styles.rightView} />
        </View>
        <View style={styles.main_view}>
          <View style={styles.blank_row_view} />
          <TouchableOpacity
            style={styles.row_view}
            onPress={() => this.navigate.navigate("Settings")}
          >
            <Text style={styles.row_lb}>Settings</Text>
            <Image
              resizeMode="contain"
              source={require("../assets/images/item_arrow.png")}
              style={styles.row_icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row_view}
            onPress={() => this.navigate.navigate("FAQScreen")}
          >
            <Text style={styles.row_lb}>FAQ</Text>
            <Image
              resizeMode="contain"
              source={require("../assets/images/item_arrow.png")}
              style={styles.row_icon}
            />
          </TouchableOpacity>
          <View style={styles.blank_row_view} />
          <TouchableOpacity
            style={styles.row_view}
            onPress={() => this.navigate.navigate("PrivacyPolicyScreen")}
          >
            <Text style={styles.row_lb}>Privacy Policy</Text>
            <Image
              resizeMode="contain"
              source={require("../assets/images/item_arrow.png")}
              style={styles.row_icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row_view}
            onPress={() => this.navigate.navigate("TermsofUseScreen")}
          >
            <Text style={styles.row_lb}>Terms of Use</Text>
            <Image
              resizeMode="contain"
              source={require("../assets/images/item_arrow.png")}
              style={styles.row_icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row_view}
            onPress={() => this.navigate.navigate("ContactUs")}
          >
            <Text style={styles.row_lb}>Contact Us</Text>
            <Image
              resizeMode="contain"
              source={require("../assets/images/item_arrow.png")}
              style={styles.row_icon}
            />
          </TouchableOpacity>
          <View style={styles.blank_logout_view} />
          <TouchableOpacity
            style={styles.row_view}
            onPress={() => this.onLogout()}
          >
            <Text style={styles.row_logout_lb}>LOGOUT</Text>
            <Image
              resizeMode="contain"
              source={require("../assets/images/Logout_icon.png")}
              style={styles.row_icon}
            />
          </TouchableOpacity>
        </View>
        {this.showLoading()}
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
  },
  statusbar: {
    width: width,
    height:
      Platform.OS == "ios" ? (isIphoneX() ? 44 : 20) : StatusBar.currentHeight,
    backgroundColor: Colors.main,
    position: "absolute",
    top: 0,
    left: 0
  },

  // --- navigation bar --- //
  navigationbar: {
    height: 44,
    marginTop: Platform.OS == "ios" ? (isIphoneX() ? 44 : 20) : 0,
    backgroundColor: Colors.main,
    width: width,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  backButton: {
    height: 15,
    width: 10
  },
  centerText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    width: width - 160,
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  rightView: {
    height: 15,
    width: 10
  },

  // --- main view --- //
  main_view: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f9fbfe"
  },
  blank_row_view: {
    width: width,
    height: 40,
    backgroundColor: "#f9fbfe",
    borderBottomWidth: 1,
    borderColor: "#c2c3c9"
  },
  blank_logout_view: {
    width: width,
    height: 60,
    backgroundColor: "#f9fbfe",
    borderBottomWidth: 1,
    borderColor: "#c2c3c9"
  },
  row_view: {
    height: 50,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#c2c3c9",
    backgroundColor: "white"
  },
  row_lb: {
    color: "black",
    fontSize: 17,
    fontFamily: DefaultFont.textFont
  },
  row_logout_lb: {
    color: "red",
    fontSize: 17,
    fontFamily: DefaultFont.textFont
  },
  row_icon: {
    height: 15,
    width: 15
  },

  // --- Activity --- //
  loadingView: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(MoreScreen);
