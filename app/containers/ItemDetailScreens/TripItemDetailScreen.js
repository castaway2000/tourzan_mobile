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
import Checkbox  from 'react-native-custom-checkbox'

import NavigationBar from '../../components/NavigationBar'

var { width, height } = Dimensions.get('window');

const backAction = NavigationActions.back({
    
})

class TripItemDetailScreen extends React.Component {
  static navigationOptions = {
      title: 'Login Tourist',
      header : null,
  };

 constructor(props) {
    super(props);
    this.state = {  };
  }


  render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.container}>  
            <Image resizeMode='cover' source={require("../../assets/images/login_bg.png")} style={styles.top_container}>
                  <NavigationBar title={'Tourist Login'} bgColor={'transparent'} onPress={() => {this.props.navigation.dispatch(backAction)}}/>
                  <View style={styles.view_logo}>
                        <Image resizeMode='contain' style={styles.icon_logo}  source={require("../../assets/images/Tourzan_Logo.png")}/>
                        <Text style={styles.txt_welcome}>TOURZAN</Text>
                        <Text style={styles.txt_bottom}>Wine Tours La Dolce Vita</Text>
                  </View>
            </Image>
            <View style={styles.bottom_container}>
               
            </View>
        </View>
      );
   }
}

const styles = StyleSheet.create({
  container: {
      alignItems: 'center',
      flexDirection: 'column',
  },
  top_container: {
      width: width,
      height : height*40/100,
      flexDirection:'column',
      justifyContent:'space-between'
  },
  view_logo:{
      width: width,
      height : height*40/100 - 44,
      alignItems:'center',
      flexDirection:'column',
      justifyContent:'center',
  },
  icon_logo:{
      height:70,
      width:70
  },
  txt_welcome: {
      fontSize: 17,
      fontWeight : 'bold',
      textAlign: 'center',
      color : '#ffffff',
  },
  txt_bottom:{
      fontSize: 17,
      textAlign: 'center',
      color : '#eeeeee'
  },
  bottom_container:{
      width: width,
      height:height-height*40/100,
      alignItems:'center'
  },
});

export default TripItemDetailScreen;

