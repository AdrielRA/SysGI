/*import React from 'react';
import { View } from 'react-native';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-react-native-sdk';

export default class Mongo extends React.Component{
  constructor(props){
    super(props);
    this.state={
      currentUserId: undefined,
      client: undefined,
    }
    this._loadClient = this._loadClient.bind(this);
    this._onPressLogin = this._onPressLogin.bind(this);
    this._onPressLogout = this._onPressLogout.bind(this);
  }

  componentDidMount() {
    this._loadClient();
    this._onPressLogin();
  }
  
  render(){
    return ( <View style={{flex:0}}></View> );
  }

  _loadClient() {
    Stitch.initializeDefaultAppClient('sysgi-kroky').then(client => {
      this.setState({ client });

      if(client.auth.isLoggedIn) {
        this.setState({ currentUserId: client.auth.user.id })
      }
    });
  }

  _onPressLogin() {
    this.state.client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log(`Successfully logged in as user ${user.id}`);
      this.setState({ currentUserId: user.id });
    }).catch(err => {
      console.log(`Failed to log in anonymously: ${err}`);
      this.setState({ currentUserId: undefined });
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
}*/