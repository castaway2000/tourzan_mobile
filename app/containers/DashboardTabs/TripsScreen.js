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
  TouchableHighlight,
  ListView,
  Platform,
  ActivityIndicator
} from "react-native";

import { bindActionCreators } from "redux";
import { Rating, AirbnbRating } from "react-native-ratings";
import { NavigationActions } from "react-navigation";

import NavigationBar from "../../components/NavigationBar";
import { getTourList } from "../../actions";

//Store
import { connect } from "react-redux";
import { store } from "../../store/index";

//Actions
import { updatebooking } from "../../actions/bookingActions";
import { updateuser } from "../../actions/userActions";

//Utilities
import { Storage, isIphoneX } from "../../global/Utilities";
import {
  Colors,
  API,
  Paymentrails,
  Braintree,
  DefaultFont
} from "../../constants";

var { width, height } = Dimensions.get("window");

class TripsScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      toursList: [],
      starCount: 3.5
    };
    this.navigate = this.props.navigation;
  }

  // function for ratingview
  ratingCompleted(rating) {
    console.log("Rating is: " + rating);
  }

  // functions for listview
  componentWillMount() {
    this.getTourList();
  }

  getTourList() {
    getTourList()
      .then(data => {
        console.log("download toursList ->", data);
        this.setState({
          toursList: data
        });
      })
      .catch(err => {
        alert(err);
      });
  }

  pressRow(rowData) {
    //  var { dispatch } = this.props;
    //  dispatch(NavigationActions.navigate({routeName: 'TripItemDetail'}))

    console.log("rowData", rowData);

    this.props.navigation.navigate("TripItemDetail", { tourData: rowData });
  }

  showTourList() {
    return this.state.toursList.map((rowData, index) => {
      return (
        <TouchableOpacity
          style={styles.row_view}
          onPress={() => this.pressRow(rowData)}
          underlayColor="#ddd"
          key={index}
        >
          <View style={styles.row}>
            <Image
              resizeMode="cover"
              source={
                rowData.image_small
                  ? { uri: rowData.image_small }
                  : require("../../assets/images/trip_avatar.png")
              }
              style={styles.avatar_img}
            />
            <View style={styles.info_view}>
              <View style={styles.location_view}>
                <Image
                  resizeMode="contain"
                  source={require("../../assets/images/trip_item_location_icon.png")}
                  style={styles.location_icon}
                />
                <Text style={styles.name_text}>{rowData.name}</Text>
              </View>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.description_text}
              >
                {rowData.overview}
              </Text>
              <View style={styles.rate_view} pointerEvents="none">
                <Rating
                  ratingCount={5}
                  imageSize={8}
                  onFinishRating={this.ratingCompleted}
                  ratingBackgroundColor="transparent"
                />
                <Text style={styles.rating_text}>(12)</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.arrow_view}>
              <Image
                resizeMode="contain"
                source={require("../../assets/images/item_arrow.png")}
                style={styles.arrow_btn}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.sortBtn}>
          <Image
            source={require("../../assets/images/ic_tab_settings.png")}
            style={styles.sortImg}
          />
        </TouchableOpacity>
        <ScrollView style={styles.mTableView}>{this.showTourList()}</ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent"
  },
  sortBtn: {
    width: 40,
    alignItems: "center"
  },
  mTableView: {
    width: width - 50
  },
  sortImg: {
    marginTop: 25,
    width: 22,
    height: 22,
    resizeMode: "contain"
  },
  icon: {
    width: 20,
    height: 20
  },
  text_color: {
    color: "#000"
  },
  row_view: {
    height: 100,
    marginTop: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  row: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  avatar_img: {
    width: 80,
    height: 80,
    borderRadius: 5
  },
  info_view: {
    flex: 1,
    marginLeft: 10,
    flexDirection: "column",
    justifyContent: "center"
  },
  location_view: {
    height: 15,
    flexDirection: "row",
    alignItems: "center"
  },
  location_icon: {
    width: 13,
    height: 13
  },
  name_text: {
    marginLeft: 5,
    fontSize: 15,
    color: "#000",
    textAlign: "left",
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  description_text: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.color999,
    textAlign: "left",
    fontFamily: DefaultFont.textFont
  },
  rate_view: {
    marginTop: 5,
    height: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  ratingbar: {
    height: 10,
    width: 50
  },
  rating_text: {
    marginLeft: 5,
    fontSize: 8,
    color: Colors.color999,
    fontFamily: DefaultFont.textFont
  },
  arrow_view: {
    width: 30,
    alignItems: "flex-end"
  },
  arrow_btn: {
    width: 10,
    height: 15
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

const mapStateToProps = store => {
  return {
    bookingdata: store.tour.bookingdata,
    userdata: store.user.userdata,
    currentlocation: store.location.currentlocation
  };
};

export default connect(mapStateToProps)(TripsScreen);
