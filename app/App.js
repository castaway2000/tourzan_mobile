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
  Platform
} from "react-native";

import { StackNavigator } from "react-navigation";
import { TabNavigator } from "react-navigation";

import LoginGuideScreen from "./containers/LoginGuideScreen";
import LoginTouristScreen from "./containers/LoginTouristScreen";
import RegisterTourist from "./containers/RegisterTouristScreen";
import RegisterGuide from "./containers/RegisterGuideScreen";
import ForgotPassword from "./containers/ForgotPasswordScreen";
import WelcomeScreen from "./containers/WelcomeScreen";

import MapsScreen from "./containers/MapsScreen";
import DashboardScreen from "./containers/DashboardScreen";
import ChatScreen from "./containers/ChatScreen";
import MarketplaceScreen from "./containers/MarketplaceScreen";
import MoreScreen from "./containers/MoreScreen";

import TripsScreen from "./containers/DashboardTabs/TripsScreen";
import GuidesScreen from "./containers/DashboardTabs/GuidesScreen";
import TransactionsScreen from "./containers/DashboardTabs/TransactionsScreen";

import TripItemDetailScreen from "./containers/ItemDetailScreens/TripItemDetailScreen";
import GuideItemDetailScreen from "./containers/ItemDetailScreens/GuideItemDetailScreen";
import TransactionItemDetailScreen from "./containers/ItemDetailScreens/TransactionItemDetailScreen";

import ChatRoomScreen from "./containers/ChatRoomScreen";
import ProfileScreen from "./containers/ProfileScreen";
import PaymentMethodScreen from "./containers/PaymentMethodScreen";
import SetTimeLimitScreen from "./containers/SetTimeLimitScreen";
import CurrentTimeLimitScreen from "./containers/CurrentTimeLimitScreen";
import BookingSearchingScreen from "./containers/BookingScreens/BookingSearchingScreen";
import BookingGuideSettingScreen from "./containers/BookingScreens/BookingGuideSettingScreen";

import SettingsScreen from "./containers/SettingsScreen";
import ChangePasswordScreen from "./containers/ChangePasswordScreen";

import FAQScreen from "./containers/FAQScreen";
import PrivacyPolicyScreen from "./containers/PrivacyPolicyScreen";
import TermsofUseScreen from "./containers/TermsofUseScreen";
import ContactUsScreen from "./containers/ContactUsScreen";

import OfferScreen from "./containers/OfferScreen";

import ExtendTimeScreen from "./containers/ExtendTimeScreen";

import CompleteTourScreen from "./containers/CompleteTourScreen";
import CardListScreen from "./containers/CardListScreen";

import VerificationResultScreen from "./containers/VerificationResultScreen";
import UpdateProfileScreen from "./containers/UpdateProfileScreen";
import SelectCityScreen from "./containers/SelectCityScreen";
import SelectInterestsScreen from "./containers/SelectInterestsScreen";
import WriteFeedbackScreen from "./containers/WriteFeedbackScreen";
import SelectLanguageScreen from "./containers/SelectLanguageScreen";
import SelectLanguageProficiencyScreen from "./containers/SelectLanguageProficiencyScreen";
import AddPaymentMethodScreen from "./containers/AddPaymentMethodScreen";
import IdentityVerificationScreen from "./containers/IdentityVerificationScreen";
import PaymentrailDetailScreen from "./containers/PaymentrailDetailScreen";
import ProfileUserScreen from "./containers/ProfileUserScreen";

var { width, height } = Dimensions.get("window");

console.disableYellowBox = true;

/**
 * MAP TAB
 */
const MapChatStackNavigator = StackNavigator(
  {
    Maps: { screen: MapsScreen },
    Profile: { screen: ProfileScreen },
    ProfileCharRoom: { screen: ChatRoomScreen },
    UpdateProfile: { screen: UpdateProfileScreen },
    ProfileUser: { screen: ProfileUserScreen }
  },
  {
    navigationOptions: {
      header: null
    },
    initialRouteName: "Maps"
  }
);

/**
 * DASHBOARD TAB
 */
const DashboardStackNavigator = StackNavigator(
  {
    Dashboard: { screen: DashboardScreen },
    Maps: { screen: MapsScreen },
    Profile: { screen: ProfileScreen },
    ProfileCharRoom: { screen: ChatRoomScreen },
    ProfileUser: { screen: ProfileUserScreen },
    UpdateProfile: { screen: UpdateProfileScreen }
  },
  {
    navigationOptions: {
      header: null
    },
    initialRouteName: "Dashboard"
  }
);

