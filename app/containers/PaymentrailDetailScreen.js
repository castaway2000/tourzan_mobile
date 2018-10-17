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
  ActivityIndicator,
  NativeModules,
  WebView
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Colors } from "../constants";
import { NavigationActions } from "react-navigation";
import MapView from "react-native-maps";

import Switch from "../components/Switch";
import NavigationBar from "../components/NavigationBar";

import flagImg from "../assets/images/guide-dot.png";
import moment from "moment";
import MapViewDirections from "react-native-maps-directions";
import ApplyButton from "../components/ApplyButton";

//Store
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser } from "../actions/userActions";
import { updatelocation } from "../actions/locationActions";
import * as Actions from "../actions";

//Webservice
import { createApplicantBraintree, profile } from "../actions";

//Utilities
import { isIphoneX } from "../global/Utilities";
var { width, height } = Dimensions.get("window");

//API
import { API, Paymentrails } from "../constants";

const backAction = NavigationActions.back({});

const resetRootAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Welcome" })],
  key: null
});

var CryptoJS = require("crypto-js");

class PaymentrailDetailScreen extends React.Component {
  //#region Constractors
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      shouldPocessNext: false,
      widgetURL: ""
    };
  }

  //#endregion
  componentDidMount() {
    this.showSpinner();
    this.generateWidgetURL();
  }

  componentWillUnmount() {}

  hideSpinner() {
    this.setState({ isLoading: false });
  }

  showSpinner() {
    this.setState({ isLoading: true });
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

  onFinish() {
    this.props.navigation.dispatch(resetRootAction);
  }

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    return (
      <View style={styles.container}>
        <View style={styles.statusbar} />
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
          <Text style={styles.centerText}>Bank Information</Text>

          <View style={styles.rightView}>
            {(params ? params.isFromRegistration : false) && (
              <TouchableOpacity onPress={() => this.onFinish()}>
                <Text style={styles.rightViewtext}>FINISH</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.main_view}>
          <View style={styles.webviewContainer}>
            <WebView
              ref={ref => {
                this.webview = ref;
              }}
              onLoad={() => this.hideSpinner()}
              source={{
                uri: this.state.widgetURL
              }}
              onNavigationStateChange={event => {
                console.log("Webview event", event);
              }}
            />
          </View>
        </View>
        {this.showLoading()}
      </View>
    );
  }

  generateWidgetURL() {
    const KEY = Paymentrails.apiKey;
    const SECRET = Paymentrails.apiSecret;

    const recipientEmail = this.props.userdata.user.email;
    const recipientReferenceId = this.props.userdata.user.email;

    let widgetBaseUrl = API.PAYMENTRAILS_WIDGET;

    let querystring = {
      ts: Math.floor(new Date().getTime() / 1000),
      key: KEY,
      email: recipientEmail,
      refid: recipientReferenceId,
      hideEmail: "false",
      roEmail: "false",
      payoutMethods: "bank-transfer,paypal",
      locale: "en"
    };

    let esc = encodeURIComponent;
    let query = Object.keys(querystring)
      .map(k => esc(k) + "=" + esc(querystring[k]))
      .join("&");

    widgetBaseUrl = widgetBaseUrl + query;

    //Signature
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, SECRET);

    hmac.update(query);

    let hash = hmac.finalize();

    var signature = hash.toString(CryptoJS.enc.Hex);

    widgetBaseUrl = widgetBaseUrl + "&sign=" + signature;

    this.setState({ widgetURL: widgetBaseUrl, shouldPocessNext: true });

    console.log("Widget URL IS:", widgetBaseUrl);
  }
}

const styles = StyleSheet.create({
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

  // --- main view --- //
  main_view: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f9fbfe",
    justifyContent: "center",
    flex: 1,
    width: "100%"
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
  backButtomContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center"
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
    fontWeight: "bold"
  },
  rightView: {
    marginRight: 20,
    height: 20
  },
  rightViewtext: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold"
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
  },
  // --- webview --- //
  webviewContainer: {
    flex: 1,
    backgroundColor: "#000000",
    width: "100%"
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(PaymentrailDetailScreen);
