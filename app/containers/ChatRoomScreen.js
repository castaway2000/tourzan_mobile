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

        var {params} = this.props.navigation.state

        for (let index = 0; index < params.chatData.messages.length; index++) {

            const element = params.chatData.messages[index];
            
            let data = {
                _id: element.id,
                text: element.message,
                createdAt: new Date(),
                user: {
                    _id: element.user,
                    name: 'React Native',
                    avatar: 'https://news-cdn.softpedia.com/images/news2/microsoft-releases-windows-10-cumulative-updates-kb4284822-kb4284830-kb4284833-1.jpg',
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
                        avatar: 'https://news-cdn.softpedia.com/images/news2/microsoft-releases-windows-10-cumulative-updates-kb4284822-kb4284830-kb4284833-1.jpg',
                    },
                    }),
            }));
        }, 5000);

        this.setState({
            messages: this.state.messages
        });
    }

    onSend(messages = []) {
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
                    <TouchableOpacity>
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
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'column',
    },
    statusbar: {
        width: width,
        height: (Platform.OS == 'ios') ? 20 : StatusBar.currentHeight,
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
        marginTop: (Platform.OS == 'ios') ? 20 : 0,
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
        height: (Platform.OS == 'ios') ? height - 64 : height - 66,
        width: width,
    },
});

export default ChatRoomScreen;

