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
import moment from "moment";

//Store
import { connect } from "react-redux";
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser, updateChat } from "../actions/userActions";

//Webservice
import { sendChatMessage } from "../actions";

//Utilities
import { Storage, isIphoneX } from "../global/Utilities";
import {
  Colors,
  API,
  Paymentrails,
  Braintree,
  DefaultFont
} from "../constants";

import KeyboardSpacer from "react-native-keyboard-spacer";

var { width, height } = Dimensions.get("window");

var lastid = 0;

var lastMessageBySender = "";

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

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      messageText: ""
    };
  }

  // gifted chat
  componentWillMount() {
    var { params } = this.props.navigation.state;

    let index = params.index;
    let chatData = this.props.chats[index];

    console.log("params.chatData", chatData);
    console.log("params.Index", index);

    lastid = chatData.messages[0].id;

    for (let i = 0; i < chatData.messages.length; i++) {
      const element = chatData.messages[i];

      let data = {
        _id: element.id,
        text: element.message,
        createdAt: moment(element.created),
        user: {
          _id: element.user,
          name: "",
          avatar: chatData.picurl ? chatData.picurl : ""
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

    let index = params.index;
    let chatData = this.props.chats[index];

    this.socket = new WebSocket(
      API.CHAT_URL + chatData.uuid + "/?token=" + this.props.userdata.token
    );

    // this.socket.binaryType = "blob";

    this.socket.onopen = () => {
      console.log(
        "Socket connected...!",
        API.CHAT_URL + chatData.uuid + "/?token=" + this.props.userdata.token
      );
    };

    this.socket.onmessage = e => {
      console.log("A message was received.", e.data);

      lastid = lastid + 1;

      //Append to redux array
      var { params } = this.props.navigation.state;

      let index = params.index;

      this.props.chats[index].messages.unshift({
        chat: 577,
        created: new Date().toISOString(),
        id: lastid,
        message: JSON.parse(e.data).message,
        updated: new Date().toISOString(),
        user: JSON.parse(e.data).user_id,
        uuid: this.guid()
      });

      store.dispatch(updateChat(this.props.chats));

      //Append op message
      if (this.props.userdata.user.userid == JSON.parse(e.data).user_id) {
        return;
      }

      let cm = {
        text: JSON.parse(e.data).message,
        _id: lastid,
        createdAt: new Date(),
        user: {
          _id: JSON.parse(e.data).user_id,
          name: "",
          avatar: chatData.picurl ? chatData.picurl : ""
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

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }

  onSend(messages = []) {
    var { params } = this.props.navigation.state;

    let index = params.index;
    let chatData = this.props.chats[index];

    console.log("sending message....,");

    lastMessageBySender = this.state.messageText;

    let message1 = {
      message: this.state.messageText,
      chat_uuid: chatData.uuid
    };

    let messagestringfy = JSON.stringify(message1);

    this.socket.send(messagestringfy);

    // this.sendChatMessageWS();

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  setCustomText(text) {
    this.setState({
      messageText: text
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    var { params } = this.props.navigation.state;

    let index = params.index;
    let chatData = this.props.chats[index];

    return (
      <View style={styles.container}>
        <View style={styles.statusbar} />
        <View style={styles.top_container}>
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
          <Text style={styles.centerText}>{chatData.topic}</Text>
          <TouchableOpacity
            onPress={() => {
              navigate("ProfileUser", { userid: this.getOpponmentUserID() });
            }}
          >
            <Image
              resizeMode="cover"
              source={chatData.pic}
              style={styles.rightView}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bottom_container}>
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            onInputTextChanged={text => this.setCustomText(text)}
            user={{
              _id: this.props.userdata.user.userid
            }}
          />
          {Platform.OS === "android" ? <KeyboardSpacer /> : null}
        </View>
      </View>
    );
  }

  //#region

  sendChatMessageWS() {
    var { dispatch } = this.props;
    var { params } = this.props.navigation.state;

    let index = params.index;
    let chatData = this.props.chats[index];

    var params = {
      chat_id: chatData.id,
      chat_uuid: chatData.uuid,
      message: this.state.messageText
    };

    sendChatMessage(params)
      .then(data => {})
      .catch(err => {
        alert(err);
      });
  }

  getOpponmentUserID = () => {
    var { params } = this.props.navigation.state;

    let index = params.index;
    let chatData = this.props.chats[index];

    var isguide = this.props.userdata.user.isLoggedInAsGuide;

    if (isguide) {
      return chatData.tourist;
    } else {
      return chatData.guide;
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
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    width: width - 160,
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
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
    currentlocation: store.location.currentlocation,
    chats: store.user.chats
  };
};

export default connect(mapStateToProps)(ChatRoomScreen);
