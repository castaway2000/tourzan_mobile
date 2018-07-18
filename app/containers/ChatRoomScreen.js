import React, { Component } from 'react';

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
} from 'react-native';

import { NavigationActions } from 'react-navigation'
import { GiftedChat } from 'react-native-gifted-chat';
import { Colors } from '../constants'

//Store
import { connect } from 'react-redux';
import configureStore from '../configureStore'
const store = configureStore();

//Actions
import { updatebooking } from '../actions/bookingActions'
import { updateuser } from '../actions/userActions'

//Utilities
import { Storage, isIphoneX } from '../global/Utilities';

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({

});

class ChatRoomScreen extends React.Component {
    static navigationOptions = {
        title: 'Luella Palmer',
        header: null,
        tabBarLabel: 'Chat',
        tabBarIcon: ({ tintColor }) => (
            <Image resizeMode='contain' source={require('../assets/images/Chat_Bottom_icon.png')} style={[styles.icon, { tintColor: tintColor }]} />
        ),
    };

    // gifted chat 
    componentWillMount() {

        var { params } = this.props.navigation.state

        for (let index = 0; index < params.chatData.messages.length; index++) {

            const element = params.chatData.messages[index];

            let data = {
                _id: element.id,
                text: element.message,
                createdAt: new Date(),
                user: {
                    _id: element.user,
                    name: 'React Native',
                    avatar: 'http://34.212.65.102/static/img/Tourzan-transparant.png',
                },
            }

            this.state.messages.push(data)
        }

        setTimeout(() => {
            this.setState((previousState) => ({
                messages: GiftedChat.append(previousState.messages, {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'http://34.212.65.102/static/img/Tourzan-transparant.png',
                    },
                }),
            }));
        }, 5000);

        this.setState({
            messages: this.state.messages
        });
    }

    componentDidMount() {
        this.socket = new WebSocket('ws://34.212.65.102/ws/chat/85370fc6-e253-4f2f-946f-6d5034aef072/');
        console.log(this.socket)


        this.socket.onopen = () => {
            console.log('Socket connected...!');

        };

        this.socket.onmessage = (e) => {
            console.log('A message was received', e.data);
        };

        this.socket.onerror = (e) => {
            // an error occurred
            console.log('An error occurred', e.message);
        };

        this.socket.onclose = (e) => {
            // 
            console.log('connection closed', e.code, e.reason);
        };
    }

    onSend(messages = []) {

        console.log('sending...');

        let message1 = { chat_uuid: "85370fc6-e253-4f2f-946f-6d5034aef072", message: "From Iphone 6" }

        let messagestringfy = JSON.stringify(message1)

        this.socket.send(messagestringfy);

        //this.socket.send(JSON.stringify({ "chat_uuid": "85370fc6-e253-4f2f-946f-6d5034aef072", "message": "From vs code!!!!" }))
        let message = {
            chat_uuid: '85370fc6-e253-4f2f-946f-6d5034aef072',
            message: messages
        }

        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
    }

    constructor(props) {
        super(props);
        this.state = { messages: [] };
        // this.onSend = this.onSend.bind(this);
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={styles.statusbar} />
                <View style={styles.top_container}>
                    <TouchableOpacity onPress={() => { this.props.navigation.dispatch(backAction) }}>
                        <Image resizeMode='cover' source={require("../assets/images/back.png")} style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.centerText}>Luella Palmer</Text>
                    <TouchableOpacity onPress={() => { navigate('Profile', { userid: this.getOpponmentUserID() }) }}>
                        <Image resizeMode='cover' source={require("../assets/images/chat_avatar.png")} style={styles.rightView} />
                    </TouchableOpacity>
                </View>
                <View style={styles.bottom_container}>
                    <GiftedChat
                        messages={this.state.messages}
                        onSend={(messages) => this.onSend(messages)}
                        user={{
                            _id: 1,
                        }}
                    />
                </View>
            </View>
        );
    }

    //#region 

    getOpponmentUserID = () => {

        var { params } = this.props.navigation.state

        var isguide = this.props.userdata.user.isGuide

        if (isguide) {
            return params.chatData.tourist
        } else {
            return params.chatData.guide
        }
    }

    //#endregion
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'column',
    },
    statusbar: {
        width: width,
        height: (Platform.OS == 'ios') ? (isIphoneX() ? 44 : 20) : StatusBar.currentHeight,
        backgroundColor: Colors.main,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    icon: {
        width: 20,
        height: 20,
    },
    top_container: {
        marginTop: (Platform.OS == 'ios') ? (isIphoneX() ? 44 : 20) : 0,
        height: 44,
        backgroundColor: Colors.main,
        width: width,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backButton: {
        marginLeft: 20,
        height: 15,
        width: 10,
    },
    centerText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 17,
        width: width - 160,
        fontWeight: 'bold',
    },
    rightView: {
        marginRight: 20,
        height: 35,
        width: 35
    },
    bottom_container: {
        height: (Platform.OS == 'ios') ? height - ((Platform.OS == 'ios') ? (isIphoneX() ? 130 : 44) : 0) : height - 66,
        width: width,
    },
});

const mapStateToProps = store => {
    return {
        bookingdata: store.tour.bookingdata,
        userdata: store.user.userdata
    };
};

export default connect(mapStateToProps)(ChatRoomScreen);