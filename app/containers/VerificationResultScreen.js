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
    ActivityIndicator,
    Linking
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Colors } from '../constants'
import { NavigationActions } from 'react-navigation'
import MapView from 'react-native-maps';

import Switch from '../components/Switch';
import NavigationBar from '../components/NavigationBar';

import flagImg from '../assets/images/guide-dot.png';
import moment from 'moment';

//Store
import { store } from '../store'

//Actions
import { updatebooking } from '../actions/bookingActions'
import { updateuser } from '../actions/userActions'
import { updatelocation } from '../actions/locationActions'
import * as Actions from '../actions';

//Webservice
import {
    updateClockInOutStatus,
    acceptTrip,
    declineTrip,
    cancelTrip,
    updateTrip,
    loginAndUpdateTrip,
    getnearbyguides
} from '../actions'

//Utilities
import { isIphoneX } from '../global/Utilities';
import { API } from '../constants'

//FCM
import FCM, { NotificationActionType } from "react-native-fcm";
import { registerKilledListener, registerAppListener } from "../global/Firebase/Listeners"
import firebaseClient from "../global/Firebase/FirebaseClient";

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({

});

class VerificationResultScreen extends React.Component {

    //#region Constractors
    static navigationOptions = {
        header: null,

    };

    constructor(props) {
        super(props);
        this.state = {
            nearByGuides: [],
            isLoading: false
        };

    }

    //#endregion
    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    showLoading() {
        if (this.state.isLoading) {
            return (
                <ActivityIndicator color={'black'} size={'large'} style={styles.loadingView} />
            );
        }
    }

    showMessage() {

        const { type } = this.props.navigation.state.params;

        if (type == 0) {
            return (
                <Text style={styles.paragraph}>Your profile already verified!</Text>
            );
        } else if (type == 1) {
            return (
                <Text style={styles.paragraph}>We are running the report in the background. if it comes back as fuzzy or rejected, you will no longer be verified and will have to redo your verification.</Text>
            );
        } else if (type == 2) {
            return (
                <Text style={styles.paragraph}>Your verification results came up fuzzy we need you to resubmit proper information. {"\n"}{"\n"}Please reach out to us at <Text onPress={() => Linking.openURL(API.CONTACT_US_EMAIL)} style={{ color: 'blue' }}>{API.CONTACT_US_EMAIL}</Text> to have your verification reset.</Text>
            );
        }
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={styles.statusbar} />
                <View style={styles.navigationbar}>
                    <TouchableOpacity onPress={() => { this.props.navigation.dispatch(backAction) }}>
                        <Image resizeMode='cover' source={require("../assets/images/back.png")} style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.centerText}>Onfido Verification Status</Text>
                    <View style={styles.rightView}>
                    </View>
                </View>

                <View style={styles.paragraphView}>
                    {this.showMessage()}
                </View>

                <View style={styles.main_view}>

                </View>
                {this.showLoading()}
            </View>
        );
    }

    //
    updateClockInOutStatusWS() {

        this.setState({
            isLoading: true
        })

        var { dispatch } = this.props;

        var params = {
            userid: this.props.userdata.user.userid,
            status: this.props.userdata.user.isClockedIn ? 'clockout' : 'clockin',
            latitude: this.props.currentlocation.lat,
            longitude: this.props.currentlocation.long,
        }

        updateClockInOutStatus(params)

            .then(data => {

                this.setState({
                    isLoading: false
                })

            })
            .catch(err => {
                this.setState({
                    isLoading: false
                })
                alert(err)
            })
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
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

    // --- navigation bar --- //
    navigationbar: {
        height: 44,
        marginTop: (Platform.OS == 'ios') ? (isIphoneX() ? 44 : 20) : 0,
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
        height: 20,
        width: 20
    },

    // --- Text --- //

    paragraphView: {
        //justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },

    paragraph: {
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold',
        //textAlign: 'center',
        color: '#34495e',
        justifyContent: 'center',
    },


    // --- Activity --- //
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

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

const mapStateToProps = store => {
    return {
        bookingdata: store.tour.bookingdata,
        userdata: store.user.userdata,
        currentlocation: store.location.currentlocation,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerificationResultScreen);
