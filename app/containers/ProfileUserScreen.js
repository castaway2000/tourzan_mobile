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
  Platform,
  FlatList
} from "react-native";

import { NavigationActions } from "react-navigation";
import Checkbox from "react-native-custom-checkbox";
import { Rating, AirbnbRating } from "react-native-ratings";
import ReadMore from "@expo/react-native-read-more-text";
import ApplyButton from "../components/ApplyButton";
import NavigationBar from "../components/NavigationBar";
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

//Webservice
import { bookGuide, profile } from "../actions";

//Utilities
import { Storage, isIphoneX } from "../global/Utilities";
import {
  Colors,
  API,
  Paymentrails,
  Braintree,
  DefaultFont
} from "../constants";

var { width, height } = Dimensions.get("window");

const backAction = NavigationActions.back({
  // key: 'WelcomeScreen'
});

const popToTopAction = NavigationActions.popToTop({});

class ProfileUserScreen extends React.Component {
  static navigationOptions = {
    title: "Maps",
    header: null,
    tabBarLabel: "Maps",
    isLoading: false,
    profileData: null,
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
    isIntestExtend: {
      false;
    }

    this.onContentSize = this.onContentSize.bind(this);

    this.state = {
      // for listview

      dataSource: [],

      // for ratingview
      starCount: 0.0,

      listViewHeight: 0
    };
  }

  // functions for listview
  componentDidMount() {
    this.onLoadProfileData();
  }

