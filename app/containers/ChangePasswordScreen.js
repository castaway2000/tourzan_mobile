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
import NavigationBar from '../components/NavigationBar'
import { changePassword } from '../actions/'
import {isIphoneX} from "../global/Utilities"

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({

});

class ChangePasswordScreen extends React.Component {
    static navigationOptions = {
        header: null,
        tabBarLabel: 'More',
        tabBarIcon: ({ tintColor }) => (
            <Image resizeMode='contain' source={require('../assets/images/hambuger.png')} style={[styles.icon, { tintColor: tintColor }]} />
        ),
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            password: '',
            passwordNew: '',
            passwordConfirm: '',
        };
        this.navigate = this.props.navigation;
    }

    onDone() {

        if (!this.state.password.length) {
            Alert.alert("Tourzan", "Please enter your current password.", [{ text: 'OK', onPress: () => { } }], { cancelable: false });
            return
        }

        if ((this.state.passwordNew.length < 8 || this.state.passwordNew.length > 20) &&
            (this.state.passwordConfirm.length < 8 || this.state.passwordConfirm.length > 20)) {
            Alert.alert("Tourzan", "Password must be minimum 8 and maximum 20 character long.", [{ text: 'OK', onPress: () => { } }], { cancelable: false });
            return
        }

        if (this.state.passwordNew.length != this.state.passwordConfirm.length) {
            Alert.alert("Tourzan", "New password and confirm password do not match.", [{ text: 'OK', onPress: () => { } }], { cancelable: false });
            return
        }

        this.changePasswordApiCall()
    }

    //API Call change Password
    changePasswordApiCall() {

        const { navigate } = this.props.navigation;

        this.setState({
            isLoading: true
        })

        var params = {
            passwordNew: this.state.passwordNew,
            passwordConfirm: this.state.passwordConfirm
        }

        changePassword(params)

            .then(data => {

                this.setState({
                    isLoading: false
                })

                console.log('ChangePassword data-->', data)
                
                if (data.new_password2) {
                    Alert.alert("Tourzan", data.new_password2.join(' '), [{ text: 'OK', onPress: () => { } }], { cancelable: false });
                } else if (data.detail) {
                    Alert.alert("Tourzan", data.detail, [{
                        text: 'OK', onPress: () => {
                            navigate.dispatch(backAction);
                        }
                    }], { cancelable: false });
                }
            })
            .catch(err => {
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

    setPasswordOld(text) {
        this.setState({ password: text })
    }

    setPasswordNew(text) {
        this.setState({ passwordNew: text })
    }

    setPasswordConfirm(text) {
        this.setState({ passwordConfirm: text })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.statusbar} />
                <View style={styles.navigationbar}>
                    <TouchableOpacity onPress={() => { this.props.navigation.dispatch(backAction) }}>
                        <Image resizeMode='cover' source={require("../assets/images/back.png")} style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.centerText}>Password</Text>
                    <TouchableOpacity onPress={() => this.onDone()}>
                        <Text style={styles.rightView}>DONE</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.main_view}>
                    <View style={styles.blank_row_view}>
                    </View>
                    <View style={styles.row_icon_view}>
                        <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} />
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder='Current Password'
                            style={styles.row_icon_lb}
                            secureTextEntry={true}
                            value={this.state.password}
                            onChangeText={(text) => this.setPasswordOld(text)} />
                    </View>
                    <View style={styles.blank_row_view}>
                    </View>
                    <View style={styles.row_icon_view}>
                        <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} />
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder='New Password'
                            style={styles.row_icon_lb}
                            secureTextEntry={true}
                            value={this.state.passwordNew}
                            onChangeText={(text) => this.setPasswordNew(text)} />
                    </View>
                    <View style={styles.row_icon_view}>
                        <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} />
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder='Confirm Password'
                            style={styles.row_icon_lb}
                            secureTextEntry={true}
                            value={this.state.passwordConfirm}
                            onChangeText={(text) => this.setPasswordConfirm(text)} />
                    </View>
                </View>
                {this.showLoading()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        width: 20,
        height: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
    },
    statusbar: {
        width: width,
        height: (Platform.OS == 'ios') ? (isIphoneX() ? 44 : 20 ) : StatusBar.currentHeight,
        backgroundColor: Colors.main,
        position: 'absolute',
        top: 0,
        left: 0,
    },

    // --- navigation bar --- //
    navigationbar: {
        height: 44,
        marginTop: (Platform.OS == 'ios') ? (isIphoneX() ? 44 : 20 ) : 0,
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
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
        width: width - 160,
        fontWeight: 'bold',
    },
    rightView: {
        marginRight: 20,
        color: 'white',
        fontSize: 17,
    },

    // --- main view --- //
    main_view: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f9fbfe',
    },
    blank_row_view: {
        width: width,
        height: 30,
        backgroundColor: '#f9fbfe',
        borderBottomWidth: 1,
        borderColor: '#c2c3c9',
    },
    row_icon_view: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        width: width,
        height: 50,
        borderBottomWidth: 1,
        borderColor: '#c2c3c9',
        backgroundColor: 'white',
    },
    row_icon_lb: {
        marginLeft: 10,
        color: '#6e7478',
        fontSize: 13,
        width: width - 100,
        marginTop: 10,
    },
    row_icon: {
        height: 15,
        width: 15,
    },
    row_small_icon: {
        width: 15,
        height: 15,
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
    },

});

export default ChangePasswordScreen;

