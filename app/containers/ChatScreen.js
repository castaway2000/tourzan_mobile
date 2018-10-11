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

import Rating from "react-native-ratings";
import { NavigationActions } from "react-navigation";
import IconBadge from "react-native-icon-badge";
import { Colors } from "../constants";
import NavigationBar from "../components/NavigationBar";
import moment from "moment";

//Store
import { connect } from "react-redux";
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser } from "../actions/userActions";

//Utilities
import { Storage, isIphoneX } from "../global/Utilities";

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
  usermixins
} from "../actions";

var SearchBar = require("react-native-search-bar");
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

  _handleResults(results) {
    this.setState({ results });
  }

  constructor(props) {
    super(props);

    this.state = {
      // for listview
      ds: [],

      // for ratingview
      starCount: 3.5
    };
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
    getChatList()
      .then(data => {
        this.setState({
          isLoading: false
        });
        console.log("getChatList data-->", data);

        if (data.length && data.length > 0) {
          this.setState({
            ds: data
          });

          for (let i = 0; i < data.length; i++) {
            data[i].pic = require("../assets/images/defaultavatar.png");

            this.loadUserNameProfilePics(data, i);
          }
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  };

  loadUserNameProfilePics = (profiles, index) => {
    //let params = {id: this.props.userdata.isGuide ? profiles[index].guide : profiles[index].tourist , usertype: this.props.userdata.isGuide ? 'guide' : 'tourist'}

    let params = {
      id: this.props.userdata.isGuide
        ? profiles[index].tourist
        : profiles[index].guide,
      usertype: "tourist"
    };

    usermixins(params)
      .then(data => {
        var newArray = profiles.slice();

        if (!newArray[index].topic) {
          if (data.username) {
            newArray[index].topic = data.username;
          }

          if (data.first_name && data.last_name) {
            newArray[index].topic = data.first_name + " " + data.last_name;
          }

          newArray[index].topic =
            "Chat with " +
            (newArray[index].topic
              ? newArray[index].topic
              : newArray[index].username
                ? newArray[index].username
                : "User");
        }

        if (data.pic) {
          newArray[index].pic = { uri: data.pic };
        } else {
          newArray[index].pic = require("../assets/images/defaultavatar.png");
        }

        this.setState({
          ds: newArray
        });
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

    let filteredData = this.filterNotes(searchText, this.state.ds);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(filteredData)
    });
  }

  filterNotes(searchText, notes) {
    let text = searchText.toLowerCase();

    let filteredData = notes.filter(note => {
      return note.topic.toLowerCase().indexOf(text) != -1;
    });

    return filteredData;
  }

  pressRow(rowData, index) {
    const { navigate } = this.props.navigation;

    /*
        var newDs = [];
        newDs = this.state.ds.slice();
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newDs)
        });*/

    navigate("ChatRoom", { chatData: this.state.ds[index] });
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
                BadgeElement={<Text style={{ color: "#fff" }}>{0}</Text>}
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
                placeholder="Search here..."
                placeholderTextColor="white"
                value={this.state.searchText}
                onChange={this.setSearchText.bind(this)}
              />
            </View>
          </View>
          <FlatList
            data={this.state.ds}
            removeClippedSubviews={false}
            extraData={this.state}
            renderItem={this.renderItem.bind(this)}
            renderSeparator={(sectionId, rowId) => (
              <View key={rowId} style={styles.separator} />
            )}
            //renderHeader={() => <SearchListHeader />}
          />
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
    marginLeft: 20,
    height: 20,
    width: 20
  },
  centerText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    width: width - 160,
    fontWeight: "bold"
  },
  rightView: {
    marginRight: 20,
    height: 35,
    width: 35
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
    fontSize: 12
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
  },
  row_right_view: {
    width: 60,
    flexDirection: "column",
    alignItems: "center"
  },
  right_text: {
    fontSize: 10
  },
  badge_icon: {
    height: 10,
    width: 10
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(ChatScreen);
