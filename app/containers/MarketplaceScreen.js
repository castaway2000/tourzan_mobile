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
  Platform
} from 'react-native';

import Rating from 'react-native-ratings';
import { NavigationActions } from 'react-navigation'
import { Colors } from '../constants'
import NavigationBar from '../components/NavigationBar'

import { currentuser, isGuide, userid, profilePictureUrl} from '../global/CurrentUser';
import { Storage } from '../global/Utilities';

var SearchBar = require('react-native-search-bar');
var { width, height } = Dimensions.get('window');

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
            ds:[{name: "Luella Palmer", location:"Conventry City Guide Including Conventry Hotel"},{name: "Samuel Wells", location:"Conventry City Guide Including Conventry Hotel"},{name: "Eric Ramsey", location:"Conventry City Guide Including Conventry Hotel"}
                 ,{name: "Vera Hudson", location:"Conventry City Guide Including Conventry Hotel"},{name: "Jordan Holmes", location:"Conventry City Guide Including Conventry Hotel"},{name: "Carolyn Howard", location:"Conventry City Guide Including Conventry Hotel"}
                 ,{name: "Verar Hudson", location:"Conventry City Guide Including Conventry Hotel"},{name: "Jordfan Holmes", location:"Conventry City Guide Including Conventry Hotel"},{name: "Catrolyn Howard", location:"Conventry City Guide Including Conventry Hotel"}],
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

     setSearchText(event){
        let searchText = event.nativeEvent.text;
        console.log("debug", searchText);
        this.setState({searchText});

        let filteredData = this.filterNotes(searchText, this.state.ds);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(filteredData),
        });
     }

     filterNotes(searchText, notes) {
        let text = searchText.toLowerCase();
      
        let filteredData = notes.filter(
            (note) =>{
                return note.name.toLowerCase().indexOf(text)!= -1;
            }
        );

        return filteredData;
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
                            <Text style={styles.name_text}>{rowData.name}</Text>
                            <Text style={styles.description_text}>{rowData.location}</Text>
                        </View>
                         <View style={styles.right_view}>                      
                             <Text style={styles.right_text}>1km</Text>
                        </View>
                    </View>
            </TouchableHighlight>

         )
     }

     render() {
        let {navigate} = this.props.navigation
        
        return (
            <View style={styles.container}>  
                <View style = {styles.statusbar}/>
                <View style={styles.top_container}>
                    <View style={styles.backButton}>
                    </View>
                    <Text style={styles.centerText}>Marketplace</Text>
                    <TouchableOpacity onPress = { () => {navigate('Profile')}}>
                        <Image resizeMode='cover' source={{uri:profilePictureUrl()}}  style={styles.rightView} />
                    </TouchableOpacity>
                </View>
                <View style={styles.list_view_container}>
                    <View style={styles.search_header_container}>
                        <View style={styles.search_hedear_row_view}>
                            <Image resizeMode='cover' source={require("../assets/images/search_white_icon.png")}  style={styles.search_header_search_icon}/>
                            <TextInput
                                style={styles.search_header_text}
                                underlineColorAndroid="transparent"
                                placeholder="Search here..."
                                placeholderTextColor="white"
                                value={this.state.searchText}
                                onChange={this.setSearchText.bind(this)}
                            />
                        </View>
                    </View>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                        showsVerticalScrollIndicator = {false}
                        removeClippedSubviews = {false}
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
    statusbar:{
        width: width,
        height: (Platform.OS == 'ios')? 20 : StatusBar.currentHeight,
        backgroundColor: Colors.main,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    icon: {
        width: 20,
        height: 20,
    },
    top_container:{
        height: 44,
        marginTop: (Platform.OS == 'ios')? 20:0,
        backgroundColor: Colors.main,
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
        backgroundColor: 'transparent'
    },
    rightView:{
        marginRight:20,
        height:36,
        width:36,
        borderRadius:18
    },
    list_view_container : {
        marginTop:1,
        height:height-100,
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
        flex: 1,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between',
    },
    avatar_view:{
        width:width/5,
        flexDirection:'column',
        alignItems:'center',
    },
    avatar_img:{
        width:40,
        height:40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor:'transparent',
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
        color: Colors.color999,
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
        backgroundColor: 'transparent'
    },
    location_text:{
        marginLeft:5,
        fontSize:12,
        color: Colors.color999,
        textAlign:'left',
        fontWeight:'bold',
        backgroundColor: 'transparent'
    },
    description_text:{
        marginTop:5,
        fontSize:12,
        color: Colors.color999,
        textAlign:'left',
        backgroundColor: 'transparent'
    },
    right_view:{
        alignItems:'center',
        borderLeftWidth:1,
        borderColor: "#ddd",
    },
    right_text:{
        margin:10,
        backgroundColor: 'transparent'
    },
});


export default MarketplaceScreen;


