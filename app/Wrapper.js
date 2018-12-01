import React, { Component } from "react";

import {
  AppRegistry,
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
  TextInput
} from "react-native";

import { Provider } from "react-redux";
import { store } from "./store/index";
import App from "./App";


if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;

if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;

if (Button.defaultProps == null) Button.defaultProps = {};
Button.defaultProps.allowFontScaling = false;

class Wrapper extends React.Component {
  render() {
    
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

export default Wrapper;
