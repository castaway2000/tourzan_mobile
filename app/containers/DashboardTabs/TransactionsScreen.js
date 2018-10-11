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
  ListView,
  TouchableOpacity,
  TouchableHighlight,
  Platform
} from "react-native";

import Rating from "react-native-ratings";
import { NavigationActions } from "react-navigation";
import { Colors } from "../../constants";
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

//Webservice
import { previousGuideList } from "../../actions";

var { width, height } = Dimensions.get("window");

class TransactionsScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    });
    this.state = {
      // for listview
      ds: [],
      dataSource: ds
    };

    this.navigate = this.props.navigation;
  }

  // function for ratingview
  ratingCompleted(rating) {
    console.log("Rating is: " + rating);
  }

  componentWillMount() {
    this.previousGuideListWS();
  }

  pressRow(rowData) {
    // const { navigate } = this.props.navigation;
    // var newDs = [];
    // newDs = this.state.ds.slice();
    // this.setState({
    //     dataSource: this.state.dataSource.cloneWithRows(newDs)
    // });

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

  renderRow(rowData) {
    return (
      <TouchableHighlight
        style={styles.row_view}
        onPress={() => this.pressRow(rowData)}
        underlayColor="#ddd"
      >
        <View style={styles.row}>
          <View style={styles.amount_view}>
            <Text style={styles.amount_text}>${rowData.total_price}</Text>
          </View>
          <View style={styles.verticle_line} />

          <View style={styles.info_view}>
            {/* <View style={styles.info_row_view}>
                            <Image resizeMode='contain' source={require("../../assets/images/trip_item_location_icon.png")} style={styles.location_icon} />
                            <Text style={styles.location_text}>07 Verona Tunnel Suite 987</Text>
                        </View> */}
            <View style={styles.info_row_view}>
              <Image
                resizeMode="contain"
                source={require("../../assets/images/time_icon.png")}
                style={styles.location_icon}
              />
              <Text style={styles.time_text}>
                {this.getTripDurationString(rowData.duration_seconds)}
              </Text>
            </View>
          </View>
          <View style={styles.row_right_view}>
            <Text style={styles.right_text}>
              {this.getDateString(rowData.date_booked_for)}
            </Text>
            <TouchableOpacity style={styles.arrow_view}>
              <Image
                resizeMode="contain"
                source={require("../../assets/images/item_arrow.png")}
                style={styles.arrow_btn}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, width: "100%" }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderSeparator={(sectionId, rowId) => (
            <View key={rowId} style={styles.separator} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  previousGuideListWS() {
    previousGuideList()
      .then(data => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data)
        });
      })
      .catch(err => {
        alert(err);
      });
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
    borderColor: "white"
  },
  amount_text: {
    fontSize: 15,
    color: Colors.color999
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
    fontWeight: "bold"
  },
  time_text: {
    marginLeft: 5,
    fontSize: 12,
    color: Colors.tintColor,
    textAlign: "left",
    fontWeight: "bold"
  },
  row_right_view: {
    marginRight: 5,
    width: (width * 30) / 100,
    flexDirection: "column",
    alignItems: "flex-end"
  },
  right_text: {
    fontSize: 10
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
    height: 40,
    backgroundColor: "#dddddd"
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
