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
    TouchableHighlight,
    ListView,
    Platform
} from 'react-native';

import Rating from 'react-native-ratings';
import { NavigationActions } from 'react-navigation'
import { Colors } from '../../constants'
import NavigationBar from '../../components/NavigationBar'
import { getGuideList } from '../../actions'

//FCM
import FCM, { NotificationActionType } from "react-native-fcm";
import { registerKilledListener, registerAppListener } from "../../global/Firebase/Listeners"
import firebaseClient from "../../global/Firebase/FirebaseClient";

//Store
import { connect } from 'react-redux';
import { store } from '../../store/index'

//Actions
import { updatebooking } from '../../actions/bookingActions'
import { updateuser } from '../../actions/userActions'

//Utilities
import { Storage, isIphoneX } from '../../global/Utilities';

//Webservice
import {
    previousGuideList
} from '../../actions'

const resetRootAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Welcome' }),
    ],
    key: null
});

var { width, height } = Dimensions.get('window');

class GuideScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            guideList: [],
            starCount: 3.5,
        };

        this.navigate = this.props.navigation;
    }
    componentDidMount() {
        this.previousGuideListWS()
    }

    previousGuideListWS() {

        previousGuideList()
            .then(data => {
                // this.setState({
                //     guideList: data,
                // })
                // if (data.detail == 'Signature has expired.') {
                //     Alert.alert("Tourzan", 'Session expired. Please login again.', [{
                //         text: 'OK', onPress: () => {
                //               console.log('this.props.navigation',this.props.navigation)
                //         }
                //     }], { cancelable: false });
                //     return
                // }

                for (let i = 0; i < data.length; i++) {
                    const order = data[i];

                    if (order.reviews) {
                        order.reviews.user_guide.guide_rating = order.reviews.guide_rating ? order.reviews.guide_rating : '0'
                        order.reviews.user_guide.guide_feedback_text = order.reviews.guide_feedback_text ? order.reviews.guide_feedback_text : ''
                        order.reviews.user_guide.fees_total = order.fees_total ? order.fees_total : 'Not available'

                        this.state.guideList.push(order.reviews.user_guide)
                    }
                }

                this.setState({ guideList: this.state.guideList })

            })
            .catch(err => {
                alert(err)
            })
    }

    // function for ratingview
    ratingCompleted(rating) {
        console.log("Rating is: " + rating)
    }

    pressRow(rowData) {
        // this.navigate.navigate('GuideItemDetail');
        // this.props.navigation.navigate('GuideItemDetail', { guideData: rowData });

        const { navigate } = this.props.navigation;

        navigate('Profile', { userid: rowData.pk })
    }

    showGuideList() {
        return (
            this.state.guideList.map((rowData, index) => {
                return (
                    <TouchableHighlight style={styles.row_view}
                        onPress={() => this.pressRow(rowData)}
                        underlayColor='#ddd'
                        key={index}>
                        <View style={styles.row}>
                            <View style={styles.avatar_view}>
                                <Image resizeMode='cover' source={rowData.guide_profile_image ? { uri: rowData.guide_profile_image } : require("../../assets/images/defaultavatar.png")} style={styles.avatar_img} defaultSource={require('../../assets/images/user_placeholder.png')} />
                                <View style={styles.rate_view} pointerEvents="none">
                                    <Text style={styles.rating_text}>Rating: {rowData.guide_rating}</Text>
                                </View>
                            </View>
                            <View style={styles.info_view}>

                                <Text style={styles.name_text}>{rowData.username}</Text>
                                <View style={styles.location_view}>
                                    {/* <Image resizeMode='contain' source={require("../../assets/images/banknote.png")} style={styles.location_icon} /> */}
                                    {/* <Text style={styles.location_text}>Amount: </Text> */}
                                    <Text style={styles.location_text}>${rowData.fees_total}</Text>
                                </View>
                                <Text style={styles.description_text} numberOfLines={3}>{rowData.guide_feedback_text}</Text>
                            </View>
                            <TouchableOpacity style={styles.arrow_view}>
                                <Image resizeMode='contain' source={require("../../assets/images/item_arrow.png")} style={styles.arrow_btn} />
                            </TouchableOpacity>
                        </View>
                    </TouchableHighlight>
                )
            })
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <TouchableOpacity style={styles.sortBtn}>
                    <Image source={require('../../assets/images/ic_tab_settings.png')} style={styles.sortImg} />
                </TouchableOpacity> */}
                <ScrollView style={styles.mTableView}>
                    {this.showGuideList()}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    sortBtn: {
        width: 40,
        alignItems: 'center',
    },
    mTableView: {
        width: width - 50,
    },
    sortImg: {
        marginTop: 25,
        width: 22,
        height: 22,
        resizeMode: 'contain'
    },
    icon: {
        width: 20,
        height: 20,
    },
    text_color: {
        color: '#000',
    },
    row_view: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    avatar_view: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar_img: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    rate_view: {
        marginTop: 5,
        height: 20,
        // flexDirection:'row',
        alignItems: 'flex-start',
    },
    ratingbar: {
        height: 10,
        width: 50,
    },
    rating_text: {
        marginLeft: 5,
        fontSize: 10,
        color: Colors.color999,
    },
    info_view: {
        width: width * 50 / 100,
        marginLeft: 10,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    location_view: {
        marginTop: 5,
        height: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    location_icon: {
        width: 10,
        height: 10,
    },
    name_text: {
        fontSize: 15,
        color: '#000',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    location_text: {

        fontSize: 12,
        color: Colors.color999,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    description_text: {
        marginTop: 5,
        fontSize: 12,
        color: Colors.color999,
        textAlign: 'left',
    },
    arrow_view: {
        width: width * 10 / 100,
        alignItems: 'flex-end',
    },
    arrow_btn: {
        width: 10,
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

export default connect(mapStateToProps)(GuideScreen);