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

import ActionSheet from "react-native-actionsheet";
import { NavigationActions } from "react-navigation";
import KeyEvent from "react-native-keyevent";
import PercentageCircle from "react-native-percentage-circle";
import ApplyButton from "../components/ApplyButton";
var TimerMixin = require("react-timer-mixin");
import { Rating, AirbnbRating } from "react-native-ratings";

//Utilities
import { isIphoneX, isNumber, Storage } from "../global/Utilities";
import {
  Colors,
  API,
  Paymentrails,
  Braintree,
  DefaultFont
} from "../constants";

//Store
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";

//Webservice
import {
  getTourList,
  updateClockInOutStatus,
  endTrip,
  cancelTrip,
  declineTrip,
  acceptTrip,
  updateTrip,
  extendTime
} from "../actions";

import { Actions } from "../../node_modules/react-native-gifted-chat";

var { width, height } = Dimensions.get("window");

const backAction = NavigationActions.back({});

const resetRootAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Home" })],
  key: null
});

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 4;
const options = ["Cancel", "End Tour"];

import * as Actions1 from "../actions";

class CurrentTimeLimitScreen extends React.Component {
  static navigationOptions = {
    title: "Time Limit",
    header: null
  };

  constructor(props) {
    super(props);
    this.navigate = this.props.navigation;

    this.state = {
      selected: "",
      isLoading: false
    };
    this.handlePress = this.handlePress.bind(this);
    this.showActionSheet = this.showActionSheet.bind(this);
  }

