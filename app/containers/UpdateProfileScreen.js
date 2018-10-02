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
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Colors } from '../constants'
import { NavigationActions } from 'react-navigation'
import MapView from 'react-native-maps';

import Switch from '../components/Switch';
import NavigationBar from '../components/NavigationBar';

import flagImg from '../assets/images/guide-dot.png';
import moment from 'moment';
import MapViewDirections from 'react-native-maps-directions';
import DateTimePicker from 'react-native-modal-datetime-picker';

//Store
import { store } from '../store/index'

//Actions
import { updatebooking } from '../actions/bookingActions'
import { updateuser } from '../actions/userActions'
import { updatelocation } from '../actions/locationActions'
import * as Actions from '../actions';

//Webservice
import {
    updateGuideProfile,
    updateTouristProfile,
    autocompleteCity
} from '../actions'

//Utilities
import { isIphoneX } from '../global/Utilities';

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({

});

class UpdateProfileScreen extends React.Component {

    //#region Constractors
    static navigationOptions = {
        header: null,

    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isDateTimePickerVisible: false,
            dobDate: new Date(),

            firstname: '',
            lastname: '',
            dob: '',
            profession: '',
            city: '',
            rate: '',
            overview: '',
            selectedInterests: [],
        };
    }

    //#endregion
    componentDidMount() {

    }

    componentWillUnmount() {

    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this._hideDateTimePicker();
        this.setState({ dobDate: date, dob: moment(date).format('MM-DD-YYYY') })
    };

    showLoading() {
        if (this.state.isLoading) {
            return (
                <ActivityIndicator color={'black'} size={'large'} style={styles.loadingView} />
            );
        }
    }

    //Common
    setFirstname(text) {
        this.setState({ firstname: text })
    }

    //Common
    setLastname(text) {
        this.setState({ lastname: text })
    }

    //Common
    setDOB(text) {
        this.setState({ dob: text })
    }

    //Tourist
    setProfession(text) {
        this.setState({ profession: text })
    }

    //Guide
    setCity(text) {
        this.setState({ city: text })
    }

    //Guide
    setRate(text) {
        this.setState({ rate: text.replace(/[^(((\d)+(\.)\d)|((\d)+))]/g, '_').split("_")[0] })
    }

    //Common
    setOverview(text) {
        this.setState({ overview: text })
    }

    onUpdateProfile() {

        if (this.props.userdata.user.isGuide) {
            if (this.validateGuidetData()) {
                this.updateGuideProfileWS()
            }
        } else {
            if (this.validateTouristData()) {
                this.updateTouristProfileWS()
            }
        }
    }

    validateTouristData() {
        if (this.state.firstname == '' || this.state.firstname.trim() == '') {
            Alert.alert('Tourzan', 'Please enter your firstname.')
            return false
        }

        if (this.state.lastname == '' || this.state.lastname.trim() == '') {
            Alert.alert('Tourzan', 'Please enter your lastname.')
            return false
        }

        if (this.state.dob == '' || this.state.dob.trim() == '') {
            Alert.alert('Tourzan', 'Please enter your birthdate.')
            return false
        }

        if (this.state.profession == '' || this.state.profession.trim() == '') {
            Alert.alert('Tourzan', 'Please enter your profession.')
            return false
        }

        if (this.state.overview == '' || this.state.overview.trim() == '') {
            Alert.alert('Tourzan', 'Please enter your overview.')
            return false
        }

        return true
    }

    validateGuidetData() {
        if (this.state.firstname == '' || this.state.firstname.trim() == '') {
            Alert.alert('Tourzan', 'Please enter your firstname.')
            return false
        }

        if (this.state.lastname == '' || this.state.lastname.trim() == '') {
            Alert.alert('Tourzan', 'Please enter your lastname.')
            return false
        }

        if (this.state.dob == '' || this.state.dob.trim() == '') {
            Alert.alert('Tourzan', 'Please enter your birthdate.')
            return false
        }

        if (this.state.city == '' || this.state.city.trim() == '') {
            Alert.alert('Tourzan', 'Please enter your city.')
            return false
        }

        if (this.state.rate == '' || this.state.rate.trim() == '') {
            Alert.alert('Tourzan', 'Please enter your rate.')
            return false
        }

        if (this.state.overview == '' || this.state.overview.trim() == '') {
            Alert.alert('Tourzan', 'Please enter your overview.')
            return false
        }

        return true
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
                    <Text style={styles.centerText}>Update Profile</Text>
                    <View style={styles.rightView}>
                        <TouchableOpacity onPress={() => this.onUpdateProfile()}>
                            <Text style={styles.rightView}>UPDATE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.main_view}>
                    <KeyboardAwareScrollView style={styles.out_container}>
                        <View style={styles.main_view}>
                            <View style={styles.blank_row_view}>
                            </View>

                            <View style={styles.row_icon_view}>
                                {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    placeholder='Firstname'
                                    style={styles.row_icon_lb}
                                    secureTextEntry={false}
                                    value={this.state.firstname}
                                    onChangeText={(text) => this.setFirstname(text)} />
                            </View>

                            <View style={styles.row_icon_view}>
                                {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    placeholder='Lastname'
                                    style={styles.row_icon_lb}
                                    secureTextEntry={false}
                                    value={this.state.lastname}
                                    onChangeText={(text) => this.setLastname(text)} />
                            </View>

                            <TouchableOpacity onPress={this._showDateTimePicker}>
                                <View pointerEvents="none" style={styles.row_icon_view}>
                                    {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}

                                    <TextInput
                                        underlineColorAndroid='transparent'
                                        placeholder='Date of Birth'
                                        style={styles.row_icon_lb}
                                        secureTextEntry={false}
                                        value={this.state.dob}
                                        onChangeText={(text) => this.setDOB(text)} />

                                </View>
                            </TouchableOpacity>

                            {!this.props.userdata.user.isGuide && <View style={styles.row_icon_view}>
                                {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    placeholder='Profession'
                                    style={styles.row_icon_lb}
                                    secureTextEntry={false}
                                    value={this.state.profession}
                                    onChangeText={(text) => this.setProfession(text)} />
                            </View>}

                            {this.props.userdata.user.isGuide && <TouchableOpacity onPress={() => { navigate('SelectCity', { cityDidSelected: this.cityDidSelected }) }}>
                                <View pointerEvents="none" style={styles.row_icon_view}>
                                    {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                                    <TextInput
                                        underlineColorAndroid='transparent'
                                        placeholder='City'
                                        style={styles.row_icon_lb}
                                        secureTextEntry={false}
                                        value={this.state.city}
                                        onChangeText={(text) => this.setCity(text)} />
                                    <Image resizeMode='contain' source={require("../assets/images/item_arrow.png")} style={styles.row_icon} />

                                </View>
                            </TouchableOpacity>}

                            {this.props.userdata.user.isGuide && <View style={styles.row_icon_view}>
                                {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    placeholder='Rate'
                                    style={styles.row_icon_lb}
                                    secureTextEntry={false}
                                    keyboardType='numeric'
                                    value={this.state.rate}
                                    onChangeText={(text) => this.setRate(text)} />
                            </View>}

                            <TouchableOpacity onPress={() => { navigate('SelectInterests', { interestsDidSelected: this.interestsDidSelected, selectedInterests: this.state.selectedInterests }) }}>
                                <View pointerEvents="none" style={styles.row_icon_view}>
                                    {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                                    <TextInput
                                        underlineColorAndroid='transparent'
                                        placeholder='Interests'
                                        style={styles.row_icon_lb}
                                        secureTextEntry={false}
                                        value={this.state.selectedInterests.toString()}
                                        onChangeText={(text) => this.setCity(text)} />
                                    <Image resizeMode='contain' source={require("../assets/images/item_arrow.png")} style={styles.row_icon} />
                                </View>
                            </TouchableOpacity>

                            <View style={styles.row_icon_view}>
                                {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    placeholder='Overview'
                                    style={styles.row_icon_lb}
                                    secureTextEntry={false}
                                    value={this.state.overview}
                                    multiline={true}
                                    onChangeText={(text) => this.setOverview(text)} />
                            </View>

                        </View>
                    </KeyboardAwareScrollView>

                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                        maximumDate={new Date()}
                    />
                </View>
                {this.showLoading()}
            </View>
        );
    }

    //
    updateGuideProfileWS() {

        this.setState({
            isLoading: true
        })

        var { dispatch } = this.props;

        var params = {
            'dob': this.state.dob,
            'first_name': this.state.firstname,
            'last_name': this.state.lastname,
            'city': this.state.city,
            'rate': this.state.rate,
            'overview': this.state.overview
        }

        updateGuideProfile(params)

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

    //
    updateTouristProfileWS() {

        this.setState({
            isLoading: true
        })

        var { dispatch } = this.props;

        let age = moment().diff(date, 'years', false);

        var params = {
            'about': this.state.overview,
            'first_name': this.state.firstname,
            'last_name': this.state.lastname,
            'age': age,
            'dob': this.state.dob,
            'profession': this.state.profession
        }

        updateTouristProfile(params)

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

    //Select city callback
    cityDidSelected = (city) => {
        console.log('cityDidSelected', city.description);

        this.setState({ city: city.description })
    };

    //Select city callback
    interestsDidSelected = (interests) => {
        console.log('interests', interests);

        this.setState({ selectedInterests: interests })
    };
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
        marginRight: 8,
        height: 20,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
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
        fontSize: 15,
        marginTop: 10,
        flex: 1
    },
    row_icon: {
        height: 15,
        width: 15,
    },
    row_small_icon: {
        width: 15,
        height: 15,
    },
});

const mapStateToProps = store => {
    return {
        bookingdata: store.tour.bookingdata,
        userdata: store.user.userdata,
        currentlocation: store.location.currentlocation,
    };
};

export default connect(mapStateToProps)(UpdateProfileScreen);
