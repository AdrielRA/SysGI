import React,{useState, useEffect} from 'react';
import { View, Text, TouchableHighlight, Image, Switch, AsyncStorage, Alert, SafeAreaView } from 'react-native';
import Network  from '../controllers/network';
import { LinearGradient } from 'expo-linear-gradient';
import * as Permissions from 'expo-permissions';
import {Notifications} from 'expo';
import firebase from '../services/firebase';
import Credencial from '../controllers/credencial';
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
        if(allowNotify != undefined){
          if(allowNotify){
            let token = await Notifications.getExpoPushTokenAsync();
            firebase.database().ref().child('users').child(firebase.auth().currentUser.uid).child('Device').set(token);
          }
          else{
            firebase.database().ref().child('users').child(firebase.auth().currentUser.uid).child('Device').remove();
          }
          
          
          await AsyncStorage.setItem('notify', allowNotify.toString());
        }
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
      else { 
        _saveNotify(); 
      }
    }

    if(allowNotify){
      _requestNotifyPermission();
    }
    else{_saveNotify();}

  }, [allowNotify]);

  firebase.auth().onAuthStateChanged((user)=>{
    if (user) { Credencial._getCredencial(user, setCredencial); }    
    else {
      Alert.alert("Atenção:","Seu usuário foi desconectado!");
      navigation.navigate('Login');
    }
  });
  
  return (
    <SafeAreaView style={Styles.page}>
    <LinearGradient
        start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal,Colors.Terciary.Normal]}
        style={[Styles.page, {alignSelf:"stretch"}]}>
      <Text style={Styles.lblMENU}>MENU</Text>
      <Text style={Styles.lblMsg}>Bem-vindo, {userLogged}</Text>
      <View style={{flex:6, width:300, alignItems:"center", justifyContent:"center"}}>
        <Image style={{width: 200, height: 200}}
          source={require('../assets/images/balança.png')}></Image>
        <TouchableHighlight style={Styles.btnSecundary}
            underlayColor={Colors.Primary.White}
            onPress={() => {
              if(!Network.haveInternet)
                Network.alertOffline(() => {});
              else{
                if(Credencial.haveAccess(credencial, Credencial.AccessToCadastro))
                  navigation.navigate('Cadastro');
                else Credencial.accessDenied();
              }              
            }}>
            <Text style={Styles.btnTextSecundary}>CADASTRAR</Text>
          </TouchableHighlight>
        <TouchableHighlight style={Styles.btnSecundary}
          underlayColor={Colors.Primary.White}
          onPress={() =>{
            if(!Network.haveInternet)
              Network.alertOffline(() => {});
            else{
              if(Credencial.haveAccess(credencial, Credencial.AccessToConsulta))
                navigation.navigate('Consulta');
              else Credencial.accessDenied();
            }
            
          }}>
          <Text style={Styles.btnTextSecundary}>CONSULTAR</Text>
        </TouchableHighlight>
        {credencial > 10 ? (<TouchableHighlight style={Styles.btnSecundary}
            underlayColor={Colors.Primary.White}
            onPress={() =>  {
              if(!Network.haveInternet)
                Network.alertOffline(() => {});
              else{
                if(Credencial.isAdimin(credencial))
                  navigation.navigate('Controle')
                else Credencial.accessDenied();
              }
            }}>
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
    </SafeAreaView>
  );
}

export default MENU;