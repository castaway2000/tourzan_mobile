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

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { NavigationActions } from "react-navigation";
import MapView from "react-native-maps";
import ApplyButton from "../components/ApplyButton";
import Switch from "../components/Switch";
import NavigationBar from "../components/NavigationBar";
import flagImg from "../assets/images/guide-dot.png";
import moment from "moment";
import MapViewDirections from "react-native-maps-directions";

//Store
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser } from "../actions/userActions";
import { updatelocation } from "../actions/locationActions";
import * as Actions from "../actions";

//Webservice
import {
  updateClockInOutStatus,
  acceptTrip,
  declineTrip,
  cancelTrip,
  updateTrip,
  loginAndUpdateTrip,
  getnearbyguides,
  brainTreeToken,
  brainTreeSaveNonce,
  allPayments,
  setDefaultCard,
  deactiveteCard
} from "../actions";

//Utilities
import { isIphoneX } from "../global/Utilities";
import {
  Colors,
  API,
  Paymentrails,
  Braintree,
  DefaultFont
} from "../constants";

//Braintree Dropin
import BraintreeDropIn from "react-native-braintree-payments-drop-in";

var { width, height } = Dimensions.get("window");

const backAction = NavigationActions.back({});

const resetRootAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Home" })],
  key: null
});

class AddPaymentMethodScreen extends React.Component {
  //#region Constractors
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      braintreeClientToken: "",
      paymentButtonText: "Please wait..."
    };
  }

  //#endregion this.state.braintreeClientToken.length > 0
  componentDidMount() {
    this.getBrainTreeTokenWS();
  }

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
    this.props.navigation.dispatch(resetRootAction);
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
          <Text style={styles.centerText}>Add Payment Method</Text>
          <View style={styles.rightView} />
        </View>
        <View style={styles.main_view}>
          <ApplyButton
            onPress={() => {
              this.onAddPaymentMethod();
            }}
            name={this.state.paymentButtonText}
          />
        </View>
        {this.showLoading()}
        <View style={styles.skipView}>
          <TouchableOpacity
            style={styles.skipButtonView}
            onPress={() => this.onSkip()}
          >
            <Text style={styles.skipButton}>Finish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  //
  getBrainTreeTokenWS() {
    this.setState({
      isLoading: true
    });

    brainTreeToken()
      .then(data => {
        if (data.braintree_client_token) {
          this.setState({ braintreeClientToken: data.braintree_client_token });
        }

        this.setState({
          isLoading: false,
          paymentButtonText: "Add Your Payment Method"
        });
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  saveNonceToServer(result) {
    /* Result
        description: "ending in 31"
        isDefault: false
        nonce: "tokencc_bf_hkmznk_95253c_nzgzkq_q6f6mz_m9z"
        type: "AMEX"
        */

    this.setState({
      isLoading: true
    });

    let params = {
      paymentmethodnonce: result.nonce,
      isdefault: result.isDefault
    };

    brainTreeSaveNonce(params)
      .then(data => {
        this.setState({
          isLoading: false
        });

        if (data && data.status == "success") {
          Alert.alert(
            "Tourzan",
            "A new payment method was successfully added.",
            [
              {
                text: "OK",
                onPress: () => {}
              }
            ],
            { cancelable: false }
          );

          //Finish
        } else {
          Alert.alert(
            "Tourzan",
            data.message ? data.message : "Error while saving card."
          );
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  onAddPaymentMethod() {
    BraintreeDropIn.show({
      clientToken: this.state.braintreeClientToken
    })
      .then(result => {
        console.log("result:", result);
        /* Result
                    description: "ending in 31"
                    isDefault: false
                    nonce: "tokencc_bf_hkmznk_95253c_nzgzkq_q6f6mz_m9z"
                    type: "AMEX"
                    */

        this.saveNonceToServer(result);
      })
      .catch(error => {
        if (error.code === "USER_CANCELLATION") {
          // update your UI to handle cancellation
        } else {
          // update your UI to handle other errors
          console.log("result:", result);
        }
      });
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
    fontWeight: "800",
    fontFamily: DefaultFont.textFont
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

export default connect(mapStateToProps)(AddPaymentMethodScreen);
