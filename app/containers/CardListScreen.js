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
    FlatList,
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
import { store } from '../store/index'

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
    getnearbyguides,
    brainTreeToken,
    brainTreeSaveNonce,
    allPayments,
    setDefaultCard,
    deactiveteCard
} from '../actions'

//Utilities
import { isIphoneX } from '../global/Utilities';

//FCM
import FCM, { NotificationActionType } from "react-native-fcm";
import { registerKilledListener, registerAppListener } from "../global/Firebase/Listeners"
import firebaseClient from "../global/Firebase/FirebaseClient";

//Braintree Dropin
import BraintreeDropIn from 'react-native-braintree-payments-drop-in';

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({

});

const numColumns = 2;
const size = Dimensions.get('window').width / numColumns;

const checkedCard = require('./../assets/images/card-checked.png')
const unCheckedCard = require('./../assets/images/card-unchecked.png')
const removeCard = require('./../assets/images/card-remove.png')


class CardListScreen extends React.Component {

    //#region Constractors
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            braintreeClientToken: '',
            isLoading: false,
            message: ''
        };
    }

    //#endregion
    async componentWillMount() {

    }

    componentDidMount() {

        this.getBrainTreeTokenWS()

        this.getAllPaymentsDetail()
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

    // card-checked.png
    // card-checked.png
    onAddPaymentMethod() {

        BraintreeDropIn.show({
            clientToken: this.state.braintreeClientToken,
        })
            .then(result => {

                console.log("result:", result)
                /* Result
                    description: "ending in 31"
                    isDefault: false
                    nonce: "tokencc_bf_hkmznk_95253c_nzgzkq_q6f6mz_m9z"
                    type: "AMEX"
                    */

                this.saveNonceToServer(result)
            })
            .catch((error) => {
                if (error.code === 'USER_CANCELLATION') {
                    // update your UI to handle cancellation
                } else {
                    // update your UI to handle other errors
                    console.log("result:", result)

                }
            });

        /*
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
            });*/
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
                    <Text style={styles.centerText}>Your Payment Methods</Text>
                    <View style={styles.rightView}>

                        {this.state.braintreeClientToken.length > 0 &&
                            <TouchableOpacity onPress={() => { this.onAddPaymentMethod() }}>
                                <Image resizeMode='cover' source={require("../assets/images/add-card-payment.png")} style={styles.addPayment} />
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={styles.listview}>

                    {this.state.cards.length > 0 &&
                        <FlatList
                            data={this.state.cards}
                            renderItem={({ item, index }) => (
                                <View style={styles.itemContainer}>
                                    <View style={styles.item}>
                                        <Text style={styles.itemcarddigit}>{item.card_number}</Text>

                                        <Image source={require('./../assets/images/visa-straight-32px.png')} style={{ width: 50, height: 30, position: 'absolute', bottom: 10, right: 10 }} />
                                        {item.is_active == true && <TouchableOpacity onPress={() => this.setDefaultCardWS(item)} style={{ width: 50, height: 30, position: 'absolute', bottom: 10, left: 10 }}>
                                            <Image source={item.is_default ? checkedCard : unCheckedCard} />
                                        </TouchableOpacity>}

                                        {item.is_active == true && <TouchableOpacity onPress={() => this.removeCardWS(item)} style={{ width: 50, height: 30, position: 'absolute', bottom: 10, left: 50 }}>
                                            <Image source={removeCard} />
                                        </TouchableOpacity>}

                                        {item.is_active == false && <Text style={{ position: 'absolute', bottom: 10, left: 4, color: 'red' }}>Disabled</Text>}

                                    </View>
                                </View>
                            )}
                            keyExtractor={item => item.id}
                            numColumns={numColumns} />}

                    {this.state.cards.length < 1 &&
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ width: '100%', textAlign: 'center' }}>{this.state.message}</Text>
                        </View>}
                </View>

                {this.showLoading()}

            </View>
        );
    }

    //
    getBrainTreeTokenWS() {

        this.setState({
            isLoading: true
        })

        brainTreeToken()

            .then(data => {

                if (data.braintree_client_token) {
                    this.setState({ braintreeClientToken: data.braintree_client_token })
                }

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

    saveNonceToServer(result) {

        /* Result
        description: "ending in 31"
        isDefault: false
        nonce: "tokencc_bf_hkmznk_95253c_nzgzkq_q6f6mz_m9z"
        type: "AMEX"
        */

        this.setState({
            isLoading: true
        })

        let params = { paymentmethodnonce: result.nonce, isdefault: result.isDefault }

        brainTreeSaveNonce(params)

            .then(data => {

                this.setState({
                    isLoading: false
                })

                if (data && data.status == 'success') {
                    Alert.alert('Tourzan', data.message ? data.message : 'A new payment method was successfully added!')
                } else {
                    Alert.alert('Tourzan', data.message ? data.message : 'Error while saving card.')
                }

            })
            .catch(err => {
                this.setState({
                    isLoading: false
                })
                alert(err)
            })
    }

    getAllPaymentsDetail() {

        this.setState({
            isLoading: true
        })

        allPayments()

            .then(data => {

                this.setState({
                    isLoading: false
                })

                if (data && data.length > 0) {
                    this.setState({ cards: data, message: '' })
                } else {
                    this.setState({ message: 'There are no Payment method added.' })
                }
            })
            .catch(err => {
                this.setState({
                    isLoading: false
                })
                alert(err)
            })
    }


    setDefaultCardWS(item) {

        console.log('item', item)
        this.setState({
            isLoading: true
        })

        let params = { paymentmethodid: item.id }

        setDefaultCard(params)

            .then(data => {

                this.setState({
                    isLoading: false
                })

                this.getAllPaymentsDetail()
            })
            .catch(err => {
                this.setState({
                    isLoading: false
                })
                alert(err)
            })
    }

    removeCardWS(item) {

        console.log('item', item)

        this.setState({
            isLoading: true
        })

        let params = { paymentmethodid: item.id }

        deactiveteCard(params)

            .then(data => {

                this.setState({
                    isLoading: false
                })

                this.getAllPaymentsDetail()
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
    addPayment: {
        marginLeft: 20,
    },
    centerText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
        width: width - 160,
        fontWeight: 'bold',
    },
    rightView: {
        marginRight: 40,
        width: 20
    },

    // --- cell --- //
    listview: {
        backgroundColor: 'white',
        flex: 1
    },

    // --- cell --- //
    itemContainer: {
        width: size,
        height: 150,
        padding: 5,
    },

    item: {
        flex: 1,
        margin: 3,
        backgroundColor: '#fafafa',
        borderColor: '#e6e6e6',
        borderWidth: 1,
        borderRadius: 5,
    },

    itemcarddigit: {
        color: '#5c5c5c',
        fontSize: 12,
        marginTop: 30,
        fontWeight: 'bold',
        paddingLeft: 4,
    },

    // --- Loading --- //
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

export default connect(mapStateToProps, mapDispatchToProps)(CardListScreen);
