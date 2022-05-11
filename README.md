# react-native-otp-verify
Automatic SMS Verification with the SMS Retriever API, you can perform SMS-based user verification in your Android app automatically, without requiring the user to manually type verification codes, and without requiring any extra app permissions.

## Message Format/Structure
In order to detect the message, SMS message must include a hash that identifies your app. This hash can be obtained by using the getHash() method below.

Please read the official documentation for the message structure at this
[Google developer guide](https://developers.google.com/identity/sms-retriever/verify)

## Getting started

`$ npm install react-native-otp-verify --save`
 or
`$ yarn add react-native-otp-verify`

### Auto Linking

`$ react-native link react-native-otp-verify`

### Manual Linking

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.faizal.OtpVerify.RNOtpVerifyPackage;` to the imports at the top of the file
  - Add `new RNOtpVerifyPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```gradle
  	include ':react-native-otp-verify'
  	project(':react-native-otp-verify').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-otp-verify/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```gradle
      compile project(':react-native-otp-verify')
  	```

## Usage
```javascript
import RNOtpVerify from 'react-native-otp-verify';

getHash = () =>
    RNOtpVerify.getHash()
    .then(console.log)
    .catch(console.log);

startListeningForOtp = () =>
    RNOtpVerify.getOtp()
    .then(p => RNOtpVerify.addListener(this.otpHandler))
    .catch(p => console.log(p));

otpHandler = (message) => {
    const otp = /(\d{4})/g.exec(message)[1];
    this.setState({ otp });
}

componentWillUnmount() {
    RNOtpVerify.removeListener();
}
```

#### Methods
---
### `getOtp():Promise<boolean>`

Start listening for OTP/SMS. Return true if listener starts else throws error.

---
### `getHash():Promise<string[]>`

Gets the hash code for the application which should be added at the end of message.
This is just a one time process.

---
### `addListener(handler:(message:string)=>any):Promise<boolean>`

Adds a javascript listener to the handler passed which is called when message is received.

---
### `removeListener():void`

Removes the listener.

---
