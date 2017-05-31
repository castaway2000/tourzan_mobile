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
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';

// import {
//   StackNavigator,
// } from 'react-navigation';

var { width, height } = Dimensions.get('window');

const onButtonPress = () => { Alert.alert('Button has been pressed!'); }; 

class Navigation extends Component {
  
  render() {
    //const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>  
          <Image resizeMode='cover' source={require("../assets/images/welcome-bg.png")} style={styles.bg_img}>
                <View style={styles.top_container}>
                    <Image resizeMode='center' source={require("../assets/images/Tourzan_Logo.png")}/>
                    <Text style={styles.txt_welcome}>WELCOME!</Text>
                    <View style={styles.line}></View>
                    <Text style={styles.txt_bottom}>Wine Tours La Dolce Vita</Text>
                </View>
                <View style={styles.bottom_container}>
                    <TouchableOpacity>
                        <Text style={styles.button_tourist}>Tourist</Text>
                    </TouchableOpacity>
                      <TouchableOpacity>
                        <Text style={styles.button_guide}>Tour Guide</Text>
                    </TouchableOpacity>
                </View>
          </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
  },
  bg_img: {
    width: width,
    height : height,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  top_container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt_welcome: {
    marginTop : -20,
    fontSize: 30,
    textAlign: 'center',
    color : '#ffffff',
  },
  line: {
    marginTop:7,
    height: 1,
    width: '50%',
    backgroundColor: '#ffffff',
  },
  txt_bottom:{
    marginTop: 7,
    fontSize: 20,
    textAlign: 'center',
    color : '#eeeeee',
  },

  bottom_container:{
    width: width,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:30,
  },
  button_tourist:{
    color:'#fff',
    paddingTop:10,
    textAlign:'center',
    fontSize: 18,
    height:50,
    width:width-60,
    backgroundColor:'#31dd73',
    borderRadius:5,
    borderColor: '#555555'
  },
  button_guide:{
    paddingTop:10,
    color:'#000',
    textAlign:'center',
    fontSize: 18,
    marginTop : 20,
    height:50,
    width:width-60,
    backgroundColor:'#ffffff',
    borderRadius:5,
    borderColor: '#555555'
  },
});

// const App = StackNavigator({ 
//   Welcome : {screen: WelcomeScreen}
// })

export default Navigation;

