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

//Webservice
import {
  profile,
  getReviewTouristRepresentation,
  getReviewGuideRepresentation
} from "../actions";

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

var { width, height } = Dimensions.get("window");

const onButtonPress = () => {
  Alert.alert("Button has been pressed!");
};
const backAction = NavigationActions.back({
  // key: 'WelcomeScreen'
});

class ProfileScreen extends React.Component {
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
      reviewsArray: [],

      // for ratingview
      starCount: 0.0,

      listViewHeight: 0
    };

    this.navigate = this.props.navigation;
  }

  // functions for listview
  componentDidMount() {
    this.onLoadProfileData();
  }

  //API Call get user profile
  onLoadProfileData() {
    this.setState({
      isLoading: true
    });

    var params = {
      userid: this.props.userdata.user.userid
    };

    profile(params)
      .then(data => {
        if (data) {
          this.setState({
            profileData: data,
            isLoading: false
          });

          this.getReviewWS();
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  //API Call get user profile
  getReviewWS() {
    if (this.props.userdata.user.isLoggedInAsGuide) {
      getReviewGuideRepresentation()
        .then(data => {
          if (data) {
            var result = data.filter(obj => {
              return obj.tourist_review_created;
            });

            this.setState({
              reviewsArray: result,
              isLoading: false
            });
          }
        })
        .catch(err => {
          this.setState({
            isLoading: false
          });
          alert(err);
        });
    } else {
      getReviewTouristRepresentation()
        .then(data => {
          if (data) {
            var result = data.filter(obj => {
              return obj.guide_review_created;
            });

            this.setState({
              reviewsArray: result,
              isLoading: false
            });
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

  pressRow(rowData) {
    const { navigate } = this.props.navigation;
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
  };

  // interesting button functions
  _interestingBtnHandlePress() {
    console.log("Pressed!");
  }

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

  renderRow = ({ item, index }) => {
    let isGuide = this.props.userdata.user.isLoggedInAsGuide;

    return (
      <TouchableHighlight
        style={styles.row_view}
        onPress={() => this.pressRow(item)}
        underlayColor="transparent"
      >
        <View style={styles.row}>
          <View style={styles.avatar_view}>
            <Image
              resizeMode="cover"
              source={{
                uri: isGuide
                  ? item.user_tourist[0].tourist_profile_image
                  : item.user_tourist[0].guide_profile_image
              }}
              style={styles.avatar_img}
            />
          </View>
          <View style={styles.info_view}>
            <View style={styles.list_info_location_view}>
              <Text style={styles.list_info_name_text}>
                {isGuide
                  ? item.user_tourist[0].username
                  : item.user_guide.username}
              </Text>
              <Text style={styles.list_info_time_text}>
                {this.getDateString(
                  isGuide
                    ? item.tourist_review_created
                    : item.guide_review_created
                )}
              </Text>
            </View>
            <Text style={styles.description_name}>
              {isGuide ? item.tourist_feedback_name : item.guide_feedback_name}
            </Text>
            <Text style={styles.description_text}>
              {isGuide ? item.tourist_feedback_text : item.guide_feedback_text}
            </Text>
            <View style={styles.rate_view} pointerEvents="none">
              {this._showRatingViewList(
                parseFloat(isGuide ? item.tourist_rating : item.guide_rating)
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
      profilepicture = this.state.profileData.guide_data.profile_image;
    } else {
      profilepicture = this.state.profileData.profile_picture;
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
      overviewText = this.state.profileData.guide_data.guide_overview;
    } else {
      overviewText = this.state.profileData.about_tourist;
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
            <TouchableOpacity
              key={i}
              style={styles.interesting_container_btn}
              onPress={() => this._interestingBtnHandlePress()}
            >
              <Text style={styles.interesting_btn}>{i}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      return <Text style={styles.name_text} />;
    }
  };

  ratingCompleted(rating) {

  }

  //Calculate average star from review
  _showRatingViewMain = () => {
    let isGuide = this.props.userdata.user.isLoggedInAsGuide;

    var totalRatings = 0.0;

    for (let i = 0; i < this.state.reviewsArray.length; i++) {
      const review = this.state.reviewsArray[i];

      totalRatings =
        totalRatings +
        (isGuide
          ? parseFloat(review.tourist_rating)
          : parseFloat(review.guide_rating));
    }

    var rating = 0;
    if (this.state.reviewsArray.length > 0) {
      rating = totalRatings / this.state.reviewsArray.length;
    }

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

  //Callback from edit profile
  profileUpdated = () => {
    
  };

  _keyExtractor = (item, index) => item.id.toString();

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
          >
            <Image
              resizeMode="cover"
              source={require("../assets/images/edit-icon.png")}
              style={styles.rightButton}
            />
          </TouchableOpacity>
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
                <Text style={styles.listview_title_text}>
                  {this.state.reviewsArray.length} Reviews
                </Text>
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
                data={this.state.reviewsArray}
                renderItem={this.renderRow}
                keyExtractor={this._keyExtractor}
              />
            </View>
          </View>
        </ScrollView>

        {this.showLoading()}
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
    marginTop: (Platform.OS == "ios" ? (isIphoneX() ? 44 : 20) : 0) + 44
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
    marginTop: 10
  },
  overview_title_text: {
    fontSize: 15,
    color: "black",
    fontFamily: DefaultFont.textFont,
    marginBottom: 8
  },
  overview_content_text: {
    marginTop: 12,
    fontFamily: DefaultFont.textFont
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
    marginTop: 8,
    height: 1,
    backgroundColor: "#ddd"
  },
  interesting_title_text: {
    marginTop: 5,
    fontSize: 15,
    color: "black",
    fontFamily: DefaultFont.textFont
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
    flexDirection: "row",
    alignSelf: "stretch",
    margin: 5,
    flexWrap: "wrap"
  },
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

export default connect(mapStateToProps)(ProfileScreen);
