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
  TouchableHighlight,
  Platform,
  FlatList
} from "react-native";

import { Rating, AirbnbRating } from 'react-native-ratings';
import { NavigationActions } from "react-navigation";
import NavigationBar from "../../components/NavigationBar";
import { getGuideList } from "../../actions";

//FCM
import FCM, { NotificationActionType } from "react-native-fcm";
import {
  registerKilledListener,
  registerAppListener
} from "../../global/Firebase/Listeners";
import firebaseClient from "../../global/Firebase/FirebaseClient";

//Store
import { connect } from "react-redux";
import { store } from "../../store/index";

//Actions
import { updatebooking } from "../../actions/bookingActions";
import { updateuser } from "../../actions/userActions";

//Utilities
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
  previousGuideList,
  getOrdersGuideRepresentation,
  getOrdersTouristRepresentation,
  usermixins
} from "../../actions";

const resetRootAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Welcome" })],
  key: null
});

var { width, height } = Dimensions.get("window");

class GuideScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      guideList: [],
      starCount: 3.5,
      message: ""
    };

    this.navigate = this.props.navigation;
  }
  componentDidMount() {
    this.previousGuideListWS();
  }

  previousGuideListWS() {
    if (this.props.userdata.user.isLoggedInAsGuide) {
      getOrdersGuideRepresentation()
        .then(data => {
          console.log("getOrdersGuideRepresentation", data);

          if (data && data.length > 0) {
            data.sort(function(a, b) {
              return new Date(b.date_booked_for) - new Date(a.date_booked_for);
            });

            this.setState({ guideList: data, message: "" });

            for (let i = 0; i < data.length; i++) {
              this.loadUserNameProfilePics(i);
            }
          } else {
            this.setState({ guideList: [], message: "No data found." });
          }
        })
        .catch(err => {
          alert(err);
        });
    } else {
      getOrdersTouristRepresentation()
        .then(data => {
          console.log("getOrdersTouristRepresentation", data);

          if (data && data.length > 0) {
            data.sort(function(a, b) {
              return new Date(b.date_booked_for) - new Date(a.date_booked_for);
            });

            this.setState({ guideList: data, message: "" });

            for (let i = 0; i < data.length; i++) {
              this.loadUserNameProfilePics(i);
            }
          } else {
            this.setState({ guideList: [], message: "No data found." });
          }
        })
        .catch(err => {
          alert(err);
        });
    }
  }

  loadUserNameProfilePics = index => {
    let opponmentid = 0;
    let usertype = "";

    if (!this.props.userdata.user.isLoggedInAsGuide) {
      opponmentid = this.state.guideList[index].guide;
      usertype = "guide";
    } else {
      opponmentid = this.state.guideList[index].tourist;
      usertype = "tourist";
    }

    let params = {
      id: opponmentid,
      usertype: usertype
    };

    usermixins(params)
      .then(data => {
        console.log("usermixins:", data);

        let name = "";

        if (data.first_name) {
          name = data.first_name;
        }

        if (data.last_name) {
          name = name + " " + data.last_name;
        }

        if (!name) {
          name = data.username;
        }

        this.state.guideList[index].username = name;

        this.setState({ guideList: this.state.guideList });
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  };

  // function for ratingview
  ratingCompleted(rating) {
    console.log("Rating is: " + rating);
  }

  pressRow(rowData) {
    // this.navigate.navigate('GuideItemDetail');
    // this.props.navigation.navigate('GuideItemDetail', { guideData: rowData });

    const { navigate } = this.props.navigation;

    navigate("Profile", { userid: rowData.pk });
  }

  renderRow = ({ item, index }) => {
    return (
      <TouchableHighlight
        style={styles.row_view}
        onPress={() => this.pressRow(item)}
        underlayColor="#ddd"
        key={index}
      >
        <View style={styles.row}>
          <View style={styles.avatar_view}>
            <Image
              resizeMode="cover"
              source={
                item.guide_profile_image
                  ? { uri: item.guide_profile_image }
                  : require("../../assets/images/defaultavatar.png")
              }
              style={styles.avatar_img}
              defaultSource={require("../../assets/images/user_placeholder.png")}
            />
            <View style={styles.rate_view} pointerEvents="none">
              <Text style={styles.rating_text}>
                Rating: {item.rating_guide}
              </Text>
            </View>
          </View>
          <View style={styles.info_view}>
            <Text style={styles.name_text}>{item.username}</Text>
            <View style={styles.location_view}>
              {/* <Image resizeMode='contain' source={require("../../assets/images/banknote.png")} style={styles.location_icon} /> */}
              {/* <Text style={styles.location_text}>Amount: </Text> */}
              <Text style={styles.location_text}>${item.fees_total}</Text>
            </View>
            <Text style={styles.description_text} numberOfLines={3}>
              {item.guide_feedback_text}
            </Text>
          </View>
          <TouchableOpacity style={styles.arrow_view}>
            <Image
              resizeMode="contain"
              source={require("../../assets/images/item_arrow.png")}
              style={styles.arrow_btn}
            />
          </TouchableOpacity>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {/* <TouchableOpacity style={styles.sortBtn}>
                    <Image source={require('../../assets/images/ic_tab_settings.png')} style={styles.sortImg} />
                </TouchableOpacity> */}

        {this.state.guideList.length < 1 && (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              width: "100%"
            }}
          >
            <Text
              style={{
                width: "100%",
                textAlign: "center",
                fontFamily: DefaultFont.textFont
              }}
            >
              {this.state.message}
            </Text>
          </View>
        )}

        {this.state.guideList.length > 0 && (
          <ScrollView style={styles.mTableView}>
            {/* {this.showGuideList()} */}

            {this.state.guideList.length < 1 && (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%"
                }}
              >
                <Text
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontFamily: DefaultFont.textFont
                  }}
                >
                  {this.state.message}
                </Text>
              </View>
            )}

            {this.state.guideList.length > 0 && (
              <FlatList
                data={this.state.guideList}
                renderItem={this.renderRow}
                renderSeparator={(sectionId, rowId) => (
                  <View key={rowId} style={styles.separator} />
                )}
                extraData={this.state}
                showsVerticalScrollIndicator={true}
              />
            )}
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent"
  },
  sortBtn: {
    width: 40,
    alignItems: "center"
  },
  mTableView: {
    width: width - 50
  },
  sortImg: {
    marginTop: 25,
    width: 22,
    height: 22,
    resizeMode: "contain"
  },
  icon: {
    width: 20,
    height: 20
  },
  text_color: {
    color: "#000"
  },
  row_view: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
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
    // flexDirection:'row',
    alignItems: "flex-start"
  },
  ratingbar: {
    height: 10,
    width: 50
  },
  rating_text: {
    marginLeft: 5,
    fontSize: 10,
    color: Colors.color999,
    fontFamily: DefaultFont.textFont
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
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  location_text: {
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
  arrow_view: {
    width: (width * 10) / 100,
    alignItems: "flex-end"
  },
  arrow_btn: {
    width: 10,
    height: 15
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(GuideScreen);
