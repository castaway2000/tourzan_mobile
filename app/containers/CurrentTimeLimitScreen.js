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

import ActionSheet from 'react-native-actionsheet'
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux'
import { NavigationActions } from 'react-navigation'
import KeyEvent from 'react-native-keyevent';
import PercentageCircle from 'react-native-percentage-circle';
import ApplyButton from '../components/ApplyButton'
var Toast = require('react-native-toast');
import * as Actions from '../actions/map'


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(Actions, dispatch)
}

const  mapStateToProps = (state) => {
    return {
        isbooked: state.isbooked,
    }
 }

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({
})

const resetRootAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'Home' }),
        ],
        key: null
 });

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = [ 'Cancel', 'End Tour' ]


class CurrentTimeLimitScreen extends React.Component {
  static navigationOptions = {
      title: 'Time Limit',
      header : null,
  };

 constructor(props) {
    super(props);
    this.navigate = this.props.navigation;

    this.state = {
      selected: ''
    };
    this.handlePress = this.handlePress.bind(this);
    this.showActionSheet = this.showActionSheet.bind(this);
  }

  componentDidMount() {
    // if you want to react to keyDown 
    KeyEvent.onKeyDownListener((keyCode) => {
      console.log(`Key code pressed: key down`);
      Toast.show.bind(null, 'key code pressed');
    });
 
    // // if you want to react to keyUp 
    // KeyEvent.onKeyUpListener((keyCode) => {
    //   console.log(`Key code pressed: ${keyCode}`);
    // });
  }

  showActionSheet() {
    this.ActionSheet.show()
  }
 
  handlePress(i) {
    this.setState({
      selected: i
    })

    if (this.state.selected == 1 ) { 
        this.props.getBookedState();
        this.props.navigation.navigate('CompleteTour');
    }
  }

  onCompleteTourBtnClick(){
      this.showActionSheet();
  }

  onExtendTimeBtnClick(){
     this.props.navigation.navigate('ExtendTime');
  }

  render() {
      return (
        <View style={styles.container}>  
            <View  style={styles.navigationbar}>
                    <TouchableOpacity  onPress={() => {this.props.navigation.dispatch(backAction)}}>
                        <Image resizeMode='cover' source={require("../assets/images/back.png")} style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.centerText}>Time Limit</Text>
                    <View style={styles.rightView}>
                    </View>
            </View>
            <View style={styles.main_view}>
                <View style={styles.current_spent_time_view}>
                    <Image resizeMode='contain' source={require("../assets/images/circular_clock.png")} style={styles.time_icon} />
                    <Text style={styles.current_spent_time_text}>03h 40m</Text>
                </View>
                <View style={styles.main_top_view}>
                     <PercentageCircle radius={100} percent={75} innerColor='#31dd73' borderWidth={10} color={"#3498db"}>
                        <Text style={styles.circle_progress_text}>-1h  30m</Text>
                     </PercentageCircle>
                </View>
                <View style={styles.main_bottom_view}>
                     <TouchableOpacity style={styles.extend_time_view} onPress={() => this.onExtendTimeBtnClick()} title='Extend Time'>
                            <Text style={styles.extend_time_btn} >Extend Time</Text>
                    </TouchableOpacity>
                    <ApplyButton onPress={() => this.onCompleteTourBtnClick()} name={'Complete Tour'} style={styles.done_btn}/>
                </View>
            </View>
            <ActionSheet
                ref={o => this.ActionSheet = o}
                // title={title}
                options={options}
                cancelButtonIndex={CANCEL_INDEX}
                destructiveButtonIndex={DESTRUCTIVE_INDEX}
                onPress={this.handlePress}
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
  },

  // --- navigation bar --- //
   navigationbar:{
      height:44,
      backgroundColor: '#31dd73',
      width:width,
      alignItems:'center',
      flexDirection:'row',
      justifyContent:'space-between',
  },
  backButton:{
        marginLeft:20,
        height:15,
        width:10,
    },
    centerText:{
        color:'white',
        textAlign:'center',
        fontSize:17,
        width:width-160,
        fontWeight:'bold',
    },
    rightView:{
        marginRight:20,
        height:20,
        width:20
    },

    /// ------- main view -------///
    main_view:{
        flexDirection:'column',
        alignItems:'center',
        width:width,
        height:height-44,
        backgroundColor:'#31dd73',
    },

    // --- current time view ---//
    current_spent_time_view:{
        marginTop:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor:'#78e7a2',
        borderRadius:5,
        paddingVertical:10,
        paddingHorizontal:20,
    },
    current_spent_time_text:{
        fontSize:12,
        color:'white',
        textAlign:'center',
        marginLeft:5,
    },
    time_icon:{
        width:10,
        height:10,
    },

    
    // --- main top view -- //
    main_top_view:{
        width:width,
        flex:0.5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    circle_progress_text:{
        fontSize:40,
        color:'white',  
    },


    // --- main bottom view -- //
    main_bottom_view:{
        width:width,
        flex:0.5,
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:'white',
    },
    done_btn:{
        marginTop:30,
        width:width-60,
    },
    note_text:{
        marginTop:50,
        fontSize: 12,
        color:'black',
        width:200,
        textAlign:'center',
    },
    extend_time_view:{
        marginTop:40,
    },
    extend_time_btn:{
        color:'black',
        paddingTop:10,
        textAlign:'center',
        fontSize: 18,
        height:50,
        width:width-60,
        backgroundColor:'white',
        borderWidth:1,
        borderRadius:5,
        borderColor: '#ddd'
    },
});

// export default CurrentTimeLimitScreen;
export default connect(mapStateToProps,mapDispatchToProps)(CurrentTimeLimitScreen);
