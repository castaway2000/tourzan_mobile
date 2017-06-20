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
var { width, height } = Dimensions.get('window');

class TransactionsScreen extends React.Component {
    static navigationOptions = {
        header : null,
        tabBarLabel: 'Transaction',
        tabBarIcon: ({ tintColor }) => (
             <Image source={require('../../assets/images/transactions_icon.png')} style={[styles.icon, {tintColor: tintColor}]} />
        ),
    };

    constructor(props) {
        super(props);
    
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>  
               <Text style={styles.text_color}>Transactions</Text>
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
  text_color:{
    color:'#000',
  },
});

export default TransactionsScreen;

