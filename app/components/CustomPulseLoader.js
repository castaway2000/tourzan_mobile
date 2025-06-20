import React from "react";
import { View, Image, TouchableOpacity, Animated, Easing } from "react-native";
import CustomPulse from "../components/CustomPulse";
import PropTypes from "prop-types";
import { Colors, API, Paymentrails, Braintree, DefaultFont  } from "../constants";

export default class CustomPulseLoader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      circles: []
    };

    this.counter = 1;
    this.setInterval = null;
    this.anim = new Animated.Value(1);
  }

  componentDidMount() {
    this.setCircleInterval();
  }

  setCircleInterval() {
    this.setInterval = setInterval(
      this.addCircle.bind(this),
      this.props.interval
    );
    this.addCircle();
  }

  addCircle() {
    this.setState({ circles: [...this.state.circles, this.counter] });
    this.counter++;
  }

  onPressIn() {
    Animated.timing(this.anim, {
      toValue: this.props.pressInValue,
      duration: this.props.pressDuration,
      easing: this.props.pressInEasing
    }).start(() => clearInterval(this.setInterval));
  }

  onPressOut() {
    Animated.timing(this.anim, {
      toValue: 1,
      duration: this.props.pressDuration,
      easing: this.props.pressOutEasing
    }).start(this.setCircleInterval.bind(this));
  }

  render() {
    const { size, avatar, avatarBackgroundColor, interval } = this.props;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "transparent",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {this.state.circles.map(circle => (
          <CustomPulse pulseMaxSize={400} key={circle} {...this.props} />
        ))}

        <TouchableOpacity
          activeOpacity={1}
          // onPressIn={this.onPressIn.bind(this)}
          // onPressOut={this.onPressOut.bind(this)}
          style={{
            paddingBottom: 60,
            transform: [
              {
                scale: this.anim
              }
            ]
          }}
        >
          <Image
            resizeMode="contain"
            source={require("../assets/images/find_pin_location.png")}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: avatarBackgroundColor
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

CustomPulseLoader.propTypes = {
  interval: PropTypes.number,
  size: PropTypes.number,
  pulseMaxSize: PropTypes.number,
  avatar: PropTypes.string,
  avatarBackgroundColor: PropTypes.string,
  pressInValue: PropTypes.number,
  pressDuration: PropTypes.number,
  borderColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  getStyle: PropTypes.func
};

CustomPulseLoader.defaultProps = {
  interval: 2000,
  size: 100,
  pulseMaxSize: 250,
  avatar: undefined,
  avatarBackgroundColor: "white",
  pressInValue: 0.8,
  pressDuration: 150,
  pressInEasing: Easing.in,
  pressOutEasing: Easing.in,
  borderColor: "#D8335B",
  backgroundColor: "#ED225B55",
  getStyle: undefined
};
