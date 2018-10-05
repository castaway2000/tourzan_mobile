import React, { Component } from 'react';

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
} from 'react-native';

import { NavigationActions } from 'react-navigation'
import Checkbox from 'react-native-custom-checkbox'
import Rating from 'react-native-ratings';
import ReadMore from '@expo/react-native-read-more-text';
import { Colors } from '../../constants/index';
import NavigationBar from '../../components/NavigationBar'
import moment from 'moment'
import ParallaxScrollView from 'react-native-parallax-scroll-view'

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({

});


class TripItemDetailScreen extends React.Component {
      static navigationOptions = {
            title: 'List of Trips',
            header: null,
      };

      constructor(props) {
            super(props);
            this.state = {

            };
      }

      // Read More funtions
      _renderTruncatedFooter = (handlePress) => {
            return (
                  <View style={styles.downarrow_view}>
                        <TouchableOpacity onPress={handlePress}>
                              <Image resizeMode='stretch' source={require("../../assets/images/down_arrow.png")} style={styles.downarrow_btn} />
                        </TouchableOpacity>
                  </View>
            );
      };

      _renderRevealedFooter = (handlePress) => {
            return (
                  <View style={styles.downarrow_view}>
                        <TouchableOpacity onPress={handlePress}>
                              <Image resizeMode='stretch' source={require("../../assets/images/up_arrow.png")} style={styles.downarrow_btn} />
                        </TouchableOpacity>
                  </View>
            );
      };

      _handleTextReady = () => {
            // ...
      };


      render() {
            var { params } = this.props.navigation.state
            console.log('Tour Item -->', params.tourData)
            moment.locale('en')
            var credit_Date = moment(params.tourData.created).format('DD MMM YYYY')
            var credit_Hour = moment(params.tourData.created).format('hh')
            var credit_Minute = moment(params.tourData.created).format('mm')
            console.log(credit_Hour)

            const { onScroll = () => { } } = this.props

            const { navigate } = this.props.navigation;
            
            return (
                  <View style={styles.container}>
                        <ParallaxScrollView
                              onScroll={onScroll}
                              headerBackgroundColor="#333"
                              stickyHeaderHeight={STICKY_HEADER_HEIGHT}
                              parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
                              backgroundSpeed={10}
                              backgroundColor='#31dd73'

                              renderBackground={() => (
                                    <View key="background">
                                          <Image resizeMode='cover' source={{ uri: params.tourData.image_small }} style={styles.top_container} />
                                    </View>
                              )}

                              renderForeground={() => (
                                    <View key="parallax-header" >
                                          <View style={styles.top_location_view}>
                                                <Image resizeMode='contain' source={require("../../assets/images/location_white_icon.png")} style={styles.top_location_icon} />
                                                <Text style={styles.top_location_lb}>{params.tourData.name}</Text>
                                          </View>
                                    </View>
                              )}

                              renderStickyHeader={() => (
                                    <View key="sticky-header" style={styles.stickySection}>
                                          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginBottom: 10 }}>
                                                <TouchableOpacity style={styles.backButtonView} onPress={() => { this.props.navigation.dispatch(backAction) }}>
                                                      <Image resizeMode='contain' source={require("../../assets/images/back.png")} style={styles.top_location_icon} />
                                                </TouchableOpacity>
                                                <Text style={styles.stickySectionText}>{params.tourData.name}</Text>
                                          </View>
                                    </View>
                              )}>
                              <View style={styles.scrollview_container}>
                                    <View style={styles.bottom_container}>
                                          <View style={styles.profile_infoView}>
                                                <Image resizeMode='cover' source={require("../../assets/images/defaultavatar.png")} style={styles.avatar_img} />
                                                <View style={styles.info_view}>
                                                      <Text style={styles.name_text}>Glen Hale</Text>
                                                      <View style={styles.location_view}>
                                                            <Image resizeMode='contain' source={require("../../assets/images/location_maps.png")} style={styles.location_icon} />
                                                            <Text style={styles.location_text}>Lake Elta</Text>
                                                      </View>
                                                      <View style={styles.rate_view} pointerEvents="none">
                                                            <Rating ratingCount={5} imageSize={8} onFinishRating={this.ratingCompleted} />
                                                      </View>
                                                </View>
                                          </View>
                                          <View style={styles.info_row_view}>
                                                <View style={styles.info_icon_row_view}>
                                                      <Image resizeMode='contain' source={require("../../assets/images/calendar_icon.png")} style={styles.top_location_icon} />
                                                      <Text style={styles.info_icon_row_lb}>{credit_Date}</Text>
                                                </View>
                                                <View style={styles.info_icon_row_view}>
                                                      <Image resizeMode='contain' source={require("../../assets/images/time_icon_black.png")} style={styles.top_location_icon} />
                                                      <Text style={styles.info_icon_row_lb}>{credit_Hour}h {credit_Minute}m </Text>
                                                </View>
                                                <View style={styles.info_icon_row_view}>
                                                      <Image resizeMode='contain' source={require("../../assets/images/wallet_icon.png")} style={styles.top_location_icon} />
                                                      <Text style={styles.info_icon_row_lb}>${params.tourData.price}</Text>
                                                </View>
                                          </View>
                                          <View style={styles.map_view}>
                                                <Image source={require('../../assets/images/ic_googlemap.jpg')} style={styles.googleMapImage} />
                                          </View>
                                          <View sytle={styles.overview_view}>
                                                <Text style={styles.overview_title_lb}>Overview</Text>
                                                <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                                                      <Text style={styles.overview_content_txt}>
                                                            {params.tourData.overview}
                                                      </Text>
                                                </View>
                                          </View>
                                    </View>
                              </View>
                        </ParallaxScrollView>
                  </View>
            );
      }
}

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 250;
const STICKY_HEADER_HEIGHT = 70;


