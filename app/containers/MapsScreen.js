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
  AppState
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
var TimerMixin = require("react-timer-mixin");

//Store
import { store } from "../store/index";

//Actions
import { updatebooking } from "../actions/bookingActions";
import { updateuser } from "../actions/userActions";
import { updatelocation } from "../actions/locationActions";
import * as Actions from "../actions";

//Webservice
import {
  updateClockInOutStatus,
  acceptTrip,
  declineTrip,
  cancelTrip,
  updateTrip,
  loginAndUpdateTrip,
  getnearbyguides,
  gettripstatus,
  verifyToken
} from "../actions";

//Utilities
import { isIphoneX, Storage } from "../global/Utilities";

//Geo coder
import Geocoder from "../global/Geocoder";
Geocoder.init("AIzaSyDvAVjQNstV2ENih9MtQDi9DmbrJjhUcDk"); // use a valid API key

//FCM
import FCM, { NotificationActionType } from "react-native-fcm";
import {
  registerKilledListener,
  registerAppListener
} from "../global/Firebase/Listeners";
import firebaseClient from "../global/Firebase/FirebaseClient";

var { width, height } = Dimensions.get("window");

const backAction = NavigationActions.back({});

const resetRootAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Welcome" })],
  key: null
});

registerKilledListener();

class MapsScreen extends React.Component {
  //#region Constractors
  static navigationOptions = {
    header: null,
    tabBarLabel: "Maps",
    tabBarIcon: ({ tintColor }) => (
      <Image
        resizeMode="contain"
        source={require("../assets/images/Maps_Bottom_icon.png")}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    )
  };

