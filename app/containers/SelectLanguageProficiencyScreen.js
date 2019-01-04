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
  ActivityIndicator,
  FlatList
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavigationActions } from "react-navigation";
import MapView from "react-native-maps";

import Switch from "../components/Switch";
import NavigationBar from "../components/NavigationBar";

import flagImg from "../assets/images/guide-dot.png";
import moment from "moment";
import MapViewDirections from "react-native-maps-directions";

//Store
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser } from "../actions/userActions";
import { updatelocation } from "../actions/locationActions";
import * as Actions from "../actions";

//Webservice
import {} from "../actions";

//Utilities
import { isIphoneX } from "../global/Utilities";
import { Colors, API, Paymentrails, Braintree, DefaultFont  } from "../constants";

var { width, height } = Dimensions.get("window");

const backAction = NavigationActions.back({});

class SelectLanguageProficiencyScreen extends React.Component {
  //#region Constractors
  static navigationOptions = {
    header: null,
    selectedLanguage: { text: "", id: "", level: "", order: "" }
  };

  constructor(props) {
    super(props);
    this.state = {
      proficiencys: [
        { type: "Native", level: 1 },
        { type: "Advanced", level: 2 },
        { type: "Intermediate", level: 3 },
        { type: "Beignner", level: 4 }
      ]
    };
  }

  //#endregion
  componentDidMount() {
    console.log(
      "this.props.navigation.state.params",
      this.props.navigation.state.params.selectedLanguage
    );
  }

  proficiencyDidSelected(proficiency) {
    this.props.navigation.state.params.selectedLanguage.proficiency = proficiency;

    ////Callback to UpdateProfileScreen.js
    this.props.navigation.state.params.languageDidSelected(
      this.props.navigation.state.params.selectedLanguage
    );

    this.props.navigation.pop(2);
  }

  render() {
    const { navigate } = this.props.navigation;

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
          <Text style={styles.centerText}>Select Proficiency</Text>
          <View style={styles.rightView}>
            {/* <TouchableOpacity onPress={() => this.onDone()}>
                            <Text style={styles.rightView}>DONE</Text>
                        </TouchableOpacity> */}
          </View>
        </View>
        <View style={styles.view}>
          <View style={styles.listview}>
            {this.state.proficiencys.length > 0 && (
              <FlatList
                data={this.state.proficiencys}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => this.proficiencyDidSelected(item)}
                  >
                    <View style={styles.itemContainer}>
                      <View style={styles.type}>
                        <Text style={styles.celltext}>{item.type}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                numColumns={1}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column"
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
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  rightView: {
    marginRight: 8,
    height: 20
  },

  // --- view --- //
  view: {
    flex: 1,
    width: "100%",
    backgroundColor: "#E4E4E4"
  },

  // --- Activity --- //
  loadingView: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },

  // --- cell --- //
  itemContainer: {
    padding: 5,
    borderBottomWidth: 0.5,
    borderColor: "lightgray"
  },
  listview: {
    backgroundColor: "white",
    flex: 1
  },
  celltext: {
    color: "#5c5c5c",
    fontSize: 16,
    marginTop: 12,
    paddingLeft: 4,
    fontFamily: DefaultFont.textFont
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(SelectLanguageProficiencyScreen);
