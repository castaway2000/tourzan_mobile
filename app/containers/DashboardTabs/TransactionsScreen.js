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
  ListView,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

import Rating from 'react-native-ratings';
import { NavigationActions } from 'react-navigation'

import NavigationBar from '../../components/NavigationBar'

var { width, height } = Dimensions.get('window');

class TransactionsScreen extends React.Component {
    static navigationOptions = {
         header: ( 
            <View style={{backgroundColor:'white', height:45, width:width, alignItems:'center', flexDirection:'column', justifyContent:'flex-start'}}>
                <View style={{backgroundColor:'#31dd73', height:44, width:width, alignItems:'center',flexDirection:'row',justifyContent:'space-between',}}>
                    <View style={{ marginLeft:20, height:20, width:20,}}>
                    </View>
                    <Text style={{ color:'#fff', textAlign:'center',fontSize:17,width:width-160,fontWeight:'bold',}}>DASHBOARD</Text>
                    <TouchableOpacity>
                        <Image resizeMode='cover' source={require("../../assets/images/person1.png")}  style={{ marginRight:20, height:35, width:35}} />
                    </TouchableOpacity>
                </View>
            </View>
        ),
 
        tabBarLabel: 'Transaction',
        tabBarIcon: ({ tintColor }) => (
             <Image resizeMode='contain' source={require('../../assets/images/transactions_icon.png')} style={[styles.icon, {tintColor: tintColor}]} />
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

            this.navigate.navigate('TransactionItemDetail');
    }

     renderRow(rowData){
            return (
            <TouchableHighlight style={styles.row_view}
                onPress={()=> this.pressRow(rowData)}
                underlayColor = '#ddd'>
                    <View style ={styles.row}>
                        <View style={styles.amount_view}>                      
                             <Text style={styles.amount_text}>$357</Text>
                        </View>
                        <View style={styles.info_view}>
                            <View style={styles.info_row_view}>
                                <Image resizeMode='contain' source={require("../../assets/images/trip_item_location_icon.png")}  style={styles.location_icon}/>
                                <Text style={styles.location_text}>07 Verona Tunnel Suite 987</Text>
                            </View>
                            <View style={styles.info_row_view}>
                                <Image resizeMode='contain' source={require("../../assets/images/time_icon.png")}  style={styles.location_icon}/>
                                <Text style={styles.time_text}>06h 20m</Text>
                            </View>
                        </View>
                        <View style={styles.row_right_view}>
                            <Text style={styles.right_text}>06 Mar 2017</Text>
                             <TouchableOpacity style={styles.arrow_view}>
                                <Image resizeMode='contain' source={require("../../assets/images/item_arrow.png")}  style={styles.arrow_btn} />
                            </TouchableOpacity>
                        </View>
                       
                    </View>
            </TouchableHighlight>

         )
     }

     render() {
        
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            />
        );
    }
}

const styles = StyleSheet.create({
 container: {
      backgroundColor:'white',
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
     paddingTop:20,
     paddingRight:10,
     paddingBottom:20,
     paddingLeft:10,
     backgroundColor:'white',
  },
  separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#ddd',
  },
  row:{
      alignItems:'center',
      flexDirection:'row',
  },
  amount_view:{
      padding:10,
      alignItems:'center',
      borderRightWidth:1,
      borderColor: "#ddd",
  },
  amount_text:{
      fontSize: 15,
      color: '#999',
  },
  info_view: {
    width:width*45/100,
    marginLeft:10,
    flexDirection:'column',
    justifyContent: 'center',
  },
  info_row_view:{
      marginTop:5,
      height:15,
      flexDirection:'row',
      alignItems:'center',
  },
  location_icon:{
      width:10,
      height:10,
  },
  location_text:{
    marginLeft:5,
    fontSize:12,
    color:'#000',
    textAlign:'left',
    fontWeight:'bold',
  },
  time_text:{
    marginLeft:5,
    fontSize:12,
    color:'#555',
    textAlign:'left',
    fontWeight:'bold',
  },
  row_right_view:{
      width:width*30/100,
      flexDirection:'column',
      alignItems:'flex-end',
  },
  right_text:{
      fontSize:10,
  },
  arrow_view:{
      marginTop:5,
  },
  arrow_btn:{
      width: 10,
      height: 15,
  },
});

export default TransactionsScreen;

