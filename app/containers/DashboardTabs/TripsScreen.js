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

import Rating from 'react-native-ratings';
import { NavigationActions } from 'react-navigation'

import NavigationBar from '../../components/NavigationBar'

var { width, height } = Dimensions.get('window');



class TripsScreen extends React.Component {
    static navigationOptions = {
        header : null,
        tabBarLabel: 'List of trips',
        tabBarIcon: ({ tintColor }) => (
             <Image source={require('../../assets/images/trips_icon.png')} style={[styles.icon, {tintColor: tintColor}]} />
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
    }

    // function for ratingview
    ratingCompleted(rating) {
        console.log("Rating is: " + rating)
    }

    // functions for listview
    componentDidMount(){
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(this.state.ds),
            })
     }

     pressRow(rowData){
            const { navigate } = this.props.navigation;
            var newDs = [];
            newDs = this.state.ds.slice();
            // newDs[0].Selection = newDs[0] == "AwayTeam" ? "HomeTeam" : "AwayTeam";
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(newDs)
            })
            // navigate('TripItemDetail')
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
                        <Image resizeMode='contain' source={require("../../assets/images/trip_avatar.png")}  style={styles.avatar_img}/>
                        <View style={styles.info_view}>
                            <View style={styles.location_view}>
                                <Image resizeMode='contain' source={require("../../assets/images/trip_item_location_icon.png")}  style={styles.location_icon}/>
                                <Text style={styles.name_text}>Elmerburgh</Text>
                            </View>
                            
                            <Text style={styles.description_text}>Conventry City Guide Including Conventry Hotels</Text>
                            <View style={styles.rate_view} pointerEvents="none">
                                <Rating 
                                    ratingCount={5}
                                    imageSize={15}
                                    onFinishRating={this.ratingCompleted}
                                />
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
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
            />
        );
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
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
  },
  info_view: {
    width:200,
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
    //   alignItems:'center',
  },
  ratingbar:{
      height:10,
      width: 50,
  },
  rating_text:{
      marginLeft:5,
      fontSize: 12,
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


export default TripsScreen;

