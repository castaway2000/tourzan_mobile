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
import { Colors } from '../../constants'
import NavigationBar from '../../components/NavigationBar'

var { width, height } = Dimensions.get('window');

class GuideScreen extends React.Component {
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
            ds:[{AwayTeam: "TeamA"},{AwayTeam: "TeamA"},{AwayTeam: "TeamA"},{AwayTeam: "TeamA"},{AwayTeam: "TeamA"},{AwayTeam: "TeamA"},{AwayTeam: "TeamA"},{AwayTeam: "TeamA"}],
            dataSource:ds,

            // for ratingview
            starCount: 3.5,
        };

        this.navigate = this.props.navigation;
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
        });

        this.navigate.navigate('GuideItemDetail');
    }

     renderRow(rowData){
        return (
            <TouchableHighlight style={styles.row_view}
                onPress={()=> this.pressRow(rowData)}
                underlayColor = '#ddd'>
                    <View style ={styles.row}>
                        <View style={styles.avatar_view}>
                            <Image resizeMode='cover' source={require("../../assets/images/guide_avatar.png")}  style={styles.avatar_img}/>
                            <View style={styles.rate_view} pointerEvents="none">
                                    <Rating ratingCount={5} imageSize={8} onFinishRating={this.ratingCompleted}/>
                                    <Text style={styles.rating_text}>(12)</Text>
                            </View>
                        </View>
                        <View style={styles.info_view}>
                            <Text style={styles.name_text}>Glen Hale</Text>
                            <View style={styles.location_view}>
                                <Image resizeMode='contain' source={require("../../assets/images/location_maps.png")}  style={styles.location_icon}/>
                                <Text style={styles.location_text}>Lake Elta</Text>
                            </View>
                            <Text style={styles.description_text}>Conventry City Guide Including Conventry Hotels</Text>
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
                showsVerticalScrollIndicator = {false}
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
  avatar_view:{
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
  },
  location_text:{
    marginLeft:5,
    fontSize:12,
    color: Colors.color999,
    textAlign:'left',
    fontWeight:'bold',
  },
  description_text:{
    marginTop:5,
    fontSize:12,
    color: Colors.color999,
    textAlign:'left',
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


export default GuideScreen;


