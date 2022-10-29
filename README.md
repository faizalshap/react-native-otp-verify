# React Native Otp Verify ✉️

___
[![npm version](https://badge.fury.io/js/react-native-otp-verify.svg)](https://badge.fury.io/js/react-native-otp-verify)

Automatic SMS Verification with the SMS Retriever API, you can perform SMS-based user verification in your Android app automatically, without requiring the user to manually type verification codes, and without requiring any extra app permissions.

## Message Format/Structure
In order to detect the message, **SMS message must include a hash** that identifies your app. This hash can be obtained by using the getHash() method below.

Please read the official documentation for the message structure at this
[Google developer guide](https://developers.google.com/identity/sms-retriever/verify)

## Quick start 🔥
#### Installation
`$ npm install react-native-otp-verify --save`

or

`$ yarn add react-native-otp-verify`


## Usage

####Import the Library
```javascript
import {
  getHash,
  startOtpListener,
  useOtpVerify,
} from 'react-native-otp-verify';
```

####Using Hook
```javascript

// You can use the startListener and stopListener to manually trigger listeners again.
// optionally pass numberOfDigits if you want to extract otp
const { hash, otp, timeoutError, stopListener, startListener } = useOtpVerify({numberOfDigits: 4});
```
####Properties
| Property        |  Type  |  Description  |
| ------------- |:-------------:|:-------------:|
| hash      | string[] | The hash code for the application which should be added at the end of message.|
| otp     | string | OTP retreived from SMS when received. (Must pass `numberOfDigits`)       |
| timeoutError | boolean | Flag is set to true when after timeout (5 minutes) [Check here](https://developers.google.com/identity/sms-retriever/request#2_start_the_sms_retriever)  |
| startListener | function | Manually starts listener again in case of timeout or any other error      |
| stopListener | function | Stops listener for the sms      |

####Using Methods
```javascript
// using methods
useEffect(() => {
  getHash().then(hash => {
    // use this hash in the message.
  }).catch(console.log);

  startOtpListener(message => {
    // extract the otp using regex e.g. the below regex extracts 4 digit otp from message
    const otp = /(\d{4})/g.exec(message)[1];
    setOtp(otp);
  });
  return () => removeListener();
}, []);
```
## Example
See the example app in `example` folder.
### Auto Linking for React Native >= 0.60

Linking the package manually is not required anymore with [**Autolinking**](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

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

#### Methods
---
### `startOtpListener(handler:(message:string)=>any):Promise<Subscription>`

Start listening for OTP/SMS and adds listener for the handler passed which is called when message is received..

---
### `getOtp():Promise<boolean>`

Start listening for OTP/SMS. Return true if listener starts else throws error.

---
### `getHash():Promise<string[]>`

Gets the hash code for the application which should be added at the end of message.
This is just a one time process.

---
### `addListener(handler:(message:string)=>any):Subscription`

Adds a javascript listener to the handler passed which is called when message is received.

---
### `removeListener():void`

Removes all listeners.

---