  componentDidMount() {
    // if you want to react to keyDown
    KeyEvent.onKeyDownListener(keyCode => {
      console.log(`Key code pressed: key down`);
    });

    // // if you want to react to keyUp
    // KeyEvent.onKeyUpListener((keyCode) => {
    //   console.log(`Key code pressed: ${keyCode}`);
    // });

    this.timer = TimerMixin.setInterval(() => {
      let storestate = store.getState();

      store.dispatch(updatebooking(storestate.tour.bookingdata));

      //console.log('props', this.props.bookingdata.remainingTime)
    }, 5000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  showActionSheet() {
    this.ActionSheet.show();
  }

  handlePress(i) {
    this.setState({
      selected: i
    });

    if (this.state.selected == 0) {
      this.endTripWS();
    }
  }

  onCompleteTourBtnClick() {
    this.showActionSheet();
  }

  onExtendTimeBtnClick() {
    this.props.navigation.navigate("ExtendTime");
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

  remainingTimeString() {
    let tl = "";

    if (this.props.bookingdata.isAutomatic == true) {
      tl = "Auto";
    } else {
      let d = Number(this.props.bookingdata.remainingTime);

      var h = Math.floor(d / 3600);
      var m = Math.floor((d % 3600) / 60);
      var s = Math.floor((d % 3600) % 60);

      var hDisplay = h + "h";
      var mDisplay = m + "m";
      // var sDisplay = s > 0 ? s + (s == 1 ? " s" : " s") : "";

      tl = hDisplay + " " + mDisplay;
    }

    return tl;
  }

  totalTimeString() {
    let tl = "";

    if (this.props.bookingdata.isAutomatic == true) {
      tl = "Auto";
    } else {
      let d = Number(this.props.bookingdata.timeLimit);

      var h = Math.floor(d / 3600);
      var m = Math.floor((d % 3600) / 60);
      var s = Math.floor((d % 3600) % 60);

      var hDisplay = h + "h";
      var mDisplay = m + "m";
      // var sDisplay = s > 0 ? s + (s == 1 ? " s" : " s") : "";
      tl = hDisplay + " " + mDisplay;
    }

    return tl;
  }

  percentageDuration() {
    let rt = Number(this.props.bookingdata.remainingTime);
    let tl = Number(this.props.bookingdata.timeLimit);

    return (rt / tl) * 100;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navigationbar}>
          <TouchableOpacity
            style={styles.backButtomContainer}
            onPress={() => {
              this.props.navigation.dispatch(backAction);
            }}
          >
            <Image
              resizeMode="cover"
              source={require("../assets/images/back.png")}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <Text style={styles.centerText}>Time Limit</Text>
          <View style={styles.rightView} />
        </View>
        <View style={styles.main_view}>
          <View style={styles.current_spent_time_view}>
            <Image
              resizeMode="contain"
              source={require("../assets/images/circular_clock.png")}
              style={styles.time_icon}
            />
            <Text style={styles.current_spent_time_text}>
              {this.totalTimeString()}
            </Text>
          </View>
          <View style={styles.main_top_view}>
            <PercentageCircle
              radius={100}
              percent={this.percentageDuration()}
              innerColor="#31dd73"
              borderWidth={10}
              color={"#3498db"}
            >
              <Text style={styles.circle_progress_text}>
                {this.remainingTimeString()}
              </Text>
            </PercentageCircle>
          </View>
          <View style={styles.main_bottom_view}>
            {/* <TouchableOpacity style={styles.extend_time_view} onPress={() => this.onExtendTimeBtnClick()} title='Extend Time'>
                            <Text style={styles.extend_time_btn} >Extend Time</Text>
                        </TouchableOpacity> */}
            <ApplyButton
              onPress={() => this.onCompleteTourBtnClick()}
              name={"Complete Tour"}
              style={styles.done_btn}
            />
          </View>
        </View>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          // title={title}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this.handlePress}
        />
        {this.showLoading()}
      </View>
    );
  }

  endTripWS() {
    this.setState({
      isLoading: true
    });

    var { dispatch } = this.props;

    //Get store data
    let storestate = store.getState();

    var params = {
      tripid: this.props.bookingdata.tripid,
      status: "ended"
    };

    endTrip(params)
      .then(data => {
        this.setState({
          isLoading: false
        });

        console.log("End trip responce:", data);

        if (data.errors) {
          Alert.alert(
            "Tourzan",
            "Something went wrong! Please try again later."
          );
        } else {
          let totalFees = data.price;

          /*{
                    guide_id: 58
                    guide_pay: 1545.94
                    guide_trip_fees: 231
                    isEnded: true
                    order_id: 268
                    price: 2007.95
                    tourist_id: 118
                    tourist_trip_fees: 231
                    trip_id: 57}*/

          //Reset Trip
          let storestate = store.getState();
          storestate.tour.bookingdata.isTripInProgress = false;
          storestate.tour.bookingdata.tripid = 0;
          storestate.tour.bookingdata.isAutomatic = true;

          store.dispatch(updatebooking(storestate.tour.bookingdata));

          this.props.navigation.pop();

          // Alert.alert(
          //   "Tourzan",
          //   "Your trip has successfully ended.",
          //   [
          //     {
          //       text: "OK",
          //       onPress: () => {

          //         // this.props.navigation.navigate("CompleteTour", {
          //         //   tripData: data
          //         // });
          //       }
          //     }
          //   ],
          //   { cancelable: false }
          // );
        }

        console.log("endTripWS-->", data);
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column"
  },

  // --- navigation bar --- //
  navigationbar: {
    paddingTop:
      Platform.OS == "ios" ? (isIphoneX() ? 44 : 20) : StatusBar.currentHeight,
    height: 64,
    backgroundColor: "#31dd73",
    width: width,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  backButtomContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center"
  },
  backButton: {
    marginLeft: 20,
    height: 15,
    width: 10
  },
  centerText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    width: width - 160,
    fontFamily: DefaultFont.textFont
  },
  rightView: {
    marginRight: 20,
    height: 20,
    width: 20
  },

  /// ------- main view -------///
  main_view: {
    flexDirection: "column",
    alignItems: "center",
    width: width,
    height: height - 44,
    backgroundColor: "#31dd73"
  },

  // --- current time view ---//
  current_spent_time_view: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#78e7a2",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  current_spent_time_text: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
    marginLeft: 5,
    fontFamily: DefaultFont.textFont
  },
  time_icon: {
    width: 10,
    height: 10
  },

  // --- main top view -- //
  main_top_view: {
    width: width,
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  circle_progress_text: {
    fontSize: 40,
    color: "white",
    fontFamily: DefaultFont.textFont
  },

  // --- main bottom view -- //
  main_bottom_view: {
    width: width,
    flex: 0.5,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white"
  },
  done_btn: {
    marginTop: 30,
    width: width - 60
  },
  note_text: {
    marginTop: 50,
    fontSize: 12,
    color: "black",
    width: 200,
    textAlign: "center"
  },
  extend_time_view: {
    marginTop: 40
  },
  extend_time_btn: {
    color: "black",
    paddingTop: 10,
    textAlign: "center",
    fontSize: 18,
    height: 50,
    width: width - 60,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd"
  },

  // --- Loading -- //
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

//MAP

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(CurrentTimeLimitScreen);
