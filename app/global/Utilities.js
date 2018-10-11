import { AsyncStorage } from "react-native";
import { Dimensions, Platform, StatusBar } from "react-native";

//./storage.js
const Storage = {
  getItem: async function(key) {
    let item = await AsyncStorage.getItem(key);
    //You'd want to error check for failed JSON parsing...
    return JSON.parse(item);
  },
  setItem: async function(key, value) {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: async function(key) {
    return await AsyncStorage.removeItem(key);
  }
};

const isIphoneX = () => {
  const dimen = Dimensions.get("window");

  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
};

const isNumber = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const ifIphoneX = (iphoneXStyle, regularStyle) => {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
};

const getStatusBarHeight = safe => {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 30, 20),
    android: StatusBar.currentHeight
  });
};

const utilities = {
  Storage,
  isIphoneX,
  isNumber,
  getStatusBarHeight
};

module.exports = utilities;
