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

import moment from "moment";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavigationActions, StackActions } from "react-navigation";
import Stars from "react-native-stars";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import NavigationBar from "../../components/NavigationBar";
import ApplyButton from "../../components/ApplyButton";

//Utils
import { Storage, isIphoneX } from "../../global/Utilities";
import {
  Colors,
  API,
  Paymentrails,
  Braintree,
  DefaultFont
} from "../../constants";

//Webservice
import {
  bookGuide,
  acceptTrip,
  brainTreeToken,
  allPayments
} from "../../actions";

//Store
import { store } from "../../store/index";

//Actions
import { updatebooking } from "../../actions/bookingActions";
import { updateuser } from "../../actions/userActions";

import { Marker } from "react-native-maps/lib/components/MapView";

//Geo coder
import Geocoder from "../../global/Geocoder";
Geocoder.init("AIzaSyAq-cJJqZ8jWN4pJQ34tNbNdhbjsbuZUJs"); // use a valid API key

//Braintree Dropin
import BraintreeDropIn from "react-native-braintree-payments-drop-in";

var { width, height } = Dimensions.get("window");

const backAction = NavigationActions.back({});

const popToTopAction = NavigationActions.popToTop({});

const resetRootAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Home" })],
  key: null
});

class BookingGuideSettingScreen extends React.Component {
  static navigationOptions = {
    title: "Booking Guide Setting",
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isExtendTerm: false,
      isHourlyOrManual: false,
      isCheckHoulryOrManual: false,
      isLoading: false,
      address: "",
      braintreeClientToken: "",
      defaultCard: null //{Object}
    };
    this.navigate = this.props.navigation;
  }

  async componentDidMount() {
    let paymentMethodTypes = await Storage.getItem("paymentMethodTypes");

    //Get cached payment data if available
    if (paymentMethodTypes) {
      this.paymentMethodTypes = paymentMethodTypes;
    }

    //Get address from lat and lng
    this.showAddress();

    //Get card detail
    this.getAllPaymentsDetail();
  }

  onConfirm() {
    //Check if any default card is available or not
    if (this.state.defaultCard) {
      this.bookGuideWS();
    } else {
      Alert.alert("Tourzan", "Please add payment method to continue booking.");
    }
  }

  //Callback from CardListScreen.js
  cardChanged = () => {
    this.getAllPaymentsDetail();
  };

  onPaymentSetting() {
    this.navigate.navigate("CardList", { CardChanged: this.cardChanged });
  }

  onTimeLimitSetting() {
    this.navigate.navigate("TimeLimit");
  }

  onExtendTerm() {
    console.log("onExtendTerm");

    this.setState(previousState => {
      return { isExtendTerm: true };
    });
  }

  onUnExtendTerm() {
    console.log("onUnExtendTerm");

    this.setState(previousState => {
      return { isExtendTerm: false };
    });
  }

  onDone() {
    this.setState(previousState => {
      return {
        isHourlyOrManual: previousState.isCheckHoulryOrManual ? true : false
      };
    });

    this.onUnExtendTerm();
  }

  onCheckHourly() {
    this.setState(previousState => {
      return { isCheckHoulryOrManual: false };
    });
  }

  onCheckManual() {
    this.setState(previousState => {
      return { isCheckHoulryOrManual: true };
    });
  }

  bookGuideWS() {
    var { params } = this.props.navigation.state;

    var guide = params.guide;

    this.setState({
      isLoading: true
    });

    var { dispatch } = this.props;

    //Get store data
    let storestate = store.getState();
    //storestate.tour.bookingdata.isTripInProgress = true
    //storestate.tour.bookingdata.isAutomatic = !this.state.isCheckHoulryOrManual

    //storestate.tour.bookingdata.bookedTime = moment().format('YYYY-MM-DD H:mm:ss');
    /*
                store.dispatch(
                    updatebooking(storestate.tour.bookingdata)
                );*/

    var params = {
      token: this.props.userdata.token,
      userid: this.props.userdata.user.userid,
      guides: "[" + parseInt(guide.id) + "]",
      latitude: this.props.currentlocation.lat,
      longitude: this.props.currentlocation.long,
      timelimit: storestate.tour.bookingdata.timeLimit,
      bookingtype: storestate.tour.bookingdata.isAutomatic
        ? "automatic"
        : "manual"
    };

    //JSON.stringify(data)

    bookGuide(params)
      .then(data => {
        this.setState({
          isLoading: false
        });

        Alert.alert(
          "Tourzan",
          "Thanks for booking guide. Guide will respond shortly.",
          [
            {
              text: "OK",
              onPress: () => {
                this.props.navigation.dispatch(popToTopAction);
              }
            }
          ],
          { cancelable: false }
        );

        console.log("bookGuideWS-->", data);
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

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

  //Full name
  fullname = () => {
    var { params } = this.props.navigation.state;

    var guide = params.guide;

    if (!guide) {
      return "";
    }

    let fullname = "";

    if (guide.first_name) {
      fullname = guide.first_name;
    }

    if (guide.last_name) {
      fullname = fullname + " " + guide.last_name;
    }

    if (!fullname) {
      fullname = "Guide";
    }

    return fullname;
  };

  rating = () => {
    var { params } = this.props.navigation.state;

    var guide = params.guide;

    return guide.guide_data ? guide.guide_data.guide_rating : 0;
  };

  showAddress = () => {
    var { params } = this.props.navigation.state;

    var guide = params.guide;

    if (!guide.latitude || !guide.longitude) {
      this.setState({ address: "No location" });
    }

    Geocoder.from(guide.latitude, guide.longitude)
      .then(json => {
        var addressComponent = json.results[0].address_components[0];

        this.setState({ address: json.results[0].formatted_address });
      })
      .catch(error => console.warn(error));
  };

  profileImage = () => {
    var profileImage;

    var { params } = this.props.navigation.state;

    var guide = params.guide;

    if (guide.guide_data.profile_image) {
      profileImage = guide.guide_data.profile_image;
    }

    if (profileImage) {
      profileImage = { uri: profileImage };
    } else {
      profileImage = require("../../assets/images/defaultavatar.png");
    }

    return profileImage;
  };

  render() {
    const { navigate } = this.props.navigation;

    var { params } = this.props.navigation.state;

    var guide = params.guide;

    return (
      <View style={styles.container}>
        <View style={styles.navigationbar}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.pop();
              this.props.navigation.pop();
            }}
          >
            <Image
              resizeMode="cover"
              source={require("../../assets/images/back.png")}
              style={styles.nav_back_btn}
            />
          </TouchableOpacity>
          <Text style={styles.nav_center_text} />
          {/* <TouchableOpacity
            onPress={() => {
              navigate("ProfileCharRoomFromBooking");
            }}
          >
            <Image
              resizeMode="cover"
              source={require("../../assets/images/profile_chat_icon.png")}
              style={styles.nav_right_view}
            />
          </TouchableOpacity> */}
        </View>
        {/*<ScrollView style={styles.scrollview}>*/}
        <View style={styles.content_view}>
          <View style={styles.top_container}>
            <View style={styles.top_container_bg_view} />
            <View style={styles.top_info_view} pointerEvents="none">
              <Text style={styles.top_name_text}>{this.fullname()}</Text>
              <View style={styles.top_location_view}>
                <Image
                  resizeMode="contain"
                  source={require("../../assets/images/location_maps.png")}
                  style={styles.top_location_icon}
                />
                <Text style={styles.top_location_text}>
                  {this.state.address}
                </Text>
              </View>
              {/* <Rating ratingCount={5} imageSize={12} style={{ marginTop: 5 }} onFinishRating={this.ratingCompleted} /> */}
              <Stars
                rating={this.rating()}
                count={5}
                half={true}
                spacing={0}
                fullStar={<Icon name={"star"} style={[styles.starStyle]} />}
                emptyStar={
                  <Icon
                    name={"star-outline"}
                    style={[styles.starStyle, styles.emptyStarStyle]}
                  />
                }
                halfStar={
                  <Icon name={"star-half"} style={[styles.starStyle]} />
                }
              />
            </View>
          </View>
          <View style={styles.setting_container}>
            <View style={styles.row_setting_view}>
              <View style={styles.setting_text_view}>
                <Text style={styles.setting_text}>Payment Method</Text>
              </View>
              <TouchableOpacity
                onPress={() => this.onPaymentSetting()}
                style={styles.row_setting_btn_view}
              >
                <View style={styles.row_setting_btn_left_view}>
                  <Image
                    resizeMode="contain"
                    source={
                      this.state.defaultCard
                        ? { uri: this.state.defaultCard.logo }
                        : require("../../assets/images/cash_icon.png")
                    }
                    style={styles.row_setting_btn_icon}
                  />
                  <Text style={styles.row_setting_btn_text}>
                    {this.state.defaultCard
                      ? this.state.defaultCard.card_number
                      : "Set Credit Card"}
                  </Text>
                </View>
                <Image
                  resizeMode="contain"
                  source={require("../../assets/images/item_arrow.png")}
                  style={styles.row_setting_btn_right_icon}
                />
              </TouchableOpacity>
            </View>
            {/* <View style={styles.row_setting_view}>
                            <View style={styles.setting_text_view_term}>
                                <Text style={styles.setting_text}>Time Limit Settings</Text>
                                {this.state.isExtendTerm ? (
                                    <TouchableOpacity onPress={() => this.onDone()}>
                                        <Text style={styles.done_text}>DONE</Text>
                                    </TouchableOpacity>
                                ) : (
                                        <TouchableOpacity pointerEvents='none'>
                                            <Text style={styles.done_text}></Text>
                                        </TouchableOpacity>
                                    )}
                            </View>
                            {this.state.isExtendTerm ? (
                                !this.state.isHourlyOrManual ? (
                                    <View style={styles.setting_term_extend_view}>
                                        <TouchableOpacity style={styles.hourly_setting_view} onPress={() => this.onCheckHourly()}>
                                            <View style={styles.row_setting_btn_left_view}>
                                                <Image resizeMode='contain' source={require("../../assets/images/time_icon_black.png")} style={styles.row_setting_btn_icon} />
                                                <Text style={styles.row_setting_btn_text}>Automatic</Text>
                                            </View>
                                            {this.state.isCheckHoulryOrManual ? (
                                                <Image resizeMode='contain' source={require("../../assets/images/unchecked_gray_badge.png")} style={styles.row_setting_btn_right_icon} />
                                            ) : (
                                                    <Image resizeMode='contain' source={require("../../assets/images/checked_green_badge.png")} style={styles.row_setting_btn_right_icon} />
                                                )}

                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.manual_setting_view} onPress={() => this.onCheckManual()}>
                                            <View style={styles.row_setting_btn_left_view}>
                                                <Image resizeMode='contain' source={require("../../assets/images/forms.png")} style={styles.row_setting_btn_icon} />
                                                <Text style={styles.row_setting_btn_text}>Manual</Text>
                                            </View>
                                            {this.state.isCheckHoulryOrManual ? (
                                                <Image resizeMode='contain' source={require("../../assets/images/checked_green_badge.png")} style={styles.row_setting_btn_right_icon} />
                                            ) : (
                                                    <Image resizeMode='contain' source={require("../../assets/images/unchecked_gray_badge.png")} style={styles.row_setting_btn_right_icon} />
                                                )}
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                        <View style={styles.setting_term_extend_view}>
                                            <TouchableOpacity style={styles.manual_setting_view} onPress={() => this.onCheckManual()}>
                                                <View style={styles.row_setting_btn_left_view}>
                                                    <Image resizeMode='contain' source={require("../../assets/images/forms.png")} style={styles.row_setting_btn_icon} />
                                                    <Text style={styles.row_setting_btn_text}>Manual</Text>
                                                </View>
                                                {this.state.isCheckHoulryOrManual ? (
                                                    <Image resizeMode='contain' source={require("../../assets/images/checked_green_badge.png")} style={styles.row_setting_btn_right_icon} />
                                                ) : (
                                                        <Image resizeMode='contain' source={require("../../assets/images/unchecked_gray_badge.png")} style={styles.row_setting_btn_right_icon} />
                                                    )}
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.hourly_setting_view} onPress={() => this.onCheckHourly()}>
                                                <View style={styles.row_setting_btn_left_view}>
                                                    <Image resizeMode='contain' source={require("../../assets/images/time_icon_black.png")} style={styles.row_setting_btn_icon} />
                                                    <Text style={styles.row_setting_btn_text}>Automatic</Text>
                                                </View>
                                                {this.state.isCheckHoulryOrManual ? (
                                                    <Image resizeMode='contain' source={require("../../assets/images/unchecked_gray_badge.png")} style={styles.row_setting_btn_right_icon} />
                                                ) : (
                                                        <Image resizeMode='contain' source={require("../../assets/images/checked_green_badge.png")} style={styles.row_setting_btn_right_icon} />
                                                    )}
                                            </TouchableOpacity>
                                        </View>
                                    )
                            ) : (
                                    !this.state.isHourlyOrManual ? (
                                        <TouchableOpacity onPress={() => this.onExtendTerm()} style={styles.row_setting_btn_view}>
                                            <View style={styles.row_setting_btn_left_view}>
                                                <Image resizeMode='contain' source={require("../../assets/images/time_icon_black.png")} style={styles.row_setting_btn_icon} />
                                                <Text style={styles.row_setting_btn_text}>Automatic</Text>
                                            </View>
                                            <Image resizeMode='contain' source={require("../../assets/images/edit_icon.png")} style={styles.row_setting_btn_right_icon} />
                                        </TouchableOpacity>
                                    ) : (
                                            <TouchableOpacity onPress={() => this.onExtendTerm()} style={styles.row_setting_btn_view}>
                                                <View style={styles.row_setting_btn_left_view}>
                                                    <Image resizeMode='contain' source={require("../../assets/images/forms.png")} style={styles.row_setting_btn_icon} />
                                                    <Text style={styles.row_setting_btn_text}>Manual</Text>
                                                </View>
                                                <Image resizeMode='contain' source={require("../../assets/images/edit_icon.png")} style={styles.row_setting_btn_right_icon} />
                                            </TouchableOpacity>
                                        )
                                )}
                        </View> 
                        <View style={styles.row_setting_view}>
                            <View style={styles.setting_text_view}>
                                <Text style={styles.setting_text}>Time Limit</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.onTimeLimitSetting()} style={styles.row_setting_btn_view}>
                                <View style={styles.row_setting_btn_left_view}>
                                    <Text style={styles.row_setting_btn_time_text}>Set Time Limit</Text>
                                </View>
                                <Image resizeMode='contain' source={require("../../assets/images/item_arrow.png")} style={styles.row_setting_btn_right_icon} />
                            </TouchableOpacity>
                        </View>*/}
          </View>
          <View style={styles.bottom_container}>
            <ApplyButton
              onPress={() => this.onConfirm()}
              name={"Confirm"}
              style={styles.confirm_btn}
            />
          </View>
          <Image
            resizeMode="cover"
            source={this.profileImage()}
            style={styles.top_avatar_icon}
          />
        </View>
        {this.showLoading()}
      </View>
    );
  }

  getAllPaymentsDetail() {
    allPayments()
      .then(data => {
        if (data && data.length > 0) {
          //Three status: 'true', 'false' and ''unknown'

          var isActiveCardFound = false;

          for (let i = 0; i < data.length; i++) {
            const card = data[i];

            if (card.is_active == true && card.is_default == true) {
              isActiveCardFound = true;
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

              this.setState({ defaultCard: card });
            }
          }

          if (!isActiveCardFound) {
            this.setState({ defaultCard: null });
          }
        }
      })
      .catch(err => {
        alert(err);
      });
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "column"
  },

  // ---- top naviatgion bar ----//
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
  nav_back_btn: {
    marginLeft: 20,
    height: 15,
    width: 10
  },
  nav_center_text: {
    color: "#000",
    textAlign: "center",
    fontSize: 17,
    width: width - 160,
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  nav_right_view: {
    marginRight: 20,
    height: 20,
    width: 20
  },

  // --- scroll view --- //
  scrollview: {},
  content_view: {
    //   height:1000,
    alignItems: "center"
  },

  // --- top container ---//
  top_container: {
    flexDirection: "column",
    alignItems: "center"
  },
  top_container_bg_view: {
    height: 50,
    width: width,
    backgroundColor: "#31dd73"
  },
  top_avatar_icon: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
    backgroundColor: "transparent",
    borderColor: "#ffffff",
    borderWidth: 4
  },
  top_info_view: {
    backgroundColor: "white",
    width: width,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "column",
    alignItems: "center"
  },
  top_name_text: {
    marginTop: 40,
    fontSize: 15,
    color: "#000",
    textAlign: "left",
    fontFamily: DefaultFont.textFont
  },
  top_location_view: {
    marginTop: 5,
    marginLeft: 30,
    marginRight: 30,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  top_location_icon: {
    width: 10,
    height: 10
  },
  top_location_text: {
    marginLeft: 5,
    fontSize: 12,
    color: Colors.color999,
    textAlign: "left",
    fontFamily: DefaultFont.textFont,
    width: "70%",
    alignSelf: "center"
  },

  //--- setting container ---//
  setting_container: {
    flexDirection: "column",
    alignItems: "center"
  },
  row_setting_view: {
    flexDirection: "column",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd"
  },
  setting_text_view: {
    paddingVertical: 7,
    paddingLeft: 20,
    width: width,
    backgroundColor: "#f9fbfc",
    borderBottomWidth: 1,
    borderColor: "#ddd"
  },
  setting_text: {
    fontSize: 13,
    color: Colors.tintColor,
    fontFamily: DefaultFont.textFont
  },
  row_setting_btn_view: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    justifyContent: "space-between",
    backgroundColor: "white"
  },
  row_setting_btn_left_view: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 30
  },
  row_setting_btn_icon: {
    height: 40,
    width: 40
  },
  row_setting_btn_text: {
    marginLeft: 10,
    fontSize: 15,
    color: "black",
    fontFamily: DefaultFont.textFont
  },
  row_setting_btn_time_text: {
    fontSize: 15,
    color: "black"
  },
  row_setting_btn_right_icon: {
    height: 20,
    width: 20,
    marginRight: 30
  },
  setting_term_extend_view: {
    flexDirection: "column",
    alignItems: "flex-start"
  },
  hourly_setting_view: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    justifyContent: "space-between",
    backgroundColor: "white"
  },
  manual_setting_view: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    justifyContent: "space-between",
    backgroundColor: "white"
  },
  done_text: {
    fontSize: 15,
    color: "#31dd73",
    marginRight: 20
  },
  setting_text_view_term: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 7,
    paddingLeft: 20,
    width: width,
    backgroundColor: "#f9fbfc",
    borderBottomWidth: 1,
    borderColor: "#ddd"
  },

  //--- bottom container ---//
  confirm_btn: {
    marginTop: 30,
    marginBottom: 200
  },

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

  //--- star style ---//
  starStyle: {
    color: "#f3bc17",
    backgroundColor: "transparent"
  },
  emptyStarStyle: {
    color: "#f3bc17"
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(BookingGuideSettingScreen);