const styles = StyleSheet.create({
      container: {
            flex: 1,
            backgroundColor: 'white',
            flexDirection: 'column',
            overflow: 'hidden'
      },
      top_container: {
            width: width,
            height: 250,
            flexDirection: 'column',
            justifyContent: 'space-between'
      },
      top_location_view: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 20,
            marginTop: 200,
      },
      top_location_icon: {
            width: 15,
            height: 15,
      },
      top_location_lb: {
            fontSize: 20,
            color: 'white',
            marginLeft: 5,
            backgroundColor: 'transparent',
      },

      // --- bottom container --- //
      scrollview_container: {
            flex: 1,
      },
      bottom_container: {
            width: width,
            flex: 1,
            backgroundColor: 'white',
      },

      avatar_img: {
            marginLeft: 30,
            width: 50,
            height: 50,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: 'transparent',
      },
      info_view: {
            width: width * 50 / 100,
            marginLeft: 20,
            flexDirection: 'column',
            justifyContent: 'center',
      },
      location_view: {
            marginTop: 5,
            height: 15,
            flexDirection: 'row',
            alignItems: 'center',
      },
      location_icon: {
            width: 10,
            height: 10,
      },
      name_text: {
            fontSize: 15,
            color: '#000',
            textAlign: 'left',
            fontWeight: 'bold',
      },
      location_text: {
            marginLeft: 5,
            fontSize: 12,
            color: Colors.color999,
            textAlign: 'left',
            fontWeight: 'bold',
      },
      rate_view: {
            marginTop: 5,
            height: 20,
            flexDirection: 'row',
            alignItems: 'center',
      },
      ratingbar: {
            height: 10,
            width: 50,
      },
      info_row_view: {
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 30,
            paddingRight: 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderColor: '#c7c6ca',
      },
      info_icon_row_view: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      info_icon_row_lb: {
            fontSize: 15,
            color: '#5e6265',
            marginLeft: 5,
      },
      map_view: {
            height: 120,
            width: width,
            borderBottomWidth: 1,
            borderColor: '#c7c6ca',
      },
      googleMapImage: {
            width: width,
            flex: 1,
            resizeMode: 'cover'
      },
      overview_view: {
            width: width,
            flexDirection: 'column',
      },
      overview_title_lb: {
            marginLeft: 20,
            marginTop: 20,
            fontSize: 17,
            color: 'black',
      },
      overview_content_txt: {
            marginTop: 10,
            width: width - 40,
            fontSize: 15,
            color: Colors.color999,
      },
      downarrow_view: {
            marginTop: 5,
            alignItems: 'center',
      },
      downarrow_btn: {
            width: 30,
            height: 15,
      },
      profile_infoView: {
            width: width,
            paddingTop: 10,
            paddingBottom: 10,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            borderBottomWidth: 1,
            borderColor: '#c7c6ca',
      },
      backButtonView: {
            width: 25,
            height: 25,
            justifyContent: 'center',
            alignItems: 'center',
      },
      background: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: width,
            height: 250
      },

      stickySection: {
            height: STICKY_HEADER_HEIGHT,
            width: width,
            justifyContent: 'flex-end',
      },
      stickySectionText: {
            color: 'white',
            fontSize: 20,
            marginLeft: 5,
      },
      fixedSection: {
            position: 'absolute',
            bottom: 10,
            right: 10
      },
      fixedSectionText: {
            color: '#999',
            fontSize: 20
      },
      parallaxHeader: {
            alignItems: 'center',
            flex: 1,
            flexDirection: 'column',
            paddingTop: 100
      },
      avatar: {
            marginBottom: 10,
            borderRadius: AVATAR_SIZE / 2
      },
      sectionSpeakerText: {
            color: 'white',
            fontSize: 24,
            paddingVertical: 5
      },
      sectionTitleText: {
            color: 'white',
            fontSize: 18,
            paddingVertical: 5
      },
      row: {
            overflow: 'hidden',
            paddingHorizontal: 10,
            height: ROW_HEIGHT,
            backgroundColor: 'white',
            borderColor: '#ccc',
            borderBottomWidth: 1,
            justifyContent: 'center'
      },
      rowText: {
            fontSize: 20
      }

});

export default TripItemDetailScreen;

