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
    WebView,
    ActivityIndicator
} from 'react-native';

import { NavigationActions } from 'react-navigation'
import Checkbox from 'react-native-custom-checkbox'
import { Colors } from '../constants'
import NavigationBar from '../components/NavigationBar'
import {isIphoneX} from "../global/Utilities"

const contactUsHtml = require('../assets/resources/contactus.html');

var { width, height } = Dimensions.get('window');
const backAction = NavigationActions.back({

});

class ContactUsScreen extends Component {

    static navigationOptions = {
        header: null,
        tabBarLabel: 'More',
        tabBarIcon: ({ tintColor }) => (
            <Image resizeMode='contain' source={require('../assets/images/hambuger.png')} style={[styles.icon, { tintColor: tintColor }]} />
        ),
    };

    constructor(props) {
        super(props);
        this.state = { visible: true };
        this.navigate = this.props.navigation;
    }

    hideSpinner() {
        this.setState({ visible: false });
    }

    showLoading() {
        if (this.state.visible) {
            return (
                <ActivityIndicator color={'black'} size={'large'} style={styles.loadingView} />
            );
        }
    }
//contactUsHtml
    render() {
        return (
            <View style={styles.container}>

                <View style={styles.statusbar} />

                <View style={styles.navigationbar}>
                    <TouchableOpacity onPress={() => { this.props.navigation.dispatch(backAction) }}>
                        <Image resizeMode='cover' source={require("../assets/images/back.png")} style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.centerText}>Contact Us</Text>
                    <View style={styles.rightView}>
                    </View>
                </View>

                <View style={styles.webviewContainer}>
                    <WebView
                        onLoad={() => this.hideSpinner()}
                        source={contactUsHtml}
                        scalesPageToFit={false}
                        // source={{
                        //     uri:
                        //         'https://api.tourzan.com/en/tos/'
                        // }}
                    />
                </View>
                {this.showLoading()}

            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    statusbar: {
        width: width,
        height: (Platform.OS == 'ios') ? (isIphoneX() ? 44 : 20 ) : StatusBar.currentHeight,
        backgroundColor: Colors.main,
        position: 'absolute',
        top: 0,
        left: 0,
    },

    // --- navigation bar --- //
    navigationbar: {
        height: 44,
        marginTop: (Platform.OS == 'ios') ? (isIphoneX() ? 44 : 20 ) : 0,
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

    // --- webview --- //
    webviewContainer: {
        flex: 1,
        backgroundColor: '#000000',

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
});
export default ContactUsScreen;