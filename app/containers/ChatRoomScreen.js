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
import moment from 'moment'

//Store
import { connect } from "react-redux";
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser } from "../actions/userActions";

//Webservice
import { sendChatMessage } from "../actions";

//Utilities
import { Storage, isIphoneX } from "../global/Utilities";

var { width, height } = Dimensions.get("window");

var lastid = 0;

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

    console.log("params.chatData", params.chatData);

    lastid = params.chatData.messages[0].id

    for (let index = 0; index < params.chatData.messages.length; index++) {
      const element = params.chatData.messages[index];

      let data = {
        _id: element.id,
        text: element.message,
        createdAt: moment(element.created),
        user: {
          _id: element.user,
          name: "",
          avatar: params.chatData.picurl ? params.chatData.picurl : ""
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

    this.socket = new WebSocket(API.CHAT_URL + params.chatData.uuid + "/?token=" + this.props.userdata.token);

    // this.socket.binaryType = "blob";

    this.socket.onopen = () => {
      console.log("Socket connected...!",API.CHAT_URL + params.chatData.uuid + "/?token=" + this.props.userdata.token);
    };

    this.socket.onmessage = e => {
      
      console.log("A message was received.", e.data);

      var { params } = this.props.navigation.state;

      lastid = lastid + 1;
      
      let cm = {
        text: JSON.parse(e.data).message,
        _id: lastid,
        createdAt: new Date(),
        user: {
          _id: this.props.userdata.user.userid,
          name: "",
          avatar: params.chatData.picurl ? params.chatData.picurl : ""
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

    var { params } = this.props.navigation.state;

    console.log("sending message....,");
    
    let message1 = {
      message: this.state.messageText,
      chat_uuid: params.chatData.uuid,
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
            onInputTextChanged={text => this.setCustomText(text)}
            user={{
              _id: this.props.userdata.user.userid
            }}
          />
        </View>
      </View>
    );
  }

  //#region

  sendChatMessageWS() {
    var { dispatch } = this.props;
    var { params } = this.props.navigation.state;

    var params = {
      chat_id: params.chatData.id,
      chat_uuid: params.chatData.uuid,
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
