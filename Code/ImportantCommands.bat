
rem start a new mobile app project

D:\Material\AppDevelopment\Gossipy>npx @react-native-community/cli@latest init Gossipy

rem connect mobile and enable usb debuging , install via usb , USB Debugging (Security Settings)

D:\Material\AppDevelopment\Gossipy>cd Gossipy
D:\Material\AppDevelopment\Gossipy>npx react-native run-android

rem -----------------------------------------------------------------------------------------------

rem start server
npx react-native start

rem start server and reseting
npx react-native start --reset-cache

rem start / restart app on android (autometically start server)
npx react-native run-android

adb logcat | findstr "com.snkapp"


rem -----------------------------------------------------------------------------------------------

rem Create and Install release APK

rem     1. Generate the JavaScript bundle
rem         Run this from the **root of your project** (where `index.js` is):

npx react-native bundle  --platform android  --dev false  --entry-file index.js  --bundle-output android/app/src/main/assets/index.android.bundle  --assets-dest android/app/src/main/res/

rem     2. Create a signed release build
rem         Go into the android folder:

cd android

rem         Build the release APK:

gradlew assembleRelease

rem     The APK will be here -> App-root-folder/android/app/build/outputs/apk/release/app-release.apk

rem     3. Install on your phone
rem         From App-root-folder

adb install android/app/build/outputs/apk/release/app-release.apk

rem To check TypeScript syntax  without building
D:\Material\AppDevelopment\Gossipy\Gossipy>npx tsc --noEmit