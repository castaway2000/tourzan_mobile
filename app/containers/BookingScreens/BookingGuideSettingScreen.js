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

import moment from 'moment'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Colors } from '../../constants'
import { NavigationActions, StackActions } from 'react-navigation'
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import NavigationBar from '../../components/NavigationBar'
import ApplyButton from '../../components/ApplyButton'
import BraintreeDropIn from 'react-native-braintree-payments-drop-in';

//Utils
import { Storage, isIphoneX } from '../../global/Utilities';

//Webservice
import { bookGuide, acceptTrip } from '../../actions'

//Store
import { store } from '../../store/index'

//Actions
import { updatebooking } from '../../actions/bookingActions'
import { updateuser } from '../../actions/userActions'

import { Marker } from 'react-native-maps/lib/components/MapView';

//Geo coder
import Geocoder from '../../global/Geocoder';
Geocoder.init('AIzaSyAq-cJJqZ8jWN4pJQ34tNbNdhbjsbuZUJs'); // use a valid API key

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({

});

const popToTopAction = NavigationActions.popToTop({

});

const resetRootAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Home' }),
    ],
    key: null
});

class BookingGuideSettingScreen extends React.Component {
    static navigationOptions = {
        title: 'Booking Guide Setting',
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isExtendTerm: false,
            isHourlyOrManual: false,
            isCheckHoulryOrManual: false,
            isLoading: false,
            address: '',
        };
        this.navigate = this.props.navigation;
    }

    componentDidMount() {
        this.showAddress()
    }

    onConfirm() {

        this.bookGuideWS()

        //this.navigate.navigate('Offer');
    }

    onPaymentSetting() {
        
        //this.navigate.navigate('PaymentMethod');

        // BraintreeDropIn.show({
        //   clientToken: 'eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiI0NzA4ZmE1MmI0MzdhMzc3YzRhMzU0ZTVlYmY0NzU5OWQ2ZTEwOWY0NDEwODFiYTQwOWIzMmI3MGRlZDM4NjYwfGNyZWF0ZWRfYXQ9MjAxOC0wOC0yN1QxMjoxODowNy44MDIxOTA1NzYrMDAwMFx1MDAyNm1lcmNoYW50X2lkPTM0OHBrOWNnZjNiZ3l3MmJcdTAwMjZwdWJsaWNfa2V5PTJuMjQ3ZHY4OWJxOXZtcHIiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvMzQ4cGs5Y2dmM2JneXcyYi9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJjaGFsbGVuZ2VzIjpbXSwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwiY2xpZW50QXBpVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzLzM0OHBrOWNnZjNiZ3l3MmIvY2xpZW50X2FwaSIsImFzc2V0c1VybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXV0aFVybCI6Imh0dHBzOi8vYXV0aC52ZW5tby5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIiwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vb3JpZ2luLWFuYWx5dGljcy1zYW5kLnNhbmRib3guYnJhaW50cmVlLWFwaS5jb20vMzQ4cGs5Y2dmM2JneXcyYiJ9LCJ0aHJlZURTZWN1cmVFbmFibGVkIjp0cnVlLCJwYXlwYWxFbmFibGVkIjp0cnVlLCJwYXlwYWwiOnsiZGlzcGxheU5hbWUiOiJBY21lIFdpZGdldHMsIEx0ZC4gKFNhbmRib3gpIiwiY2xpZW50SWQiOm51bGwsInByaXZhY3lVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vcHAiLCJ1c2VyQWdyZWVtZW50VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3RvcyIsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImFsbG93SHR0cCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOnRydWUsImVudmlyb25tZW50Ijoib2ZmbGluZSIsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJicmFpbnRyZWVDbGllbnRJZCI6Im1hc3RlcmNsaWVudDMiLCJiaWxsaW5nQWdyZWVtZW50c0VuYWJsZWQiOnRydWUsIm1lcmNoYW50QWNjb3VudElkIjoiYWNtZXdpZGdldHNsdGRzYW5kYm94IiwiY3VycmVuY3lJc29Db2RlIjoiVVNEIn0sIm1lcmNoYW50SWQiOiIzNDhwazljZ2YzYmd5dzJiIiwidmVubW8iOiJvZmYifQ==',
        // })
        //   .then(result => console.log(result))
        //   .catch((error) => {
        //     if (error.code === 'USER_CANCELLATION') {
        //       // update your UI to handle cancellation
        //     } else {
        //       // update your UI to handle other errors
        //     }
        //   });

        BraintreeDropIn.show({
            clientToken: 'eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiI0NzA4ZmE1MmI0MzdhMzc3YzRhMzU0ZTVlYmY0NzU5OWQ2ZTEwOWY0NDEwODFiYTQwOWIzMmI3MGRlZDM4NjYwfGNyZWF0ZWRfYXQ9MjAxOC0wOC0yN1QxMjoxODowNy44MDIxOTA1NzYrMDAwMFx1MDAyNm1lcmNoYW50X2lkPTM0OHBrOWNnZjNiZ3l3MmJcdTAwMjZwdWJsaWNfa2V5PTJuMjQ3ZHY4OWJxOXZtcHIiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvMzQ4cGs5Y2dmM2JneXcyYi9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJjaGFsbGVuZ2VzIjpbXSwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwiY2xpZW50QXBpVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzLzM0OHBrOWNnZjNiZ3l3MmIvY2xpZW50X2FwaSIsImFzc2V0c1VybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXV0aFVybCI6Imh0dHBzOi8vYXV0aC52ZW5tby5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIiwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vb3JpZ2luLWFuYWx5dGljcy1zYW5kLnNhbmRib3guYnJhaW50cmVlLWFwaS5jb20vMzQ4cGs5Y2dmM2JneXcyYiJ9LCJ0aHJlZURTZWN1cmVFbmFibGVkIjp0cnVlLCJwYXlwYWxFbmFibGVkIjp0cnVlLCJwYXlwYWwiOnsiZGlzcGxheU5hbWUiOiJBY21lIFdpZGdldHMsIEx0ZC4gKFNhbmRib3gpIiwiY2xpZW50SWQiOm51bGwsInByaXZhY3lVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vcHAiLCJ1c2VyQWdyZWVtZW50VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3RvcyIsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImFsbG93SHR0cCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOnRydWUsImVudmlyb25tZW50Ijoib2ZmbGluZSIsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJicmFpbnRyZWVDbGllbnRJZCI6Im1hc3RlcmNsaWVudDMiLCJiaWxsaW5nQWdyZWVtZW50c0VuYWJsZWQiOnRydWUsIm1lcmNoYW50QWNjb3VudElkIjoiYWNtZXdpZGdldHNsdGRzYW5kYm94IiwiY3VycmVuY3lJc29Db2RlIjoiVVNEIn0sIm1lcmNoYW50SWQiOiIzNDhwazljZ2YzYmd5dzJiIiwidmVubW8iOiJvZmYifQ==',
            threeDSecure: {
                amount: 1000.0,
            },
        })
            .then(result => console.log(result))
            .catch((error) => {
                if (error.code === 'USER_CANCELLATION') {
                    // update your UI to handle cancellation
                } else {
                    // update your UI to handle other errors
                    // for 3D secure, there are two other specific error codes: 3DSECURE_NOT_ABLE_TO_SHIFT_LIABILITY and 3DSECURE_LIABILITY_NOT_SHIFTED
                }
            });
    }

    onTimeLimitSetting() {
        this.navigate.navigate('TimeLimit');
    }

    onExtendTerm() {

        console.log('onExtendTerm')

        this.setState(previousState => {
            return { isExtendTerm: true, };
        });
    }

    onUnExtendTerm() {

        console.log('onUnExtendTerm')

        this.setState(previousState => {
            return { isExtendTerm: false, };
        });
    }

    onDone() {

        this.setState(previousState => {
            return { isHourlyOrManual: previousState.isCheckHoulryOrManual ? true : false }
        });

        this.onUnExtendTerm();
    }

    onCheckHourly() {
        this.setState(previousState => {
            return { isCheckHoulryOrManual: false, };
        });
    }

    onCheckManual() {
        this.setState(previousState => {
            return { isCheckHoulryOrManual: true, };
        });
    }

    bookGuideWS() {

        var { params } = this.props.navigation.state

        var guide = params.guide

        this.setState({
            isLoading: true
        })

        var { dispatch } = this.props;

        //Get store data
        let storestate = store.getState()
        storestate.tour.bookingdata.isTripInProgress = true
        storestate.tour.bookingdata.isAutomatic = !this.state.isCheckHoulryOrManual

        storestate.tour.bookingdata.bookedTime = moment().format('YYYY-MM-DD H:mm:ss');

        store.dispatch(
            updatebooking(storestate.tour.bookingdata)
        );

        var params = {
            token: this.props.userdata.token,
            userid: this.props.userdata.user.userid,
            guides: '[' + parseInt(guide.id) + ']',
            latitude: this.props.currentlocation.lat,
            longitude: this.props.currentlocation.long,
            timelimit: storestate.tour.bookingdata.timeLimit,
            bookingtype: storestate.tour.bookingdata.isAutomatic ? 'automatic' : 'manual'
        }

        bookGuide(params)

            .then(data => {

                this.setState({
                    isLoading: false
                })

                Alert.alert(
                    'Book Guide Responce',
                    JSON.stringify(data),
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.props.navigation.dispatch(popToTopAction)
                            }
                        },
                    ],
                    { cancelable: false }
                )

                console.log('bookGuideWS-->', data)

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

    //Full name
    fullname = () => {

        var { params } = this.props.navigation.state

        var guide = params.guide

        if (!guide) {
            return ''
        }

        let isGuide = guide.is_guide

        let fullname = ''

        if (guide.first_name) {
            fullname = guide.first_name
        }

        if (guide.last_name) {
            fullname = fullname + ' ' + guide.last_name
        }

        if (!fullname) {
            fullname = isGuide ? 'Guide' : 'Tourist'
        }

        return fullname
    }

    rating = () => {

        var { params } = this.props.navigation.state

        var guide = params.guide

        return guide.guide_data.guide_rating
    }

    showAddress = () => {

        var { params } = this.props.navigation.state

        var guide = params.guide

        if (!guide.latitude || !guide.longitude) {
            this.setState({ address: 'No location' })
        }

        Geocoder.from(guide.latitude, guide.longitude)
            .then(json => {
                var addressComponent = json.results[0].address_components[0];

                this.setState({ address: json.results[0].formatted_address })
            })
            .catch(error => console.warn(error));
    }

    profileImage = () => {

        var profileImage = null;
        var profileImageobj = {};

        var { params } = this.props.navigation.state

        var guide = params.guide

        let isGuide = guide.is_guide

        if (!isGuide) {
            profileImage = guide.profile_picture
        } else {
            if (guide.profile_picture) {
                profileImage = guide.profile_picture
            } else if (uide.guide_data.profile_image) {
                profileImage = uide.guide_data.profile_image
            }
        }

        if (profileImage) {
            profileImageobj = { uri: profileImage }
        } else {
            profileImage = require("../../assets/images/defaultavatar.png")
        }

        return profileImage
    }

    render() {

        const { navigate } = this.props.navigation;

        var { params } = this.props.navigation.state

        var guide = params.guide

        return (
            <View style={styles.container}>
                <View style={styles.navigationbar}>
                    <TouchableOpacity onPress={() => { this.props.navigation.dispatch(resetRootAction) }}>
                        <Image resizeMode='cover' source={require("../../assets/images/back.png")} style={styles.nav_back_btn} />
                    </TouchableOpacity>
                    <Text style={styles.nav_center_text}></Text>
                    <TouchableOpacity onPress={() => { navigate('ProfileCharRoomFromBooking') }}>
                        <Image resizeMode='cover' source={require("../../assets/images/profile_chat_icon.png")} style={styles.nav_right_view} />
                    </TouchableOpacity>
                </View>
                {/*<ScrollView style={styles.scrollview}>*/}
                <View style={styles.content_view}>
                    <View style={styles.top_container}>
                        <View style={styles.top_container_bg_view}>
                        </View>
                        <View style={styles.top_info_view} pointerEvents="none">
                            <Text style={styles.top_name_text}>{this.fullname()}</Text>
                            <View style={styles.top_location_view}>
                                <Image resizeMode='contain' source={require("../../assets/images/location_maps.png")} style={styles.top_location_icon} />
                                <Text style={styles.top_location_text}>{this.state.address}</Text>
                            </View>
                            {/* <Rating ratingCount={5} imageSize={12} style={{ marginTop: 5 }} onFinishRating={this.ratingCompleted} /> */}
                            <Stars
                                rating={this.rating()}
                                count={5}
                                half={true}
                                spacing={0}
                                fullStar={<Icon name={'star'} style={[styles.starStyle]} />}
                                emptyStar={<Icon name={'star-outline'} style={[styles.starStyle, styles.emptyStarStyle]} />}
                                halfStar={<Icon name={'star-half'} style={[styles.starStyle]} />}
                            />
                        </View>
                    </View>
                    <View style={styles.setting_container}>
                        <View style={styles.row_setting_view}>
                            <View style={styles.setting_text_view}>
                                <Text style={styles.setting_text}>Payment Method</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.onPaymentSetting()} style={styles.row_setting_btn_view}>
                                <View style={styles.row_setting_btn_left_view}>
                                    <Image resizeMode='contain' source={require("../../assets/images/cash_icon.png")} style={styles.row_setting_btn_icon} />
                                    <Text style={styles.row_setting_btn_text}>Set Credit Card</Text>
                                </View>
                                <Image resizeMode='contain' source={require("../../assets/images/item_arrow.png")} style={styles.row_setting_btn_right_icon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row_setting_view}>
                            <View style={styles.setting_text_view_term}>
                                <Text style={styles.setting_text}>Time Limit Settings</Text>
                                {this.state.isExtendTerm ? (
                                    <TouchableOpacity onPress={() => this.onDone()}>
                                        <Text style={styles.done_text}>DONE</Text>
                                    </TouchableOpacity>
                                ) : (
                                        <TouchableOpacity pointerEvents='none'>
                                            <Text style={styles.done_text}></Text>
                                        </TouchableOpacity>
                                    )}
                            </View>
                            {this.state.isExtendTerm ? (
                                !this.state.isHourlyOrManual ? (
                                    <View style={styles.setting_term_extend_view}>
                                        <TouchableOpacity style={styles.hourly_setting_view} onPress={() => this.onCheckHourly()}>
                                            <View style={styles.row_setting_btn_left_view}>
                                                <Image resizeMode='contain' source={require("../../assets/images/time_icon_black.png")} style={styles.row_setting_btn_icon} />
                                                <Text style={styles.row_setting_btn_text}>Automatic</Text>
                                            </View>
                                            {this.state.isCheckHoulryOrManual ? (
                                                <Image resizeMode='contain' source={require("../../assets/images/unchecked_gray_badge.png")} style={styles.row_setting_btn_right_icon} />
                                            ) : (
                                                    <Image resizeMode='contain' source={require("../../assets/images/checked_green_badge.png")} style={styles.row_setting_btn_right_icon} />
                                                )}

                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.manual_setting_view} onPress={() => this.onCheckManual()}>
                                            <View style={styles.row_setting_btn_left_view}>
                                                <Image resizeMode='contain' source={require("../../assets/images/forms.png")} style={styles.row_setting_btn_icon} />
                                                <Text style={styles.row_setting_btn_text}>Manual</Text>
                                            </View>
                                            {this.state.isCheckHoulryOrManual ? (
                                                <Image resizeMode='contain' source={require("../../assets/images/checked_green_badge.png")} style={styles.row_setting_btn_right_icon} />
                                            ) : (
                                                    <Image resizeMode='contain' source={require("../../assets/images/unchecked_gray_badge.png")} style={styles.row_setting_btn_right_icon} />
                                                )}
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                        <View style={styles.setting_term_extend_view}>
                                            <TouchableOpacity style={styles.manual_setting_view} onPress={() => this.onCheckManual()}>
                                                <View style={styles.row_setting_btn_left_view}>
                                                    <Image resizeMode='contain' source={require("../../assets/images/forms.png")} style={styles.row_setting_btn_icon} />
                                                    <Text style={styles.row_setting_btn_text}>Manual</Text>
                                                </View>
                                                {this.state.isCheckHoulryOrManual ? (
                                                    <Image resizeMode='contain' source={require("../../assets/images/checked_green_badge.png")} style={styles.row_setting_btn_right_icon} />
                                                ) : (
                                                        <Image resizeMode='contain' source={require("../../assets/images/unchecked_gray_badge.png")} style={styles.row_setting_btn_right_icon} />
                                                    )}
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.hourly_setting_view} onPress={() => this.onCheckHourly()}>
                                                <View style={styles.row_setting_btn_left_view}>
                                                    <Image resizeMode='contain' source={require("../../assets/images/time_icon_black.png")} style={styles.row_setting_btn_icon} />
                                                    <Text style={styles.row_setting_btn_text}>Automatic</Text>
                                                </View>
                                                {this.state.isCheckHoulryOrManual ? (
                                                    <Image resizeMode='contain' source={require("../../assets/images/unchecked_gray_badge.png")} style={styles.row_setting_btn_right_icon} />
                                                ) : (
                                                        <Image resizeMode='contain' source={require("../../assets/images/checked_green_badge.png")} style={styles.row_setting_btn_right_icon} />
                                                    )}
                                            </TouchableOpacity>
                                        </View>
                                    )
                            ) : (
                                    !this.state.isHourlyOrManual ? (
                                        <TouchableOpacity onPress={() => this.onExtendTerm()} style={styles.row_setting_btn_view}>
                                            <View style={styles.row_setting_btn_left_view}>
                                                <Image resizeMode='contain' source={require("../../assets/images/time_icon_black.png")} style={styles.row_setting_btn_icon} />
                                                <Text style={styles.row_setting_btn_text}>Automatic</Text>
                                            </View>
                                            <Image resizeMode='contain' source={require("../../assets/images/edit_icon.png")} style={styles.row_setting_btn_right_icon} />
                                        </TouchableOpacity>
                                    ) : (
                                            <TouchableOpacity onPress={() => this.onExtendTerm()} style={styles.row_setting_btn_view}>
                                                <View style={styles.row_setting_btn_left_view}>
                                                    <Image resizeMode='contain' source={require("../../assets/images/forms.png")} style={styles.row_setting_btn_icon} />
                                                    <Text style={styles.row_setting_btn_text}>Manual</Text>
                                                </View>
                                                <Image resizeMode='contain' source={require("../../assets/images/edit_icon.png")} style={styles.row_setting_btn_right_icon} />
                                            </TouchableOpacity>
                                        )
                                )}
                        </View>
                        <View style={styles.row_setting_view}>
                            <View style={styles.setting_text_view}>
                                <Text style={styles.setting_text}>Time Limit</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.onTimeLimitSetting()} style={styles.row_setting_btn_view}>
                                <View style={styles.row_setting_btn_left_view}>
                                    <Text style={styles.row_setting_btn_time_text}>Set Time Limit</Text>
                                </View>
                                <Image resizeMode='contain' source={require("../../assets/images/item_arrow.png")} style={styles.row_setting_btn_right_icon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bottom_container}>
                        <ApplyButton onPress={() => this.onConfirm()} name={'Confirm'} style={styles.confirm_btn} />
                    </View>
                    <Image resizeMode='cover' source={this.profileImage()} style={styles.top_avatar_icon} />
                </View>
                {this.showLoading()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'column',
    },

    // ---- top naviatgion bar ----//
    navigationbar: {
        paddingTop: (Platform.OS == 'ios') ? (isIphoneX() ? 44 : 20) : StatusBar.currentHeight,
        height: 64,
        backgroundColor: '#31dd73',
        width: width,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nav_back_btn: {
        marginLeft: 20,
        height: 15,
        width: 10,
    },
    nav_center_text: {
        color: '#000',
        textAlign: 'center',
        fontSize: 17,
        width: width - 160,
        fontWeight: 'bold',
    },
    nav_right_view: {
        marginRight: 20,
        height: 20,
        width: 20
    },

    // --- scroll view --- //
    scrollview: {

    },
    content_view: {
        //   height:1000,
        alignItems: 'center',
    },

    // --- top container ---//
    top_container: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    top_container_bg_view: {
        height: 50,
        width: width,
        backgroundColor: '#31dd73',
    },
    top_avatar_icon: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 10,
        backgroundColor: 'lightgray'
    },
    top_info_view: {
        backgroundColor: 'white',
        width: width,
        height: 100,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'column',
        alignItems: 'center',
    },
    top_name_text: {
        marginTop: 30,
        fontSize: 15,
        color: '#000',
        textAlign: 'left',
    },
    top_location_view: {
        marginTop: 5,
        marginLeft: 30,
        marginRight: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    top_location_icon: {
        width: 10,
        height: 10,
    },
    top_location_text: {
        marginLeft: 5,
        fontSize: 12,
        color: Colors.color999,
        textAlign: 'left',
    },

    //--- setting container ---//
    setting_container: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    row_setting_view: {
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    setting_text_view: {
        paddingVertical: 7,
        paddingLeft: 20,
        width: width,
        backgroundColor: '#f9fbfc',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    setting_text: {
        fontSize: 13,
        color: Colors.tintColor
    },
    row_setting_btn_view: {
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    row_setting_btn_left_view: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 30,
    },
    row_setting_btn_icon: {
        height: 20,
        width: 20,
    },
    row_setting_btn_text: {
        marginLeft: 10,
        fontSize: 15,
        color: 'black',
    },
    row_setting_btn_time_text: {
        fontSize: 15,
        color: 'black',
    },
    row_setting_btn_right_icon: {
        height: 20,
        width: 20,
        marginRight: 30,
    },
    setting_term_extend_view: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    hourly_setting_view: {
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    manual_setting_view: {
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    done_text: {
        fontSize: 15,
        color: '#31dd73',
        marginRight: 20,
    },
    setting_text_view_term: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 7,
        paddingLeft: 20,
        width: width,
        backgroundColor: '#f9fbfc',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },

    //--- bottom container ---//
    confirm_btn: {
        marginTop: 30,
        marginBottom: 200,
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

    //--- star style ---//
    starStyle: {
        color: '#f3bc17',
        backgroundColor: 'transparent',
    },
    emptyStarStyle: {
        color: '#f3bc17',
    }
});


const mapStateToProps = store => {
    return {
        bookingdata: store.tour.bookingdata,
        userdata: store.user.userdata,
        currentlocation: store.location.currentlocation,
    };
};


export default connect(mapStateToProps)(BookingGuideSettingScreen);