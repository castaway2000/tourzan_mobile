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
import { languageSearch } from "../actions";

//Utilities
import { isIphoneX } from "../global/Utilities";
import {
  Colors,
  API,
  Paymentrails,
  Braintree,
  DefaultFont
} from "../constants";

var { width, height } = Dimensions.get("window");

const backAction = NavigationActions.back({});

class SelectLanguageScreen extends React.Component {
  //#region Constractors
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      languages: [],
      isLoading: false,
      message: "",
      searchText: "",
      rightViewButtonText: ""
    };
  }

  //#endregion
  componentDidMount() {
    this.refs.SearchBar.focus();

    this.languageSearchWS();

    console.log(
      "this.props.navigation.state.params",
      this.props.navigation.state.params.selectedLanguage
    );
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

    if (text.length < 1) {
      this.setState({ message: "" });
    }

    if (this.searchWaiting) {
      clearTimeout(this.searchWaiting);
    }

    this.searchWaiting = setTimeout(() => {
      this.searchWaiting = null;
      this.languageSearchWS();
    }, 500);
  }

  languageDidSelected(language) {
    // this.props.navigation.state.params.languageDidSelected(language);
    // this.props.navigation.dispatch(backAction)

    var isSelectedFound = false;
    for (let i = 0; i < this.state.languages.length; i++) {
      if (language.text === this.state.languages[i].text) {
        this.state.languages[i].isSelected = !this.state.languages[i]
          .isSelected;
        isSelectedFound = this.state.languages[i].isSelected;
      } else {
        this.state.languages[i].isSelected = false;
      }
    }

    if (isSelectedFound) {
      this.setState({ rightViewButtonText: "Next" });
    } else {
      this.setState({ rightViewButtonText: "Save" });
    }

    this.setState({ languages: this.state.languages });

    // const { navigate } = this.props.navigation;

    // this.props.navigation.state.params.selectedLanguage.id = language.id;
    // this.props.navigation.state.params.selectedLanguage.text = language.text;

    // console.log("languageDidSelected", this.props.navigation.state.params);

    // navigate("SelectLanguageProficiency", {
    //   selectedLanguage: this.props.navigation.state.params.selectedLanguage,
    //   languageDidSelected: this.props.navigation.state.params
    //     .languageDidSelected
    // });
  }

  onNext() {
    const { navigate } = this.props.navigation;
    var selectedLanguage = null;

    var isSelectedFound = false;
    for (let i = 0; i < this.state.languages.length; i++) {
      if (this.state.languages[i].isSelected) {
        selectedLanguage = this.state.languages[i];
        isSelectedFound = true;
      }
    }

    if (isSelectedFound) {
      this.props.navigation.state.params.selectedLanguage.id =
        selectedLanguage.id;
      this.props.navigation.state.params.selectedLanguage.text =
        selectedLanguage.text;

      console.log("languageDidSelected", this.props.navigation.state.params);

      navigate("SelectLanguageProficiency", {
        selectedLanguage: this.props.navigation.state.params.selectedLanguage,
        languageDidSelected: this.props.navigation.state.params
          .languageDidSelected
      });
    } else {

      console.log(
        "this.props.navigation.state.params.selectedLanguage",
        this.props.navigation.state.params.selectedLanguage
      );

      this.props.navigation.state.params.selectedLanguage.id = null;
      this.props.navigation.state.params.selectedLanguage.text = "";
      //this.props.navigation.state.params.selectedLanguage.proficiency.type = "";

      //Callback to UpdateProfileScreen.js
      this.props.navigation.state.params.languageDidSelected(
        this.props.navigation.state.params.selectedLanguage
      );

      this.props.navigation.pop(1);
    }
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
          <Text style={styles.centerText}>Search Language</Text>
          <View style={styles.rightView}>
            <TouchableOpacity onPress={() => this.onDone()}>
              <Text style={styles.rightView}>
                {/* {this.state.rightViewButtonText} */}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.view}>
          <View style={styles.searchBarbg}>
            <Image
              resizeMode="cover"
              source={require("../assets/images/search_white_icon.png")}
              style={styles.searchIcon}
            />
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
            {this.state.languages.length > 0 && (
              <FlatList
                data={this.state.languages}
                extraData={this.state}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => this.languageDidSelected(item)}
                  >
                    <View style={styles.itemContainer}>
                      <View style={styles.item}>
                        <Text style={styles.celltext}>{item.text}</Text>
                      </View>

                      {item.isSelected && (
                        <Image
                          resizeMode="contain"
                          source={require("../assets/images/checked_green_badge.png")}
                          style={styles.row_icon}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                numColumns={1}
              />
            )}

            {this.state.languages.length < 1 && (
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <Text
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontFamily: DefaultFont.textFont
                  }}
                >
                  {this.state.message}
                </Text>
              </View>
            )}
          </View>
        </View>
        {this.showLoading()}

        <View style={styles.skipView}>
          <TouchableOpacity
            style={styles.skipButtonView}
            onPress={() => this.onNext()}
          >
            <Text style={styles.skipButton}>
              {this.state.rightViewButtonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  //
  languageSearchWS = () => {
    var { dispatch } = this.props;

    var params = {
      q: this.state.searchText ? this.state.searchText : ""
    };

    languageSearch(params)
      .then(data => {
        if (data.items && data.items.length > 0) {
          var isSelectedFound = false;

          for (let i = 0; i < data.items.length; i++) {
            const element = data.items[i];

            if (
              element.text ===
              this.props.navigation.state.params.selectedLanguage.text
            ) {
              element.isSelected = true;
              isSelectedFound = true;
            } else {
              element.isSelected = false;
            }
          }

          if (isSelectedFound) {
            this.setState({ rightViewButtonText: "Next" });
          } else {
            this.setState({ rightViewButtonText: "Save" });
          }

          this.setState({ languages: data.items });
        } else {
          this.setState({ languages: [], message: "No languages found." });
        }
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
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  rightView: {
    marginRight: 8,
    width: 44,
    height: 20
  },

  // --- view --- //
  view: {
    flex: 1,
    width: "100%",
    backgroundColor: "#E4E4E4",
    marginBottom: 44
  },

  // --- search --- //
  searchBarbg: {
    height: 50,
    borderWidth: 4,
    borderColor: "#E4E4E4",
    backgroundColor: "white",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center"
  },
  searchBar: {
    flex: 1,
    fontFamily: DefaultFont.textFont
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 10,
    width: 12,
    height: 12,
    tintColor: "#5c5c5c"
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
    alignItems: "center",
    justifyContent: "space-between"
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
  },
  row_icon: {
    height: 15,
    width: 15
  },

  // --- Skip --- //
  skipView: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: 44,

    flexDirection: "row"
  },
  skipButton: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "800"
  },
  skipButtonView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.main,
    marginRight: 1
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(SelectLanguageScreen);