  //API Call get user profile
  onLoadProfileData() {
    let isGuide = this.props.userdata.user.isLoggedInAsGuide;

    this.setState({
      isLoading: true
    });

    var params = {
      userid: this.getUserID()
    };

    profile(params)
      .then(data => {
        if (data) {
          var ds = isGuide ? data.tourist_reviews : data.guide_data.reviews;

          ds = ds.filter(obj => {
            return isGuide
              ? obj.fields.guide_review_created
              : obj.fields.tourist_review_created;
          });

          this.setState({
            profileData: data,
            isLoading: false,
            dataSource: ds
          });
        }

        console.log("dataSource", data.tourist_reviews);
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  pressRow(rowData) {
    const { navigate } = this.props.navigation;

    // var newDs = [];
    // newDs = this.state.ds.slice();
    // this.setState({
    //     dataSource: this.state.dataSource.cloneWithRows(newDs)
    // })
  }

  onIntestExtention() {
    isIntestExtend = !isIntestExtend;
  }

  // Read More funtions
  _renderTruncatedFooter = handlePress => {
    return (
      <View style={styles.downarrow_view}>
        <TouchableOpacity onPress={handlePress}>
          <Image
            resizeMode="stretch"
            source={require("../assets/images/down_arrow.png")}
            style={styles.downarrow_btn}
          />
        </TouchableOpacity>
      </View>
    );
  };

  _renderRevealedFooter = handlePress => {
    return (
      <View style={styles.downarrow_view}>
        <TouchableOpacity onPress={handlePress}>
          <Image
            resizeMode="stretch"
            source={require("../assets/images/up_arrow.png")}
            style={styles.downarrow_btn}
          />
        </TouchableOpacity>
      </View>
    );
  };

  _handleTextReady = () => {
    // ...

    this.setState({ listViewHeight: this.state.contentHeight });
  };

  // interesting button functions
  _interestingBtnHandlePress() {
    console.log("Pressed!");
  }

  //#region Helper Func
  getUserID = () => {
    var { params } = this.props.navigation.state;

    return params.userid;
  };

  //#endregion
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

  _showRatingViewList = rating => {
    return (
      <Stars
        rating={rating}
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
        halfStar={<Icon name={"star-half"} style={[styles.starStyle]} />}
      />
    );
  };

  onContentSize(contentWidth, contentHeight) {
    this.setState({ listViewHeight: contentHeight });
  }

  //source={require("../assets/images/defaultavatar.png")}

  showProfilePic(item) {
    if (!item.fields || !item.fields.reviewers_picture) {
      return (
        <Image
          resizeMode="cover"
          source={require("../assets/images/defaultavatar.png")}
          style={styles.avatar_img}
        />
      );
    }
    return (
      <Image
        resizeMode="cover"
        source={{ uri: item.fields.reviewers_picture }}
        style={styles.avatar_img}
      />
    );
  }

  _showBookingButton = () => {
    var { params } = this.props.navigation.state;

    return (
      params &&
      params.shouldShowBookButtoon && (
        <TouchableOpacity
          onPress={() => this._onBooking()}
          style={styles.bookButtonView}
        >
          <Text style={styles.bookButtonText}>BOOK</Text>
        </TouchableOpacity>
      )
    );
  };

  _onBooking = () => {
    if (!this.props.currentlocation.lat || !this.props.currentlocation.long) {
      Alert.alert(
        "Tourzan",
        "Your current location is unavailable. Please try again."
      );
      return;
    }

    this.bookGuideWS();
  };

  renderRow = ({ item, index }) => {
    let isGuide = this.props.userdata.user.isLoggedInAsGuide;
    return (
      <TouchableHighlight
        style={styles.row_view}
        onPress={() => this.pressRow(item)}
        underlayColor="transparent"
      >
        <View style={styles.row}>
          <View style={styles.avatar_view}>{this.showProfilePic(item)}</View>
          <View style={styles.info_view}>
            <View style={styles.list_info_location_view}>
              <Text style={styles.list_info_name_text}>
                {item.fields.reviewers_name}
              </Text>

              <Text style={styles.list_info_time_text}>
                {this.getDateString(
                  isGuide
                    ? item.fields.guide_review_created
                    : item.fields.tourist_review_created
                )}
              </Text>
            </View>

            <Text style={styles.description_text_bold}>
              {isGuide
                ? item.fields.guide_feedback_name
                : item.fields.tourist_feedback_name}
            </Text>

            <Text style={styles.description_text}>
              {isGuide
                ? item.fields.guide_feedback_text
                : item.fields.tourist_feedback_text}
            </Text>
            <View style={styles.rate_view} pointerEvents="none">
              {this._showRatingViewList(
                parseFloat(
                  isGuide
                    ? item.fields.guide_rating
                    : item.fields.tourist_rating
                )
              )}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  //Show full name
  _showProfilePicture = () => {
    if (!this.state.profileData) {
      return (
        <Image
          resizeMode="cover"
          source={require("../assets/images/defaultavatar.png")}
          style={styles.avatar_icon}
        />
      );
    }

    let isGuide = this.props.userdata.user.isLoggedInAsGuide;

    let profilepicture = "";

    if (isGuide) {
      profilepicture = this.state.profileData.profile_picture;
    } else {
      profilepicture = this.state.profileData.guide_data.profile_image;
    }

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
    if (!this.state.profileData) {
      return <Text style={styles.name_text} />;
    }

    if (!this.state.profileData.guide_data) {
      return <Text style={styles.name_text} />;
    }

    let isGuide = this.props.userdata.user.isLoggedInAsGuide;

    let fullname = "";

    if (this.state.profileData.first_name) {
      fullname = this.state.profileData.first_name;
    }

    if (this.state.profileData.last_name) {
      fullname = fullname + " " + this.state.profileData.last_name;
    }

    if (!fullname) {
      fullname = isGuide ? "Guide" : "Tourist";
    }

    return <Text style={styles.name_text}>{fullname}</Text>;
  };

  _showOverview = () => {
    if (!this.state.profileData) {
      return <Text style={styles.name_text} />;
    }

    if (!this.state.profileData.guide_data) {
      return <Text style={styles.name_text} />;
    }

    let isGuide = this.props.userdata.user.isLoggedInAsGuide;

    let overviewText = "";

    if (isGuide) {
      overviewText = this.state.profileData.about_tourist;
    } else {
      overviewText = this.state.profileData.guide_data.guide_overview;
    }

    return (
      <ReadMore
        numberOfLines={3}
        renderTruncatedFooter={this._renderTruncatedFooter}
        renderRevealedFooter={this._renderRevealedFooter}
        onReady={this._handleTextReady}
      >
        <Text style={styles.overview_content_text}>{overviewText}</Text>
      </ReadMore>
    );
  };

  _showTagsView = () => {
    if (!this.state.profileData) {
      return <Text style={styles.name_text}>-</Text>;
    }

    if (this.state.profileData.interests) {
      let interests = this.state.profileData.interests;

      return (
        <View style={styles.tags}>
          {interests.map((i, k) => (
            // console.log("I",i)
            // <Button containerStyle={styles.interesting_container_btn} style={styles.interesting_btn} onPress={() => this._interestingBtnHandlePress()} >Attractions</Button>

            <TouchableOpacity
              key={i.toString()}
              style={styles.interesting_container_btn}
              onPress={() => this._interestingBtnHandlePress()}
            >
              <Text style={styles.interesting_btn}>{i}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      return <Text style={styles.name_text}>-</Text>;
    }
  };

  //Calculate average star from review
  _showRatingViewMain = () => {
    if (!this.state.profileData) {
      return (
        <Rating
          ratingCount={5}
          startingValue={0}
          readonly
          imageSize={15}
          onFinishRating={this.ratingCompleted}
        />
      );
    }

    if (!this.state.profileData.guide_data) {
      return (
        <Rating
          ratingCount={5}
          startingValue={0}
          readonly
          imageSize={15}
          onFinishRating={this.ratingCompleted}
        />
      );
    }

    let isGuide = this.props.userdata.user.isLoggedInAsGuide;

    let rating = isGuide
      ? this.state.profileData.tourist_rating
      : this.state.profileData.guide_data.guide_rating;

    return (
      <Rating
        ratingCount={5}
        startingValue={rating}
        readonly
        imageSize={15}
        onFinishRating={this.ratingCompleted}
      />
    );
  };

  ratingCompleted() {}

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

  showTotalRating() {
    if (!this.state.profileData) {
      return <Text style={styles.listview_title_text}> 0 Review </Text>;
    }

    let totalRating = 0;
    let isGuide = this.props.userdata.user.isLoggedInAsGuide;

    if (isGuide) {
      totalRating = this.state.dataSource.length;
    } else {
      totalRating = this.state.dataSource.length;
    }

    return (
      <Text style={styles.listview_title_text}> {totalRating} Reviews </Text>
    );
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
          <Text style={styles.centerText} />

          <TouchableOpacity
            style={styles.backButtomContainer}
            onPress={() => {
              this.navigate.navigate("UpdateProfile", {
                isFromRegistration: false,
                ProfileUpdated: this.profileUpdated
              });
            }}
          />
        </View>
        <ScrollView
          nestedScrollEnabled={true}
          style={styles.scrollview_container}
        >
          <View style={styles.content_container}>
            <View style={styles.main_container}>
              <View style={styles.name_view}>
                {this._showProfilePicture()}
                {this._showFullname()}
                {this._showRatingViewMain()}
                {this._showBookingButton()}
              </View>

              <View style={styles.overview_view}>
                <Text style={styles.overview_title_text}>Overview</Text>
                {this._showOverview()}
              </View>

              <View style={styles.interesting_view}>
                <View style={styles.devide_view} />

                <Text style={styles.interesting_title_text}>Interest</Text>
                {this._showTagsView()}

                <View style={styles.devide_view} />
              </View>
            </View>
            <View style={styles.listview_view}>
              <View style={styles.listview_title_view} pointerEvents="none">
                {this.showTotalRating()}
                {this._showRatingViewMain()}
              </View>
              <FlatList
                style={{
                  width: "100%",
                  flex: 1,
                  marginBottom: 16
                }}
                ref={ref => (this.listView = ref)}
                onContentSizeChange={this.onContentSize}
                data={this.state.dataSource}
                renderItem={this.renderRow}
              />
            </View>
          </View>
        </ScrollView>
        {this.showLoading()}
      </View>
    );
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

    var params = {
      token: this.props.userdata.token,
      userid: this.props.userdata.user.userid,
      guides: "[" + this.getUserID() + "]",
      latitude: this.props.currentlocation.lat,
      longitude: this.props.currentlocation.long,
      timelimit: storestate.tour.bookingdata.timeLimit,
      bookingtype: storestate.tour.bookingdata.isAutomatic
        ? "automatic"
        : "manual"
    };

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
}

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20
  },
  container: {
    flexDirection: "column",
    backgroundColor: "white",
    flex: 1
  },
  navigationbar: {
    height: 44,
    backgroundColor: "rgba(256, 256, 256, 0.8)",
    width: width,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    zIndex: 1,
    marginTop:
      Platform.OS == "ios" ? (isIphoneX() ? 44 : 20) : StatusBar.currentHeight
  },
  statusbar: {
    width: width,
    height:
      Platform.OS == "ios" ? (isIphoneX() ? 44 : 20) : StatusBar.currentHeight,
    backgroundColor: "rgba(256, 256, 256, 0.8)",
    position: "absolute",
    zIndex: 2
  },
  backButtomContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center"
  },
  backButton: {
    height: 15,
    width: 10,
    tintColor: "black"
  },
  rightButton: {
    height: 15,
    width: 15,
    tintColor: "black"
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
    marginRight: 20,
    height: 20,
    width: 20
  },
  scrollview_container: {
    backgroundColor: "transparent"
  },
  avatar_icon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: "#ddd",
    backgroundColor: "transparent"
  },
  content_container: {
    marginBottom: 4,
    width: width,
    marginTop:
      Platform.OS == "ios"
        ? isIphoneX()
          ? 88
          : 64
        : StatusBar.currentHeight + 44
  },
  main_container: {
    paddingHorizontal: 30,
    width: width
  },
  top_image_container: {
    width: width,
    height: 150,
    flexDirection: "column"
  },
  name_view: {
    alignItems: "center",
    justifyContent: "center"
  },
  name_text: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 17,
    color: "black",
    fontFamily: DefaultFont.textFont,
    fontWeight: "600"
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
    marginTop: 10
  },
  overview_title_text: {
    fontSize: 15,
    color: "black",
    fontFamily: DefaultFont.textFont,
    marginBottom: 8,
    fontWeight: "600"
  },
  overview_content_text: {
    marginTop: 12,
    fontFamily: DefaultFont.textFont,
    fontWeight: "100",
    fontSize: 12
  },
  downarrow_view: {
    marginTop: 5,
    alignItems: "center"
  },
  downarrow_btn: {
    width: 30,
    height: 15
  },
  devide_view: {
    marginTop: 15,
    height: 1,
    backgroundColor: "#ddd"
  },
  interesting_title_text: {
    marginTop: 5,
    fontSize: 15,
    color: "black",
    fontFamily: DefaultFont.textFont,
    fontWeight: "600"
  },
  btn_group_view: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center"
  },
  interesting_container_btn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    paddingTop: 5,
    marginRight: 8,
    borderRadius: 15,
    height: 30,
    backgroundColor: "#f4f5f8",
    borderColor: "#ddd",
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5
  },
  interesting_btn: {
    fontSize: 12,
    color: Colors.tintColor,
    fontWeight: "normal",
    fontFamily: DefaultFont.textFont
  },
  listview_view: {
    width: width,
    marginTop: 20
  },
  listview_title_view: {
    paddingHorizontal: 20,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f7f7f7"
  },
  listview_title_text: {
    color: "black",
    fontFamily: DefaultFont.textFont
  },
  listview_title_ratingbar: {
    backgroundColor: "#f7f7f7"
  },
  listview: {
    paddingHorizontal: 20
  },
  row_view: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: "white"
  },
  row: {
    alignItems: "center",
    flexDirection: "row"
  },
  avatar_view: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "flex-start"
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
  rating_text: {
    marginLeft: 5,
    fontSize: 8,
    color: Colors.color999
  },
  info_view: {
    flex: 0.8,
    marginLeft: 10,
    flexDirection: "column",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 20
  },
  list_info_location_view: {
    marginTop: 5,
    height: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  list_info_time_text: {
    fontSize: 12,
    color: Colors.color999,
    fontFamily: DefaultFont.textFont
  },
  list_info_name_text: {
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
  description_text: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.color999,
    textAlign: "left",
    fontFamily: DefaultFont.textFont
  },
  description_name: {
    marginTop: 5,
    fontSize: 14,
    color: Colors.colorBlack,
    textAlign: "left",
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
  tags: {
    marginTop: 4,
    flexDirection: "row",
    alignSelf: "auto",
    flexWrap: "wrap"
  },
  starStyle: {
    color: "#f3bc17",
    backgroundColor: "transparent"
  },
  emptyStarStyle: {
    color: "#f3bc17"
  },
  bookButtonView: {
    width: 100,
    height: 36,
    backgroundColor: Colors.main,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginTop: 8
  },
  bookButtonText: {
    color: "#ffffff",
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

export default connect(mapStateToProps)(ProfileUserScreen);
