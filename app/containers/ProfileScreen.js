import React, { Component } from 'react';

import {
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
    ListView,
    TouchableOpacity,
    TouchableHighlight,
    ImageBackground,
    ActivityIndicator,
    Platform,
} from 'react-native';

import { NavigationActions } from 'react-navigation'
import Checkbox from 'react-native-custom-checkbox'
import Rating from 'react-native-ratings';
import ReadMore from '@expo/react-native-read-more-text';
import Button from 'react-native-button';
import { Colors } from '../constants'
import ApplyButton from '../components/ApplyButton'
import NavigationBar from '../components/NavigationBar'
import { profile } from '../actions'
import { Marker } from 'react-native-maps/lib/components/MapView';
import moment from 'moment'
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//Store
import { connect } from 'react-redux';
import { store } from '../store/index'

//Actions
import { updatebooking } from '../actions/bookingActions'
import { updateuser } from '../actions/userActions'

//Utilities
import { Storage, isIphoneX } from '../global/Utilities';

var { width, height } = Dimensions.get('window');

const onButtonPress = () => { Alert.alert('Button has been pressed!'); };
const backAction = NavigationActions.back({
    // key: 'WelcomeScreen'
});

class ProfileScreen extends React.Component {
    static navigationOptions = {
        title: 'Maps',
        header: null,
        tabBarLabel: 'Maps',
        isLoading: false,
        profileData: null,
        tabBarIcon: ({ tintColor }) => (
            <Image resizeMode='contain' source={require('../assets/images/Maps_Bottom_icon.png')} style={[styles.icon, { tintColor: tintColor }]} />
        ),
    };

