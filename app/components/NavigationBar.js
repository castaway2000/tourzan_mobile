import React, { PropTypes } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Platform
} from "react-native";

import { isIphoneX } from "../global/Utilities";

var { width, height } = Dimensions.get("window");
class NavigationBar extends React.Component {
  render() {
    const { bgColor, title, onPress } = this.props;

    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <TouchableOpacity onPress={onPress} style={styles.backButtomContainer}>
          <Image
            resizeMode="contain"
            style={styles.backButton}
            source={require("../assets/images/back.png")}
          />
        </TouchableOpacity>
        <Text style={styles.centerText}>{title}</Text>
        <Image style={styles.rightView} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 44,
    alignItems: "center",
    flexDirection: "row",
    marginTop: Platform.OS === "ios" ? (isIphoneX() ? 44 : 20) : 0
  },
  backView: {
    height: 44,
    width: 50
  },
  backButtomContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center"
  },
  backButton: {
    height: 15,
    width: 50
  },
  centerText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    width: width - 100
  },
  rightView: {
    height: 44,
    width: 50
  }
});

export default NavigationBar;
