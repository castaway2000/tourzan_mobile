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
  NativeModules,
  ActivityIndicator
} from "react-native";

import { NavigationActions } from "react-navigation";
import Checkbox from "react-native-custom-checkbox";
import NavigationBar from "../components/NavigationBar";
import ImagePicker from "react-native-image-picker";

//Store
import { connect } from "react-redux";
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser } from "../actions/userActions";

//Utilities
import { Storage, isIphoneX } from "../global/Utilities";
import {
  Colors,
  API,
  Paymentrails,
  Braintree,
  DefaultFont
} from "../constants";

//Webservice
import {
  profile,
  createApplicantOnfido,
  paymentMethodTypes,
  uploadProfilePicture
} from "../actions";

var { width, height } = Dimensions.get("window");
const backAction = NavigationActions.back({});

class SettingsScreen extends React.Component {
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
    this.state = {
      isLoading: false
    };
    this.navigate = this.props.navigation;
  }

  async componentDidMount() {
    let paymentMethodTypes = await Storage.getItem("paymentMethodTypes");

    console.log("cached payment data", paymentMethodTypes);

    //Get cached payment data if available
    if (!paymentMethodTypes) {
      this.paymentMethodTypesWS();
    }
  }

  //Show full name
  _fullname = () => {
    let fullname = "";

    if (this.props.userdata.user.first_name) {
      fullname = this.props.userdata.user.first_name;
    }

    if (this.props.userdata.user.last_name) {
      fullname = fullname + " " + this.props.userdata.user.last_name;
    }

    if (!fullname) {
      fullname = this.props.userdata.user.username;
    }

    return fullname;
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

  onUploadProfilePicture() {
    // More info on all the options is below in the API Reference... just some common use cases shown here
    const options = {
      title: "Select Avatar",
      maxWidth: 400,
      maxHeight: 400,
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };
        this.uploadProfileWS(response.data);
      }
    });
  }

  validateVerification() {
    this.getProfileDataForBankValidation();
  }

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
          <Text style={styles.centerText}>Settings</Text>
          <View style={styles.rightView} />
        </View>
        <View style={styles.main_view}>
          <View style={styles.main_top_view}>
            <TouchableOpacity
              onPress={() => {
                this.onUploadProfilePicture();
              }}
            >
              <Image
                resizeMode="cover"
                source={this.props.userdata.user.profilepicture}
                style={styles.user_photo_img}
              />

              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: "800",
                    fontSize: 15,
                    fontFamily: DefaultFont.textFont
                  }}
                >
                  {" "}
                  Edit{" "}
                </Text>

                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "800",
                      fontSize: 14,
                      fontFamily: DefaultFont.textFont
                    }}
                  >
                    {" "}
                    Edit{" "}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <Text style={styles.profile_name_text}>{this._fullname()}</Text>

            <Text style={styles.profile_email_text}>
              {this.props.userdata.user.email
                ? this.props.userdata.user.email
                : "-"}
            </Text>
          </View>

          <View style={styles.main_info_view}>
            <TouchableOpacity
              style={styles.row_view}
              onPress={() => {
                this.navigate.navigate("UpdateProfile");
              }}
            >
              <Text style={styles.row_lb}>Update Profile</Text>
              <Image
                resizeMode="contain"
                source={require("../assets/images/item_arrow.png")}
                style={styles.row_icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.row_view}
              onPress={() => {
                this.navigate.navigate("ChangePassword");
              }}
            >
              <Text style={styles.row_lb}>Update Password</Text>
              <Image
                resizeMode="contain"
                source={require("../assets/images/item_arrow.png")}
                style={styles.row_icon}
              />
            </TouchableOpacity>
            <View style={styles.blank_row_view} />

            {/* <View style={styles.row_icon_view}>
              <Image
                resizeMode="contain"
                source={require("../assets/images/Icon_email.png")}
                style={styles.row_small_icon}
              />
              <TextInput underlineColorAndroid='transparent' style={styles.row_icon_lb} value={'adamparker@gmail.com'}></TextInput>
              <Text style={styles.row_icon_lb}>
                {this.props.userdata.user.email
                  ? this.props.userdata.user.email
                  : "-"}
              </Text>
            </View> */}
            {/* <View style={styles.row_icon_view}>
                            <Image resizeMode='contain' source={require("../assets/images/trip_item_location_icon.png")} style={styles.row_small_icon} />
                            <Text style={styles.row_icon_lb}>Pending from webside</Text>
                        </View> */}

            {!this.props.userdata.user.isLoggedInAsGuide && (
              <TouchableOpacity
                style={styles.row_credit_view}
                onPress={() => this.navigate.navigate("CardList")}
              >
                <View style={styles.row_icon_small_view}>
                  <Image
                    resizeMode="contain"
                    source={require("../assets/images/wallet_icon.png")}
                    style={styles.row_small_icon}
                  />
                  <Text style={styles.row_icon_lb}>Credit Card</Text>
                </View>
                <Image
                  resizeMode="contain"
                  source={require("../assets/images/item_arrow.png")}
                  style={styles.row_icon}
                />
              </TouchableOpacity>
            )}

            {this.props.userdata.user.isLoggedInAsGuide && (
              <TouchableOpacity
                style={styles.row_credit_view}
                onPress={() => this.validateVerification()}
              >
                <View style={styles.row_icon_small_view}>
                  <Image
                    resizeMode="contain"
                    source={require("../assets/images/wallet_icon.png")}
                    style={styles.row_small_icon}
                  />
                  <Text style={styles.row_icon_lb}>Bank Info</Text>
                </View>
                <Image
                  resizeMode="contain"
                  source={require("../assets/images/item_arrow.png")}
                  style={styles.row_icon}
                />
              </TouchableOpacity>
            )}

            {this.props.userdata.user.isLoggedInAsGuide && (
              <TouchableOpacity
                style={styles.row_credit_view}
                onPress={() => this.getProfileData()}
              >
                <View style={styles.row_icon_small_view}>
                  <Image
                    resizeMode="contain"
                    source={require("../assets/images/wallet_icon.png")}
                    style={styles.row_small_icon}
                  />
                  <Text style={styles.row_icon_lb}>Identity Verification</Text>
                </View>
                <Image
                  resizeMode="contain"
                  source={require("../assets/images/item_arrow.png")}
                  style={styles.row_icon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {this.showLoading()}
      </View>
    );
  }

  //API Call get user profile
  getProfileData() {
    this.setState({
      isLoading: true
    });

    var params = {
      userid: this.props.userdata.user.userid
    };

    profile(params)
      .then(data => {
        console.log("Profile data-->", data);

        if (data) {
          this.verifyVerification(data);
        } else {
          Alert.alert("Tourzan", "Server error. Please try again.");
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  verifyVerification(data) {
    /*
        From client:
        there are two extra details. 
        anything other than passed or consider from verification_result object should flag for contacting tourzan.

        there is also a verification_status that will have clear or awaiting approval or withdrawn. 
        anything other than awaiting approval or completed should be cause to send them to tourzan.
        */

    /*
        User_profile

        it has three new items.
        is_verified = True/False
        verification status
        and
        verification result

        status will be in progress or waiting etc

        We are running the report in the background. if it csomes back as fuzzy or rejected, you will no longer be verified and will have to redo your verification

        when rejected it should say the following

        Your verification results came up fuzzy we need you to resubmit proper information.

        please reach out to us at contactus@tourzan.com to have your verification reset.
        */

    if (data.is_verified === true) {
      let type = 0;

      this.props.navigation.navigate("VerificationResult", { type: type });

      this.setState({
        isLoading: false
      });

      return;
    }

    if (data.verification_status) {
      let type = 1;

      if (data.verification_status == "progress") {
        this.props.navigation.navigate("VerificationResult", { type: type });
      } else if (data.verification_status == "waiting") {
        this.props.navigation.navigate("VerificationResult", { type: type });
      }

      this.setState({
        isLoading: false
      });

      return;
    }

    if (data.verification_result) {
      let type = 2;

      if (data.verification_result == "rejected") {
        this.props.navigation.navigate("VerificationResult", { type: type });

        this.setState({
          isLoading: false
        });

        return;
      }
    }

    this.generateOnfidoApplicantID(data);
  }

  generateOnfidoApplicantID(data) {
    if (!data.first_name || !data.last_name) {
      Alert.alert(
        "Tourzan",
        "Please complete your first name and last name to continue."
      );
      return;
    }

    this.setState({
      isLoading: true
    });
    
    var params = {
      firstname: data.first_name,
      lastname: data.last_name
    };

    createApplicantOnfido(params)
      .then(data => {
        console.log("GenerateOnfidoApplicantID data-->", data);

        this.setState({
          isLoading: false
        });

        if (data) {
          if (data.id) {
            //Verify Guide Identity
            this.verifyOnfidoIdentity(data.id);
          } else {
            Alert.alert("Tourzan", "Server error. Please try again.");
          }
        } else {
          Alert.alert("Tourzan", "Server error. Please try again.");
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  verifyOnfidoIdentity(applicationId) {
    if (Platform.OS == "ios") {
      NativeModules.OnfidoSDK.startSDK(
        applicationId,
        applicationId => {
          Alert.alert("Tourzan", "Verification complete");
          this.isVerified = true;
        },
        errorCause => {
          this.setState({
            isLoading: false
          });
          Alert.alert("Tourzan", "Verification not finished please try again.");
          this.isVerified = false;
        }
      );
    } else {
      NativeModules.OnfidoSDK.startSDK(
        applicationId,
        applicantId => {
          Alert.alert("Tourzan", "Verification complete");
          this.isVerified = true;
        },
        errorCause => {
          Alert.alert("Tourzan", "Verification not finished please try again.");
          this.isVerified = false;
        }
      );
    }
  }

  paymentMethodTypesWS() {
    paymentMethodTypes()
      .then(data => {
        if (data) {
          Storage.setItem("paymentMethodTypes", data);
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  uploadProfileWS(imageData) {
    this.setState({
      isLoading: true
    });

    var params = {
      user_type: this.props.userdata.user.isLoggedInAsGuide
        ? "guide"
        : "tourist",
      image: imageData
    };

    uploadProfilePicture(params)
      .then(data => {
        console.log("Profile data-->", data);

        if (data && data.status == 200) {
          this.onLoadProfileData();
        } else {
          Alert.alert("Tourzan", "Server error. Please try again.");
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  //API Call get user profile
  onLoadProfileData() {
    this.setState({
      isLoading: true
    });

    var params = {
      userid: this.props.userdata.user.userid
    };

    profile(params)
      .then(data => {
        this.setState({
          isLoading: false
        });
        if (data) {
          let isGuide = this.props.userdata.user.isLoggedInAsGuide;

          if (isGuide) {
            this.props.userdata.user.guide_profile_image =
              data.guide_data.profile_image;

            store.dispatch(updateuser(this.props.userdata));
          } else {
            this.props.userdata.user.tourist_profile_image =
              data.profile_picture;

            store.dispatch(updateuser(this.props.userdata));
          }

          Storage.setItem("currentuser", this.props.userdata);
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  //API Call get user profile
  getProfileDataForBankValidation() {
    this.setState({
      isLoading: true
    });

    var params = {
      userid: this.props.userdata.user.userid
    };

    profile(params)
      .then(data => {
        this.setState({
          isLoading: false
        });
        if (data) {
          if (data.is_verified == true || this.isVerified == true) {
            this.navigate.navigate("PaymentrailDetail");
          } else {
            Alert.alert(
              "Tourzan",
              "In order to add bank info you must verify you identity."
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
}

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20
  },
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
    marginRight: 20,
    height: 20,
    width: 20
  },

  // --- main view --- //
  main_view: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f9fbfe"
  },

  // -- main top view -- //
  main_top_view: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: width,
    height: 180,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#c2c3c9"
  },

  user_photo_img: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 40
  },
  profile_name_text: {
    marginTop: 8,
    fontSize: 17,
    color: "black",
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  profile_email_text: {
    marginTop: 8,
    fontSize: 13,
    color: "#31dd73",
    fontFamily: DefaultFont.textFont
  },

  // -- main info view -- //
  main_info_view: {
    flexDirection: "column",
    alignItems: "center",
    width: width
  },
  row_view: {
    height: 40,
    paddingVertical: 13,
    paddingHorizontal: 30,
    width: width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#c2c3c9",
    backgroundColor: "white"
  },
  row_credit_view: {
    height: 40,
    paddingVertical: 13,
    paddingHorizontal: 30,
    width: width,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#c2c3c9"
  },
  row_lb: {
    color: "#6e7478",
    fontSize: 13,
    fontFamily: DefaultFont.textFont
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
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#c2c3c9",
    backgroundColor: "white"
  },
  row_icon_lb: {
    marginLeft: 10,
    color: "#6e7478",
    fontSize: 13,
    width: width - 100,
    marginTop: 5,
    fontFamily: DefaultFont.textFont
  },
  row_icon: {
    height: 15,
    width: 15
  },
  row_small_icon: {
    width: 15,
    height: 10
  },
  row_icon_small_view: {
    flexDirection: "row",
    alignItems: "center",
    width: width - 60,
    height: 40
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
  }
});

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(SettingsScreen);