    constructor(props) {
        super(props);
        isIntestExtend: { false };

        this.onContentSize = this.onContentSize.bind(this);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });
        this.state = {

            // for listview
            ds: [],
            dataSource: ds,

            // for ratingview
            starCount: 3.5,

            listViewHeight: 0,
        }
    }

    // functions for listview
    componentDidMount() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.ds),
        })

        this.onLoadProfileData()
    }

    //API Call get user profile
    onLoadProfileData() {

        this.setState({
            isLoading: true
        })

        var params = {
            userid: this.getUserID()
        }

        profile(params)

            .then(data => {

                this.setState({
                    profileData: data,
                    isLoading: false,
                    dataSource: this.state.dataSource.cloneWithRows(data.tourist_reviews.concat(data.tourist_reviews).concat(data.tourist_reviews).concat(data.tourist_reviews).concat(data.tourist_reviews).concat(data.tourist_reviews).concat(data.tourist_reviews).concat(data.tourist_reviews)),
                    ds: this.state.dataSource.cloneWithRows(data.tourist_reviews.concat(data.tourist_reviews).concat(data.tourist_reviews).concat(data.tourist_reviews).concat(data.tourist_reviews).concat(data.tourist_reviews).concat(data.tourist_reviews).concat(data.tourist_reviews))
                })

                console.log('Profile data-->', data)

            })
            .catch(err => {
                this.setState({
                    isLoading: false
                })
                alert(err)
            })
    }

    pressRow(rowData) {
        const { navigate } = this.props.navigation;

        var newDs = [];
        newDs = this.state.ds.slice();
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newDs)
        })
    }

    onIntestExtention() {
        isIntestExtend = !isIntestExtend;
    }

    // Read More funtions
    _renderTruncatedFooter = (handlePress) => {
        return (
            <View style={styles.downarrow_view}>
                <TouchableOpacity onPress={handlePress}>
                    <Image resizeMode='stretch' source={require("../assets/images/down_arrow.png")} style={styles.downarrow_btn} />
                </TouchableOpacity>
            </View>
        );
    }

    _renderRevealedFooter = (handlePress) => {
        return (
            <View style={styles.downarrow_view}>
                <TouchableOpacity onPress={handlePress}>
                    <Image resizeMode='stretch' source={require("../assets/images/up_arrow.png")} style={styles.downarrow_btn} />
                </TouchableOpacity>
            </View>
        );
    };

    _handleTextReady = () => {
        // ...
    };

    // interesting button functions
    _interestingBtnHandlePress() {
        console.log('Pressed!');
    }

    //#region Helper Func
    getUserID = () => {

        var { params } = this.props.navigation.state

        if (params && params.userid) {

            return params.userid

        } else {

            return this.props.userdata.user.userid
        }
    }

    isMyProfile = () => {

        var { params } = this.props.navigation.state

        if (params.userid) {

            return (params.userid == userid)

        } else {

            return false
        }
    }

    //#endregion
    getChatDate = (date) => {

        let chatdate = moment(date)

        var isPast = moment(chatdate);

        if (moment(chatdate).isSame(moment(), 'day')) {
            return chatdate.format('hh:mm A')
        } else {
            return chatdate.format('DD MMM YYYY')
        }
    }

    _showRatingViewList = (rating) => {
        return <Stars
            rating={rating}
            count={5}
            half={true}
            spacing={0}
            fullStar={<Icon name={'star'} style={[styles.starStyle]} />}
            emptyStar={<Icon name={'star-outline'} style={[styles.starStyle, styles.emptyStarStyle]} />}
            halfStar={<Icon name={'star-half'} style={[styles.starStyle]} />}
        />
    }

    onContentSize(contentWidth, contentHeight) {
        console.log("<<<<<< content >>>>>>>>>", contentWidth, contentHeight);

        this.setState({ listViewHeight: contentHeight })
    }

    renderRow(rowData) {
        return (
            <TouchableHighlight style={styles.row_view}
                onPress={() => this.pressRow(rowData)}
                underlayColor='#ddd'>
                <View style={styles.row}>
                    <View style={styles.avatar_view}>
                        <Image resizeMode='cover' source={{ uri: rowData.fields.reviewers_picture }} style={styles.avatar_img} />
                    </View>
                    <View style={styles.info_view}>
                        <View style={styles.list_info_location_view}>
                            <Text style={styles.list_info_name_text}>{rowData.fields.reviewers_name}</Text>
                            <Text style={styles.list_info_time_text}>{this.getChatDate(rowData.fields.tourist_review_updated)}</Text>
                        </View>
                        <Text style={styles.description_text}>{rowData.fields.guide_feedback_text}</Text>
                        <View style={styles.rate_view} pointerEvents="none">
                            {this._showRatingViewList(parseFloat(rowData.fields.tourist_rating))}
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    //Show full name
    _showProfilePicture = () => {

        if (!this.state.profileData) {
            return (
                <Image resizeMode='cover' source={require("../assets/images/person1.png")} style={styles.avatar_icon} />
            )
        }

        let isGuide = this.state.profileData.guide_data.is_guide

        let profilepicture = ''

        if (isGuide) {
            profilepicture = this.state.profileData.guide_data.profile_image
        } else {
            profilepicture = this.state.profileData.profile_picture
        }

        if (profilepicture) {
            return (
                <Image resizeMode='cover' source={{ uri: profilepicture }} style={styles.avatar_icon} />
            )
        } else {
            return (
                <Image resizeMode='cover' source={require("../assets/images/person1.png")} style={styles.avatar_icon} />
            )
        }
    }

    //Show full name
    _showFullname = () => {

        if (!this.state.profileData) {
            return <Text style={styles.name_text}></Text>
        }

        let isGuide = this.state.profileData.guide_data.is_guide

        let fullname = ''

        if (this.state.profileData.first_name) {
            fullname = this.state.profileData.first_name
        }

        if (this.state.profileData.last_name) {
            fullname = fullname + ' ' + this.state.profileData.last_name
        }

        if (!fullname) {
            fullname = isGuide ? 'Guide' : 'Tourist'
        }

        return (
            <Text style={styles.name_text}>{fullname}</Text>
        );
    }

    _showOverview = () => {

        if (!this.state.profileData) {
            return <Text style={styles.name_text}></Text>
        }

        let isGuide = this.state.profileData.guide_data.is_guide

        let overviewText = ''

        if (isGuide) {
            overviewText = this.state.profileData.guide_data.guide_overview
        } else {
            overviewText = this.state.profileData.about_tourist
        }

        return (
            <ReadMore
                numberOfLines={3}
                renderTruncatedFooter={this._renderTruncatedFooter}
                renderRevealedFooter={this._renderRevealedFooter}
                onReady={this._handleTextReady}>
                <Text style={styles.overview_content_text}>{overviewText}</Text>
            </ReadMore>
        )
    }

    _showTagsView = () => {

        if (!this.state.profileData) {
            return <Text style={styles.name_text}>-</Text>
        }

        if (!this.state.profileData.interests != undefined && this.state.profileData.interests.length > 0) {

            let interests = this.state.profileData.interests

            return (

                <View style={styles.tags}>
                    {
                        interests.map((i, k) => (
                            // console.log("I",i)
                            // <Button containerStyle={styles.interesting_container_btn} style={styles.interesting_btn} onPress={() => this._interestingBtnHandlePress()} >Attractions</Button>

                            <TouchableOpacity style={styles.interesting_container_btn} onPress={() => this._interestingBtnHandlePress()} >
                                <Text style={styles.interesting_btn}>{i}</Text>
                            </TouchableOpacity>
                        )
                        )}
                </View>
            )
        } else {
            return <Text style={styles.name_text}>-</Text>
        }
    }

    //Calculate average star from review
    _showRatingViewMain = () => {

        if (!this.state.profileData) {
            return <Rating ratingCount={5}
                startingValue={0}
                readonly
                imageSize={15}
                onFinishRating={this.ratingCompleted} />
        }

        let isGuide = this.state.profileData.guide_data.is_guide

        let rating = isGuide ? this.state.profileData.guide_data.guide_rating : this.state.profileData.tourist_rating

        return <Stars
            rating={rating}
            count={5}
            half={true}
            spacing={0}
            fullStar={<Icon name={'star'} style={[styles.starStyle]} />}
            emptyStar={<Icon name={'star-outline'} style={[styles.starStyle, styles.emptyStarStyle]} />}
            halfStar={<Icon name={'star-half'} style={[styles.starStyle]} />}
        />
    }

    //Show load more.
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
                <ImageBackground resizeMode='cover' source={require("../assets/images/profile_bg.png")} style={styles.top_container}>
                    <View style={styles.navigationbar}>
                        <TouchableOpacity onPress={() => { this.props.navigation.dispatch(backAction) }}>
                            <Image resizeMode='cover' source={require("../assets/images/back.png")} style={styles.backButton} />
                        </TouchableOpacity>
                        <Text style={styles.centerText}></Text>
                        <TouchableOpacity onPress={() => { navigate('ProfileCharRoom') }}>
                            <Image resizeMode='cover' source={require("../assets/images/profile_chat_icon.png")} style={styles.rightView} />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                <ScrollView style={styles.scrollview_container}>
                    <View style={styles.content_container}>
                        <View style={styles.main_container}>
                            <View pointerEvents="none" style={styles.name_view}>
                                {this._showFullname()}
                                {this._showRatingViewMain()}
                            </View>
                            <View style={styles.location_view}>
                                <Image resizeMode='contain' source={require("../assets/images/location_maps.png")} style={styles.location_icon} />
                                <Text style={styles.location_text}>Not Avaible</Text>
                            </View>
                            <View style={styles.overview_view}>
                                <Text style={styles.overview_title_text}>Overview</Text>
                                {this._showOverview()}
                            </View>

                            <View style={styles.interesting_view}>
                                <View style={styles.devide_view} />

                                <Text style={styles.interesting_title_text}>Interest</Text>
                                {this._showTagsView()}
                                {/* <View style={styles.btn_group_view}>
                                    <Button containerStyle={styles.interesting_container_btn} style={styles.interesting_btn} onPress={() => this._interestingBtnHandlePress()} >Attractions</Button>
                                    <Button containerStyle={styles.interesting_container_btn} style={styles.interesting_btn} onPress={() => this._interestingBtnHandlePress()} > Boating</Button>
                                    <Button containerStyle={styles.interesting_container_btn} style={styles.interesting_btn} onPress={() => this._interestingBtnHandlePress()} >Traveling</Button>
                                </View>
                                <View style={styles.btn_group_view}>
                                    <Button containerStyle={styles.interesting_container_btn} style={styles.interesting_btn} onPress={() => this._interestingBtnHandlePress()} >Hiking</Button>
                                    <Button containerStyle={styles.interesting_container_btn} style={styles.interesting_btn} onPress={() => this._interestingBtnHandlePress()} >Swimming</Button>
                                    <Button containerStyle={styles.interesting_container_btn} style={styles.interesting_btn} onPress={() => this._interestingBtnHandlePress()} >Reading</Button>
                                </View> */}

                                <View style={styles.devide_view} />
                            </View>

                        </View>
                        <View style={styles.listview_view}>
                            <View style={styles.listview_title_view} pointerEvents='none'>
                                <Text style={styles.listview_title_text}> {this.state.profileData ? this.state.profileData.tourist_reviews.length : 0} Reviews </Text>
                                {this._showRatingViewMain()}
                            </View>
                            <ListView
                                style={{ paddingHorizontal: 0, height: this.state.listViewHeight }}
                                ref={ref => this.listView = ref}
                                onContentSizeChange={this.onContentSize}
                                dataSource={this.state.dataSource}
                                renderRow={this.renderRow.bind(this)}
                            />
                        </View>
                    </View>
                </ScrollView>
                {this._showProfilePicture()}
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
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    top_container: {
        width: width,
        height: 180,
    },
    navigationbar: {
        paddingTop: (Platform.OS == 'ios') ? (isIphoneX() ? 44 : 20) : StatusBar.currentHeight,
        height: 64,
        backgroundColor: 'transparent',
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
        color: '#000',
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
    scrollview_container: {
        // flex:1,
        paddingTop: 20,
        height: height - 100,
    },
    avatar_icon: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 140,
        marginLeft: 30,
        backgroundColor: 'white',
        backgroundColor: 'transparent'
    },
    content_container: {
        marginTop: 20,
        width: width,

    },
    main_container: {
        paddingHorizontal: 30,
        width: width,
    },
    top_image_container: {
        width: width,
        height: 150,
        flexDirection: 'column',
    },
    name_view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
    },
    name_text: {
        fontSize: 17,
        color: 'black',
    },
    location_view: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    location_icon: {
        width: 15,
        height: 15,
    },
    overview_view: {
        marginTop: 10,
    },
    overview_title_text: {
        fontSize: 15,
        color: 'black',
    },
    overview_content_text: {
        marginTop: 8
    },
    downarrow_view: {
        marginTop: 5,
        alignItems: 'center',
    },
    downarrow_btn: {
        width: 30,
        height: 15,
    },
    devide_view: {
        marginTop: 15,
        height: 1,
        backgroundColor: '#ddd',
    },
    interesting_title_text: {
        marginTop: 5,
        fontSize: 15,
        color: 'black',
    },
    btn_group_view: {
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    interesting_container_btn: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        paddingTop: 5,
        marginRight: 20,
        borderRadius: 15,
        height: 30,
        backgroundColor: '#f4f5f8',
        borderColor: '#ddd',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 5,
    },
    interesting_btn: {
        fontSize: 12,
        color: Colors.tintColor,
        fontWeight: 'normal',
    },
    listview_view: {
        width: width,
        marginTop: 20
    },
    listview_title_view: {
        paddingHorizontal: 20,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f7f7f7',
    },
    listview_title_text: {
        color: 'black',
    },
    listview_title_ratingbar: {
        backgroundColor: '#f7f7f7',
    },
    listview: {
        paddingHorizontal: 20,
    },
    row_view: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        backgroundColor: 'white',
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    avatar_view: {
        flex: 0.2,
        flexDirection: 'row',
        alignItems: 'flex-start',
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating_text: {
        marginLeft: 5,
        fontSize: 8,
        color: Colors.color999,
    },
    info_view: {
        flex: 0.8,
        marginLeft: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        paddingBottom: 20,
    },
    list_info_location_view: {
        marginTop: 5,
        height: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    list_info_time_text: {
        fontSize: 12,
        color: Colors.color999
    },
    list_info_name_text: {
        fontSize: 15,
        color: '#000',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    location_text: {
        marginLeft: 5,
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
    tags: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        margin: 5,
        flexWrap: 'wrap',

    },
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

export default connect(mapStateToProps)(ProfileScreen);
