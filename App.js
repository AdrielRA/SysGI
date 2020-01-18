import React from 'react';
import { StatusBar, ActivityIndicator } from 'react-native';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-react-native-sdk';
import Routes from './src/routes';
import * as Font from 'expo-font';
import Colors from './src/styles/colors';

export default class App extends React.Component {
  constructor(){
    super()
    this.state={
      fontLoaded:false,
      currentUserId: undefined,
      client: undefined,
    }
    this._loadClient = this._loadClient.bind(this);
    this._onPressLogout = this._onPressLogout.bind(this);
  }

  async componentDidMount() {
    this._loadClient();

    await Font.loadAsync({
      'CenturyGothicBold': require('./src/assets/fonts/CenturyGothicBold.ttf'),
      'CenturyGothic': require('./src/assets/fonts/CenturyGothicRegular.ttf'),
    });
    this.setState({fontLoaded:true});
  }
  render(){
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#800000"/>
        {this.state.fontLoaded ? (<Routes/>) : (<ActivityIndicator size="large" color={Colors.Primary.White} style={{flex: 1, justifyContent:"center", backgroundColor:Colors.Secondary.Normal}}/>)}   
      </>
    );
  }

  _loadClient() {
    Stitch.initializeDefaultAppClient("sysgi-kroky").then(client => {
      this.setState({ client });
      if(client.auth.isLoggedIn) {
        this.setState({ currentUserId: client.auth.user.id })
      }
      else{
        this.state.client.auth
        .loginWithCredential(new AnonymousCredential())
        .then(user => {
          console.log(`Successfully logged in as user ${user.id}`);
          this.setState({ currentUserId: user.id });
        })
        .catch(err => {
          console.log(`Failed to log in anonymously: ${err}`);
          this.setState({ currentUserId: undefined });
        });
      }
    });
  }

  _onPressLogout() {
    this.state.client.auth.logout().then(user => {
        console.log(`Successfully logged out`);
        this.setState({ currentUserId: undefined })
    }).catch(err => {
        console.log(`Failed to log out: ${err}`);
        this.setState({ currentUserId: undefined })
    });
  }
}
