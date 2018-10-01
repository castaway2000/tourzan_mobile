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
    ActivityIndicator,
    ImageBackground
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavigationActions } from 'react-navigation'
import Checkbox from 'react-native-custom-checkbox'
import { Colors } from '../constants'
import ApplyButton from '../components/ApplyButton'
import NavigationBar from '../components/NavigationBar'
import { emailSignup } from '../actions/'
import PLoading from '../components/Loading'

var { width, height } = Dimensions.get('window');
let nextInput1;
let nextInput2;
let nextInput3;
let nextInput4;
let nextInput5;
let nextInput6;

const onButtonPress = () => { Alert.alert('Button has been pressed!'); };
const backAction = NavigationActions.back({
    // key: 'WelcomeScreen'
});

const resetRootAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Welcome' }),
    ],
    key: null
});

var isInterestExtend = false
var isAttractions = false
var isBoarading = false
var isHiking = false
var isTraveling = false

class RegisterGuideScreen extends React.Component {
    static navigationOptions = {
        title: 'Login Tourist',
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmpassword: '',
            address: '',
            company: '',
            phone: '',
            interests: '',
            isInterestExtend: false,
            isAttractions: false,
            isBoarading: false,
            isHiking: false,
            isTraveling: false,
            isLoading: false
        };
    }

    onSignup() {
        if (this.state.name == '' || this.state.name.trim() == '') {
            alert('Please enter your username')
        }
        else if (this.state.email == '' || this.state.email.trim() == '') {
            alert('Please enter your email address')
        }
        else if (this.state.password == '' || this.state.password.trim() == '') {
            alert('Please enter your password')
        }
        else if (this.state.password.length < 8) {
            alert('Password must be at least 8 characters.')
        }
        else if (this.state.password != this.state.confirmpassword) {
            alert('Not matched password and confirm password')
        }
        else {
            this.setState({
                isLoading: true
            })

            var { dispatch } = this.props;
            var params = {
                username: this.state.name,
                email: this.state.email,
                password1: this.state.password,
                password2: this.state.confirmpassword
            }

            emailSignup(params)
                .then(data => {
                    this.setState({
                        isLoading: false
                    })
                    console.log('donwload email sing up-->', data)
                    if (data.token) {

                        Alert.alert("Tourzan", "Registration Successful. Please Login.", [{
                            text: 'OK', onPress: () => {
                                this.props.navigation.dispatch(resetRootAction);
                            }
                        }],
                            { cancelable: false });
                    } else {
                        Alert.alert("Tourzan", data.error)
                    }
                })
                .catch(err => {
                    this.setState({
                        isLoading: false
                    })
                    alert(err)
                })
        }

    }

    setUserName(text) {
        this.setState({ name: text })
    }

    setUserEmail(text) {
        this.setState({ email: text })
    }

    setUserPassword(text) {
        this.setState({ password: text })
    }

    setUserConfirmPassword(text) {
        this.setState({ confirmpassword: text })
    }

    setUserAddress(text) {
        this.setState({ address: text })
    }

    setUserCompany(text) {
        this.setState({ company: text })
    }

    setUserPhone(text) {
        this.setState({ phone: text })
    }

    setUserInterests(text) {
        this.setState({ interests: text })
    }

    getNextInput1(data) {
        nextInput1 = data;
    }

    getNextInput2(data) {
        nextInput2 = data;
    }

    getNextInput3(data) {
        nextInput3 = data;
    }

    getNextInput4(data) {
        nextInput4 = data;
    }

    getNextInput5(data) {
        nextInput5 = data;
    }

    getNextInput6(data) {
        nextInput6 = data;
    }

    changeFocus1() {
        if (nextInput1 !== undefined) {
            nextInput1.focus();
        }
    }

    changeFocus2() {
        nextInput2.focus();
    }

    changeFocus3() {
        nextInput3.focus();
    }

    changeFocus4() {
        nextInput4.focus();
    }

    changeFocus5() {
        nextInput5.focus();
    }

    changeFocus6() {
        nextInput6.focus();
    }

    onClickExtendInterests() {
        isInterestExtend = !isInterestExtend;
        this.setState({ isInterestExtend: isInterestExtend })
    }

    onAttractions() {
        isAttractions = !isAttractions
        this.setState({
            isAttractions: isAttractions,
        })
    }

    onBoarding() {
        isBoarading = !isBoarading
        this.setState({
            isBoarading: isBoarading,
        })
    }

    onHiking() {
        isHiking = !isHiking
        this.setState({
            isHiking: isHiking,
        })
    }

    onTraveling() {
        isTraveling = !isTraveling
        this.setState({
            isTraveling: isTraveling,
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
                <ImageBackground resizeMode='cover' source={require("../assets/images/login_bg.jpg")} style={styles.top_container}>
                    <NavigationBar title={''} bgColor={'transparent'} onPress={() => { this.props.navigation.dispatch(backAction) }} />
                    <View style={styles.view_title}>
                        <Text style={styles.txt_bottom}>Create an account to Tourist</Text>
                        <Text style={styles.txt_welcome}>REGISTER</Text>
                    </View>
                </ImageBackground>
                <KeyboardAwareScrollView style={styles.out_container}>
                    <View style={styles.bottom_container}>
                        <View>
                            <TextInput
                                placeholder="Username"
                                style={styles.inputText}
                                underlineColorAndroid='transparent'
                                value={this.state.name}
                                onChangeText={(text) => this.setUserName(text)}
                                onSubmitEditing={this.changeFocus1.bind(this)}
                            />
                            <View style={styles.line}></View>
                        </View>
                        <View>
                            <TextInput
                                ref={this.getNextInput1.bind(this)}
                                placeholder="Email"
                                style={styles.inputText}
                                underlineColorAndroid='transparent'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                value={this.state.email}
                                onChangeText={(text) => this.setUserEmail(text)}
                                onSubmitEditing={this.changeFocus2.bind(this)}
                            />
                            <View style={styles.line}></View>
                        </View>
                        <View>
                            <TextInput
                                ref={this.getNextInput2.bind(this)}
                                placeholder="Password"
                                secureTextEntry={true}
                                style={styles.inputText}
                                underlineColorAndroid='transparent'
                                value={this.state.password}
                                onChangeText={(text) => this.setUserPassword(text)}
                                onSubmitEditing={this.changeFocus3.bind(this)}
                            />
                            <View style={styles.line}></View>
                        </View>
                        <View>
                            <TextInput
                                ref={this.getNextInput3.bind(this)}
                                placeholder="Confirm Password"
                                style={styles.inputText}
                                secureTextEntry={true}
                                underlineColorAndroid='transparent'
                                value={this.state.confirmpassword}
                                onChangeText={(text) => this.setUserConfirmPassword(text)}
                                onSubmitEditing={this.changeFocus4.bind(this)}
                            />
                            <View style={styles.line}></View>
                        </View>
                        {/* <View>
                            <TextInput
                                ref={this.getNextInput4.bind(this)}
                                placeholder="Address"
                                style={styles.inputText}
                                underlineColorAndroid='transparent'
                                value={this.state.address}
                                onChangeText={(text) => this.setUserAddress(text)}
                                onSubmitEditing={this.changeFocus5.bind(this)}
                            />
                            <View style={styles.line}></View>
                        </View>
                        <View>
                            <TextInput
                                ref={this.getNextInput5.bind(this)}
                                placeholder="Company Name"
                                style={styles.inputText}
                                underlineColorAndroid='transparent'
                                value={this.state.company}
                                onChangeText={(text) => this.setUserCompany(text)}
                                onSubmitEditing={this.changeFocus6.bind(this)}
                            />
                            <View style={styles.line}></View>
                        </View>
                        <View>
                            <TextInput
                                ref={this.getNextInput6.bind(this)}
                                placeholder="Phone Number"
                                style={styles.inputText}
                                keyboardType='numeric'
                                underlineColorAndroid='transparent'
                                value={this.state.phone}
                                onChangeText={(text) => this.setUserPhone(text)}
                            />
                            <View style={styles.line}></View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={styles.intestsView} onPress={() => this.onClickExtendInterests()}>
                                <Text style={styles.label}>Interests</Text>
                                <Image source={this.state.isInterestExtend ? require('../assets/images/caret-arrow-up.png') : require('../assets/images/caret-arrow-down.png')} style={styles.arrowIcon} />
                            </TouchableOpacity>
                            {
                                this.state.isInterestExtend ?
                                    <View style={styles.interest_list_view}>
                                        <TouchableOpacity onPress={() => this.onAttractions()} style={styles.interres_list_button}>
                                            <Text style={this.state.isAttractions ? styles.interest_item_txt1 : styles.interest_item_txt}>Attractions</Text>
                                            {this.state.isAttractions ?
                                                <Image source={require('../assets/images/checked_gray.png')} style={{ width: 15, height: 15 }} /> : null
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.onBoarding()} style={styles.interres_list_button}>
                                            <Text style={this.state.isBoarading ? styles.interest_item_txt1 : styles.interest_item_txt}>Boarding</Text>
                                            {this.state.isBoarading ?
                                                <Image source={require('../assets/images/checked_gray.png')} style={{ width: 15, height: 15 }} /> : null
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.onHiking()} style={styles.interres_list_button}>
                                            <Text style={this.state.isHiking ? styles.interest_item_txt1 : styles.interest_item_txt}>Hiking</Text>
                                            {this.state.isHiking ?
                                                <Image source={require('../assets/images/checked_gray.png')} style={{ width: 15, height: 15 }} /> : null
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.onTraveling()} style={styles.interres_list_button}>
                                            <Text style={this.state.isTraveling ? styles.interest_item_txt1 : styles.interest_item_txt}>Traveling</Text>
                                            {this.state.isTraveling ?
                                                <Image source={require('../assets/images/checked_gray.png')} style={{ width: 15, height: 15 }} /> : null
                                            }
                                        </TouchableOpacity>
                                    </View> : null
                            }
                        </View> */}
                        <View style={styles.line}></View>

                        <ApplyButton name={'Sign Up'} onPress={() => this.onSignup()} style={styles.button_login} />
                        <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 20, }}>
                            <Text style={styles.label1}>Already have an account</Text>
                            <TouchableOpacity onPress={() => { this.props.navigation.dispatch(backAction) }} title="SING IN">
                                <Text style={styles.button_signin} >Sign In</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line1}></View>
                        <View style={styles.termsView}>
                            <Text style={{ color: 'gray', fontSize: 13 }}>By clicking "<Text style={{ color: Colors.main }}>Sign Up</Text>" I agree</Text>
                            <Text style={{ fontSize: 13, marginTop: 4 }}>Terms of Service</Text>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {this.showLoading()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    top_container: {
        width: width,
        height: height * 0.4,
        flexDirection: 'column',
    },
    view_title: {
        width: width,
        height: height * 0.4 - 90,
        alignItems: 'flex-start',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginLeft: 30
    },
    txt_welcome: {
        marginTop: 5,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: 'transparent'
    },
    txt_bottom: {
        fontSize: 17,
        textAlign: 'center',
        color: Colors.textBottomColor,
        backgroundColor: 'transparent'
    },
    scrollview_container: {
        flex: 1,
        height: 1000,
    },
    bottom_container: {
        width: width,
        alignItems: 'center'
    },
    inputText: {
        width: width - 60,
        marginTop: 20,
        height: 40,
        borderColor: 'gray',
        fontSize: 15,
    },
    interest_text: {
        width: width - 60,
        marginTop: 20,
        height: 40,
        borderColor: 'gray',
    },
    txt_checkbox: {
        marginLeft: 10,
        fontSize: 12,
    },
    txt_forgot: {
        fontSize: 12,
    },
    view_remember: {
        width: width - 60,
        marginTop: 20,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    view_checkbox: {
        width: 100,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center'
    },
    button_login: {
        marginTop: 25,
    },
    button_signin: {
        marginLeft: 5,
        color: '#000',
        textAlign: 'center',
        fontSize: 17,
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "#000"
    },
    line: {
        height: 1,
        width: width - 60,
        backgroundColor: Colors.lineColor,
    },
    line1: {
        height: 1,
        width: width,
        backgroundColor: Colors.lineColor,
        marginTop: 15,

    },
    arrowIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    label: {
        color: 'black',
        fontSize: 15
    },
    label1: {
        color: 'darkgray',
        fontSize: 17
    },
    intestsView: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width - 60,
        height: 40,
        marginTop: 20,
        marginBottom: 10
    },
    interest_list_view: {
        width: width - 60,
    },
    interest_item_txt: {
        height: 37,
        paddingLeft: 7,
        color: Colors.interest_color,
        fontSize: 15,
    },
    interest_item_txt1: {
        height: 37,
        paddingLeft: 7,
        color: 'black',
        fontSize: 15,
    },
    interres_list_button: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },
    termsView: {
        marginTop: 15,
        marginBottom: 20,
        alignItems: 'center'
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

export default RegisterGuideScreen;

