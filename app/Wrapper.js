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
  TouchableOpacity
} from "react-native";

import { Provider } from "react-redux";
import { store } from "./store/index";
import App from "./App";

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
