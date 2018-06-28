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

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Colors } from '../constants'
import { NavigationActions } from 'react-navigation'
import MapView from 'react-native-maps';

import Switch from '../components/Switch';
import NavigationBar from '../components/NavigationBar';
import * as Actions from '../actions/map'

import flagImg from '../assets/images/flag-blue_small.png';
import moment from 'moment';

import { currentuser, isGuide, userid, profilePictureUrl} from '../global/CurrentUser';
import { Storage } from '../global/Utilities';

//import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';

// var Switch = require('react-native-material-switch');

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({

});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(Actions, dispatch)
};

const mapStateToProps = (state) => {
    return {
        isbooked: state.isbooked,
    }
};

class MapsScreen extends React.Component {


    //#region Constractors
    static navigationOptions = {
        header: null,
        tabBarLabel: 'Maps',
        tabBarIcon: ({ tintColor }) => (
            <Image resizeMode='contain' source={require('../assets/images/Maps_Bottom_icon.png')} style={[styles.icon, { tintColor: tintColor }]} />
        ),
    };

    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            isSettingTime: false,
            hour: moment().format('hh'),
            minute: moment().format('mm'),
            trueSwitchIsOn: moment().format('A') == 'AM' ? true : false,
        };
    }

    //#endregion

    componentWillMount() {

        // console.log("isGuide",isGuide())
        // console.log("userid",userid())
        // console.log("profilePictureUrl", profilePictureUrl())

/*
        this.toggleTracking()

        BackgroundGeolocation.on('start', () => {
            // service started successfully
            // you should adjust your app UI for example change switch element to indicate
            // that service is running
            console.log('[DEBUG] BackgroundGeolocation has been started');
            this.setState({ isRunning: true });
        });

        BackgroundGeolocation.on('stop', () => {
            console.log('[DEBUG] BackgroundGeolocation has been stopped');
            this.setState({ isRunning: false });
        });

        BackgroundGeolocation.on('background', () => {
            console.log('[INFO] App is in background');
            BackgroundGeolocation.configure({
                locationProvider: BackgroundGeolocation.RAW_PROVIDER,
                interval: 3000,
                fastestInterval: 3000,
            });
            BackgroundGeolocation.stop();
            BackgroundGeolocation.start();
        });

        BackgroundGeolocation.on('authorization', status => {
            console.log(
                '[INFO] BackgroundGeolocation authorization status: ' + status
            );
            if (status !== BackgroundGeolocation.AUTHORIZED) {
                // we need to set delay after permission prompt or otherwise alert will not be shown
                setTimeout(() =>
                    Alert.alert(
                        'App requires location tracking',
                        'Would you like to open app settings?',
                        [
                            {
                                text: 'Yes',
                                onPress: () => BackgroundGeolocation.showAppSettings()
                            },
                            {
                                text: 'No',
                                onPress: () => console.log('No Pressed'),
                                style: 'cancel'
                            }
                        ]
                    ), 1000);
            }
        });

        BackgroundGeolocation.on('foreground', () => {
            console.log('[INFO] App is in foreground');
            BackgroundGeolocation.configure({
                locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER, // or RAW it depends on your needs
                desiredAccuracy: 10,
                interval: 30000,
                fastestInterval: 30000,
            });
            BackgroundGeolocation.stop();
            BackgroundGeolocation.start();
        });

        BackgroundGeolocation.on('location', location => {
            console.log('[DEBUG] BackgroundGeolocation location', location);

        });

        BackgroundGeolocation.on('error', ({ message }) => {
            Alert.alert('BackgroundGeolocation error', message);
        });

    }

    toggleTracking() {
        BackgroundGeolocation.checkStatus(({ isRunning, locationServicesEnabled, authorization }) => {
            if (isRunning) {
                BackgroundGeolocation.stop();
                return false;
            }

            if (!locationServicesEnabled) {
                Alert.alert(
                    'Location services disabled',
                    'Would you like to open location settings?',
                    [
                        {
                            text: 'Yes',
                            onPress: () => BackgroundGeolocation.showLocationSettings()
                        },
                        {
                            text: 'No',
                            onPress: () => console.log('No Pressed'),
                            style: 'cancel'
                        }
                    ]
                );
                return false;
            }

            if (authorization == 99) {
                // authorization yet to be determined
                BackgroundGeolocation.start();
            } else if (authorization == BackgroundGeolocation.AUTHORIZED) {
                // calling start will also ask user for permission if needed
                // permission error will be handled in permisision_denied event
                BackgroundGeolocation.start();
            } else {
                Alert.alert(
                    'App requires location tracking',
                    'Please grant permission',
                    [
                        {
                            text: 'Ok',
                            onPress: () => BackgroundGeolocation.start()
                        }
                    ]
                );
            }
        });*/
    }

    getInitialState() {
        return {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }

    onRegionChange(region) {
        () => this.onRegionChange.bind(this);
    }

    //#region Time related
    onSettingTime() {

        if (this.state.isSettingTime) {
            if (this.isValidHour()) {
                this.setState({ isSettingTime: false })
            } else {
                Alert.alert('Tourzan', 'Please enter correct hour and minutes.')
            }
        } else {
            this.setState({ isSettingTime: true })
        }
    }

    onUnSettingTime() {
        if (this.isValidHour()) {
            this.setState({ isSettingTime: false })
        } else {
            Alert.alert('Tourzan', 'Please enter correct hour and minutes.')
        }
    }

    setHour(text) {

        var hour = parseInt(text)

        if (hour) {
            hour = hour > 11 ? 11 : hour

            this.setState({ hour: hour.toString() })
        } else {
            this.setState({ hour: '' })
        }
    }

    setMinute(text) {

        var minute = parseInt(text)

        if (minute) {
            minute = minute > 59 ? 0 : minute

            this.setState({ minute: minute.toString() })
        } else {
            this.setState({ minute: '' })
        }
    }

    onChangeHourMinute(isHour, isUp) {

        var hour = parseInt(this.state.hour)
        var minute = parseInt(this.state.minute)

        if (isHour) {

            hour = (hour + 1 * (isUp ? 1 : -1))
            hour = (hour < 0) ? 11 : hour
            hour = (hour > 11) ? 0 : hour

            this.setState({ hour: ("0" + hour).slice(-2).toString() })
        } else {

            minute = minute + 1 * (isUp ? 1 : -1)
            minute = (minute < 0) ? 59 : minute
            minute = (minute > 59) ? 0 : minute

            this.setState({ minute: ("0" + minute).slice(-2).toString() })
        }
    }

    isValidHour = () => {
        var hour = parseInt(this.state.hour)
        var minute = parseInt(this.state.minute)
        if ((hour && (hour > 0) && (hour < 12)) && (minute && (minute > 0) && (minute < 59))) {
            return true
        }
        return false
    }
    //#endregion
    
    
    render() {
        const { navigate } = this.props.navigation;
        console.log('map_debug', this.props.isbooked);

        return (
            <View style={styles.container}>
                <View style={styles.statusbar} />
                <View style={styles.top_container}>
                    <View style={styles.backButton}>
                    </View>
                    <Text style={styles.centerText}>TOURZAN</Text>
                    <TouchableOpacity onPress={() => { navigate('Profile') } }>
                        <Image resizeMode='cover' source={{uri: profilePictureUrl()}} style={styles.rightView} />
                    </TouchableOpacity>
                </View>
                <View style={styles.map_container}>
                
                {/*
                    <MapView style={styles.map_view}
                        region={this.state.region}
                        onRegionChange={this.onRegionChange}>
                        <MapView.Marker
                            coordinate={this.state.region}
                            centerOffset={{ x: 0, y: 0 }}
                            anchor={{ x: 0.69, y: 1 }}
                            image={flagImg} />
                    </MapView>*/
                    }
                    <View style={styles.locationInfo_view}>
                        <View style={styles.location_address_view}>
                            <Image resizeMode='contain' source={require("../assets/images/location_maps.png")} style={styles.icon_image} />
                            <Text style={styles.row_text}>052 Maggio Road Apt. o16</Text>
                        </View>
                        <View style={styles.devide_line} />
                        {this.state.isSettingTime ? (
                            <View style={styles.setting_time_view}>
                                <TouchableOpacity onPress={() => this.onSettingTime()}>
                                    <View style={styles.setting_time_top_view}>
                                        <Image resizeMode='contain' source={require("../assets/images/time_icon.png")} style={styles.icon_image} />
                                        <Text style={styles.row_text}>{this.state.hour} : {this.state.minute} {this.state.trueSwitchIsOn ? 'AM' : 'PM'}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.setting_time_main_view}>
                                    <View style={styles.setting_time_lb_view}>
                                        <Text style={styles.setting_time_lb}>Set your time schedule</Text>
                                        <TouchableOpacity onPress={() => this.onUnSettingTime()}>
                                            <Image resizeMode='contain' source={require("../assets/images/checked_gray.png")} style={styles.setting_time_check_icon} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.setting_time_picker_view}>
                                        <View style={styles.setting_time_picker_main_view}>
                                            <View style={styles.hour_view}>
                                                <TouchableOpacity onPress={() => this.onChangeHourMinute(true, true)}>
                                                    <Image resizeMode='contain' source={require("../assets/images/caret-arrow-up.png")} style={styles.up_down_arrow_view} />
                                                </TouchableOpacity>
                                                <TextInput
                                                    style={styles.hour_text}
                                                    underlineColorAndroid='transparent'
                                                    value={this.state.hour}
                                                    keyboardType='numeric'
                                                    maxLength={2}
                                                    onChangeText={(text) => this.setHour(text)}
                                                    onSubmitEditing={this._onLogin}
                                                />
                                                <TouchableOpacity onPress={() => this.onChangeHourMinute(true, false)}>
                                                    <Image resizeMode='contain' source={require("../assets/images/caret-arrow-down.png")} style={styles.up_down_arrow_view} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.double_dut_view}>
                                                <Text style={styles.double_dut_symbol}>:</Text>
                                            </View>
                                            <View style={styles.minute_view}>
                                                <TouchableOpacity onPress={() => this.onChangeHourMinute(false, true)}>
                                                    <Image resizeMode='contain' source={require("../assets/images/caret-arrow-up.png")} style={styles.up_down_arrow_view} />
                                                </TouchableOpacity>
                                                <TextInput
                                                    style={styles.hour_text}
                                                    underlineColorAndroid='transparent'
                                                    value={this.state.minute}
                                                    keyboardType='numeric'
                                                    maxLength={2}
                                                    onChangeText={(text) => this.setMinute(text)}
                                                    onSubmitEditing={this._onLogin}
                                                />
                                                <TouchableOpacity onPress={() => this.onChangeHourMinute(false, false)}>
                                                    <Image resizeMode='contain' source={require("../assets/images/caret-arrow-down.png")} style={styles.up_down_arrow_view} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <Switch
                                            value={this.state.trueSwitchIsOn}
                                            onValueChange={(val) => this.setState({ trueSwitchIsOn: val })}
                                            disabled={false}
                                            activeText={'AM'}
                                            inActiveText={'PM'}
                                            backgroundActive={'#31dd73'}
                                            backgroundInactive={'#c2c3c9'}
                                            circleActiveColor={'white'}
                                            circleInActiveColor={'white'}
                                        />
                                    </View>
                                </View>
                            </View>
                        ) : (
                                <TouchableOpacity style={styles.location_time_touchable_view} onPress={() => this.onSettingTime()}>
                                    <View style={styles.location_time_view}>
                                        <View style={styles.location_time_left_child}>
                                            <Image resizeMode='contain' source={require("../assets/images/time_icon.png")} style={styles.icon_image} />
                                            <Text style={styles.row_text}>{this.state.hour} : {this.state.minute} {this.state.trueSwitchIsOn ? 'AM' : 'PM'}</Text>
                                        </View>
                                        <Image resizeMode='contain' source={require("../assets/images/edit_time.png")} style={styles.edit_time} />
                                    </View>
                                </TouchableOpacity>
                            )}
                    </View>
                    {
                        !this.props.isbooked ? (
                            <TouchableOpacity style={styles.booking_view} onPress={() => { navigate('BookingSearching') }}>
                                <Image resizeMode='cover' source={require("../assets/images/book.png")} style={styles.booking_green_btn} />
                            </TouchableOpacity>
                        ) : (
                                <TouchableOpacity style={styles.booking_view} onPress={() => { navigate('CurrentTimeLimit') }}>
                                    <Image resizeMode='cover' source={require("../assets/images/book_time.png")} style={styles.booking_green_btn} />
                                </TouchableOpacity>
                            )}
                </View>
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
        height: (Platform.OS == 'ios') ? 20 : StatusBar.currentHeight,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    top_container: {
        marginTop: (Platform.OS == 'ios') ? 20 : 0,
        height: 44,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        width: width,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },
    backButton: {
        marginLeft: 20,
        height: 20,
        width: 20,
    },
    centerText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 17,
        width: width - 160,
        fontWeight: 'bold',
    },
    rightView: {
        marginRight: 20,
        height: 36,
        width: 36,
        borderRadius:18,
    },
    map_container: {
        flex: 1,
        width: width,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    map_view: {
        flex: 1,
        width: width,
    },
    locationInfo_view: {
        position: 'absolute',
        width: width - 60,
        top: 25,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    location_address_view: {
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: width - 60,
        paddingHorizontal: 20,
    },
    devide_line: {
        backgroundColor: '#c2c3c9',
        height: 1,
        width: width - 60,
    },
    location_time_touchable_view: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
    },
    location_time_view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 30,
        width: width - 120,
    },
    location_time_left_child: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        // width:width-90,
    },
    booking_view: {
        position: 'absolute',
        width: 85,
        height: 85,
        bottom: 20,
        backgroundColor: 'transparent',
    },
    booking_green_btn: {
        backgroundColor: 'transparent',
        width: 85,
        height: 85,
    },
    icon_image: {
        marginLeft: 10,
        height: 15,
        width: 15,
    },
    row_text: {
        marginLeft: 15,
    },
    edit_time: {
        height: 15,
        width: 15,
    },

    // --- setting time view --- //
    setting_time_view: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    setting_time_top_view: {
        backgroundColor: '#f9fbfe',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        width: width - 62,
        borderBottomWidth: 1,
        borderColor: '#c2c3c9',
        paddingHorizontal: 20,
    },
    setting_time_main_view: {
        backgroundColor: 'white',
        flexDirection: 'column',
        alignItems: 'center',
    },
    setting_time_lb_view: {
        paddingVertical: 10,
        width: width - 120,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#c2c3c9',
    },
    setting_time_lb: {
        color: 'black',
    },
    setting_time_check_icon: {
        height: 15,
        width: 15,
    },
    setting_time_picker_view: {
        width: width - 120 - 20,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    setting_time_picker_main_view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hour_view: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hour_text: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
        height: 50,
        width: 40,
        borderWidth: 1,
        borderColor: '#979797',
        borderRadius: 5,
        textAlign: 'center',
    },
    hour_lb: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 15,
        color: '#9fa0a2',
    },
    double_dut_view: {
        marginBottom: 20,
        width: 60,
        alignItems: 'center',
    },
    double_dut_symbol: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
    },
    minute_view: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    up_down_arrow_view: {
        width: 40,
        height: 40,
    },
    switch_view: {

    },

});

// export default MapsScreen;
export default connect(mapStateToProps, mapDispatchToProps)(MapsScreen);