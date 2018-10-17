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
import { Colors } from "../constants";
import { NavigationActions } from "react-navigation";
import MapView from "react-native-maps";

import Switch from "../components/Switch";
import NavigationBar from "../components/NavigationBar";

import flagImg from "../assets/images/guide-dot.png";
import moment from "moment";
import MapViewDirections from "react-native-maps-directions";

//Store
import { store } from "../store";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser } from "../actions/userActions";
import { updatelocation } from "../actions/locationActions";
import * as Actions from "../actions";

//Webservice
import { searchInterest } from "../actions";

//Utilities
import { isIphoneX } from "../global/Utilities";

var { width, height } = Dimensions.get("window");

const backAction = NavigationActions.back({});

class SelectInterestsScreen extends React.Component {
  //#region Constractors
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      interests: [],
      isLoading: false,
      message: "",
      searchText: ""
    };
  }

  //#endregion
  componentDidMount() {
    this.refs.SearchBar.focus();
  }

  showLoading() {
    if (this.state.isLoading) {
      return (
        <ActivityIndicator
          color={"black"}
          size={"large"}
          style={styles.loadingView}
        />
      );
    }
  }

  setSearchText(text) {
    this.setState({ searchText: text });

    if (this.searchWaiting) {
      clearTimeout(this.searchWaiting);
    }

    this.searchWaiting = setTimeout(() => {
      this.searchWaiting = null;

      if (text.length < 1) {
        this.setState({ interests: [], message: "" });
      } else {
        this.getSearchInterest();
      }
    }, 500);
  }

  interestDidSelected(interest, index) {
    let { selectedInterests } = this.props.navigation.state.params;

    console.log("interest", interest, index);

    let i = selectedInterests.indexOf(interest.text);

    if (i > -1) {
      selectedInterests.splice(i, 1);
      this.state.interests[index].isselected = false;
    } else {
      selectedInterests.push(interest.text);
      this.state.interests[index].isselected = true;
    }

    this.setState({ interests: this.state.interests });
  }

  onDone() {
    let { selectedInterests } = this.props.navigation.state.params;

    this.props.navigation.state.params.interestsDidSelected(selectedInterests);
    this.props.navigation.dispatch(backAction);
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
          <Text style={styles.centerText}>Search interests</Text>
          <View style={styles.rightView}>
            <TouchableOpacity onPress={() => this.onDone()}>
              <Text style={styles.rightViewText}>DONE</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.view}>
          <View style={styles.searchBarbg}>
            <TextInput
              style={styles.searchBar}
              value={this.state.searchText}
              ref="SearchBar"
              onChangeText={text => this.setSearchText(text)}
              underlineColorAndroid="transparent"
              placeholder="Search"
            />
          </View>

          <View style={styles.listview}>
            {this.state.interests.length > 0 && (
              <FlatList
                data={this.state.interests}
                extraData={this.state}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => this.interestDidSelected(item, index)}
                  >
                    <View style={styles.itemContainer}>
                      <View style={styles.item}>
                        <Text style={styles.celltext}>{item.text}</Text>
                      </View>
                      {item.isselected && (
                        <Image
                          resizeMode="contain"
                          source={require("../assets/images/checked_green_badge.png")}
                          style={styles.row_icon}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                numColumns={1}
              />
            )}

            {this.state.interests.length < 1 && (
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <Text style={{ width: "100%", textAlign: "center" }}>
                  {this.state.message}
                </Text>
              </View>
            )}
          </View>
        </View>
        {this.showLoading()}
      </View>
    );
  }

  //
  getSearchInterest = () => {
    var { dispatch } = this.props;

    var params = {
      q: this.state.searchText
    };

    searchInterest(params)
      .then(data => {
        if (data.items && data.items.length > 0) {
          this.setState({ interests: data.items });
        } else {
          this.setState({
            interests: [
              {
                text: this.state.searchText,
                id: 0
              }
            ]
          });
        }

        let { selectedInterests } = this.props.navigation.state.params;

        for (let i = 0; i < this.state.interests.length; i++) {
          const e = this.state.interests[i];

          for (let j = 0; j < selectedInterests.length; j++) {
            const f = selectedInterests[j];

            if (e.text == f) {
              e.isselected = true;
            }
          }
        }

        this.setState({ interests: this.state.interests });
      })
      .catch(err => {
        alert(err);
      });
  };
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
    fontWeight: "bold"
  },
  rightView: {
    marginRight: 8,
    height: 20
  },

  rightViewText: {
    marginRight: 8,
    height: 20,
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center"
  },

  // --- view --- //
  view: {
    flex: 1,
    width: "100%",
    backgroundColor: "#E4E4E4"
  },

  // --- search --- //
  searchBarbg: {
    height: 44,
    borderWidth: 4,
    borderColor: "#E4E4E4",
    backgroundColor: "white",
    borderRadius: 14
  },
  searchBar: {
    paddingLeft: 10,
    fontSize: 14,
    flex: 1
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
    borderColor: "lightgray",
    flexDirection: "row",
    alignItems: "center"
  },
  item: {
    backgroundColor: "white",
    flex: 1
  },
  listview: {
    backgroundColor: "white",
    flex: 1
  },
  celltext: {
    color: "#5c5c5c",
    fontSize: 16,
    marginTop: 12,
    paddingLeft: 4
  },
  row_icon: {
    height: 15,
    width: 15
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(SelectInterestsScreen);
