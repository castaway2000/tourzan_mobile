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
  ListView,
  Platform,
  FlatList
} from "react-native";

import { Rating, AirbnbRating } from "react-native-ratings";
import { NavigationActions } from "react-navigation";
import IconBadge from "react-native-icon-badge";
import NavigationBar from "../components/NavigationBar";
import moment from "moment";

//Store
import { connect } from "react-redux";
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser, updateChat } from "../actions/userActions";

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
import {
  getChatList,
  getTourList,
  updateClockInOutStatus,
  endTrip,
  cancelTrip,
  declineTrip,
  acceptTrip,
  updateTrip,
  extendTime,
  usermixins,
  getChatListGuideRepresentation,
  getChatListRepresentation
} from "../actions";

var { width, height } = Dimensions.get("window");

class ChatScreen extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: "Chat",
    tabBarIcon: ({ tintColor }) => (
      <Image
        resizeMode="contain"
        source={require("../assets/images/Chat_Bottom_icon.png")}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    )
  };

  constructor(props) {
    super(props);

    this.state = {
      // for ratingview
      starCount: 0.0,
      isFetching: false,
      shouldShowEmptyState: false
    };

    this.chatArrayHolder = [];
  }

  _handleResults(results) {
    this.setState({ results });
  }

  onRefresh() {
    console.log("Refreshing.....");

    this.setState({ isFetching: true });
    this.loadChatList();
  }

  // function for ratingview
  ratingCompleted(rating) {
    console.log("Rating is: " + rating);
  }

  // functions for listview
  componentDidMount() {
    this.loadChatList();
  }

  loadChatList = () => {
    if (this.props.userdata.user.isLoggedInAsGuide) {
      getChatListGuideRepresentation()
        .then(data => {
          this.setState({
            isLoading: false
          });
          console.log("getChatListGuideRepresentation data-->", data);

          if (data.length && data.length > 0) {
            store.dispatch(updateChat(data.reverse()));

            //To add default profile picture
            for (let i = 0; i < data.length; i++) {
              data[i].pic = require("../assets/images/defaultavatar.png");

              //To remove HTML From message
              for (let index = 0; index < data[i].messages.length; index++) {
                const element = data[i].messages[index];
                const regex = /(<([^>]+)>)/gi;
                data[i].messages[index].message = element.message.replace(
                  regex,
                  ""
                );
              }

              this.loadUserNameProfilePics(data, i);
            }
            this.setState({ shouldShowEmptyState: false });
          } else {
            this.setState({ shouldShowEmptyState: true });
          }
          this.setState({ isFetching: false });
        })
        .catch(err => {
          this.setState({
            isLoading: false,
            isFetching: false
          });
          alert(err);
        });
    } else {
      getChatListRepresentation()
        .then(data => {
          this.setState({
            isLoading: false
          });
          console.log("getChatListRepresentation data-->", data);

          if (data.length && data.length > 0) {
            store.dispatch(updateChat(data.reverse()));

            //To add default profile picture
            for (let i = 0; i < data.length; i++) {
              data[i].pic = require("../assets/images/defaultavatar.png");

              //To remove HTML From message
              for (let index = 0; index < data[i].messages.length; index++) {
                const element = data[i].messages[index];
                const regex = /(<([^>]+)>)/gi;
                data[i].messages[index].message = element.message.replace(
                  regex,
                  ""
                );
              }

              this.loadUserNameProfilePics(data, i);
            }
            this.setState({ shouldShowEmptyState: false });
          } else {
            this.setState({ shouldShowEmptyState: true });
          }
          this.setState({ isFetching: false });
        })
        .catch(err => {
          this.setState({
            isLoading: false,
            isFetching: false
          });
          alert(err);
        });
    }
  };

  loadUserNameProfilePics = (profiles, index) => {
    //let params = {id: this.props.userdata.isGuide ? profiles[index].guide : profiles[index].tourist , usertype: this.props.userdata.isGuide ? 'guide' : 'tourist'}

    let opponmentid = 0;
    var user = "";

    if (this.props.userdata.user.isLoggedInAsGuide) {
      opponmentid = profiles[index].tourist;
      user = "tourist";
    } else {
      opponmentid = profiles[index].guide;
      user = "guide";
    }

    let params = {
      id: opponmentid,
      usertype: user
    };

    usermixins(params)
      .then(data => {
        var newArray = profiles.slice();

        if (data.pic) {
          newArray[index].pic = { uri: data.pic };
          newArray[index].picurl = data.pic;
        } else {
          newArray[index].pic = require("../assets/images/defaultavatar.png");
          newArray[index].picurl = data.pic;
        }

        newArray[index].opfirstname = data.first_name;
        newArray[index].oplastname = data.last_name;

        newArray[index].topic =
          (data.first_name ? data.first_name : "") +
          " " +
          (data.last_name ? data.last_name : "");

        //Timer to reduce cpu load
        //Because this method calls many times
        if (this.setArrayDelay) {
          clearTimeout(this.setArrayDelay);
        }

        this.setArrayDelay = setTimeout(() => {
          this.setArrayDelay = null;
          store.dispatch(updateChat(newArray));
        }, 2000);

        this.chatArrayHolder = newArray.slice(0);
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  };

  setSearchText(event) {
    let searchText = event.nativeEvent.text;
    console.log("debug", searchText);
    this.setState({ searchText });

    let filteredData = this.filterNotes(searchText, this.chatArrayHolder);

    store.dispatch(updateChat(filteredData));
  }

  filterNotes(searchText, notes) {
    let text = searchText.toLowerCase();

    let filteredData = notes.filter(note => {
      return (note.topic.toLowerCase().indexOf(text) != -1) || (note.messages);
    });

    return filteredData;
  }

  pressRow(rowData, index) {
    const { navigate } = this.props.navigation;

    navigate("ChatRoom", { index: index });
  }

  getChatDate = rowData => {
    if (rowData.messages && rowData.messages.length > 0) {
      let chatdate = moment(rowData.messages[0].created);

      if (moment(chatdate).isSame(moment(), "day")) {
        return chatdate.format("hh:mm A");
      } else if (moment(chatdate).isSame(moment(), "year")) {
        return chatdate.format("DD MMM");
      } else {
        return chatdate.format("DD MMM YYYY");
      }
    }

    return " ";
  };

  getMessagesText = rowData => {
    if (rowData.messages && rowData.messages.length > 0) {
      return rowData.messages[0].message;
    }

    return " ";
  };

  showEmptyState() {
    return (
      <View style={styles.emptyStateContainer}>
        <Image
          resizeMode="contain"
          source={require("../assets/images/message-icons.png")}
          style={styles.emptyStateImage}
        />
        <Text style={styles.emptyStateBoldText}>
          {"No previous chat found."}
        </Text>
        <Text style={styles.emptyStateNormalText}>
          {"When guide booked new chat with \n guide will be displayed here."}
        </Text>
      </View>
    );
  }

  renderItem(rowData) {
    let { item, index } = rowData;

    return (
      <TouchableHighlight
        style={styles.row_view}
        onPress={() => this.pressRow(item, index)}
        underlayColor="#ddd"
      >
        <View style={styles.row}>
          <View style={styles.avatar_view}>
            <Image
              resizeMode="cover"
              source={item.pic}
              style={styles.avatar_img}
            />
          </View>
          <View style={styles.info_view}>
            <Text style={styles.name_text}>{item.topic}</Text>
            <Text
              numberOfLines={2}
              ellipsizeMode={"tail"}
              style={styles.description_text}
            >
              {this.getMessagesText(item)}
            </Text>
          </View>
          <View style={styles.row_right_view}>
            <Text style={styles.right_text}>{this.getChatDate(item)}</Text>
            <View style={{ marginTop: 5 }}>
              <IconBadge
                MainElement={
                  <View
                    style={{
                      backgroundColor: "#fff",
                      width: 0,
                      height: 0,
                      margin: 0
                    }}
                  />
                }
                BadgeElement={
                  <Text
                    style={{ color: "#fff", fontFamily: DefaultFont.textFont }}
                  >
                    {0}
                  </Text>
                }
                IconBadgeStyle={{
                  position: "relative",
                  width: 20,
                  height: 20,
                  backgroundColor: "#31dd73"
                }}
                Hidden={true}
              />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusbar} />
        <View style={styles.top_container}>
          <View style={styles.backButton} />
          <Text style={styles.centerText}>MESSAGES</Text>
          <View style={styles.rightView} />
        </View>
        <View style={styles.list_view_container}>
          <View style={styles.search_header_container}>
            <View style={styles.search_hedear_row_view}>
              <Image
                resizeMode="cover"
                source={require("../assets/images/search_white_icon.png")}
                style={styles.search_header_search_icon}
              />
              <TextInput
                style={styles.search_header_text}
                underlineColorAndroid="transparent"
                placeholder="Search chat history..."
                placeholderTextColor="white"
                value={this.state.searchText}
                onChange={this.setSearchText.bind(this)}
              />
            </View>
          </View>
          <View style={Platform.OS === "ios" ? { flex: 1 } : null}>
            {this.props.chats.length < 1 &&
              this.state.shouldShowEmptyState &&
              this.showEmptyState()}

            {this.props.chats.length > 0 && (
              <FlatList
                data={this.props.chats}
                removeClippedSubviews={false}
                extraData={this.state}
                renderItem={this.renderItem.bind(this)}
                ItemSeparatorComponent={(sectionId, rowId) => (
                  <View key={rowId} style={styles.separator} />
                )}
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFetching}
                //renderHeader={() => <SearchListHeader />}
              />
            )}
          </View>
        </View>
      </View>
    );
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
  top_container: {
    marginTop: Platform.OS == "ios" ? (isIphoneX() ? 44 : 20) : 0,
    height: 44,
    backgroundColor: Colors.main,
    width: width,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  icon: {
    width: 20,
    height: 20
  },
  backButton: {
    marginRight: 20,
    height: 20,
    width: 20
  },
  centerText: {
    color: "#fff",
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
  list_view_container: {
    marginTop: 1,
    height: height - 100,
    width: width
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ddd"
  },
  text_color: {
    color: "#000"
  },
  search_header_container: {
    padding: 10,
    // flexDirection: 'row',
    alignItems: "center",
    backgroundColor: "#31dd73"
  },
  search_hedear_row_view: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20bb5c",
    width: width - 80,
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 7
  },
  search_header_search_icon: {
    height: 15,
    width: 15
  },
  search_header_text: {
    marginLeft: 10,
    paddingTop: 0,
    paddingBottom: 0,
    height: 30,
    width: width - 100,
    color: "white",
    fontSize: 12,
    fontFamily: DefaultFont.textFont
  },
  row_view: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
    borderRadius: 5
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
    padding: 5,
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "transparent"
  },
  info_view: {
    width: width * 0.5,
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
    fontWeight: "bold"
  },
  description_text: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.color999,
    textAlign: "left",
    fontFamily: DefaultFont.textFont
  },
  row_right_view: {
    width: 60,
    flexDirection: "column",
    alignItems: "center"
  },
  right_text: {
    fontSize: 10,
    fontFamily: DefaultFont.textFont
  },
  badge_icon: {
    height: 10,
    width: 10
  },

  //Empty state
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    justifyContent: "center"
  },
  emptyStateImage: {
    width: 80,
    height: 80,
    opacity: 0.1
  },
  emptyStateBoldText: {
    width: "100%",
    marginTop: 12,
    textAlign: "center",
    color: "#bbbbbb",
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  emptyStateNormalText: {
    width: "100%",
    marginTop: 12,
    textAlign: "center",
    color: "#bbbbbb",
    fontFamily: DefaultFont.textFont
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation,
    chats: store.user.chats
  };
};

export default connect(mapStateToProps)(ChatScreen);
