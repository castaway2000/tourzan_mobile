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
  ActivityIndicator
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavigationActions } from "react-navigation";
import MapView from "react-native-maps";

import Switch from "../components/Switch";
import NavigationBar from "../components/NavigationBar";

import flagImg from "../assets/images/guide-dot.png";
import moment from "moment";
import MapViewDirections from "react-native-maps-directions";
import DateTimePicker from "react-native-modal-datetime-picker";

//Store
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser } from "../actions/userActions";
import { updatelocation } from "../actions/locationActions";
import * as Actions from "../actions";

//Webservice
import {
  updateGuideProfile,
  updateTouristProfile,
  autocompleteCity,
  createRecipientsPaymentrails,
  getUserProfileAllData
} from "../actions";

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

import { TagSelect } from "react-native-tag-select";

class UpdateProfileScreen extends React.Component {
  //#region Constractors
  static navigationOptions = {
    header: null,
    tabBarVisible: false
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isDateTimePickerVisible: false,
      dobDate: new Date(),
      firstname: "",
      lastname: "",
      dob: "",
      profession: "",
      city: null,
      rate: "",
      overview: "",
      selectedInterests: [],
      firstLanguage: { order: 1 },
      secondLanguage: { order: 2 },
      thirdLanguage: { order: 3 },
      profile: {}
    };
  }

  //#endregion
  componentDidMount() {
    const { params } = this.props.navigation.state;

    console.log(
      "paramsparamsparamsparamsparamsparamsparamsparams",
      this.props.navigation.state
    );

    if (params && !params.isFromRegistration) {
      this.getProfileWS();
    }
  }

  componentWillUnmount() {}

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = date => {
    this._hideDateTimePicker();
    this.setState({ dobDate: date, dob: moment(date).format("MM/DD/YYYY") });
  };

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

  //Common
  setFirstname(text) {
    this.setState({ firstname: text });
  }

  //Common
  setLastname(text) {
    this.setState({ lastname: text });
  }

  //Common
  setDOB(text) {
    this.setState({ dob: text });
  }

  //Tourist
  setProfession(text) {
    this.setState({ profession: text });
  }

  //Guide
  setCity(text) {
    this.setState({ city: text });
  }

  //Common
  setFirstLanguage(text) {
    this.setState({
      firstLanguage: {
        ...this.state.access,
        text: text
      }
    });
  }

  //Common
  setSecondLanguage(text) {
    this.setState({
      secondLanguage: {
        ...this.state.access,
        text: text
      }
    });
  }

  //Common
  setThirdLanguage(text) {
    this.setState({
      thirdLanguage: {
        ...this.state.access,
        text: text
      }
    });
  }

  //Guide
  setRate(text) {
    this.setState({
      rate: text.replace(/[^(((\d)+(\.)\d)|((\d)+))]/g, "_").split("_")[0]
    });
  }

  //Common
  setOverview(text) {
    this.setState({ overview: text });
  }

  onUpdateProfile() {
    const { params } = this.props.navigation.state;

    let isGuide = params
      ? params.isGuideRegistration
        ? params.isGuideRegistration
        : this.props.userdata.user.isLoggedInAsGuide
      : this.props.userdata.user.isLoggedInAsGuide;

    if (isGuide) {
      if (this.validateGuidetData()) {
        this.updateGuideProfileWS();
      }
    } else {
      if (this.validateTouristData()) {
        this.updateTouristProfileWS();
      }
    }
  }

  validateTouristData() {
    if (this.state.firstname == "" || this.state.firstname.trim() == "") {
      Alert.alert("Tourzan", "Please enter your firstname.");
      return false;
    }

    if (this.state.lastname == "" || this.state.lastname.trim() == "") {
      Alert.alert("Tourzan", "Please enter your lastname.");
      return false;
    }

    /*
    if (this.state.dob == "" || this.state.dob.trim() == "") {
      Alert.alert("Tourzan", "Please enter your birthdate.");
      return false;
    }

    if (this.state.profession == "" || this.state.profession.trim() == "") {
      Alert.alert("Tourzan", "Please enter your profession.");
      return false;
    }

    //Language Validations

    //

    if (this.state.selectedInterests.length < 1) {
      Alert.alert("Tourzan", "Please select interests.");
      return false;
    }

    if (this.state.overview == "" || this.state.overview.trim() == "") {
      Alert.alert("Tourzan", "Please enter your overview.");
      return false;
    }
*/
    return true;
  }

  validateGuidetData() {
    if (this.state.firstname == "" || this.state.firstname.trim() == "") {
      Alert.alert("Tourzan", "Please enter your firstname.");
      return false;
    }

    if (this.state.lastname == "" || this.state.lastname.trim() == "") {
      Alert.alert("Tourzan", "Please enter your lastname.");
      return false;
    }

    /*
    if (this.state.dob == "" || this.state.dob.trim() == "") {
      Alert.alert("Tourzan", "Please enter your birthdate.");
      return false;
    }

    if (!this.state.city) {
      Alert.alert("Tourzan", "Please enter your city.");
      return false;
    }

    if (this.state.rate == "" || this.state.rate.trim() == "") {
      Alert.alert("Tourzan", "Please enter your rate.");
      return false;
    }

    //Language Validations
    if (this.state.selectedInterests.length < 1) {
      Alert.alert("Tourzan", "Please enter interests.");
      return false;
    }

    if (this.state.overview == "" || this.state.overview.trim() == "") {
      Alert.alert("Tourzan", "Please enter your overview.");
      return false;
    }
*/
    return true;
  }

  firstLanguageText() {
    let text = "";

    if (this.state.firstLanguage.id) {
      text = this.state.firstLanguage["text"];

      if (this.state.firstLanguage["proficiency"]) {
        text =
          text + " (" + this.state.firstLanguage["proficiency"]["type"] + ")";
      }
    }

    return text;
  }

  secondLanguageText() {
    let text = "";

    if (this.state.secondLanguage.id) {
      text = this.state.secondLanguage["text"];

      if (this.state.secondLanguage["proficiency"]) {
        text =
          text + " (" + this.state.secondLanguage["proficiency"]["type"] + ")";
      }
    }

    return text;
  }

  thirdLanguageText() {
    let text = "";

    if (this.state.thirdLanguage.id) {
      text = this.state.thirdLanguage["text"];

      if (this.state.thirdLanguage["proficiency"]) {
        text =
          text + " (" + this.state.thirdLanguage["proficiency"]["type"] + ")";
      }
    }

    return text;
  }

  getCity() {
    let city = "";

    if (
      this.state.city &&
      this.state.city.description &&
      this.state.city.description.length > 0
    ) {
      city = this.state.city.description.split(",")[0];
    }

    return city;
  }

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    let isGuide = params
      ? params.isGuideRegistration
        ? params.isGuideRegistration
        : this.props.userdata.user.isLoggedInAsGuide
      : this.props.userdata.user.isLoggedInAsGuide;
    // let isGuide = params.isGuideRegistration ? params.isGuideRegistration : this.props.userdata.user.isLoggedInAsGuide

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
          <Text style={styles.centerText}>Update Profile</Text>
          <View style={styles.rightView}>
            <TouchableOpacity onPress={() => this.onUpdateProfile()}>
              <Text style={styles.rightViewtext} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.main_view}>
          <KeyboardAwareScrollView style={styles.out_container}>
            <View style={styles.main_view}>
              <View style={styles.blank_row_view} />

              <View style={styles.row_icon_view}>
                {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="First Name*"
                  style={styles.row_icon_lb}
                  secureTextEntry={false}
                  value={this.state.firstname}
                  onChangeText={text => this.setFirstname(text)}
                />
              </View>

              <View style={styles.row_icon_view}>
                {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Last Name*"
                  style={styles.row_icon_lb}
                  secureTextEntry={false}
                  value={this.state.lastname}
                  onChangeText={text => this.setLastname(text)}
                />
              </View>

              <TouchableOpacity onPress={this._showDateTimePicker}>
                <View pointerEvents="none" style={styles.row_icon_view}>
                  {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}

                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholder="Date of Birth"
                    style={styles.row_icon_lb}
                    secureTextEntry={false}
                    value={this.state.dob}
                    onChangeText={text => this.setDOB(text)}
                  />
                </View>
              </TouchableOpacity>

              {!isGuide && (
                <View style={styles.row_icon_view}>
                  {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholder="Profession"
                    style={styles.row_icon_lb}
                    secureTextEntry={false}
                    value={this.state.profession}
                    onChangeText={text => this.setProfession(text)}
                  />
                </View>
              )}

              {/* LANGUAGE 1 */}
              <TouchableOpacity
                onPress={() => {
                  navigate("SelectLanguage", {
                    selectedLanguage: this.state.firstLanguage,
                    languageDidSelected: this.languageDidSelected
                  });
                }}
              >
                <View pointerEvents="none" style={styles.row_icon_view}>
                  {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholder="Native Language"
                    style={styles.row_icon_lb}
                    secureTextEntry={false}
                    value={this.firstLanguageText()}
                    onChangeText={text => this.setFirstLanguage(text)}
                  />
                  <Image
                    resizeMode="contain"
                    source={require("../assets/images/item_arrow.png")}
                    style={styles.row_icon}
                  />
                </View>
              </TouchableOpacity>

              {/* LANGUAGE 2 */}
              <TouchableOpacity
                onPress={() => {
                  navigate("SelectLanguage", {
                    selectedLanguage: this.state.secondLanguage,
                    languageDidSelected: this.languageDidSelected
                  });
                }}
              >
                <View pointerEvents="none" style={styles.row_icon_view}>
                  {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholder="Second Language"
                    style={styles.row_icon_lb}
                    secureTextEntry={false}
                    value={this.secondLanguageText()}
                    onChangeText={text => this.setSecondLanguage(text)}
                  />
                  <Image
                    resizeMode="contain"
                    source={require("../assets/images/item_arrow.png")}
                    style={styles.row_icon}
                  />
                </View>
              </TouchableOpacity>

              {/* LANGUAGE 3 */}
              <TouchableOpacity
                onPress={() => {
                  navigate("SelectLanguage", {
                    selectedLanguage: this.state.thirdLanguage,
                    languageDidSelected: this.languageDidSelected
                  });
                }}
              >
                <View pointerEvents="none" style={styles.row_icon_view}>
                  {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholder="Third Language"
                    style={styles.row_icon_lb}
                    secureTextEntry={false}
                    value={this.thirdLanguageText()}
                    onChangeText={text => this.setThirdLanguage(text)}
                  />
                  <Image
                    resizeMode="contain"
                    source={require("../assets/images/item_arrow.png")}
                    style={styles.row_icon}
                  />
                </View>
              </TouchableOpacity>

              {isGuide && (
                <TouchableOpacity
                  onPress={() => {
                    navigate("SelectCity", {
                      cityDidSelected: this.cityDidSelected
                    });
                  }}
                >
                  <View pointerEvents="none" style={styles.row_icon_view}>
                    {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                    <TextInput
                      underlineColorAndroid="transparent"
                      placeholder="City"
                      style={styles.row_icon_lb}
                      secureTextEntry={false}
                      value={this.getCity()}
                      onChangeText={text => this.setCity(text)}
                    />
                    <Image
                      resizeMode="contain"
                      source={require("../assets/images/item_arrow.png")}
                      style={styles.row_icon}
                    />
                  </View>
                </TouchableOpacity>
              )}

              {isGuide && (
                <View style={styles.row_icon_view}>
                  {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholder="Hourly rate, USD/hour"
                    style={styles.row_icon_lb}
                    secureTextEntry={false}
                    keyboardType="numeric"
                    value={this.state.rate}
                    onChangeText={text => this.setRate(text)}
                  />
                </View>
              )}

              <TouchableOpacity
                onPress={() => {
                  navigate("SelectInterests", {
                    interestsDidSelected: this.interestsDidSelected,
                    selectedInterests: this.state.selectedInterests
                  });
                }}
              >
                <View pointerEvents="none" style={styles.row_icon_tag_view}>
                  {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}

                  {this.state.selectedInterests.length < 1 && (
                    <TextInput
                      underlineColorAndroid="transparent"
                      placeholder="Interests"
                      style={styles.row_icon_lb}
                      secureTextEntry={false}
                      value={this.state.selectedInterests.toString()}
                      onChangeText={text => this.setCity(text)}
                    />
                  )}

                  {this.state.selectedInterests.length > 0 && (
                    <View style={styles.tag_container_view}>
                      <TagSelect
                        data={this.state.selectedInterests}
                        itemStyle={styles.item}
                        itemLabelStyle={styles.label}
                        itemStyleSelected={styles.itemSelected}
                        itemLabelStyleSelected={styles.labelSelected}
                        max={3}
                        ref={tag => {
                          this.tag = tag;
                        }}
                        onMaxError={() => {
                          Alert.alert("Ops", "Max reached");
                        }}
                      />
                    </View>
                  )}

                  <Image
                    resizeMode="contain"
                    source={require("../assets/images/item_arrow.png")}
                    style={styles.row_icon}
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.row_icon_view_no_height}>
                {/* <Image resizeMode='contain' source={require("../assets/images/key_unlock_icon.png")} style={styles.row_small_icon} /> */}
                <TextInput
                
                  underlineColorAndroid="transparent"
                  placeholder= "Please describe a little bit about yourself and your interests here. for example: I am from Seattle, I love hiking, boating and taking photos. I am really excited about this vacation because I can get to experience new things"
                  style={[styles.row_icon_lb, {textAlignVertical: "top", lineHeight: 22}]}
                  secureTextEntry={false}
                  value={this.state.overview}
                  multiline={true}
                  numberOfLines={7}
                  onChangeText={text => this.setOverview(text)}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>

          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            maximumDate={new Date()}
            date={this.state.dobDate}
          />
        </View>
        {this.showLoading()}

        <View style={styles.skipView}>
          {(params ? params.isFromRegistration : false) && (
            <TouchableOpacity
              style={styles.skipButtonView}
              onPress={() => this.onSkip()}
            >
              <Text style={styles.skipButton}>Skip</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.skipButtonView}
            onPress={() => this.onUpdateProfile()}
          >
            <Text style={styles.skipButton}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  onSkip() {
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;

    let isGuide = params
      ? params.isGuideRegistration
        ? params.isGuideRegistration
        : this.props.userdata.user.isLoggedInAsGuide
      : this.props.userdata.user.isLoggedInAsGuide;

    if (isGuide) {
      //Identity verification
      navigate("IdentityVerification", {
        isFromRegistration: params ? params.isFromRegistration : false
      });
    } else {
      navigate("AddPaymentMethod", {
        isFromRegistration: params ? params.isFromRegistration : false
      });
    }
  }

  updateUI(data) {
    //First name
    if (data.general_profile.first_name) {
      this.setState({ firstname: data.general_profile.first_name });
    }

    //Last name
    if (data.general_profile.last_name) {
      this.setState({ lastname: data.general_profile.last_name });
    }

    //Date of birth
    if (data.general_profile.date_of_birth) {
      var date = moment(
        data.general_profile.date_of_birth,
        "YYYY-MM-DD"
      ).toDate();

      if (date) {
        this.setState({
          dobDate: date,
          dob: moment(date).format("MM/DD/YYYY")
        });
      }
    }

    //Profession
    if (data.general_profile.profession) {
      this.setState({ profession: data.general_profile.profession });
    }

    //First Languages
    if (data.general_profile.languages.Native) {
      let langDict = {
        id: data.general_profile.languages.Native_language_id,
        order: 1,
        text: data.general_profile.languages.Native,
        proficiency: { type: "Native" }
      };

      this.setState({ firstLanguage: langDict });
    }

    //Second Languages
    if (data.general_profile.languages.Intermediate) {
      let langDict = {
        id: data.general_profile.languages.Intermediate_language_id,
        order: 1,
        text: data.general_profile.languages.Intermediate,
        proficiency: { type: "Intermediate" }
      };

      this.setState({ secondLanguage: langDict });
    }

    //Third Languages
    if (data.general_profile.languages.Advanced) {
      let langDict = {
        id: data.general_profile.languages.Advanced_language_id,
        order: 1,
        text: data.general_profile.languages.Advanced,
        proficiency: { type: "Advanced" }
      };

      this.setState({ thirdLanguage: langDict });
    }

    //Selected Interests
    if (data.general_profile.interests) {
      this.setState({ selectedInterests: data.general_profile.interests });

      if (data.guide_profile.overview) {
        this.setState({ overview: data.guide_profile.overview });
      }
    }

    //Rating
    if (this.props.userdata.user.isLoggedInAsGuide) {
      if (data.guide_profile.rate) {
        this.setState({ rate: data.guide_profile.rate.toString() });
      }
    } else {
      if (data.tourist_profile.about) {
        this.setState({ overview: data.tourist_profile.about });
      }
    }

    //City
    if (this.props.userdata.user.isLoggedInAsGuide) {
      if (data.guide_profile.city) {
        let city = {};
        city.description = data.guide_profile.city + ",";

        if (data.guide_profile.city_id) {
          city.place_id = data.guide_profile.city_id;
        }

        if (data.general_profile.registration_country) {
          city.terms = [{ value: data.general_profile.registration_country }];
        }

        console.log("city object", city);

        this.setState({ city: city });
      }
    }
  }

  //getUserProfileAllData
  getProfileWS() {
    const { navigate } = this.props.navigation;

    this.setState({
      isLoading: true
    });

    var { dispatch } = this.props;

    var params = {};

    getUserProfileAllData(params)
      .then(data => {
        this.setState({
          isLoading: false
        });

        if (data && data.status === 400) {
          Alert.alert("Tourzan", data.detail);
        } else {
          this.state.profile = data;
          this.setState({ profile: data });
          this.updateUI(data);
        }

        console.log("getUserProfileAllData", data);
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  //
  updateGuideProfileWS() {
    const { navigate } = this.props.navigation;

    this.setState({
      isLoading: true
    });

    var { dispatch } = this.props;

    var params = {};

    if (this.state.dob) {
      params.dob = this.state.dob;
    } else {
      params.dob = "0";
    }

    params.first_name = this.state.firstname;
    params.last_name = this.state.lastname;

    //City Logic
    var terms = "";
    if (this.state.city) {
      if (this.state.city.terms) {
        terms = this.state.city.terms;
        if (terms.length > 0) {
          params.country = terms[terms.length - 1].value;
        }
      }

      params.city = this.state.city.description.split(",")[0];
      params.place_id = this.state.city.place_id;
    } else {
      params.city = "";
      params.place_id = "";
    }

    if (this.state.rate) {
      params.rate = this.state.rate;
    } else {
      params.rate = "0.00";
    }

    params.overview = this.state.overview;

    //Languages
    let languages = [];
    if (this.state.firstLanguage.text) {
      languages.push({ name: this.state.firstLanguage.text, level: 1 });
    }

    if (this.state.secondLanguage.text) {
      languages.push({ name: this.state.secondLanguage.text, level: 2 });
    }

    if (this.state.thirdLanguage.text) {
      languages.push({ name: this.state.thirdLanguage.text, level: 3 });
    }

    if (languages) {
      params.languages = JSON.stringify(languages);
    }

    //Interests
    let interests = JSON.stringify(this.state.selectedInterests);
    if (interests) {
      params.interests = interests;
    }

    updateGuideProfile(params)
      .then(data => {
        if (data.error) {
          Alert.alert("Tourzan", data.error);
        } else {
          //Nav pass data
          const { params } = this.props.navigation.state;

          if (params ? params.isFromRegistration : false) {
            //Create Paymentrails Recipient
            this.createRecipientsPaymentrailsWS();
          } else {
            //Nav pass data
            const { params } = this.props.navigation.state;

            if (params && params.ProfileUpdated) {
              params.ProfileUpdated();
            }

            Alert.alert(
              "Tourzan",
              "Profile updated successfully.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    this.props.navigation.dispatch(backAction);
                  }
                }
              ],
              { cancelable: true }
            );
          }
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  createRecipientsPaymentrailsWS() {
    const { navigate } = this.props.navigation;

    let body = {
      type: "individual",
      firstName: this.state.firstname,
      lastName: this.state.lastname,
      email: this.props.userdata.user.email
    };

    createRecipientsPaymentrails(body)
      .then(data => {
        this.setState({
          isLoading: false
        });

        Alert.alert(
          "Tourzan",
          "Profile updated successfully.",
          [
            {
              text: "OK",
              onPress: () => {
                const { params } = this.props.navigation.state;
                const { navigate } = this.props.navigation;

                //Identity verification
                navigate("IdentityVerification", {
                  isFromRegistration: params ? params.isFromRegistration : false
                });
              }
            }
          ],
          { cancelable: true }
        );
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  //
  updateTouristProfileWS() {
    //Nav passdata

    const { navigate } = this.props.navigation;

    this.setState({
      isLoading: true
    });

    var { dispatch } = this.props;

    let age = moment().diff(this.state.dobDate, "years", false);

    var params = {};

    params.about = this.state.overview;
    params.first_name = this.state.firstname;
    params.last_name = this.state.lastname;

    if (this.state.age) {
      params.age = this.state.age;
    }

    if (this.state.dob) {
      params.dob = this.state.dob;
    } else {
      params.dob = 0;
    }

    params.profession = this.state.profession;

    let interests = JSON.stringify(this.state.selectedInterests);
    if (interests) {
      params.interests = interests;
    }

    /*
    firstLanguage: { order: 1 },
    secondLanguage: { order: 2 },
    thirdLanguage: { order: 3 },
    
    let langDict = {
      order: 1,
      text: data.general_profile.languages.Native,
      proficiency: { type: "Native" }
    };
    */

    let languages = [];
    if (this.state.firstLanguage.text) {
      languages.push({ name: this.state.firstLanguage.text, level: 1 });
    }

    if (this.state.secondLanguage.text) {
      languages.push({ name: this.state.secondLanguage.text, level: 2 });
    }

    if (this.state.thirdLanguage.text) {
      languages.push({ name: this.state.thirdLanguage.text, level: 3 });
    }

    if (languages) {
      params.languages = JSON.stringify(languages);
    }

    updateTouristProfile(params)
      .then(data => {
        this.setState({
          isLoading: false
        });

        if (data.error) {
          Alert.alert("Tourzan", data.detail);
        } else {
          //Nav pass data
          const { params } = this.props.navigation.state;

          if (params && params.ProfileUpdated) {
            params.ProfileUpdated();
          }

          Alert.alert(
            "Tourzan",
            "Profile updated successfully.",
            [
              {
                text: "OK",
                onPress: () => {
                  const { params } = this.props.navigation.state;

                  if (params ? params.isFromRegistration : false) {
                    navigate("AddPaymentMethod");
                  } else {
                    this.props.navigation.dispatch(backAction);
                  }
                }
              }
            ],
            { cancelable: true }
          );
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  //Select city callback
  cityDidSelected = cityDetail => {
    console.log("cityDidSelected", cityDetail);

    this.setState({ city: cityDetail });
  };

  //Select city callback
  interestsDidSelected = interests => {
    this.setState({ selectedInterests: interests });
  };

  //Select city callback
  languageDidSelected = language => {
    if (language.order == 1) {
      this.setState({ firstLanguage: language });
    } else if (language.order == 2) {
      this.setState({ secondLanguage: language });
    } else if (language.order == 3) {
      this.setState({ thirdLanguage: language });
    }
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
    width: width - 160,
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  rightView: {
    marginRight: 8,
    height: 20,
    width: 40
  },
  rightViewtext: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  out_container: {
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

  // --- main view --- //
  main_view: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f9fbfe",
    flex: 1,
    marginBottom: 44
  },
  blank_row_view: {
    width: width,
    height: 30,
    backgroundColor: "#f9fbfe",
    borderBottomWidth: 1,
    borderColor: "#c2c3c9"
  },
  row_icon_view: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    width: width,
    height: 50,
    borderBottomWidth: 1,
    borderColor: "#c2c3c9",
    backgroundColor: "white"
  },
  row_icon_view_no_height: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    width: width,
    borderBottomWidth: 1,
    borderColor: "#c2c3c9",
    backgroundColor: "white",
    minHeight: 50
  },
  row_icon_tag_view: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    width: width,
    borderBottomWidth: 1,
    borderColor: "#c2c3c9",
    minHeight: 50,
    backgroundColor: "white"
  },
  row_icon_lb: {
    marginLeft: 10,
    color: "#6e7478",
    fontSize: 15,
    marginTop: 10,
    flex: 1,
    fontFamily: DefaultFont.textFont
  },
  row_icon: {
    height: 15,
    width: 15
  },
  row_small_icon: {
    width: 15,
    height: 15
  },

  // --- Tags --- //
  tag_container_view: {
    marginTop: 8,
    flex: 1
  },
  item: {
    borderWidth: 1,
    borderColor: Colors.main,
    backgroundColor: Colors.main
  },
  label: {
    color: "#ffffff"
  },
  itemSelected: {
    backgroundColor: "#333"
  },
  labelSelected: {
    color: "#FFF"
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
    fontWeight: "800",
    fontFamily: DefaultFont.textFont
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

export default connect(mapStateToProps)(UpdateProfileScreen);
