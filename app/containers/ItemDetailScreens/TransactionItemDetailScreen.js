import React, { Component } from "react";

import {
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
  ListView,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";

import { NavigationActions } from "react-navigation";
import Checkbox from "react-native-custom-checkbox";
import Rating from "react-native-ratings";
import ReadMore from "@expo/react-native-read-more-text";
import Button from "react-native-button";
import moment from "moment";

import ApplyButton from "../../components/ApplyButton";
import NavigationBar from "../../components/NavigationBar";
import { Colors } from "../../constants/index";

var { width, height } = Dimensions.get("window");

const onButtonPress = () => {
  Alert.alert("Button has been pressed!");
};
const backAction = NavigationActions.back({
  // key: 'WelcomeScreen'
});

class TransactionItemDetailScreen extends React.Component {
  static navigationOptions = {
    title: "",
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      // for ratingview
      starCount: 3.5
    };
  }

  // functions for listview
  componentDidMount() {}

  getDateString = date => {
    let chatdate = moment(date);

    var isPast = moment(chatdate);

    //2018-10-04T13:10:10.716Z
    if (moment(chatdate).isSame(moment(), "day")) {
      return chatdate.format("hh:mm A");
    } else {
      return chatdate.format("DD MMM YYYY");
    }
  };

  getTripDurationString = seconds => {
    var formatted = "";

    if (seconds < 60) {
      formatted = moment.utc(seconds * 1000).format("ss") + "s";
    } else {
      formatted =
        moment.utc(seconds * 1000).format("HH") +
        "h " +
        moment.utc(seconds * 1000).format("mm") +
        "m";
    }

    return formatted;
  };

  render() {
    const { navigate } = this.props.navigation;

    let tripData = this.props.navigation.state.params.tripData;

    if (tripData.reviews) {
      tripData.reviews.user_guide.guide_rating = tripData.reviews.guide_rating
        ? tripData.reviews.guide_rating
        : "0";
      tripData.reviews.user_guide.guide_feedback_text = tripData.reviews
        .guide_feedback_text
        ? tripData.reviews.guide_feedback_text
        : "";
      tripData.reviews.user_guide.fees_total = tripData.fees_total
        ? tripData.fees_total
        : "Not available";
    }

    return (
      <View style={styles.container}>
        <View style={styles.navigationbar}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.dispatch(backAction);
            }}
          >
            <Image
              resizeMode="cover"
              source={require("../../assets/images/back.png")}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <Text style={styles.centerText}>Transaction</Text>
          <View style={styles.rightView} />
        </View>
        <View style={styles.main_container}>
          <View style={styles.amount_view}>
            <Text style={styles.amount_txt}>${tripData.total_price}</Text>
          </View>
          <View style={styles.info_main_view}>
            {/* <View style={styles.location_info_view}>
                            <Image resizeMode='contain' source={require("../../assets/images/trip_item_location_icon.png")} style={styles.icon_image} />
                            <Text style={styles.row_text}>052 Maggio Road Apt. o16</Text>
                        </View> */}
            {/* <View style={styles.map_view}>
                        </View> */}
            <View style={styles.date_time_view}>
              <View style={styles.info_icon_row_view}>
                <Image
                  resizeMode="contain"
                  source={require("../../assets/images/calendar_icon.png")}
                  style={styles.small_info_icon}
                />
                <Text style={styles.info_icon_row_lb}>
                  {this.getDateString(tripData.date_booked_for)}
                </Text>
              </View>
              <View style={styles.info_icon_row_view_right}>
                <Image
                  resizeMode="contain"
                  source={require("../../assets/images/time_icon_black.png")}
                  style={styles.small_info_icon}
                />
                <Text style={styles.info_icon_row_lb}>
                  {this.getTripDurationString(tripData.duration_seconds)}
                </Text>
              </View>
            </View>
            {/* <View style={styles.card_view}>
                            <View style={styles.info_icon_row_view}>
                                <Image resizeMode='contain' source={require("../../assets/images/credit_card_black_ icon.png")} style={styles.small_info_icon} />
                                <Text style={styles.info_icon_row_lb}>Credit Card : Visa</Text>
                            </View>
                        </View> */}

            {tripData.reviews && (
              <View style={styles.personal_info_view}>
                <View style={styles.avatar_view}>
                  <Image
                    resizeMode="cover"
                    source={require("../../assets/images/defaultavatar.png")}
                    style={styles.avatar_img}
                  />
                  <View style={styles.rate_view} pointerEvents="none">
                    <Rating
                      ratingCount={5}
                      imageSize={8}
                      onFinishRating={this.ratingCompleted}
                    />
                  </View>
                </View>

                <View style={styles.info_view}>
                  <Text style={styles.name_text}>Brandon Delgado</Text>
                  <View style={styles.location_view}>
                    <Image
                      resizeMode="contain"
                      source={require("../../assets/images/location_maps.png")}
                      style={styles.location_icon}
                    />
                    <Text style={styles.location_text}>
                      {tripData.reviews.user_guide.guide_rating.username}
                    </Text>
                  </View>
                  <Text style={styles.description_text}>
                    Conventry City Guide...
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
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
    flexDirection: "column",
    backgroundColor: "white"
  },
  top_container: {
    width: width,
    height: 180,
    borderBottomWidth: 2,
    borderColor: "#31dd73"
  },
  navigationbar: {
    paddingTop: 20,
    height: 64,
    backgroundColor: "#31dd73",
    width: width,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
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
    width: width - 160
  },
  rightView: {
    marginRight: 20,
    height: 20,
    width: 20
  },

  // --- main container ---//
  main_container: {
    width: width,
    height: 1000,
    backgroundColor: "#f9fbfe"
  },
  amount_view: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 30
  },
  amount_txt: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold"
  },

  // --- info view --- //
  info_main_view: {
    marginLeft: 20,
    marginRight: 20,
    width: width - 40,
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.textBottomColor,
    borderRadius: 5
  },
  location_info_view: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: width - 40,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#c7c6ca"
  },
  icon_image: {
    height: 15,
    width: 15
  },
  row_text: {
    marginLeft: 15
  },
  map_view: {
    height: 100,
    width: width - 40,
    borderBottomWidth: 1,
    borderColor: "#c7c6ca"
  },
  date_time_view: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    width: width - 40,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#c7c6ca"
  },
  info_icon_row_view: {
    flexDirection: "row",
    alignItems: "center"
  },
  info_icon_row_view_right: {
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  info_icon_row_lb: {
    fontSize: 15,
    color: "#5e6265",
    marginLeft: 5,
    fontSize: 12
  },
  small_info_icon: {
    width: 15,
    height: 15
  },
  card_view: {
    height: 50,
    paddingHorizontal: 20,
    width: width - 40,
    borderBottomWidth: 1,
    borderColor: "#c7c6ca",
    flexDirection: "row",
    alignItems: "center"
  },
  personal_info_view: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    width: width - 40,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  avatar_view: {
    flexDirection: "column",
    alignItems: "center"
  },
  avatar_img: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent"
  },
  rate_view: {
    marginTop: 5,
    height: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  ratingbar: {
    height: 10,
    width: 50
  },
  rating_text: {
    marginLeft: 5,
    fontSize: 8,
    color: Colors.color999
  },
  info_view: {
    width: (width * 50) / 100,
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
    fontWeight: "bold"
  },
  location_text: {
    marginLeft: 5,
    fontSize: 12,
    color: Colors.color999,
    textAlign: "left",
    fontWeight: "bold"
  },
  description_text: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.color999,
    textAlign: "left"
  }
});

export default TransactionItemDetailScreen;
