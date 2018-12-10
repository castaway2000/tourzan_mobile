import React, { Component } from "react";

import {
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
  ImageBackground
} from "react-native";

import { NavigationActions } from "react-navigation";
import Checkbox from "react-native-custom-checkbox";
import { Rating, AirbnbRating } from 'react-native-ratings';
import ReadMore from "@expo/react-native-read-more-text";
import { Colors, API, Paymentrails, Braintree, DefaultFont  } from "../../constants";

import ApplyButton from "../../components/ApplyButton";
import NavigationBar from "../../components/NavigationBar";

var { width, height } = Dimensions.get("window");

const onButtonPress = () => {
  Alert.alert("Button has been pressed!");
};
const backAction = NavigationActions.back({
  // key: 'WelcomeScreen'
});

class GuideItemDetailScreen extends React.Component {
  static navigationOptions = {
    title: "",
    header: null
  };

  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 != r2 });
    this.state = {
      ds: [{ AwayTeam: "TeamA" }, { AwayTeam: "TeamA" }, { AwayTeam: "TeamA" }],
      dataSource: ds,
      interestList: [],
      starCount: 3.5
    };
  }

  // functions for listview
  componentDidMount() {
    var { params } = this.props.navigation.state;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(
        params.guideData.guide_services
      )
    });
  }

  pressRow(rowData) {
    const { navigate } = this.props.navigation;
    var newDs = [];
    newDs = this.state.ds.slice();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(newDs)
    });
  }

  // Read More funtions
  _renderTruncatedFooter = handlePress => {
    return (
      <View style={styles.downarrow_view}>
        <TouchableOpacity onPress={handlePress}>
          <Image
            resizeMode="stretch"
            source={require("../../assets/images/down_arrow.png")}
            style={styles.downarrow_btn}
          />
        </TouchableOpacity>
      </View>
    );
  };

  _renderRevealedFooter = handlePress => {
    return (
      <View style={styles.downarrow_view}>
        <TouchableOpacity onPress={handlePress}>
          <Image
            resizeMode="stretch"
            source={require("../../assets/images/up_arrow.png")}
            style={styles.downarrow_btn}
          />
        </TouchableOpacity>
      </View>
    );
  };

  _handleTextReady = () => {
    // ...
  };

  // interesting button functions
  _interestingBtnHandlePress() {
    console.log("Pressed!");
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight
        style={styles.row_view}
        onPress={() => this.pressRow(rowData)}
        underlayColor="#ddd"
      >
        <View style={styles.row}>
          <View style={styles.avatar_view}>
            <Image
              resizeMode="cover"
              source={require("../../assets/images/defaultavatar.png")}
              style={styles.avatar_img}
            />
          </View>
          <View style={styles.info_view}>
            <View style={styles.list_info_location_view}>
              <Text style={styles.list_info_name_text}>Jhon Fred</Text>
              <Text style={styles.list_info_time_text}>15 Dec 2017</Text>
            </View>
            <Text style={styles.description_text}>
              Travel Prodently Luggage And Carry on Worries
            </Text>
            <View style={styles.rate_view} pointerEvents="none">
              <Rating
                style={styles.list_info_ratingbar}
                ratingCount={5}
                imageSize={12}
                onFinishRating={this.ratingCompleted}
              />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  showInterest() {
    var { params } = this.props.navigation.state;
    return params.guideData.interests.map((item, index) => {
      return (
        <View style={styles.interestItemView} key={index}>
          <Text style={styles.interesting_title_text}>
            {item.interest.name}
          </Text>
        </View>
      );
    });
  }

  render() {
    var { params } = this.props.navigation.state;
    console.log("Guide Item -->", params.guideData);
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <ImageBackground
          resizeMode="cover"
          source={require("../../assets/images/profile_bg.png")}
          style={styles.top_container}
        >
          <View style={styles.navigationbar}>
            <TouchableOpacity style={styles.backButtomContainer}
              onPress={() => {
                this.props.navigation.dispatch(backAction);
              }}
            >
              <Image
                resizeMode="cover"
                source={require("../../assets/images/back.png")}
                style={styles.backButton}
              />
            </TouchableOpacity>
            <Text style={styles.centerText} />
            <TouchableOpacity
              onPress={() => {
                navigate("ProfileCharRoom");
              }}
            >
              <Image
                resizeMode="cover"
                source={require("../../assets/images/profile_chat_icon.png")}
                style={styles.rightView}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <ScrollView style={styles.scrollview_container}>
          <View style={styles.main_container}>
            <View pointerEvents="none" style={styles.name_view}>
              <Text style={styles.name_text}>{params.guideData.name}</Text>
              <Rating
                ratingCount={5}
                imageSize={15}
                onFinishRating={this.ratingCompleted}
              />
            </View>
            <View style={styles.location_view}>
              <Image
                resizeMode="contain"
                source={require("../../assets/images/location_maps.png")}
                style={styles.location_icon}
              />
              <Text style={styles.location_text}>Lake Elta</Text>
            </View>
            <View style={styles.overview_view}>
              <Text style={styles.overview_title_text}>Overview</Text>
              <ReadMore
                style={{ marginTop: 10 }}
                numberOfLines={3}
                renderTruncatedFooter={this._renderTruncatedFooter}
                renderRevealedFooter={this._renderRevealedFooter}
                onReady={this._handleTextReady}
              >
                <Text style={styles.overview_content_text}>
                  {params.guideData.overview}
                </Text>
              </ReadMore>
            </View>
            <View style={styles.interesting_view}>
              <View style={styles.devide_view} />
              <Text style={[styles.interesting_title_text, { marginTop: 10 }]}>
                Interest
              </Text>
              <View style={styles.btn_group_view}>{this.showInterest()}</View>
              <View style={styles.devide_view} />
            </View>
          </View>
          <View style={styles.listview_view}>
            <View style={styles.listview_title_view} pointerEvents="none">
              <Text style={styles.listview_title_text}>
                {" "}
                {params.guideData.guide_services.length} REVIEWS{" "}
              </Text>
              {/*<Rating ratingCount={5} imageSize={15}  onFinishRating={this.ratingCompleted}/>*/}
            </View>
            <ListView
              style={styles.listview}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
            />
          </View>
        </ScrollView>
        <Image
          resizeMode="cover"
          source={{ uri: params.guideData.profile_image }}
          style={styles.avatar_icon}
          defaultSource={require("../../assets/images/user_placeholder.png")}
        />
        <Image
          resizeMode="cover"
          source={require("../../assets/images/book.png")}
          style={styles.booking_icon}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white"
  },
  top_container: {
    width: width,
    height: 180,
    borderBottomWidth: 2,
    borderColor: "#31dd73"
  },
  navigationbar: {
    paddingTop: 20,
    height: 64,
    backgroundColor: "transparent",
    width: width,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  backButtomContainer:{
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
    color: "#000",
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
  scrollview_container: {
    width: width,
    paddingTop: 25,
    height: height - 100,
    borderTopWidth: 3,
    borderColor: Colors.main
  },
  avatar_icon: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 140,
    marginLeft: 30
  },
  booking_icon: {
    position: "absolute",
    width: 56,
    height: 56,
    resizeMode: "contain",
    marginTop: 150,
    marginLeft: width - 86
  },
  main_container: {
    paddingHorizontal: 30,
    width: width
  },
  top_image_container: {
    width: width,
    height: 150,
    flexDirection: "column"
  },
  name_view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  name_text: {
    fontSize: 17,
    color: "black",
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  location_view: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  location_icon: {
    width: 15,
    height: 15
  },
  overview_view: {
    marginTop: 10
  },
  overview_title_text: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: DefaultFont.textFont
  },
  overview_content_text: {
    marginTop: 10,
    fontFamily: DefaultFont.textFont
  },
  downarrow_view: {
    marginTop: 5,
    alignItems: "center"
  },
  downarrow_btn: {
    width: 30,
    height: 15
  },
  devide_view: {
    marginTop: 15,
    height: 1,
    backgroundColor: "#ddd"
  },
  interesting_title_text: {
    fontSize: 15,
    color: "black",
    fontFamily: DefaultFont.textFont
  },
  interestItemView: {
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 8,
    marginRight: 10,
    height: 30,
    backgroundColor: "#f4f5f8",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center"
  },
  btn_group_view: {
    marginTop: 8,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center"
  },
  interesting_container_btn: {
    paddingHorizontal: 15,
    paddingTop: 5,
    marginRight: 20,
    borderRadius: 15,
    height: 30,
    backgroundColor: "#f4f5f8",
    borderColor: "#ddd",
    borderWidth: 1
  },
  interesting_btn: {
    fontSize: 12,
    color: Colors.tintColor,
    fontWeight: "normal"
  },
  listview_view: {
    width: width,
    marginTop: 20
  },
  listview_title_view: {
    paddingHorizontal: 20,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f7f7f7"
  },
  listview_title_text: {
    color: "black",
    fontFamily: DefaultFont.textFont
  },
  listview_title_ratingbar: {
    backgroundColor: "#f7f7f7"
  },
  listview: {
    paddingHorizontal: 20
  },
  row_view: {
    marginLeft: 5,
    marginRight: 5,
    padding: 10
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row"
  },
  avatar_view: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  avatar_img: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent"
  },
  rate_view: {
    marginTop: 5,
    height: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  rating_text: {
    marginLeft: 5,
    fontSize: 8,
    color: Colors.color999
  },
  info_view: {
    flex: 0.8,
    marginLeft: 10,
    flexDirection: "column",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 20
  },
  list_info_location_view: {
    marginTop: 5,
    height: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  list_info_time_text: {
    fontSize: 12,
    color: Colors.color999
  },
  list_info_name_text: {
    fontSize: 15,
    color: "#000",
    textAlign: "left",
    fontWeight: "bold",
    fontFamily: DefaultFont.textFont
  },
  location_text: {
    marginLeft: 5,
    fontSize: 12,
    color: Colors.color999,
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
  }
});

export default GuideItemDetailScreen;
