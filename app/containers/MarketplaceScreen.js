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
import NavigationBar from '../components/NavigationBar'

var { width, height } = Dimensions.get('window');

class MarketplaceScreen extends React.Component {
    static navigationOptions = {
        header : null,
        tabBarLabel: 'Marketplace',
        tabBarIcon: ({ tintColor }) => (
             <Image source={require('../assets/images/Marketplace_Bottom_icon.png')} style={[styles.icon, {tintColor: tintColor}]} />
        ),
    };

    constructor(props) {
        super(props);
    
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>  
               
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-between'
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default MarketplaceScreen;

