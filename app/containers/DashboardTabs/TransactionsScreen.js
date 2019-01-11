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
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Platform
} from "react-native";

import { Rating, AirbnbRating } from "react-native-ratings";
import { NavigationActions } from "react-navigation";
import NavigationBar from "../../components/NavigationBar";
import moment from "moment";

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

//Webservice
import {
  previousGuideList,
  getOrdersGuideRepresentation,
  getOrdersTouristRepresentation
} from "../../actions";

var { width, height } = Dimensions.get("window");

class TransactionsScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      isFetching: false,
      shouldShowEmptyState: false
    };

    this.navigate = this.props.navigation;
  }

  onRefresh() {
    console.log("Refreshing.....");

    this.setState({ isFetching: true });
    this.previousGuideListWS();
  }

  // function for ratingview
  ratingCompleted(rating) {
    console.log("Rating is: " + rating);
  }

  componentWillMount() {
    let orderdata = store.getState().user.orderList;
    console.log("store.getState().user.orderList is: " + orderdata);

    if (store.getState().user.orderList.length < 1) {
      this.previousGuideListWS();
    } else {
      this.setState({ dataSource: store.getState().user.orderList });
    }
  }

  pressRow(rowData) {
    this.navigate.navigate("TransactionItemDetail", { tripData: rowData });
  }

  getDateString = date => {
    let chatdate = moment(date);

    var isPast = moment(chatdate);

    //2018-10-04T13:10:10.716Z
    if (moment(chatdate).isSame(moment(), "day")) {
      return chatdate.format("hh:mm A");
    } else {
      return chatdate.format("DD MMM YYYY");
    }
  };

  getTripDurationString = seconds => {
    var formatted = "";

    if (seconds < 60) {
      formatted = moment.utc(seconds * 1000).format("ss") + "s";
    } else {
      formatted =
        moment.utc(seconds * 1000).format("HH") +
        "h " +
        moment.utc(seconds * 1000).format("mm") +
        "m";
    }

    return formatted;
  };

  renderRow = ({ item, index }) => {
    return (
      // <TouchableHighlight
      //   style={styles.row_view}
      //   onPress={() => this.pressRow(item)}
      //   underlayColor="transparent"
      // >
      <View style={styles.row_view}>
        <View style={styles.row}>
          <View style={styles.amount_view}>
            <Text style={styles.amount_text}>
              $
              {this.props.userdata.user.isLoggedInAsGuide
                ? item.guide_payment
                : item.total_price}
            </Text>
          </View>
          <View style={styles.verticle_line} />

          <View style={styles.info_view}>
            <View style={styles.info_row_view}>
              <Image
                resizeMode="contain"
                source={require("../../assets/images/cash_icon.png")}
                style={styles.location_icon}
              />
              <Text style={styles.location_text}>
                Base Charge: ${item.total_price_before_fees}
              </Text>
            </View>
            <View style={styles.info_row_view}>
              <Image
                resizeMode="contain"
                source={require("../../assets/images/cash_icon.png")}
                style={styles.location_icon}
              />
              <Text style={styles.location_text}>
                Discount: ${item.discount}
              </Text>
            </View>
            <View style={styles.info_row_view}>
              <Image
                resizeMode="contain"
                source={require("../../assets/images/cash_icon.png")}
                style={styles.location_icon}
              />
              <Text style={styles.location_text}>
                Service fee: $
                {this.props.userdata.user.isLoggedInAsGuide
                  ? item.fees_guide
                  : item.fees_tourist}
              </Text>
            </View>
            <View style={styles.info_row_view}>
              <Image
                resizeMode="contain"
                source={require("../../assets/images/cash_icon.png")}
                style={styles.location_icon}
              />
              <Text style={styles.location_text}>
                Total: $
                {this.props.userdata.user.isLoggedInAsGuide
                  ? item.guide_payment
                  : item.total_price}
              </Text>
            </View>
            <View style={styles.info_row_view}>
              <Image
                resizeMode="contain"
                source={require("../../assets/images/time_icon.png")}
                style={styles.location_icon}
              />
              <Text style={styles.time_text}>
                {this.getTripDurationString(item.duration_seconds)}
              </Text>
            </View>
          </View>
          <View style={styles.row_right_view}>
            <Text style={styles.right_text}>
              {this.getDateString(item.date_booked_for)}
            </Text>
            <TouchableOpacity style={styles.arrow_view}>
              {/* <Image
                resizeMode="contain"
                source={require("../../assets/images/item_arrow.png")}
                style={styles.arrow_btn}
              /> */}
            </TouchableOpacity>
          </View>
        </View>
        {/* </TouchableHighlight> */}
      </View>
    );
  };

  showEmptyState() {
    return (
      <View style={styles.emptyStateContainer}>
        <Image
          resizeMode="contain"
          source={require("../../assets/images/transaction_icon.png")}
          style={styles.emptyStateImage}
        />
        <Text style={styles.emptyStateBoldText}>
          {"No previous transactions were found. "}
        </Text>
        <Text style={styles.emptyStateNormalText}>
          {this.props.userdata.user.isLoggedInAsGuide
            ? "Your previous orders are displayed here. \n No previous transactions were found."
            : "You can book a guide from Maps screen. \n Your previous transaction displayed here."}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, width: "100%" }}>
        {this.state.dataSource.length < 1 &&
          this.state.shouldShowEmptyState &&
          this.showEmptyState()}

        {this.state.dataSource.length > 0 && (
          <FlatList
            data={this.state.dataSource}
            renderItem={this.renderRow}
            renderSeparator={(sectionId, rowId) => (
              <View key={rowId} style={styles.separator} />
            )}
            extraData={this.state}
            showsVerticalScrollIndicator={true}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
          />
        )}
      </View>
    );
  }

  previousGuideListWS() {
    if (this.props.userdata.user.isLoggedInAsGuide) {
      getOrdersGuideRepresentation()
        .then(data => {
          console.log("getOrdersGuideRepresentation", data);

          if (data && data.length > 0) {
            data.sort(function(a, b) {
              return new Date(b.date_booked_for) - new Date(a.date_booked_for);
            });

            this.setState({ dataSource: data, shouldShowEmptyState: false });
          } else {
            this.setState({ dataSource: [], shouldShowEmptyState: true });
          }

          this.setState({ isFetching: false });
        })
        .catch(err => {
          this.setState({ isFetching: false });
          alert(err);
        });
    } else {
      getOrdersTouristRepresentation()
        .then(data => {
          console.log("getOrdersTouristRepresentation", data);

          if (data && data.length > 0) {
            data.sort(function(a, b) {
              return new Date(b.date_booked_for) - new Date(a.date_booked_for);
            });

            this.setState({ dataSource: data, shouldShowEmptyState: false });
          } else {
            this.setState({ dataSource: [], shouldShowEmptyState: true });
          }
          this.setState({ isFetching: false });
        })
        .catch(err => {
          this.setState({ isFetching: false });
          alert(err);
        });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    flexDirection: "column"
  },
  icon: {
    width: 20,
    height: 20
  },
  text_color: {
    color: "#000"
  },
  row_view: {
    marginTop: 0,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "white"
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ddd"
  },
  row: {
    alignItems: "center",
    flexDirection: "row"
  },
  amount_view: {
    padding: 10,
    alignItems: "center",
    borderRightWidth: 0.5,
    borderColor: "white",
    width: 70
  },
  amount_text: {
    fontSize: 12,
    color: Colors.color999,
    fontFamily: DefaultFont.textFont
  },
  info_view: {
    width: (width * 45) / 100,
    marginLeft: 10,
    flexDirection: "column",
    justifyContent: "center"
  },
  info_row_view: {
    marginTop: 5,
    height: 15,
    flexDirection: "row",
    alignItems: "center"
  },
  location_icon: {
    width: 10,
    height: 10
  },
  location_text: {
    marginLeft: 5,
    fontSize: 12,
    color: "#000",
    textAlign: "left",
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  time_text: {
    marginLeft: 5,
    fontSize: 12,
    color: Colors.tintColor,
    textAlign: "left",
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  row_right_view: {
    marginRight: 5,
    width: (width * 30) / 100,
    flexDirection: "column",
    alignItems: "flex-end"
  },
  right_text: {
    fontSize: 10,
    fontFamily: DefaultFont.textFont
  },
  arrow_view: {
    marginTop: 5
  },
  arrow_btn: {
    width: 10,
    height: 15
  },
  verticle_line: {
    width: 0.5,
    height: 60,
    backgroundColor: "#dddddd"
  },

  //Empty state
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    justifyContent: "center"
  },
  emptyStateImage: {
    width: 80,
    height: 80,
    opacity: 0.1
  },
  emptyStateBoldText: {
    width: "100%",
    marginTop: 12,
    textAlign: "center",
    color: "#bbbbbb",
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  emptyStateNormalText: {
    width: "100%",
    marginTop: 12,
    textAlign: "center",
    color: "#bbbbbb",
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

export default connect(mapStateToProps)(TransactionsScreen);
