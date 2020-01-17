import React from 'react';
import { StatusBar, ActivityIndicator } from 'react-native';
import Routes from './src/routes';
import * as Font from 'expo-font';
import Colors from './src/styles/colors';

export default class App extends React.Component {
  constructor(){
    super()
    this.state={ fontLoaded:false }
  }
  async componentDidMount() {
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
}
