# Compile Environment

## Requirement

### iOS Requirement
- xCode 10.0
- Cocoapods


### Android Requirement
- Android Studio 3.0.1


### Common Requirement
- Node Package Manager
- React Native CLI

## To Compile

### iOS
- Clone repo: git clone `https://github.com/castaway2000/tourzan_mobile.git`
- Go to root folder: `cd tourzan_mobile`
- Install npm: `npm install`
- Go to ios folder: `cd ios`
- Install pod: `pod install`
- Go to root folder: `cd ..`
- Use command to run iOS build: `react-native run-ios`
- If you use xCode to build project make a sure you remove build folder from /tourzan_mobile/ios/build/

### Important note for iOS
- Instal xCode 10.0 (Minimum requirement of Onfido is xCode 10)
- Open xCode 10.0 in menu xCode->Prefrences...->Location Tab->Command Line Tool-> Select xCode 10
- Need to Install Homebrew: `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
- Need to Install node: `brew install node`
- Need to Install Watchman: `brew install watchman`
- Need to Install React Native CLI: `npm install -g react-native-cli`

