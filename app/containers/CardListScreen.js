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
  FlatList
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
import { Storage, isIphoneX } from "../global/Utilities";

//FCM
import FCM, { NotificationActionType } from "react-native-fcm";
import {
  registerKilledListener,
  registerAppListener
} from "../global/Firebase/Listeners";
import firebaseClient from "../global/Firebase/FirebaseClient";

//Braintree Dropin
import BraintreeDropIn from "react-native-braintree-payments-drop-in";

var { width, height } = Dimensions.get("window");

const backAction = NavigationActions.back({});

const numColumns = 2;
const size = Dimensions.get("window").width / numColumns;

const checkedCard = require("./../assets/images/card-checked.png");
const unCheckedCard = require("./../assets/images/card-unchecked.png");
const removeCard = require("./../assets/images/card-remove.png");

class CardListScreen extends React.Component {
  //#region Constractors
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      braintreeClientToken: "",
      isLoading: false,
      message: ""
    };
  }

  //#endregion
  async componentWillMount() {}

  async componentDidMount() {
    let paymentMethodTypes = await Storage.getItem("paymentMethodTypes");

    //Get cached payment data if available
    if (paymentMethodTypes) {
      this.paymentMethodTypes = paymentMethodTypes;
    }

    this.getBrainTreeTokenWS();

    this.getAllPaymentsDetail();
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

  // card-checked.png
  // card-checked.png
  onAddPaymentMethod() {
    BraintreeDropIn.show({
      clientToken: this.state.braintreeClientToken
    })
      .then(result => {
        console.log("BraintreeDropIn result:", result);
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
          console.log("BraintreeDropIn result:", error);
        }
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
          <Text style={styles.centerText}>Your Payment Methods</Text>
          <View style={styles.rightView}>
            {this.state.braintreeClientToken.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  this.onAddPaymentMethod();
                }}
              >
                <Image
                  resizeMode="cover"
                  source={require("../assets/images/add-card-payment.png")}
                  style={styles.addPayment}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.listview}>
          {this.state.cards.length > 0 && (
            <FlatList
              data={this.state.cards}
              renderItem={({ item, index }) => (
                <View style={styles.itemContainer}>
                  <View style={styles.item}>
                    <Text style={styles.itemcarddigit}>
                      {item.is_paypal ? item.paypal_email : item.card_number}
                    </Text>

                    {item.logo && (
                      <Image
                        source={{ uri: item.logo }}
                        style={{
                          width: 50,
                          height: 30,
                          position: "absolute",
                          bottom: 10,
                          right: 10
                        }}
                      />
                    )}

                    {item.is_active == true && (
                      <TouchableOpacity
                        onPress={() => this.setDefaultCardWS(item)}
                        style={{
                          width: 50,
                          height: 30,
                          position: "absolute",
                          bottom: 10,
                          left: 10
                        }}
                      >
                        <Image
                          source={item.is_default ? checkedCard : unCheckedCard}
                        />
                      </TouchableOpacity>
                    )}

                    {item.is_active == true && (
                      <TouchableOpacity
                        onPress={() => this.removeCardWS(item)}
                        style={{
                          width: 50,
                          height: 30,
                          position: "absolute",
                          bottom: 10,
                          left: 50
                        }}
                      >
                        <Image source={removeCard} />
                      </TouchableOpacity>
                    )}

                    {item.is_active == false && (
                      <Text
                        style={{
                          position: "absolute",
                          bottom: 10,
                          left: 4,
                          color: "red"
                        }}
                      >
                        Disabled
                      </Text>
                    )}
                  </View>
                </View>
              )}
              keyExtractor={item => item.id}
              numColumns={numColumns}
            />
          )}

          {this.state.cards.length < 1 && (
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <Text style={{ width: "100%", textAlign: "center" }}>
                {this.state.message}
              </Text>
            </View>
          )}
        </View>

        {this.showLoading()}
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
          isLoading: false
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
            data.message
              ? data.message
              : "A new payment method was successfully added!"
          );

          this.getAllPaymentsDetail();
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

  getAllPaymentsDetail() {
    this.setState({
      isLoading: true
    });

    allPayments()
      .then(data => {
        this.setState({
          isLoading: false
        });

        if (data && data.length > 0) {
          if (this.paymentMethodTypes) {
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < this.paymentMethodTypes.length; j++) {
                const cardtype = this.paymentMethodTypes[j];

                if (data[i].type == cardtype.id) {
                  data[i].name = cardtype.name;
                  data[i].logo = cardtype.logo;
                }
              }
            }
          }

          this.setState({ cards: data, message: "" });
        } else {
          this.setState({ message: "There are no Payment method added." });
        }

        console.log("cards", this.state.cards);
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  setDefaultCardWS(item) {
    console.log("item", item);
    this.setState({
      isLoading: true
    });

    let params = { paymentmethodid: item.id };

    setDefaultCard(params)
      .then(data => {
        this.setState({
          isLoading: false
        });

        this.getAllPaymentsDetail();
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  removeCardWS(item) {
    console.log("item", item);

    this.setState({
      isLoading: true
    });

    let params = { paymentmethodid: item.id };

    deactiveteCard(params)
      .then(data => {
        this.setState({
          isLoading: false
        });

        this.getAllPaymentsDetail();
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
    flex: 1
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
  addPayment: {
    marginLeft: 20
  },
  centerText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    width: width - 160,
    fontWeight: "bold"
  },
  rightView: {
    marginRight: 12
  },

  // --- cell --- //
  listview: {
    backgroundColor: "white",
    flex: 1
  },

  // --- cell --- //
  itemContainer: {
    width: size,
    height: 150,
    padding: 5
  },

  item: {
    flex: 1,
    margin: 3,
    backgroundColor: "#fafafa",
    borderColor: "#e6e6e6",
    borderWidth: 1,
    borderRadius: 5
  },

  itemcarddigit: {
    color: "#5c5c5c",
    fontSize: 12,
    marginTop: 30,
    fontWeight: "bold",
    paddingLeft: 4
  },

  // --- Loading --- //
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

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
};

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardListScreen);
