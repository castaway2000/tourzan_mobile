//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  Image,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";

import GuidesScreen from "./GuidesScreen";
import TransactionsScreen from "./TransactionsScreen";
import TripsScreen from "./TripsScreen";

//Store
import { connect } from "react-redux";
import { store } from "../../store/index";

//Actions
import { updatebooking } from "../../actions/bookingActions";
import { updateuser } from "../../actions/userActions";

//Utilities
import { Storage, isIphoneX } from "../../global/Utilities";
import {
  Colors,
  API,
  Paymentrails,
  Braintree,
  DefaultFont
} from "../../constants";

var { width, height } = Dimensions.get("window");

// create a component
class DashboardTapNavigator extends React.Component {
  static navigationOptions = {
    title: "",
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      //isTrips: true,
      isGuides: true,
      isTransaction: false
    };
  }

  async componentDidMount() {}

  onTrips() {
    this.setState({
      //isTrips: true,
      isGuides: false,
      isTransaction: false
    });
  }

  onGuides() {
    this.setState({
      //isTrips: false,
      isGuides: true,
      isTransaction: false
    });
  }

  onTransaction() {
    this.setState({
      //isTrips: false,
      isGuides: false,
      isTransaction: true
    });
  }

  showDashbaord() {
    /*
        if (this.state.isTrips) {
            return (
                < TripsScreen navigation={this.props.navigation} />
            )
        }*/

    if (this.state.isGuides) {
      return <GuidesScreen navigation={this.props.navigation} />;
    }
    if (this.state.isTransaction) {
      return <TransactionsScreen navigation={this.props.navigation} />;
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.statusbar} />
        <View style={styles.headView}>
          <Text style={styles.title}>DASHBOARD</Text>
          <TouchableOpacity
            style={styles.personImgButton}
            onPress={() => {
              navigate("Profile");
            }}
          >
            <Image
              resizeMode="cover"
              source={this.props.userdata.user.profilepicture}
              style={styles.personImg}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.mainView}>
          <View style={styles.tabbarView}>
            {/* <TouchableWithoutFeedback onPress={() => this.onTrips()}>
                            <View style={styles.tripsButtonView}>
                                <Image resizeMode='contain' source={require('../../assets/images/trips_icon.png')} style={this.state.isTrips ? [styles.icon, { tintColor: 'white' }] : styles.icon} />
                                <Text style={this.state.isTrips ? [styles.tabtxt, { color: 'white' }] : styles.tabtxt}>LIST OF TRIPS</Text>
                            </View>
                        </TouchableWithoutFeedback> */}
            <TouchableWithoutFeedback onPress={() => this.onGuides()}>
              <View style={styles.tripsButtonView}>
                <View style={styles.tripsButtonView}>
                  <Image
                    resizeMode="contain"
                    source={require("../../assets/images/guides_icon.png")}
                    style={
                      this.state.isGuides
                        ? [styles.icon, { tintColor: "white" }]
                        : styles.icon
                    }
                  />
                  <Text
                    style={
                      this.state.isGuides
                        ? [styles.tabtxt, { color: "white" }]
                        : styles.tabtxt
                    }
                  >
                    {this.props.userdata.user.isLoggedInAsGuide
                      ? "PREV TOURIST"
                      : "PREV GUIDES"}
                  </Text>
                </View>
                <View
                  style={
                    this.state.isGuides
                      ? [styles.bottomLine, { backgroundColor: "white" }]
                      : styles.bottomLine
                  }
                />
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => this.onTransaction()}>
              <View style={styles.tripsButtonView}>
                <View style={styles.tripsButtonView}>
                  <Image
                    resizeMode="contain"
                    source={require("../../assets/images/transactions_icon.png")}
                    style={
                      this.state.isTransaction
                        ? [styles.icon, { tintColor: "white" }]
                        : styles.icon
                    }
                  />
                  <Text
                    style={
                      this.state.isTransaction
                        ? [styles.tabtxt, { color: "white" }]
                        : styles.tabtxt
                    }
                  >
                    TRANSACTION
                  </Text>
                </View>
                <View
                  style={
                    this.state.isTransaction
                      ? [styles.bottomLine, { backgroundColor: "white" }]
                      : styles.bottomLine
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.tab_listView}>{this.showDashbaord()}</View>
        </View>
      </View>
    );
  }
  g;
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  statusbar: {
    width: width,
    height: Platform.OS == "ios" ? (isIphoneX() ? 44 : 20) : 0,
    backgroundColor: Colors.main,
    position: "absolute",
    top: 0,
    left: 0
  },
  headView: {
    width: width,
    height: 44,
    marginTop: Platform.OS == "ios" ? (isIphoneX() ? 44 : 20) : 0,
    backgroundColor: Colors.main,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    textAlign: "center",
    fontSize: 17,
    width: width - 160,
    fontWeight: "bold",
    color: "white",
    fontFamily: DefaultFont.textFont
  },
  mainView: {
    width: width,
    flex: 1
  },
  tabbarView: {
    width: width,
    height: 55,
    marginTop: 1,
    backgroundColor: Colors.main,
    flexDirection: "row"
  },
  tripsButtonView: {
    width: width / 2,
    height: 55,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    width: 20,
    height: 20,
    marginTop: 5
  },
  tabtxt: {
    fontSize: 9,
    color: Colors.tintColor,
    marginTop: 5,
    fontFamily: DefaultFont.textFont
  },
  personImg: {
    height: 36,
    width: 36,
    borderRadius: 18
  },
  personImgButton: {
    height: 36,
    width: 36,
    position: "absolute",
    right: 20,
    borderRadius: 18
  },
  tab_listView: {
    width: width,
    flex: 1,
    alignItems: "center"
  },
  bottomLine: {
    height: 3,
    backgroundColor: "transparent",
    width: "80%"
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(DashboardTapNavigator);
