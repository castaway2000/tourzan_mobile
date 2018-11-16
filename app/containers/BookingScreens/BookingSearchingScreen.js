import React, { Component } from "react";

import {
  Button,
  ScrollView,
  Dimensions,
  StatusBar,
  Navigator,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity
} from "react-native";

import { NavigationActions } from "react-navigation";
import PulseLoader from "../../components/CustomPulseLoader";

//Store
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store } from "../../store/index";

//Utilities
import { isIphoneX, isNumber, Storage } from "../../global/Utilities";
import { Colors, API, Paymentrails, Braintree, DefaultFont  } from "../../constants";

//Actions
import { updatebooking } from "../../actions/bookingActions";

//Webservice
import {
  updateClockInOutStatus,
  getnearbyguides,
  profile
} from "../../actions";

var { width, height } = Dimensions.get("window");

const timer = require("react-native-timer");
const onButtonPress = () => {
  Alert.alert("Button has been pressed!");
};
const backAction = NavigationActions.back({});

class BookingSearchingScreen extends React.Component {
  static navigationOptions = {
    header: null,
    title: "Booking Searching"
  };

  constructor(props) {
    super(props);
    this.state = { checked: false };
    this.navigate = this.props.navigation;
  }

  componentWillMount() {
    console.log("bookingSearchingScreen = componentDidMount Calling");
    //timer.clearTimeout(this);
    //timer.setTimeout(this, '', () => this.navigate.navigate('BookingGuideSetting'), 5000);

    this.onGetNearbyGuide();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.main_view}>
          <View style={styles.logo_view}>
            <Image
              resizeMode="contain"
              source={require("../../assets/images/guide_search_logo.png")}
              style={styles.logo_icon}
            />
            <Text style={styles.logo_text}>Let's find you a tour guide</Text>
          </View>
          {/* <View style={styles.bottom_view}>
                        <Text style={styles.bottom_text}>Tour guide will wait for you up to 5 mins</Text>
                    </View> */}
        </View>
        <View style={styles.circle}>
          <PulseLoader
            interval={2000}
            // avatar='../../assets/images/find_pin_location.png'
            size={100}
            pulseMaxSize={250}
            borderColor="#54db88"
            backgroundColor="#fff"
            avatarBackgroundColor="transparent"
          />
        </View>
      </View>
    );
  }

  onGetNearbyGuide() {
    console.log("this.props.userdata", this.props.userdata);

    var { dispatch } = this.props;

    var params = {
      userid: this.props.userdata.user.userid,
      latitude: this.props.currentlocation.lat,
      longitude: this.props.currentlocation.long,
      units: "km",
      range: "100"
    };

    getnearbyguides(params)
      .then(data => {
        console.log("Get onGetNearbyGuide-->", data);

        Alert.alert("Get Nearby Guide Responce", JSON.stringify(data));
        if (data) {
          if (data.length < 1) {
            // Alert.alert('Tourzan', 'No nearby guide available. Please try again later.')
            this.props.navigation.dispatch(backAction);
          } else {
            //timer.setTimeout(this, '', () => this.navigate.navigate('BookingGuideSetting', { guides: data }), 5000);
            if (data[0]) {
              this.onGetProfile(data[0]);
            } else {
              // Alert.alert('Tourzan', 'No nearby guide available. Please try again later.')
              this.props.navigation.dispatch(backAction);
            }
          }
        } else {
          //                    Alert.alert('Tourzan', 'No nearby guide available. Please try again later.')
          this.props.navigation.dispatch(backAction);
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  onGetProfile(user) {
    var { dispatch } = this.props;

    var params = {
      userid: user.user
    };

    profile(params)
      .then(data => {
        console.log("Get onGetProfile-->", data);

        if (data) {
          timer.setTimeout(
            this,
            "",
            () =>
              this.navigate.navigate("BookingGuideSetting", { guide: data }),
            5000
          );
        } else {
          Alert.alert(
            "Tourzan",
            "No nearby guide available. Please try again later."
          );
        }
      })
      .catch(err => {
        alert(err);
      });
  }
}

const styles = StyleSheet.create({
  container: {
    height: height,
    alignItems: "center",
    backgroundColor: "#31dd73"
  },
  main_view: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  logo_view: {
    flex: 0.3,
    marginTop: 50,
    flexDirection: "column",
    alignItems: "center"
  },
  logo_icon: {
    width: 80,
    height: 80
  },
  logo_text: {
    fontSize: 20,
    color: "white",
    fontFamily: DefaultFont.textFont
  },
  circle: {
    width: width,
    height: height,
    position: "absolute",
    left: 200 / 2,
    top: 300 / 2,
    marginLeft: -200 / 2,
    marginTop: -200 / 2
  },
  bottom_view: {
    flex: 0.08,
    flexDirection: "column",
    alignItems: "center"
  },
  bottom_text: {
    fontSize: 15,
    color: "white"
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(BookingSearchingScreen);