/**
 * CHAT TAB
 */
const ChatStackNavigator = StackNavigator(
  {
    Chats: { screen: ChatScreen },
    Profile: { screen: ProfileScreen },
    ProfileCharRoom: { screen: ChatRoomScreen },
    ProfileUser: { screen: ProfileUserScreen },
    UpdateProfile: { screen: UpdateProfileScreen }
  },
  {
    headerMode: "screen",
    initialRouteName: "Chats"
  }
);

/**
 * MORE TAB
 */
const MoreStackNavigator = StackNavigator(
  {
    More: { screen: MoreScreen },
    Settings: { screen: SettingsScreen },
    ChangePassword: { screen: ChangePasswordScreen },
    Profile: { screen: ProfileScreen },
    ProfileCharRoom: { screen: ChatRoomScreen },
    ProfileUser: { screen: ProfileUserScreen },
    UpdateProfile: { screen: UpdateProfileScreen }
  },
  {
    headerMode: "screen",
    initialRouteName: "More"
  }
);

const MainTapNavigator = TabNavigator(
  {
    MapsNav: { screen: MapChatStackNavigator },
    Dashboard: { screen: DashboardStackNavigator },
    Chat: { screen: ChatStackNavigator },
    // Marketplace: { screen: PaymentrailDetailScreen, },
    MoreNav: { screen: MoreStackNavigator }
  },
  {
    navigationOptions: {
      header: null
    },
    tabBarPosition: "bottom",
    lazy: false,
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      renderIndicator: () => null,
      activeTintColor: "#00943B",
      inactiveTintColor: "#444444",
      labelStyle: { fontSize: 10, width: width / 5 - 5 },
      showIcon: "true",
      style: {
        backgroundColor: "white",
        height: Platform.OS === "ios" ? 48 : 60
      },
      indicatorStyle: { opacity: 1 }
    }
  }
);

const App = StackNavigator(
  {
    Welcome: { screen: WelcomeScreen },
    LoginGuide: { screen: LoginGuideScreen },
    LoginTourist: { screen: LoginTouristScreen },
    RegisterTourist: { screen: RegisterTourist },
    RegisterGuide: { screen: RegisterGuide },
    ForgotPassword: { screen: ForgotPassword },
    Home: { screen: MainTapNavigator },
    BookingSearching: { screen: BookingSearchingScreen },
    BookingGuideSetting: { screen: BookingGuideSettingScreen },
    ProfileCharRoomFromBooking: { screen: ChatRoomScreen },
    PaymentMethod: { screen: PaymentMethodScreen },
    TimeLimit: { screen: SetTimeLimitScreen },
    CurrentTimeLimit: { screen: CurrentTimeLimitScreen },
    ChatRoom: { screen: ChatRoomScreen },
    FAQScreen: { screen: FAQScreen },
    PrivacyPolicyScreen: { screen: PrivacyPolicyScreen },
    TermsofUseScreen: { screen: TermsofUseScreen },
    ContactUs: { screen: ContactUsScreen },
    Offer: { screen: OfferScreen },
    ProfileCharRoom: { screen: ChatRoomScreen },
    ExtendTime: { screen: ExtendTimeScreen },
    CompleteTour: { screen: CompleteTourScreen },
    CardList: { screen: CardListScreen },
    VerificationResult: { screen: VerificationResultScreen },
    UpdateProfile: { screen: UpdateProfileScreen },
    SelectCity: { screen: SelectCityScreen },
    SelectInterests: { screen: SelectInterestsScreen },
    WriteFeedback: { screen: WriteFeedbackScreen },
    SelectLanguage: { screen: SelectLanguageScreen },
    SelectLanguageProficiency: { screen: SelectLanguageProficiencyScreen },
    AddPaymentMethod: { screen: AddPaymentMethodScreen },
    IdentityVerification: { screen: IdentityVerificationScreen },
    PaymentrailDetail: { screen: PaymentrailDetailScreen },
    ProfileUser: { screen: ProfileUserScreen },
    Profile: { screen: ProfileScreen }
  },
  {
    headerMode: "screen"
  }
);

export default App;
