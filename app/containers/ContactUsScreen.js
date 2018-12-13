import React, { Component } from "react";

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
} from "react-native";

import { NavigationActions } from "react-navigation";
import Checkbox from "react-native-custom-checkbox";
import {
  Colors,
  API,
  Paymentrails,
  Braintree,
  DefaultFont
} from "../constants";
import NavigationBar from "../components/NavigationBar";
import { isIphoneX } from "../global/Utilities";

const contactUsHtml = `<script type="text/javascript" src="https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.js"></script>
<style type="text/css" media="screen, projection">
	@import url(https://s3.amazonaws.com/assets.freshdesk.com/widget/freshwidget.css);
</style>
<iframe title="Feedback Form" class="freshwidget-embedded-form" id="freshwidget-embedded-form" src="https://tourzan.freshdesk.com/widgets/feedback_widget/new?&widgetType=embedded&formTitle=Contact+Us&submitTitle=Send&submitThanks=Thank+you+for+your+feedback.+&screenshot=No&captcha=yes"
 scrolling="yes" height="500px" width="100%" frameborder="0">
</iframe>`

var { width, height } = Dimensions.get("window");
const backAction = NavigationActions.back({});

class ContactUsScreen extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: "More",
    tabBarIcon: ({ tintColor }) => (
      <Image
        resizeMode="contain"
        source={require("../assets/images/hambuger.png")}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    )
  };

  constructor(props) {
    super(props);
    // this.state = { visible: true };
    this.navigate = this.props.navigation;
  }

  hideSpinner() {
    // this.setState({ visible: false });
  }

  showLoading() {
    if (this.state.visible) {
      return (
        <ActivityIndicator
          color={"black"}
          size={"large"}
          style={styles.loadingView}
        />
      );
    }
  }
  //contactUsHtml
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusbar} />

        <View style={styles.navigationbar}>
          <TouchableOpacity
            style={styles.backButtomContainer}
            onPress={() => {
              this.props.navigation.dispatch(backAction);
            }}
          >
            <Image
              resizeMode="cover"
              source={require("../assets/images/back.png")}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <Text style={styles.centerText}>Contact Us</Text>
          <View style={styles.rightView} />
        </View>

        <View style={styles.webviewContainer}>
          <WebView
            onLoad={() => this.hideSpinner()}
            originWhitelist={['*']}
            source={{ html: contactUsHtml ,  baseUrl: ''}}
            scalesPageToFit={false}
            startInLoadingState={true}
            injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=1, maximum-scale=1, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
            // source={{
            //     uri:
            //         'https://api.tourzan.com/en/tos/'
            // }}
          />
        </View>
        {/* {this.showLoading()} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  statusbar: {
    width: width,
    height:
      Platform.OS == "ios" ? (isIphoneX() ? 44 : 20) : StatusBar.currentHeight,
    backgroundColor: Colors.main,
    position: "absolute",
    top: 0,
    left: 0
  },

  // --- navigation bar --- //
  navigationbar: {
    height: 44,
    marginTop: Platform.OS == "ios" ? (isIphoneX() ? 44 : 20) : 0,
    backgroundColor: Colors.main,
    width: width,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  backButtomContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center"
  },
  backButton: {
    height: 15,
    width: 10
  },
  centerText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    width: width - 160,
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  rightView: {
    marginRight: 20,
    height: 20,
    width: 20
  },

  // --- webview --- //
  webviewContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    width:'100%',
    height:'100%'
  },
  loadingView: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  }
});
export default ContactUsScreen;
