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

import ActionSheet from "react-native-actionsheet";
import { Rating, AirbnbRating } from "react-native-ratings";
import { NavigationActions } from "react-navigation";
import KeyEvent from "react-native-keyevent";
import PercentageCircle from "react-native-percentage-circle";
import ApplyButton from "../components/ApplyButton";
import moment from "moment";

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
import { profile, usermixins } from "../actions";

var { width, height } = Dimensions.get("window");

const backAction = NavigationActions.back({});

const resetRootAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Home" })],
  key: null
});

class CompleteTourScreen extends React.Component {
  static navigationOptions = {
    title: "Complete Tour",
    header: null
  };

  constructor(props) {
    super(props);
    this.navigate = this.props.navigation;

    this.state = {
      profileData: null,
      ratings: 0
    };
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

    if (this.props.userdata.user.isLoggedInAsGuide) {
      this.onGetProfile(this.props.bookingdata.touristid);
    } else {
      this.onGetProfile(this.props.bookingdata.guideid);
    }
  }

  // function for ratingview
  ratingCompleted = rating => {
    console.log("Rating is: " + rating);

    this.setState({ ratings: rating });
  };

  onWriteReviewBtnClick() {
    if (this.state.rating < 1) {
      Alert.alert("Tourzan", "Please add rating to continue.");
      return;
    }

    let tripData = this.props.navigation.state.params.tripData;

    this.props.navigation.navigate("WriteFeedback", {
      profileData: this.state.profileData,
      ratings: this.state.ratings,
      tripData: tripData
    });
  }

  onAddFeedbackBtnClick() {
    //this.props.navigation.navigate('Profile');
  }

  //Show full name
  _showFullname = () => {
    if (!this.state.profileData) {
      return <Text style={styles.name_text} />;
    }

    let fullname = "";

    if (this.state.profileData.first_name) {
      fullname = this.state.profileData.first_name;
    }

    if (this.state.profileData.last_name) {
      fullname = fullname + " " + this.state.profileData.last_name;
    }

    return <Text style={styles.name_text}>{fullname}</Text>;
  };

  //Show full name
  _showProfilePicture = () => {
    if (!this.state.profileData) {
      return (
        <Image
          resizeMode="cover"
          source={require("../assets/images/defaultavatar.png")}
          style={styles.avatar_img}
        />
      );
    }
    
    let profilepicture = "";
    
    profilepicture = this.state.profileData.pic;

    if (profilepicture) {
      return (
        <Image
          resizeMode="cover"
          source={{ uri: profilepicture }}
          style={styles.avatar_img}
        />
      );
    } else {
      return (
        <Image
          resizeMode="cover"
          source={require("../assets/images/defaultavatar.png")}
          style={styles.avatar_img}
        />
      );
    }
  };

  getHoursMinutes() {
    var formatted = "0 Hours 0 Minutes";

    var seconds = this.props.bookingdata.duration;

    if (seconds < 60) {
      formatted = moment.utc(seconds * 1000).format("ss") + " Second";
    } else {
      formatted =
        moment.utc(seconds * 1000).format("HH") +
        " Hours " +
        moment.utc(seconds * 1000).format("mm") +
        " Minutes";
    }

    return formatted;
  }

