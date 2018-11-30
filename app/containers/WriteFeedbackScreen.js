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
  TouchableHighlight,
  ImageBackground,
  ActivityIndicator,
  Platform
} from "react-native";

import { NavigationActions } from "react-navigation";
import Checkbox from "react-native-custom-checkbox";
import { Rating, AirbnbRating } from "react-native-ratings";
import ReadMore from "@expo/react-native-read-more-text";
import Button from "react-native-button";
import ApplyButton from "../components/ApplyButton";
import NavigationBar from "../components/NavigationBar";
import { profile } from "../actions";
import { Marker } from "react-native-maps/lib/components/MapView";
import moment from "moment";
import Stars from "react-native-stars";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

//Store
import { connect } from "react-redux";
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser } from "../actions/userActions";

//Utilities
import { Storage, isIphoneX } from "../global/Utilities";
import {
  Colors,
  API,
  Paymentrails,
  Braintree,
  DefaultFont
} from "../constants";

//Webservice
import { addReview } from "../actions";

var { width, height } = Dimensions.get("window");

const onButtonPress = () => {
  Alert.alert("Button has been pressed!");
};
const backAction = NavigationActions.back({
  // key: 'WelcomeScreen'
});

const resetRootAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Home" })],
  key: null
});

class WriteFeedbackScreen extends React.Component {
  static navigationOptions = {
    title: "Maps",
    header: null,
    tabBarLabel: "Maps",
    isLoading: false,
    tabBarIcon: ({ tintColor }) => (
      <Image
        resizeMode="contain"
        source={require("../assets/images/Maps_Bottom_icon.png")}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    )
  };

  constructor(props) {
    super(props);

    this.state = {
      // for ratingview
      starCount: 0,
      feedbacktext: "",
      titleText: "",
      height: 0
    };
  }

  // functions for listview
  componentDidMount() {}

  //Show full name
  _showProfilePicture = () => {
    let profileData = this.props.navigation.state.params.profileData;

    if (!profileData) {
      return (
        <Image
          resizeMode="cover"
          source={require("../assets/images/defaultavatar.png")}
          style={styles.avatar_icon}
        />
      );
    }

    let profilepicture = "";

    profilepicture = profileData.pic;

    if (profilepicture) {
      return (
        <Image
          resizeMode="cover"
          source={{ uri: profilepicture }}
          style={styles.avatar_icon}
        />
      );
    } else {
      return (
        <Image
          resizeMode="cover"
          source={require("../assets/images/defaultavatar.png")}
          style={styles.avatar_icon}
        />
      );
    }
  };

  //Show full name
  _showFullname = () => {
    let profileData = this.props.navigation.state.params.profileData;

    if (!profileData) {
      return <Text style={styles.name_text} />;
    }

    let fullname = "";

    if (profileData.first_name) {
      fullname = profileData.first_name;
    }

    if (profileData.last_name) {
      fullname = fullname + " " + profileData.last_name;
    }

    return <Text style={styles.name_text}>{fullname}</Text>;
  };

  //Calculate average star from review
  _showRatingViewMain = () => {
    let profileData = this.props.navigation.state.params.profileData;
    let tripData = this.props.navigation.state.params.tripData;
    let ratings = this.props.navigation.state.params.ratings;

    return (
      <Rating
        ratingCount={5}
        startingValue={ratings}
        readonly
        imageSize={15}
        onFinishRating={this.ratingCompleted}
      />
    );
  };

  //Show load more.
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

  onAddRating() {
    if (this.state.titleText.length < 1) {
      Alert.alert("Tourzan", "Please add review title.");
      return;
    }

    if (this.state.feedbacktext.length < 1) {
      Alert.alert("Tourzan", "Please add review.");
      return;
    }

    this.addReviewWS();
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View resizeMode="cover" style={styles.top_container}>
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
            <Text style={styles.centerText} />
            <View style={styles.rightView}>
              <TouchableOpacity onPress={() => this.onAddRating()}>
                <Text style={styles.rightView}>DONE</Text>
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity onPress={() => { navigate('ProfileCharRoom') }}>
                            <Image resizeMode='cover' source={require("../assets/images/profile_chat_icon.png")} style={styles.rightView} />
                        </TouchableOpacity> */}
          </View>
        </View>
        <ScrollView style={styles.scrollview_container}>
          <View style={styles.content_container}>
            <View style={styles.main_container}>
              <View pointerEvents="none" style={styles.name_view}>
                {this._showFullname()}
                {this._showRatingViewMain()}
              </View>
              {/* <View style={styles.location_view}>
                <Image
                  resizeMode="contain"
                  source={require("../assets/images/location_maps.png")}
                  style={styles.location_icon}
                />
                <Text style={styles.location_text}>Not Avaible</Text>
              </View> */}
              <View style={styles.overview_view}>
                <Text style={styles.overview_title_text}>
                  Let us know how it went
                </Text>
              </View>
            </View>
            <View style={styles.line} />
          </View>

