import React,{useState} from 'react';
import { View, Text, TouchableHighlight, Image, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Styles from '../styles/styles';
import Colors from '../styles/colors';

function MENU({navigation}) {
  const [allowNotify, setAllowNotify] = useState(false);
  const NotifyChanged = () => { setAllowNotify(!allowNotify) }
  return (
    <LinearGradient
        start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal,Colors.Terciary.Normal]}
        style={Styles.page}>
      <Text style={Styles.lblSubtitle}>MENU</Text>
      <View style={{flex:6, width:300, alignItems:"center"}}>
        <Image style={{width: 200, height: 200}}
          source={require('../assets/images/balança.png')}></Image>
        <TouchableHighlight style={Styles.btnSecundary}
            underlayColor={Colors.Primary.White}
            onPress={() =>  navigation.navigate('Cadastro')}>
            <Text style={Styles.btnTextSecundary}>CADASTRAR</Text>
          </TouchableHighlight>
        <TouchableHighlight style={Styles.btnSecundary}
          underlayColor={Colors.Primary.White}
          onPress={() =>  navigation.navigate('Consulta')}>
          <Text style={Styles.btnTextSecundary}>CONSULTAR</Text>
        </TouchableHighlight>
      </View>
      <View style={{flex:1, flexDirection:"row", justifyContent:"center", alignItems:"center", width:210}}>
        <Text style={Styles.lblSmallR}>Notificações:</Text>
        <Switch 
        trackColor={{true: Colors.Primary.Normal, false: 'grey'}}
        thumbColor={Colors.Primary.White}
        onValueChange={NotifyChanged} value = {allowNotify}></Switch>
      </View>
    </LinearGradient>
  );
}

export default MENU;