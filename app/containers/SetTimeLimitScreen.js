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
import { NavigationActions } from 'react-navigation'
import KeyEvent from 'react-native-keyevent';
import { Colors } from '../constants'
import ApplyButton from '../components/ApplyButton'
import moment from 'moment'

//Utilities
import { isIphoneX, isNumber, Storage } from "../global/Utilities"

//Store
import {store} from '../store/index'

//Actions
import { updatebooking } from '../actions/bookingActions'

var Toast = require('react-native-toast');

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({
});

class SetTimeLimitScreen extends React.Component {
    static navigationOptions = {
        title: 'Time Limit',
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            hour: moment.utc(this.props.bookingdata.timeLimit * 1000).format('HH'),
            minute: moment.utc(this.props.bookingdata.timeLimit * 1000).format('mm'),
        }

        this.navigate = this.props.navigation;
    }

    componentDidMount() {

        console.log('store', store.getState())

        KeyEvent.onKeyDownListener((keyCode) => {
            console.log(`Key code pressed: key down`);
            Toast.show.bind(null, 'key code pressed');
        });

    }

    onDone() {

        console.log("clicked on DoneButton!");

        if (!isNumber(this.state.hour) || !isNumber(this.state.minute) || (parseInt(this.state.hour) == 0 && parseInt(this.state.minute) == 0)) {

            Alert.alert('Tourzan', 'Please enter correct time.')

            return
        }

        //Update Booking
        let storestate = store.getState()
        storestate.tour.bookingdata.timeLimit = parseInt(this.state.hour) * 60 * 60 + parseInt(this.state.minute) * 60

        store.dispatch(
            updatebooking(storestate.tour.bookingdata)
        );

        this.navigate.dispatch(backAction);
    }

    setHour(text) {

        if (!isNumber(text)) {
            this.setState({ hour: '' })
            return
        }

        let hour = parseInt(text)

        if (hour > 24) {
            hour = 23
        }

        this.setState({ hour: hour.toString() })
    }

    setMinute(text) {

        if (!isNumber(text)) {
            this.setState({ minute: '' })
            return
        }

        let minutes = parseInt(text)

        if (minutes > 60) {
            minutes = 59
        }

        this.setState({ minute: minutes.toString() })
    }

    _onSubmitEditing = () => {

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.navigationbar}>
                    <TouchableOpacity onPress={() => { this.props.navigation.dispatch(backAction) }}>
                        <Image resizeMode='cover' source={require("../assets/images/back.png")} style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.centerText}>Time Limit</Text>
                    <View style={styles.rightView}>
                    </View>
                </View>
                <View style={styles.main_view}>
                    <View style={styles.main_top_view}>
                        <View style={styles.hour_view}>
                            <TextInput
                                style={styles.hour_text}
                                underlineColorAndroid='transparent'
                                value={this.state.hour}
                                keyboardType='numeric'
                                maxLength={2}
                                onChangeText={(text) => this.setHour(text)}
                                onSubmitEditing={this._onSubmitEditing}
                            />
                            <Text style={styles.hour_lb}>Hours</Text>
                        </View>
                        <View style={styles.double_dut_view}>
                            <Text style={styles.double_dut_symbol}>:</Text>
                        </View>
                        <View style={styles.minute_view}>
                            <TextInput
                                style={styles.hour_text}
                                underlineColorAndroid='transparent'
                                value={this.state.minute}
                                keyboardType='numeric'
                                maxLength={2}
                                onChangeText={(text) => this.setMinute(text)}
                                onSubmitEditing={this._onSubmitEditing}
                            />
                            <Text style={styles.hour_lb}>Minutes</Text>
                        </View>
                    </View>
                    <View style={styles.main_bottom_view}>
                        <ApplyButton onPress={() => this.onDone()} name={'Done'} style={styles.done_btn} />
                        <Text style={styles.note_text}>By clicking "Done". Guide will receive your time limit offer</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
    },

    // --- navigation bar --- //
    navigationbar: {
        paddingTop: (Platform.OS == 'ios') ? (isIphoneX() ? 44 : 20) : StatusBar.currentHeight,
        height: (Platform.OS == 'ios') ? (isIphoneX() ? 88 : 64) : 64,
        backgroundColor: '#31dd73',
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
        height: 20,
        width: 20
    },

    /// ------- main view -------///
    main_view: {
        flexDirection: 'column',
        alignItems: 'center',
        width: width,
        height: height - 44,
    },

    // --- main top view -- //
    main_top_view: {
        width: width,
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fbfe',
    },
    hour_view: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hour_text: {
        fontSize: 45,
        fontWeight: 'bold',
        color: 'black',
        height: 100,
        width: 90,
        borderWidth: 1,
        borderColor: '#979797',
        borderRadius: 5,
        textAlign: 'center',
    },
    hour_lb: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 20,
        color: '#9fa0a2',
    },
    double_dut_view: {
        marginBottom: 50,
        width: 70,
        alignItems: 'center',
    },
    double_dut_symbol: {
        fontSize: 45,
        fontWeight: 'bold',
        color: 'black',
    },
    minute_view: {
        flexDirection: 'column',
        alignItems: 'center',
    },

    // --- main bottom view -- //
    main_bottom_view: {
        width: width,
        flex: 0.5,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    done_btn: {
        marginTop: 20,
        width: width - 60,
    },
    note_text: {
        marginTop: 50,
        fontSize: 12,
        color: 'black',
        width: 200,
        textAlign: 'center',
    },
});

const mapStateToProps = store => {
    return {
        bookingdata: store.tour.bookingdata,
        userdata: store.user.userdata,
        currentlocation: store.location.currentlocation,
    };
};

export default connect(mapStateToProps)(SetTimeLimitScreen);
