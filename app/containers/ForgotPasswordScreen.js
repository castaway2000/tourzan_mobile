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
    Platform,
    ActivityIndicator
} from 'react-native';

import { NavigationActions } from 'react-navigation'
import Checkbox from 'react-native-custom-checkbox'
import { Colors } from '../constants'
import ApplyButton from '../components/ApplyButton'
import NavigationBar from '../components/NavigationBar'
import { resetPassword } from '../actions'
import {isIphoneX} from "../global/Utilities"

var { width, height } = Dimensions.get('window');

const onButtonPress = () => { Alert.alert('Button has been pressed!'); };
const backAction = NavigationActions.back({
    // key: 'WelcomeScreen'
});

class ForgotPasswordScreen extends React.Component {
    static navigationOptions = {
        title: 'Forgot Password',
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isLoading: false,
        };
    }

    setUserEmail(text) {
        this.setState({ email: text })
    }

    validateEmail = (email) => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    forgotPassword = () => {

        if (!this.validateEmail(this.state.email)) {
            Alert.alert("Tourzan", 'Please enter correct email address.', [{
                text: 'OK', onPress: () => {

                }
            }], { cancelable: false });
            return
        }

        this.resetPasswordApiCall()
    }

    //API Call change Password
    resetPasswordApiCall() {

        this.setState({
            isLoading: true
        })

        var params = {
            email: this.state.email
        }

        resetPassword(params)

            .then(data => {

                this.setState({
                    isLoading: false
                })

                console.log('Reset Password data-->', data)

                if (data.new_password2) {
                    Alert.alert("Tourzan", data.new_password2.join(' '), [{ text: 'OK', onPress: () => { } }], { cancelable: false });
                } else if (data.detail) {
                    Alert.alert("Tourzan", data.detail, [{
                        text: 'OK', onPress: () => {
                            this.props.navigation.dispatch(backAction)
                        }
                    }], { cancelable: false });
                }
            })
            .catch(err => {
                this.setState({
                    isLoading: false
                })
                alert(err)
            })
    }

    showLoading() {
        if (this.state.isLoading) {
            return (
                <ActivityIndicator color={'black'} size={'large'} style={styles.loadingView} />
            );
        }
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={styles.statusbar} />
                <View style={styles.top_container}>
                    <NavigationBar title={'Forgot Password'} bgColor={'#31dd73'} onPress={() => { this.props.navigation.dispatch(backAction) }} />
                    <View style={styles.view_logo}>
                        <Image resizeMode='contain' style={styles.icon_logo} source={require("../assets/images/Tourzan_Logo.png")} />
                        <Text style={styles.txt_welcome}>Recover Password</Text>
                        <Text style={styles.txt_bottom}>Enter your email to receive intructions on how to reset your password</Text>
                    </View>
                </View>
                <View style={styles.bottom_container}>
                    <View>
                        <TextInput
                            placeholder="Email"
                            style={styles.inputText}
                            underlineColorAndroid='transparent'
                            value={this.state.email}
                            onChangeText={(text) => this.setUserEmail(text)}
                        />
                        <View style={styles.line}></View>
                    </View>
                    <ApplyButton name={'Recover'} style={styles.button_recover} onPress={() => { this.forgotPassword() }} />
                    <TouchableOpacity onPress={() => { this.props.navigation.dispatch(backAction) }} title="Cancel">
                        <Text style={styles.button_cancel} >Cancel</Text>
                    </TouchableOpacity>
                </View>
                {this.showLoading()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    statusbar: {
        width: width,
        height: (Platform.OS == 'ios') ? (isIphoneX() ? 44 : 20 ) : StatusBar.currentHeight,
        backgroundColor: Colors.main,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    top_container: {
        width: width,
        height: height * 40 / 100,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    view_logo: {
        width: width,
        height: height * 40 / 100 - 44,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    icon_logo: {
        height: 70,
        width: 70
    },
    txt_welcome: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
    },
    txt_bottom: {
        width: width - 60,
        fontSize: 15,
        textAlign: 'center',
        color: Colors.color999
    },
    bottom_container: {
        width: width,
        height: height - height * 40 / 100,
        alignItems: 'center'
    },
    inputText: {
        width: width - 60,
        marginTop: 50,
        height: 40,
        borderColor: 'gray'
    },
    line: {
        height: 1,
        width: width - 60,
        backgroundColor: 'gray',
    },
    button_recover: {
        marginTop: 35,
    },
    button_cancel: {
        marginTop: 40,
        marginBottom: 30,
        color: '#000',
        textAlign: 'center',
        fontSize: 18,
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "#000"
    },
    loadingView: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    }
});

export default ForgotPasswordScreen;

