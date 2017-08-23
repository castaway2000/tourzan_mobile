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
  TouchableHighlight,
  ListView,
} from 'react-native';

// import {connect} from 'react-redux';
// import { bindActionCreators } from 'redux'

import Rating from 'react-native-ratings';
import { NavigationActions } from 'react-navigation'

import NavigationBar from '../../components/NavigationBar'

var { width, height } = Dimensions.get('window');

// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators(Actions, dispatch)
// }

// const  mapStateToProps = (state) => {
//     return {
//         isHideDashboardNavigationbar: state.isHideDashboardNavigationbar
//     }
//  }

class TripsScreen extends React.Component {
    static navigationOptions = {
        header: ( 
            <View style={{backgroundColor:'white', height:65, width:width, alignItems:'center', flexDirection:'column', justifyContent:'flex-start'}}>
                <View style={{backgroundColor:'#31dd73', height:64,paddingTop:20, width:width, alignItems:'center',flexDirection:'row',justifyContent:'space-between',}}>
                    <View style={{ marginLeft:20, height:20, width:20,}}>
                    </View>
                    <Text style={{ color:'#fff', textAlign:'center',fontSize:17,width:width-160,fontWeight:'bold',}}>DASHBOARD</Text>
                    <TouchableOpacity>
                        <Image resizeMode='cover' source={require("../../assets/images/person1.png")}  style={{ marginRight:20, height:35, width:35}} />
                    </TouchableOpacity>
                </View>
            </View>
        ),
 
        tabBarLabel: 'List of trips',
        tabBarIcon: ({ tintColor }) => (
             <Image resizeMode='contain' source={require('../../assets/images/trips_icon.png')} style={[styles.icon, {tintColor: tintColor}]} />
        ),

    };
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });
        this.state = {
            // for listview
            ds:[{AwayTeam: "TeamA"},{AwayTeam: "TeamA"},{AwayTeam: "TeamA"},{AwayTeam: "TeamA"},{AwayTeam: "TeamA"},{AwayTeam: "TeamA"},{AwayTeam: "TeamA"},{AwayTeam: "TeamA"}],
            dataSource:ds,

            // for ratingview
            starCount: 3.5,
        }
        this.navigate = this.props.navigation;
    }

    // function for ratingview
    ratingCompleted(rating) {
        console.log("Rating is: " + rating)
    }

    // functions for listview
    componentDidMount(){

        console.log('navigation:', this.props.navigtion)
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(this.state.ds),
            })
     }

     pressRow(rowData){
            var newDs = [];
            newDs = this.state.ds.slice();
            // newDs[0].Selection = newDs[0] == "AwayTeam" ? "HomeTeam" : "AwayTeam";
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(newDs)
            })
           
           
            // this.props.hideOrShowDashboardNavigationbar();
            console.log('debug',this.props);
            console.log('debug',this.navigate);

            this.navigate.navigate('TripItemDetail');
            // this.props.rootNavigation.navigation.navigate('TripItemDetail');
    }

     renderRow(rowData){
            return (
            // <TouchableHighlight
            //     onPress={()=> this.pressRow(rowData)}
            //     underlayColor = '#ddd'>
            //         <View style ={styles.row}>
            //             <Text style={{fontSize:18}}>{rowData.AwayTeam} @ {rowData.HomeTeam} </Text>
            //             <View style={{flex:1}}>
            //                 <Text style={styles.selectionText}>{rowData[rowData.Selection]}</Text>
            //             </View>
            //         </View>
            // </TouchableHighlight>

            <TouchableHighlight style={styles.row_view}
                onPress={()=> this.pressRow(rowData)}
                underlayColor = '#ddd'>
                    <View style ={styles.row}>
                        <Image resizeMode='cover' source={require("../../assets/images/trip_avatar.png")}  style={styles.avatar_img}/>
                        <View style={styles.info_view}>
                            <View style={styles.location_view}>
                                <Image resizeMode='contain' source={require("../../assets/images/trip_item_location_icon.png")}  style={styles.location_icon}/>
                                <Text style={styles.name_text}>Elmerburgh  </Text>
                            </View>  
                            <Text style={styles.description_text}>Conventry City Guide Including Conventry Hotels</Text>
                            <View style={styles.rate_view} pointerEvents="none">
                                <Rating ratingCount={5} imageSize={8} onFinishRating={this.ratingCompleted} />
                                <Text style={styles.rating_text}>(12)</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.arrow_view}>
                            <Image resizeMode='contain' source={require("../../assets/images/item_arrow.png")}  style={styles.arrow_btn} />
                        </TouchableOpacity>
                    </View>
            </TouchableHighlight>

         )
     }

     render() {
        return (
             <View style={styles.container}> 
                <ListView 
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                />
             </View> 
        );
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor:'white',
  },
  icon: {
    width: 20,
    height: 20,
  },
  text_color:{
    color:'#000',
  },
  row_view:{
    marginTop:10,
    marginLeft:10,
    marginRight:10,
    padding:10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row:{
      alignItems:'center',
      flexDirection:'row',
      justifyContent:'space-between',
  },
  avatar_img:{
    width:80,
    height:80,
    borderRadius: 5,
    borderWidth: 1,
    borderColor:'transparent',
  },
  info_view: {
    width:width*50/100,
    marginLeft:10,
    flexDirection:'column',
    justifyContent: 'center',
  },
  location_view:{
      height:15,
      flexDirection:'row',
      alignItems:'center',
  },
  location_icon:{
      width:13,
      height:13,
  },
  name_text:{
     marginLeft:5,
    fontSize:15,
    color:'#000',
    textAlign:'left',
    fontWeight:'bold',
  },
  description_text:{
    marginTop:5,
    fontSize:12,
    color:'#999',
    textAlign:'left',
  },
  rate_view:{
      marginTop:5,
      height: 20,
      flexDirection:'row',
      alignItems:'center',
  },
  ratingbar:{
      height:10,
      width: 50,
  },
  rating_text:{
      marginLeft:5,
      fontSize: 8,
      color: '#999',
  },
  arrow_view:{
      width:width*10/100,
      alignItems:'flex-end',
  },
  arrow_btn:{
      width: 10,
      height: 15,
  },
});


export default TripsScreen
// export default connect(mapStateToProps,mapDispatchToProps)(TripsScreen);