  render() {
    let tripData = this.props.navigation.state.params.tripData;

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
          <Text style={styles.centerText}>Complete Tour</Text>
          <View style={styles.rightView} />
        </View>
        <ScrollView style={styles.scroll_view}>
          <View style={styles.scroll_content_view}>
            <View style={styles.guide_info_view}>
              <View style={styles.row}>
                <View style={styles.avatar_view}>
                  {/* <Image resizeMode='cover' source={require("../assets/images/defaultavatar.png")} style={styles.avatar_img} /> */}
                  {this._showProfilePicture()}
                </View>
                <View style={styles.info_view}>
                  {this._showFullname()}
                  {/* <View style={styles.location_view}>
                    <Image
                      resizeMode="contain"
                      source={require("../assets/images/location_maps.png")}
                      style={styles.location_icon}
                    />
                    <Text style={styles.location_text}>
                      440 Curtola, CA (Pending)
                    </Text>
                  </View> */}
                </View>
                <View style={styles.guide_info_right_view}>
                  <Text style={styles.guide_info_right_text}>
                    ${tripData.guide_payment}
                  </Text>
                </View>
              </View>
              <View style={styles.guide_rating_view}>
                <Text style={styles.rating_title_text}>
                  Please Rate Tour Guide!{" "}
                </Text>
                <View style={styles.rating_view}>
                  <Rating
                    type="star"
                    style={styles.list_info_ratingbar}
                    startingValue={Math.floor(this.state.ratings)}
                    ratingCount={5}
                    imageSize={35}
                    onFinishRating={this.ratingCompleted}
                  />
                </View>
              </View>
            </View>

            <View style={styles.tour_detail_view}>
              <View style={styles.tour_detail_title_view}>
                <Text style={styles.tour_detail_title_text}>Tour Details</Text>
              </View>
              {/* <View style={styles.row_setting_btn_view}>
                <Image
                  resizeMode="contain"
                  source={require("../assets/images/trip_item_location_icon.png")}
                  style={styles.row_setting_btn_icon}
                />
                <Text style={styles.row_setting_btn_text}>
                  053 Maggio Road Apt. 016(Pending)
                </Text>
              </View> */}
              <View style={styles.row_setting_btn_view}>
                <Image
                  resizeMode="contain"
                  source={require("../assets/images/time_icon_black.png")}
                  style={styles.row_setting_btn_icon}
                />
                <Text style={styles.row_setting_btn_text}>
                  {this.getHoursMinutes()}
                </Text>
              </View>
              <View style={styles.row_setting_btn_view}>
                <Image
                  resizeMode="contain"
                  source={require("../assets/images/wallet_icon.png")}
                  style={styles.row_setting_btn_icon}
                />
                <Text style={styles.row_setting_btn_text}>
                  Total: ${tripData.total_price}
                </Text>
              </View>
            </View>

            <View style={styles.main_bottom_view}>
              <TouchableOpacity
                onPress={() => this.onWriteReviewBtnClick()}
                title="Extend Time"
              >
                <Text style={styles.write_review_btn}>Write Review </Text>
              </TouchableOpacity>
              {/* <ApplyButton
                onPress={() => this.onAddFeedbackBtnClick()}
                name={"Add Feedback"}
                style={styles.add_feedback_btn}
              /> */}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  onGetProfile(userid) {
    var { dispatch } = this.props;

    var params = {
      id: userid,
      usertype: "tourist"
    };

    usermixins(params)
      .then(data => {
        if (data) {
          this.setState({ profileData: data });
        } else {
          Alert.alert("Tourzan", "Error while loading profile.");
        }
      })
      .catch(err => {
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
    paddingTop: 20,
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

  /// ------- main view -------///
  scroll_view: {
    // height : 500,
    backgroundColor: "white"
  },
  scroll_content_view: {
    flexDirection: "column",
    alignItems: "center",
    width: width,
    flex: 1
  },

  guide_info_view: {
    width: width - 40,
    marginTop: 30,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  row: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  avatar_view: {
    flexDirection: "column",
    alignItems: "center"
  },
  avatar_img: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "transparent"
  },
  info_view: {
    width: ((width - 40) * 50) / 100,
    marginLeft: 10,
    flexDirection: "column",
    justifyContent: "center"
  },
  location_view: {
    marginTop: 5,
    height: 15,
    flexDirection: "row",
    alignItems: "center"
  },
  location_icon: {
    width: 10,
    height: 10
  },
  name_text: {
    fontSize: 15,
    color: "#000",
    textAlign: "left",
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  location_text: {
    marginLeft: 5,
    fontSize: 12,
    color: Colors.color999,
    textAlign: "left",
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  guide_info_right_view: {
    width: 100,
    alignItems: "center",
    borderLeftWidth: 1,
    borderColor: "#ddd"
  },
  guide_info_right_text: {
    margin: 10,
    fontFamily: DefaultFont.textFont
  },
  guide_rating_view: {
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd"
  },
  rating_title_text: {
    marginTop: 20,
    fontSize: 15,
    color: Colors.color999,
    fontFamily: DefaultFont.textFont
  },
  rating_view: {
    marginTop: 20,
    marginBottom: 20
  },

  tour_detail_view: {
    width: width,
    marginTop: 10,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  tour_detail_title_view: {
    paddingVertical: 7,
    paddingLeft: 20,
    width: width,
    marginTop: 30,
    backgroundColor: "#f9fbfc",
    borderTopWidth: 1,
    borderColor: "#ddd"
  },
  tour_detail_title_text: {
    fontSize: 13,
    color: Colors.tintColor,
    fontFamily: DefaultFont.textFont
  },
  row_setting_btn_view: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  row_setting_btn_icon: {
    height: 15,
    width: 15
  },
  row_setting_btn_text: {
    marginLeft: 10,
    fontSize: 15,
    color: "black",
    fontFamily: DefaultFont.textFont
  },

  // --- main bottom view -- //
  main_bottom_view: {
    width: width,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 20
  },
  add_feedback_btn: {
    marginTop: 20,
    width: width - 60
  },
  note_text: {
    marginTop: 50,
    fontSize: 12,
    color: "black",
    width: 200,
    textAlign: "center"
  },
  write_review_btn: {
    color: "black",
    paddingTop: 10,
    textAlign: "center",
    fontSize: 18,
    height: 50,
    width: width - 60,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    fontFamily: DefaultFont.textFont
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(CompleteTourScreen);
