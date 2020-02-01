import React,{useState, useEffect} from 'react';
import { View, Text, TouchableHighlight, Image, Switch, AsyncStorage } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Permissions from 'expo-permissions';
import firebase from '../services/firebase';
import Styles from '../styles/styles';
import Colors from '../styles/colors';

function MENU({navigation}) {
  const userLogged = navigation.getParam("userLogged");
  const [allowNotify, setAllowNotify] = useState(false);
  const [credencial, setCredencial] = useState(undefined);

  useEffect(() => {
    async function _loadNotify(){
      try{
        let value = await AsyncStorage.getItem('notify');
        if (value != null){
          setAllowNotify(value == "true");
        }
        else { await AsyncStorage.setItem('notify', allowNotify.toString()); }
      }
      catch{ console.log("Falha ao manipular variavel allowNotify..."); }
    }
    _loadNotify();

  }, []);

  useEffect(() => {
    async function _saveNotify(){
      try{
        if(allowNotify != undefined)
          await AsyncStorage.setItem('notify', allowNotify.toString());
      }
      catch(err){ console.log("Falha ao salvar allowNotify..." + err.message); }
    }
    async function _requestNotifyPermission() {
      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (status === 'granted') {
          _saveNotify();
        } else {
          setAllowNotify(false);
        }
      }
      else { _saveNotify(); }
    }

    if(allowNotify){
      _requestNotifyPermission();
    }
    else{_saveNotify();}

  }, [allowNotify]);

  function _getCredencial(fire_user){
    firebase.database().ref('users').child(fire_user.uid)
    .once('value')
      .then((snapshot)=>{ setCredencial(snapshot.val().Credencial);
    });
  }

  firebase.auth().onAuthStateChanged(function(fire_user) {
    if (fire_user) { _getCredencial(fire_user); }
  });

  return (
    <LinearGradient
        start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal,Colors.Terciary.Normal]}
        style={Styles.page}>
      <Text style={Styles.lblMENU}>MENU</Text>
      <Text style={Styles.lblMsg}>Bem-vindo, {userLogged}</Text>
      <View style={{flex:6, width:300, alignItems:"center", justifyContent:"center"}}>
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
        {credencial > 10 ? (<TouchableHighlight style={Styles.btnSecundary}
            underlayColor={Colors.Primary.White}
            onPress={() =>  navigation.navigate('Controle')}>
            <Text style={Styles.btnTextSecundary}>CONTROLE</Text>
          </TouchableHighlight>) : (<></>)
        }        
      </View>
      <View style={{flex:1, flexDirection:"row", justifyContent:"center", alignItems:"center", width:210}}>
        <Text style={Styles.lblSmallR}>Notificações:</Text>
        <Switch 
        trackColor={{true: Colors.Primary.Normal, false: 'grey'}}
        thumbColor={Colors.Primary.White}
        onValueChange={() => {setAllowNotify(!allowNotify);}} value = {allowNotify}></Switch>
      </View>
    </LinearGradient>
  );
}

export default MENU;