          <TextInput
            placeholder={"Title"}
            onChangeText={text => {
              this.setState({ titleText: text });
            }}
            style={styles.text_input}
            value={this.state.titleText}
            underlineColorAndroid="transparent"
          />
          <View style={styles.line} />
          <TextInput
            multiline={true}
            placeholder={"Write here..."}
            onChangeText={text => {
              this.setState({ feedbacktext: text });
            }}
            onContentSizeChange={event => {
              this.setState({ height: event.nativeEvent.contentSize.height });
            }}
            style={[
              styles.text_input,
              { height: Math.max(35, this.state.height) }
            ]}
            value={this.state.text}
            underlineColorAndroid="transparent"
          />
        </ScrollView>
        {this._showProfilePicture()}
        {this.showLoading()}
      </View>
    );
  }

  addReviewWS() {
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

    // this.props.userdata.user.isLoggedInAsGuide ? this.props.bookingdata.touristid : this.props.bookingdata.guideid,

    let profileData = this.props.navigation.state.params.profileData;
    let tripData = this.props.navigation.state.params.tripData;
    let ratings = this.props.navigation.state.params.ratings;

    this.setState({
      isLoading: true
    });

    var { dispatch } = this.props;

    var params = {
      order: this.props.bookingdata.orderid,
      is_tourist_feedback: this.props.userdata.user.isLoggedInAsGuide
        ? "True"
        : "False",
      is_guide_feedback: !this.props.userdata.user.isLoggedInAsGuide
        ? "True"
        : "False"
    };

    if (!this.props.userdata.user.isLoggedInAsGuide) {
      params.tourist_feedback_name = this.state.titleText;
      params.tourist_feedback_text = this.state.feedbacktext;
      params.tourist_rating = this.state.starCount;
    } else {
      params.guide_feedback_name = this.state.titleText;
      params.guide_feedback_text = this.state.feedbacktext;
      params.guide_rating = this.state.starCount;
    }

    addReview(params)
      .then(data => {
        this.setState({
          isLoading: false
        });

        if (data.detail) {
          Alert.alert(
            "Tourzan",
            data.detail,
            [
              {
                text: "OK",
                onPress: () => {
                  this.props.navigation.pop();
                  this.props.navigation.pop();
                }
              }
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert("Tourzan", data);
        }
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
    height: 100,
    backgroundColor: Colors.main
  },
  navigationbar: {
    paddingTop:
      Platform.OS == "ios" ? (isIphoneX() ? 44 : 20) : StatusBar.currentHeight,
    height: 64,
    backgroundColor: "transparent",
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
    color: "#000",
    textAlign: "center",
    fontSize: 17,
    width: width - 160,
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  rightView: {
    marginRight: 8,
    height: 20,
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    fontFamily: DefaultFont.textFont
  },
  scrollview_container: {
    // flex:1,
    paddingTop: 20,
    height: height - 100
  },
  avatar_icon: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 60,
    marginLeft: 30,
    backgroundColor: "white",
    backgroundColor: "transparent"
  },
  content_container: {
    marginTop: 30,
    width: width
  },
  main_container: {
    paddingHorizontal: 30,
    width: width
  },
  name_view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  name_text: {
    fontSize: 17,
    color: "black",
    fontFamily: DefaultFont.textFont
  },
  location_view: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  location_icon: {
    width: 15,
    height: 15
  },
  overview_view: {
    marginTop: 40
  },
  overview_title_text: {
    fontSize: 17,
    color: "black",
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
  starStyle: {
    color: "#f3bc17",
    backgroundColor: "transparent"
  },
  emptyStarStyle: {
    color: "#f3bc17"
  },
  line: {
    marginTop: 14,
    borderBottomColor: "lightgray",
    borderBottomWidth: 1
  },
  text_input: {
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    maxHeight: 80,
    fontFamily: DefaultFont.textFont,
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

export default connect(mapStateToProps)(WriteFeedbackScreen);
