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
  Platform
} from "react-native";

import { NavigationActions } from "react-navigation";
import { GiftedChat } from "react-native-gifted-chat";
import { Colors } from "../constants";
import { API } from "../constants";

//Store
import { connect } from "react-redux";
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser } from "../actions/userActions";

//Utilities
import { Storage, isIphoneX } from "../global/Utilities";

var { width, height } = Dimensions.get("window");

const backAction = NavigationActions.back({});

class ChatRoomScreen extends React.Component {
  static navigationOptions = {
    title: "Luella Palmer",
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

  // gifted chat
  componentWillMount() {
    var { params } = this.props.navigation.state;

    console.log(
      "params.chatData.messages",
      API.CHAT_URL + params.chatData.uuid + "/"
    );

    for (let index = 0; index < params.chatData.messages.length; index++) {
      const element = params.chatData.messages[index];

      let data = {
        _id: element.id,
        text: element.message,
        createdAt: new Date(),
        user: {
          _id: element.user,
          name: "",
          avatar:
            "https://testing.tourzan.com/static/img/Tourzan-transparant.png"
        }
      };

      this.state.messages.push(data);
    }

    this.setState({
      messages: this.state.messages
    });
  }

  componentDidMount() {
    var { params } = this.props.navigation.state;

    this.socket = new WebSocket(API.CHAT_URL + params.chatData.uuid + "/");

    this.socket.binaryType = "blob";

    console.log(this.socket);

    this.socket.onopen = () => {
      console.log("Socket connected...!");
    };

    this.socket.onmessage = e => {
      console.log("A message was received.", e.data);

      let cm = {
        text: e.data.message,
        _id: -1,
        createdAt: new Date(),
        user: {
          _id: -2,
          name: "",
          avatar: ""
        }
      };

      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, cm)
      }));
    };

    this.socket.onerror = e => {
      // an error occurred
      console.log("An error occurred", e.message);
    };

    this.socket.onclose = e => {
      //
      console.log("connection closed", e.code, e.reason);
    };
  }

  onSend(messages = []) {
    console.log("sending...");

    let message1 = {
      message: "test",
      user: "guide100",
      dt: "08/16/2018 07:23:14"
    };

    let messagestringfy = JSON.stringify(message1);

    this.socket.send(messagestringfy);

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  constructor(props) {
    super(props);
    this.state = { messages: [] };
    // this.onSend = this.onSend.bind(this);
  }

  render() {
    const { navigate } = this.props.navigation;
    var { params } = this.props.navigation.state;

    return (
      <View style={styles.container}>
        <View style={styles.statusbar} />
        <View style={styles.top_container}>
          <TouchableOpacity
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
          <Text style={styles.centerText}>{params.chatData.topic}</Text>
          <TouchableOpacity
            onPress={() => {
              navigate("Profile", { userid: this.getOpponmentUserID() });
            }}
          >
            <Image
              resizeMode="cover"
              source={params.chatData.pic}
              style={styles.rightView}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bottom_container}>
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: 1
            }}
          />
        </View>
      </View>
    );
  }

  //#region

  getOpponmentUserID = () => {
    var { params } = this.props.navigation.state;

    var isguide = this.props.userdata.user.isLoggedInAsGuide;

    if (isguide) {
      return params.chatData.tourist;
    } else {
      return params.chatData.guide;
    }
  };

  //#endregion
}

const styles = StyleSheet.create({
  container: {
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
  icon: {
    width: 20,
    height: 20
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
  backButton: {
    marginLeft: 20,
    height: 15,
    width: 10
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
    width: 35,
    borderRadius: 17
  },
  bottom_container: {
    height:
      Platform.OS == "ios"
        ? height - (Platform.OS == "ios" ? (isIphoneX() ? 130 : 64) : 0)
        : height - 66,
    width: width
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(ChatRoomScreen);
