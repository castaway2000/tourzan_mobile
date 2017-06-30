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

import NavigationBar from '../components/NavigationBar'

var SearchBar = require('react-native-search-bar');
var { width, height } = Dimensions.get('window');

const SearchListHeader = (props) => (
    <View style={styles.search_header_container}>
        <View style={styles.search_hedear_row_view}>
            <Image resizeMode='cover' source={require("../assets/images/search_white_icon.png")}  style={styles.search_header_search_icon}/>
            <TextInput
                style={styles.search_header_text}
                underlineColorAndroid="transparent"
                placeholder="Search here..."
                placeholderTextColor="white"
                onChangeText={(text) => console.log('searching for ', text)}
            />
        </View>
    </View>
);

class MarketplaceScreen extends React.Component {
    static navigationOptions = {
        header : null,
        tabBarLabel: 'Marketplace',
        tabBarIcon: ({ tintColor }) => (
             <Image resizeMode='contain' source={require('../assets/images/Marketplace_Bottom_icon.png')} style={[styles.icon, {tintColor: tintColor}]} />
        ),
    };

    _handleResults(results) {
        this.setState({ results });
    }

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
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(newDs)
            })
    }

     renderRow(rowData){
            return (

            <TouchableHighlight style={styles.row_view}
                onPress={()=> this.pressRow(rowData)}
                underlayColor = '#ddd'>
                    <View style ={styles.row}>
                        <View style={styles.avatar_view}>
                            <Image resizeMode='cover' source={require("../assets/images/guide_avatar.png")}  style={styles.avatar_img}/>
                            <View style={styles.rate_view} pointerEvents="none">
                                    <Rating ratingCount={5} imageSize={8} onFinishRating={this.ratingCompleted}/>
                                    <Text style={styles.rating_text}>(12)</Text>
                            </View>
                        </View>
                        <View style={styles.info_view}>
                            <Text style={styles.name_text}>Glen Hale</Text>
                            <Text style={styles.description_text}>Conventry City Guide Including Conventry Hotels</Text>
                        </View>
                         <View style={styles.right_view}>                      
                             <Text style={styles.right_text}>1km</Text>
                        </View>
                    </View>
            </TouchableHighlight>

         )
     }

     render() {
        
        return (
            <View style={styles.container}>  
                  <View style={styles.top_container}>
                        <View style={styles.backButton}>
                        </View>
                        <Text style={styles.centerText}>Marketplace</Text>
                        <TouchableOpacity>
                            <Image resizeMode='cover' source={require("../assets/images/person1.png")}  style={styles.rightView} />
                        </TouchableOpacity>
                 </View>
                 <View style={styles.list_view_container}>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow.bind(this)}
                            renderHeader={() => <SearchListHeader />}
                        />
                 </View>
            </View> 
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
   top_container:{
      height:44,
      backgroundColor: '#31dd73',
      width:width,
      alignItems:'center',
      flexDirection:'row',
      justifyContent:'space-between',
  },
    backButton:{
        marginLeft:20,
        height:20,
        width:20,
    },
    centerText:{
        color:'#fff',
        textAlign:'center',
        fontSize:17,
        width:width-160,
        fontWeight:'bold',
    },
    rightView:{
        marginRight:20,
        height:35,
        width:35
    },
  list_view_container : {
         marginTop:1,
         height:height-120,
         width:width,
    },
  text_color:{
    color:'#000',
  },
  search_header_container: {
    padding: 10,
    // flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#31dd73',

  },
  search_hedear_row_view:{
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor:'#20bb5c',
     width:width-80,
     paddingHorizontal:10,
     paddingTop:0,
     paddingBottom:0,
     borderRadius:7,
  },
  search_header_search_icon:{
      height:15,
      width:15,
  },
  search_header_text: {
    marginLeft:10,
    paddingTop:0,
    paddingBottom:0,
    height: 30,
    width: width-100,
    color:'white',
    fontSize: 12,
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
  avatar_view:{
      width:80,
      flexDirection:'column',
      alignItems:'center',
  },
  avatar_img:{
    width:40,
    height:40,
    borderRadius: 20,
    borderWidth: 1,
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
  info_view: {
    width:width*50/100,
    marginLeft:10,
    flexDirection:'column',
    justifyContent: 'center',
  },
  location_view:{
      marginTop:5,
      height:15,
      flexDirection:'row',
      alignItems:'center',
  },
  location_icon:{
      width:10,
      height:10,
  },
  name_text:{
    fontSize:15,
    color:'#000',
    textAlign:'left',
    fontWeight:'bold',
  },
  location_text:{
    marginLeft:5,
    fontSize:12,
    color:'#999',
    textAlign:'left',
    fontWeight:'bold',
  },
  description_text:{
    marginTop:5,
    fontSize:12,
    color:'#999',
    textAlign:'left',
  },
  right_view:{
      width:60,
      alignItems:'center',
      borderLeftWidth:1,
      borderColor: "#ddd",
  },
  right_text:{
      margin:10,
  },
});


export default MarketplaceScreen;


