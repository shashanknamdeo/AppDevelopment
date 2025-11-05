
D:\Material\AppDevelopment\Gossipy\Gossipy>npm install -g @aws-amplify/cli

rem changed 79 packages in 6m

rem 24 packages are looking for funding
rem   run `npm fund` for details


D:\Material\AppDevelopment\Gossipy\Gossipy>amplify --version
rem 14.2.2


D:\Material\AppDevelopment\Gossipy\Gossipy>amplify configure


D:\Material\AppDevelopment\Gossipy\Gossipy>amplify init

rem ? Initialize the project with the above configuration? No
rem ? Enter a name for the environment: dev
rem ? Choose your default editor: Sublime Text
rem √ Choose the type of app that you're building: javascript
rem Please tell us about your project
rem ? What javascript framework are you using: react-native
rem ? Source Directory Path:  ./
rem ? Distribution Directory Path: ./
rem ? Build Command:  npm.cmd run-script build
rem ? Start Command: npm start


D:\Material\AppDevelopment\Gossipy\Gossipy>amplify status

rem     Current Environment: dev

rem ┌──────────┬───────────────┬───────────┬─────────────────┐
rem │ Category │ Resource name │ Operation │ Provider plugin │
rem └──────────┴───────────────┴───────────┴─────────────────┘


D:\Material\AppDevelopment\Gossipy\Gossipy>amplify add auth

rem How do you want users to be able to sign in? Email
rem  Do you want to configure advanced settings? No, I am done.


D:\Material\AppDevelopment\Gossipy\Gossipy>amplify push
rem √ Successfully pulled backend environment dev from the cloud.

rem     Current Environment: dev

rem ┌──────────┬─────────────────┬───────────┬───────────────────┐
rem │ Category │ Resource name   │ Operation │ Provider plugin   │
rem ├──────────┼─────────────────┼───────────┼───────────────────┤
rem │ Auth     │ gossipyf9c214e1 │ Create    │ awscloudformation │
rem └──────────┴─────────────────┴───────────┴───────────────────┘


D:\Material\AppDevelopment\Gossipy\Gossipy>npm install aws-amplify @aws-amplify/ui-react-native




