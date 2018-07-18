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
import { getGuideList } from '../../actions/'

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
        this.getGuideList()
    }

    getGuideList() {
        getGuideList()
            .then(data => {
                console.log('download GuideList ->', data)
                this.setState({
                    guideList: data,
                })
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
        this.props.navigation.navigate('GuideItemDetail', { guideData: rowData });
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
                                <Image resizeMode='cover' source={{ uri: rowData.header_image }} style={styles.avatar_img} defaultSource={require('../../assets/images/user_placeholder.png')} />
                                <View style={styles.rate_view} pointerEvents="none">
                                    {/*<Rating ratingCount={5} imageSize={8} onFinishRating={this.ratingCompleted}/>*/}
                                    <Text style={styles.rating_text}>Rating: {rowData.rating}</Text>
                                </View>
                            </View>
                            <View style={styles.info_view}>
                                <Text style={styles.name_text}>{rowData.name}</Text>
                                <View style={styles.location_view}>
                                    <Image resizeMode='contain' source={require("../../assets/images/location_maps.png")} style={styles.location_icon} />
                                    <Text style={styles.location_text}>Lake Elta</Text>
                                </View>
                                <Text style={styles.description_text} numberOfLines={3}>{rowData.overview}</Text>
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
                <TouchableOpacity style={styles.sortBtn}>
                    <Image source={require('../../assets/images/ic_tab_settings.png')} style={styles.sortImg} />
                </TouchableOpacity>
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
    arrow_view: {
        width: width * 10 / 100,
        alignItems: 'flex-end',
    },
    arrow_btn: {
        width: 10,
        height: 15,
    },
});


export default GuideScreen;


