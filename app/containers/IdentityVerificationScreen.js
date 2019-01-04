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
  NativeModules
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Colors,
  API,
  Paymentrails,
  Braintree,
  DefaultFont
} from "../constants";
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
import { createApplicantOnfido, profile } from "../actions";

//Utilities
import { isIphoneX } from "../global/Utilities";

var { width, height } = Dimensions.get("window");

const backAction = NavigationActions.back({});

class IdentityVerificationScreen extends React.Component {
  //#region Constractors
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  //#endregion
  componentDidMount() {}

  componentWillUnmount() {}

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

  onSkip() {
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;

    //Paymentrail Detail
    navigate("PaymentrailDetail", {
      isFromRegistration: params ? params.isFromRegistration : false
    });
  }

  render() {
    const { navigate } = this.props.navigation;

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
          <Text style={styles.centerText}>Identification</Text>
          <View style={styles.rightView} />
        </View>
        <View style={styles.main_view}>
          <ApplyButton
            onPress={() => {
              this.onVerifyIdentity();
            }}
            name="Verify Your Identity"
          />
        </View>
        {this.showLoading()}
        <View style={styles.skipView}>
          <TouchableOpacity
            style={styles.skipButtonView}
            onPress={() => this.onSkip()}
          >
            <Text style={styles.skipButton}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  onVerifyIdentity() {
    this.getProfileData();
  }

  //API Call get user profile
  getProfileData() {
    this.setState({
      isLoading: true
    });

    var params = {
      userid: this.props.userdata.user.userid
    };

    profile(params)
      .then(data => {
        console.log("Profile data-->", data);

        if (data) {
          this.generateOnfidoApplicantID(data);
        } else {
          Alert.alert("Tourzan", "Server error. Please try again.");
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  generateOnfidoApplicantID(data) {
    console.log("data", data);

    if (!data.last_name) {
      Alert.alert(
        "Tourzan",
        "Please complete your first name and last name to verify your identity or you can skip it."
      );
      this.setState({
        isLoading: false
      });
      return;
    }

    var params = {
      firstname: data.username,
      lastname: data.last_name ? data.last_name : data.username
    };

    createApplicantOnfido(params)
      .then(data => {
        console.log("GenerateOnfidoApplicantID data-->", data);

        this.setState({
          isLoading: false
        });

        if (data) {
          if (data.id) {
            //Verify Guide Identity
            this.verifyOnfidoIdentity(data.id);
          } else {
            Alert.alert("Tourzan", "Server error. Please try again.");
          }
        } else {
          Alert.alert("Tourzan", "Server error. Please try again.");
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  alertAndnNvigateToPaymentrail() {
    Alert.alert(
      "Tourzan",
      "Verification complete",
      [
        {
          text: "OK",
          onPress: () => {
            const { params } = this.props.navigation.state;
            const { navigate } = this.props.navigation;

            //Paymentrail Detail
            navigate("PaymentrailDetail", {
              isFromRegistration: params ? params.isFromRegistration : false
            });
          }
        }
      ],
      { cancelable: true }
    );
  }

  verifyOnfidoIdentity(applicationId) {
    if (Platform.OS == "ios") {
      NativeModules.OnfidoSDK.startSDK(
        applicationId,
        applicationId => {
          this.alertAndnNvigateToPaymentrail();
        },
        errorCause => {
          this.setState({
            isLoading: false
          });
          Alert.alert("Tourzan", "Verification not finished please try again.");
        }
      );
    } else {
      NativeModules.OnfidoSDK.startSDK(
        applicationId,
        applicantId => {
          this.alertAndnNvigateToPaymentrail();
        },
        errorCause => {
          Alert.alert("Tourzan", "Verification not finished please try again.");
        }
      );
    }
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
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  rightView: {
    marginRight: 20,
    height: 20,
    width: 20
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
  // --- Skip --- //
  skipView: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: 44,

    flexDirection: "row"
  },
  skipButton: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "800"
  },
  skipButtonView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.main,
    marginRight: 1
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(IdentityVerificationScreen);