  constructor(props) {
    super(props);
    this.state = {
      mapRegion: {
        latitude: 0.0,
        longitude: 0.0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      address: "Loading...",
      isSettingTime: false,
      hour: moment().format("hh"),
      minute: moment().format("mm"),
      trueSwitchIsOn: moment().format("A") == "AM" ? true : false,
      isLoading: false,
      nearByGuides: [],
      isRouteHidden: true,
      originCoordinate: { latitude: 0.0, longitude: 0.0 },
      destCoordinate: { latitude: 0.0, longitude: 0.0 },
      shouldZoomToCurrentLocation: true
    };

    this.onRegionChange = this.onRegionChange.bind(this);
  }

  //#endregion

  async componentDidMount() {
    this.handelNotifications();

    this.watchID = navigator.geolocation.watchPosition(
      position => {
        // Create the object to update this.state.mapRegion through the onRegionChange function
        this.addressFromCoordnate(
          position.coords.latitude,
          position.coords.longitude
        );

        //Update location store
        store.dispatch(
          updatelocation({
            lat: position.coords.latitude,
            long: position.coords.longitude
          })
        );

        //Update map
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922 * 150,
          longitudeDelta: 0.00421 * 150
        };

        if (this.state.shouldZoomToCurrentLocation) {
          this.onRegionChange(
            region,
            position.coords.latitude,
            position.coords.longitude
          );
          this.setState({ shouldZoomToCurrentLocation: false });
        }
      },
      error => {},
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    //Get nearby guides
    if (!this.props.userdata.user.isLoggedInAsGuide) {
      //Get nearby guides

      if (!this.timer) {
        this.timer = TimerMixin.setInterval(() => {
          if (this.props.userdata.user.isLoggedInAsGuide) {
            //Clear nearby guides on map
            if (this.state.nearByGuides && this.state.nearByGuides.length > 1) {
              this.setState({ nearByGuides: [] });
            }
          } else {
            //Get nearby guides
            this.onGetNearbyGuide();
          }

          //Add delay to give some time to redux to update state
          setTimeout(() => {
            //Update location and device token
            this.loginAndUpdateTripWS();

            //Update trip
            if (this.props.bookingdata.isTripInProgress) {
              this.updateTripWS();
            }
          }, 1000);
        }, 10000);
      }
    }

    //Check Token Exipred or not
    setTimeout(() => {
      this.verifyTokenWS();
    }, 5000);
  }

  componentWillUnmount() {
    if (this.watchID) {
      navigator.geolocation.clearWatch(this.watchID);
    }

    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  //#region GEO RELATED
  onRegionChange(region, lastLat, lastLong) {
    this.addressFromCoordnate(region.latitude, region.longitude);

    this.setState({
      mapRegion: region
      // If there are no new values set the current ones
      //lastLat: lastLat || this.state.lastLat,
      //lastLong: lastLong || this.state.lastLong
    });
  }

  addressFromCoordnate = (lat, long) => {
    Geocoder.from(lat, long)
      .then(json => {
        this.setState({ address: json.results[0].formatted_address });
      })
      .catch(error => console.warn(error));
  };
  //#endregion

  //#region Time related
  onSettingTime() {
    if (this.state.isSettingTime) {
      if (this.isValidHour()) {
        this.setState({ isSettingTime: false });
      } else {
        Alert.alert("Tourzan", "Please enter correct hour and minutes.");
      }
    } else {
      this.setState({ isSettingTime: true });
    }
  }

  onUnSettingTime() {
    if (this.isValidHour()) {
      this.setState({ isSettingTime: false });
    } else {
      Alert.alert("Tourzan", "Please enter correct hour and minutes.");
    }
  }

  setHour(text) {
    var hour = parseInt(text);

    if (hour) {
      hour = hour > 12 ? 12 : hour;

      this.setState({ hour: hour.toString() });
    } else {
      this.setState({ hour: "" });
    }
  }

  setMinute(text) {
    var minute = parseInt(text);

    if (minute) {
      minute = minute > 59 ? 0 : minute;

      this.setState({ minute: minute.toString() });
    } else {
      this.setState({ minute: "" });
    }
  }

  onChangeHourMinute(isHour, isUp) {
    var hour = parseInt(this.state.hour);
    var minute = parseInt(this.state.minute);

    if (isHour) {
      hour = hour + 1 * (isUp ? 1 : -1);
      hour = hour < 1 ? 12 : hour;
      hour = hour > 12 ? 1 : hour;

      this.setState({ hour: ("0" + hour).slice(-2).toString() });
    } else {
      minute = minute + 1 * (isUp ? 1 : -1);
      minute = minute < 0 ? 59 : minute;
      minute = minute > 59 ? 0 : minute;

      this.setState({ minute: ("0" + minute).slice(-2).toString() });
    }
  }

  isValidHour = () => {
    var hour = parseInt(this.state.hour);
    var minute = parseInt(this.state.minute);
    if (
      ((hour && hour >= 0) || hour <= 12) &&
      ((minute && minute >= 0) || minute < 60)
    ) {
      return true;
    }
    return false;
  };

  onBookingPressed = () => {
    const { navigate } = this.props.navigation;

    if (!this.props.currentlocation.lat || !this.props.currentlocation.long) {
      Alert.alert("Tourzan", "Your current location not found.");
      return;
    }

    navigate("BookingSearching");
  };

  onMyLocation = () => {
    if (this.props.currentlocation.lat && this.props.currentlocation.long) {
      //Update map
      let region = {
        latitude: this.props.currentlocation.lat,
        longitude: this.props.currentlocation.long,
        latitudeDelta: 0.00922 * 1.5,
        longitudeDelta: 0.00421 * 1.5
      };

      this.onRegionChange(
        region,
        this.props.currentlocation.lat,
        this.props.currentlocation.long
      );
    }
  };

  onDirection = () => {
    if (this.state.isRouteHidden == true) {
      this.setState({ isRouteHidden: false });
    } else {
      this.setState({ isRouteHidden: true });
    }
  };

  //#endregion
  onClockInOutPressed = () => {
    this.updateClockInOutStatusWS();
  };

  showClockinSwitch() {
    if (this.props.userdata.user.isLoggedInAsGuide) {
      return (
        <Switch
          value={this.props.userdata.user.isClockedIn}
          onValueChange={val => {
            this.onClockInOutPressed();
          }}
          disabled={false}
          activeText={"  IN  "}
          inActiveText={"OUT"}
          backgroundActive={"#31dd73"}
          backgroundInactive={"#c2c3c9"}
          circleActiveColor={"white"}
          circleInActiveColor={"white"}
        />
      );
    } else {
      return null;
    }
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

  showBottomBookButton() {
    const { navigate } = this.props.navigation;

    if (!this.props.userdata.user.isLoggedInAsGuide) {
      return !this.props.bookingdata.isTripInProgress ? (
        <TouchableOpacity
          style={styles.booking_view}
          onPress={() => {
            this.onBookingPressed();
          }}
        >
          <Image
            resizeMode="cover"
            source={require("../assets/images/book.png")}
            style={styles.booking_green_btn}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.booking_view}
          onPress={() => {
            navigate("CurrentTimeLimit");
          }}
        >
          <Image
            resizeMode="cover"
            source={require("../assets/images/book_time.png")}
            style={styles.booking_green_btn}
          />
        </TouchableOpacity>
      );
    } else {
      return this.props.bookingdata.isTripInProgress ? (
        <TouchableOpacity
          style={styles.booking_view}
          onPress={() => {
            navigate("CurrentTimeLimit");
          }}
        >
          <Image
            resizeMode="cover"
            source={require("../assets/images/book_time.png")}
            style={styles.booking_green_btn}
          />
        </TouchableOpacity>
      ) : null;
    }
  }

  showDirectionButton() {
    return this.props.bookingdata.isTripInProgress ? (
      <View style={styles.directionButton}>
        <TouchableOpacity onPress={() => this.onDirection()}>
          <Image
            resizeMode="cover"
            source={require("../assets/images/directions.png")}
            style={styles.myLocationButtonIcon}
          />
        </TouchableOpacity>
      </View>
    ) : null;
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.statusbar} />
        <View style={styles.top_container}>
          <View style={styles.backButton}>{this.showClockinSwitch()}</View>
          <Text style={styles.centerText}>TOURZAN</Text>
          <TouchableOpacity
            onPress={() => {
              navigate("Profile");
            }}
          >
            <Image
              resizeMode="cover"
              source={this.props.userdata.user.profilepicture}
              style={styles.rightView}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.map_container}>
          {
            <MapView
              style={styles.map_view}
              showsUserLocation={true}
              showsCompass={false}
              showsMyLocationButton={false}
              region={this.state.mapRegion}
              onRegionChange={this.onRegionChange}
            >
              {this.state.nearByGuides &&
                this.state.nearByGuides.map((element, index) => {
                  //Update map
                  let region = {
                    latitude: element.latitude,
                    longitude: element.longitude,
                    latitudeDelta: 0.00922 * 1.5,
                    longitudeDelta: 0.00421 * 1.5
                  };

                  return (
                    <MapView.Marker
                      coordinate={region}
                      centerOffset={{ x: 0, y: -10 }}
                      anchor={{ x: 1, y: 1 }}
                      image={flagImg}
                      key={index}
                    />
                  );
                })}

              {!this.state.isRouteHidden && (
                <MapViewDirections
                  origin={this.state.originCoordinate}
                  destination={this.state.destCoordinate}
                  strokeWidth={4}
                  strokeColor="hotpink"
                  apikey={"AIzaSyDvAVjQNstV2ENih9MtQDi9DmbrJjhUcDk"}
                  onStart={params => {
                    console.log(
                      `Started routing between "${params.origin}" and "${
                        params.destination
                      }"`
                    );
                  }}
                  onReady={result => {
                    // this.mapView.fitToCoordinates(result.coordinates, {
                    //     edgePadding: {
                    //         right: (width / 20),
                    //         bottom: (height / 20),
                    //         left: (width / 20),
                    //         top: (height / 20),
                    //     }
                    // });
                  }}
                  onError={errorMessage => {
                    console.log("GOT AN ERROR", errorMessage);
                  }}
                />
              )}
            </MapView>
          }
          <View style={styles.locationInfo_view}>
            <View style={styles.location_address_view}>
              <Image
                resizeMode="contain"
                source={require("../assets/images/location_maps.png")}
                style={styles.icon_image}
              />
              <Text style={styles.row_text}>{this.state.address}</Text>
            </View>

             <View style={styles.devide_line} />
             
          </View> 

          {this.showBottomBookButton()}

          <View style={styles.myLocationButton}>
            <TouchableOpacity onPress={() => this.onMyLocation()}>
              <Image
                resizeMode="cover"
                source={require("../assets/images/current-location.png")}
                style={styles.myLocationButtonIcon}
              />
            </TouchableOpacity>
          </View>

          {this.showDirectionButton()}
        </View>
        {this.showLoading()}
      </View>
    );
  }

  //
  updateClockInOutStatusWS() {
    if (!this.props.currentlocation.lat || !this.props.currentlocation.long) {
      Alert.alert(
        "Tourzan",
        "Your current location is unavailable. Unable to clock " +
          (this.props.userdata.user.isClockedIn ? "in" : "out")
      );
      return;
    }

    this.setState({
      isLoading: true
    });

    var { dispatch } = this.props;

    var params = {
      userid: this.props.userdata.user.userid,
      status: this.props.userdata.user.isClockedIn ? "clockout" : "clockin",
      latitude: this.props.currentlocation.lat,
      longitude: this.props.currentlocation.long
    };

    updateClockInOutStatus(params)
      .then(data => {
        this.setState({
          isLoading: false
        });

        this.props.userdata.user.isClockedIn = !this.props.userdata.user
          .isClockedIn;

        store.dispatch(updateuser(this.props.userdata));

        Alert.alert(
          "Tourzan",
          "You are successfully clocked " +
            (this.props.userdata.user.isClockedIn ? "in" : "out")
        );
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  acceptTripWS(touristId, timeLimit) {
    var { dispatch } = this.props;

    //"extradata":{"time_limit":18000,"user_id":117,"latitude":23.073076,"type":1,"body":"You have received a booking offer!","longitude":72.513348}

    var params = {
      status: "isAccepted",
      userid: touristId,
      guideid: this.props.userdata.user.userid,
      type: "automatic",
      time: timeLimit
    };

    acceptTrip(params)
      .then(data => {
        console.log("acceptTripWS-->", data);
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  declineTripWS() {
    this.setState({
      isLoading: true
    });

    var { dispatch } = this.props;

    var params = {
      type: "guide",
      status: "isDeclined",
      userid: this.props.userdata.user.userid
    };

    declineTrip(params)
      .then(data => {
        this.setState({
          isLoading: false
        });

        this.props.userdata.isClockedIn = !this.props.userdata.isClockedIn;

        store.dispatch(updateuser(this.props.userdata));

        console.log("declineTrip-->", data);
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        alert(err);
      });
  }

  updateTripWS() {
    var { dispatch } = this.props;

    if (!this.props.currentlocation.lat || !this.props.currentlocation.long) {
      return;
    }

    var params = {
      status: "update_trip",
      latitude: this.props.currentlocation.lat,
      longitude: this.props.currentlocation.long,
      tripid: this.props.bookingdata.tripid
    };

    updateTrip(params)
      .then(data => {
        console.log("updateTrip-->", data);
      })
      .catch(err => {});
  }

  loginAndUpdateTripWS() {
    var { dispatch } = this.props;

    if (
      !this.props.currentlocation.lat ||
      !this.props.currentlocation.long ||
      !this.props.bookingdata.push_token ||
      !this.props.userdata.user.userid
    ) {
      return;
    }

    var params = {
      status: "login",
      latitude: this.props.currentlocation.lat,
      longitude: this.props.currentlocation.long,
      userid: this.props.userdata.user.userid,
      devicetoken: this.props.bookingdata.push_token
    };

    loginAndUpdateTrip(params)
      .then(data => {
        console.log("loginAndUpdateTripWS-->", data);

        if (
          data.trip_in_progress &&
          data.trip_in_progress == true &&
          data.trip_id
        ) {
          console.log("Previous trip found. Trip id is", data.trip_id);

          this.gettripstatus(data.trip_id);
        }
      })
      .catch(err => {});
  }

  gettripstatus(tripid) {
    var { dispatch } = this.props;

    var params = {
      tripid: tripid
    };

    gettripstatus(params)
      .then(data => {
        console.log("get trips tatus-->", data);

        //
        let storestate = store.getState();
        storestate.tour.bookingdata.isTripInProgress = true;
        storestate.tour.bookingdata.tripid = tripid;
        storestate.tour.bookingdata.isAutomatic =
          data.flag == "automatic" ? true : false;

        if (this.props.userdata.user.isLoggedInAsGuide) {
          this.setState({
            originCoordinate: {
              latitude: this.props.currentlocation.lat,
              longitude: this.props.currentlocation.long
            },
            destCoordinate: {
              latitude: data.user_location.lat,
              longitude: data.user_location.lon
            }
          });
        } else {
          this.setState({
            originCoordinate: {
              latitude: this.props.currentlocation.lat,
              longitude: this.props.currentlocation.long
            },
            destCoordinate: {
              latitude: data.guide_location.lat,
              longitude: data.guide_location.lon
            }
          });
        }

        store.dispatch(updatebooking(storestate.tour.bookingdata));
      })
      .catch(err => {});
  }

  onGetNearbyGuide() {
    if (!this.props.currentlocation.lat || !this.props.currentlocation.long) {
      return;
    }

    var { dispatch } = this.props;

    var params = {
      userid: this.props.userdata.user.userid,
      latitude: this.props.currentlocation.lat,
      longitude: this.props.currentlocation.long,
      units: "km",
      range: "100"
    };

    getnearbyguides(params)
      .then(data => {
        console.log("Get onGetNearbyGuide-->", data);

        //Alert.alert('Get Nearby Guide Responce', JSON.stringify(data))

        if (data) {
          if (data.length < 1) {
            console.log("No nearby guides available");

            this.setState({ nearByGuides: [] });
          } else {
            this.setState({ nearByGuides: data });
          }
        } else {
          console.log("No nearby guides available");
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  verifyTokenWS() {
    var { dispatch } = this.props;

    verifyToken()
      .then(data => {
        console.log("Get verifyToken-->", data);

        if (!data.token) {
          Alert.alert(
            "Tourzan",
            "Session expired please login again.",
            [
              {
                text: "OK",
                onPress: () => {
                  //Reset Trip
                  let storestate = store.getState();
                  storestate.tour.bookingdata.isTripInProgress = false;
                  storestate.tour.bookingdata.tripid = 0;
                  storestate.tour.bookingdata.isAutomatic = true;

                  store.dispatch(updatebooking(storestate.tour.bookingdata));

                  Storage.removeItem("currentuser");

                  this.props.navigation.dispatch(resetRootAction);
                }
              }
            ],
            { cancelable: false }
          );
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  //Notifications
  async handelNotifications() {
    FCM.createNotificationChannel({
      id: "default",
      name: "Default",
      description: "used for example",
      priority: "high"
    });

    registerAppListener(this);

    try {
      let result = await FCM.requestPermissions({
        badge: false,
        sound: true,
        alert: true
      });
    } catch (e) {
      console.error(e);
    }

    FCM.getInitialNotification().then(notif => {
      //Works on both iOS and Android

      if (!notif) {
        return;
      }

      console.log("notif.custom_notification.color:", JSON.stringify(notif));

      this.notificationBannerTapped(notif);
    });

    FCM.getFCMToken().then(token => {
      console.log("TOKEN (getFCMToken)", token);

      this.setState({ token: token || "" });

      //Get store data
      let storestate = store.getState();
      storestate.tour.bookingdata.push_token = token;

      store.dispatch(updatebooking(storestate.tour.bookingdata));
    });

    if (Platform.OS === "ios") {
      FCM.getAPNSToken().then(token => {});
    }
  }

  notificationBannerTapped(notif) {
    // if ((AppState.currentState === 'background') || (AppState.currentState === 'inactive')) {
    //     return
    // }

    if (!notif) {
      return;
    }

    console.log("FCM Notification coming....", notif);

    if (Platform.OS === "ios") {
      var extradata = notif.extradata;

      if (notif.custom_notification) {
        extradata = JSON.parse(notif.custom_notification).extradata;

        //Booking offer received
        if (extradata.type == 1) {
          Alert.alert(
            "Debug",
            JSON.stringify(extradata),
            [
              {
                text: "Cancel",
                onPress: () => {}
              },
              {
                text: "Reject",
                onPress: () => {},
                style: "cancel"
              },
              {
                text: "Accept",
                onPress: () => {
                  this.acceptTripWS(extradata.user_id, extradata.time_limit);
                }
              }
            ],
            { cancelable: false }
          );

          //Tour Accepted by Tourist
        } else if (extradata.type == 2) {
          //Update location and device token
          this.loginAndUpdateTripWS();

          //Tour Ended by either tourist or guide
        } else if (extradata.type == 3) {
          //
          let storestate = store.getState();
          storestate.tour.bookingdata.isTripInProgress = false;
          storestate.tour.bookingdata.tripid = 0;
          storestate.tour.bookingdata.isAutomatic = true;

          store.dispatch(updatebooking(storestate.tour.bookingdata));
        }
      }
    } else {
      var extradata = notif.extradata;

      if (notif.custom_notification) {
        extradata = JSON.parse(notif.custom_notification).extradata;
      }

      //console.log("Android notif:",notif)

      if (extradata) {
        //"extradata":{"time_limit":18000,"user_id":117,"latitude":23.073076,"type":1,"body":"You have received a booking offer!","longitude":72.513348}

        //Booking offer received
        if (extradata.type == 1) {
          Alert.alert(
            "Debug",
            JSON.stringify(extradata),
            [
              {
                text: "Cancel",
                onPress: () => {
                  //notif.extradata.time_limit)
                  //
                }
              },
              {
                text: "Reject",
                onPress: () => {},
                style: "cancel"
              },
              {
                text: "Accept",
                onPress: () => {
                  this.acceptTripWS(extradata.user_id, extradata.time_limit);
                }
              }
            ],
            { cancelable: false }
          );
          //Tour Accepted by Tourist
        } else if (extradata.type == 2) {
          //Update location and device token
          this.loginAndUpdateTripWS();

          //Tour Ended by either tourist or guide
        } else if (extradata.type == 3) {
          //
          let storestate = store.getState();
          storestate.tour.bookingdata.isTripInProgress = false;
          storestate.tour.bookingdata.tripid = 0;
          storestate.tour.bookingdata.isAutomatic = true;

          store.dispatch(updatebooking(storestate.tour.bookingdata));
        }
      }
    }
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    position: "absolute",
    top: 0,
    left: 0
  },
  top_container: {
    marginTop: Platform.OS == "ios" ? (isIphoneX() ? 44 : 20) : 0,
    height: 44,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: width,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  backButton: {
    marginLeft: 20,
    height: 20,
    width: 20,
    justifyContent: "center"
  },
  centerText: {
    color: "black",
    textAlign: "center",
    fontSize: 17,
    width: width - 160,
    fontWeight: "bold"
  },
  rightView: {
    marginRight: 20,
    height: 36,
    width: 36,
    borderRadius: 18
  },
  map_container: {
    flex: 1,
    width: width,
    alignItems: "center",
    backgroundColor: "transparent"
  },
  map_view: {
    flex: 1,
    width: width
  },
  locationInfo_view: {
    position: "absolute",
    width: width - 60,
    top: 25,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "column",
    justifyContent: "flex-start",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 10,
    shadowOpacity: 0.2
  },
  location_address_view: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: width - 70,
    paddingHorizontal: 20
  },
  devide_line: {
    backgroundColor: "#c2c3c9",
    height: 1,
    width: width - 60
  },
  location_time_touchable_view: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20
  },
  location_time_view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 30,
    width: width - 120
  },
  location_time_left_child: {
    flexDirection: "row",
    alignItems: "center",
    height: 30
    // width:width-90,
  },
  booking_view: {
    position: "absolute",
    width: 85,
    height: 85,
    bottom: 20,
    backgroundColor: "transparent"
  },
  booking_green_btn: {
    backgroundColor: "transparent",
    width: 85,
    height: 85
  },
  icon_image: {
    marginLeft: 10,
    height: 15,
    width: 15
  },
  row_text: {
    marginLeft: 15
  },
  edit_time: {
    height: 15,
    width: 15
  },

  // --- setting time view --- //
  setting_time_view: {
    flexDirection: "column",
    alignItems: "center"
  },
  setting_time_top_view: {
    backgroundColor: "#f9fbfe",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    width: width - 62,
    borderBottomWidth: 1,
    borderColor: "#c2c3c9",
    paddingHorizontal: 20
  },
  setting_time_main_view: {
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center"
  },
  setting_time_lb_view: {
    paddingVertical: 10,
    width: width - 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#c2c3c9"
  },
  setting_time_lb: {
    color: "black"
  },
  setting_time_check_icon: {
    height: 15,
    width: 15
  },
  setting_time_picker_view: {
    width: width - 120 - 20,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  setting_time_picker_main_view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  hour_view: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  hour_text: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    height: 50,
    width: 40,
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 5,
    textAlign: "center"
  },
  hour_lb: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
    color: "#9fa0a2"
  },
  double_dut_view: {
    marginBottom: 20,
    width: 60,
    alignItems: "center"
  },
  double_dut_symbol: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: "black"
  },
  minute_view: {
    flexDirection: "column",
    alignItems: "center"
  },
  up_down_arrow_view: {
    width: 40,
    height: 40
  },
  switch_view: {},
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
  myLocationButton: {
    backgroundColor: "transparent",
    position: "absolute",
    right: 10,
    bottom: 10
  },
  directionButton: {
    backgroundColor: "transparent",
    position: "absolute",
    left: 10,
    bottom: 10
  },
  myLocationButtonIcon: {
    width: 40,
    height: 40
  }
});

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
};

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapsScreen);
