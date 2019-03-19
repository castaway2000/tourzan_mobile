import React, { PropTypes } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform
} from "react-native";

export const DefaultFont = {
  textFont: Platform.OS === "ios" ? null : "Roboto-Regular"
};
