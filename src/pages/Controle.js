import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Image, ScrollView, Text, TouchableHighlight, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {SwipeListView} from 'react-native-swipe-list-view';
import ItemControle from '../components/ItemControle';
import ItemControleSwipe from '../components/ItemControleSwipe';
import Credencial from '../controllers/credencial';
import Network  from '../controllers/network';
import firebase from '../services/firebase';
import Styles from '../styles/styles';
import Colors from '../styles/colors';

function Controle({navigation}) {
  const[lista,setLista]=useState([]);
  let query = undefined;
  const users = firebase.database().ref().child('users');
  if(Credencial.loggedCred == 30)
  {
    query = users.orderByChild("Credencial").endAt(0);
  }
  else
  {
    query = users.orderByChild("Credencial").equalTo(Credencial.loggedCred % 10 * -1);
  }

  
  useEffect(() => {
    if(query!=undefined){
    query.on("value", function(snapshot) {
      let users_res = [];
      if(snapshot.val() != null)
      {
        snapshot.forEach(function(child) {
          users_res = [...users_res, {...child.val(), "key":child.key}]
        });
      }
      setLista(users_res);
    });
   }
  }, []);
  
  firebase.auth().onAuthStateChanged((user)=>{
    if(!user) {
      Alert.alert("Atenção:","Seu usuário foi desconectado!");
      navigation.navigate('Login');
    }
  });

  function confirmar(item){
    if(!Network.haveInternet){
      Network.alertOffline(() => {});
      return;
    }
    if(Credencial.isAdimin(Credencial.loggedCred)){
      const users = firebase.database().ref().child('users');
      users.child(item.key).child('Credencial').set(Math.abs(item.Credencial)).then(() => {
        Alert.alert("Sucesso:","Usuário confirmado!");
      }).catch(() => {
        Alert.alert("Falha:","Não foi possivel liberar este usuário no momento!");
      });
    }
    else{
      Credencial.accessDenied();
      navigation.goBack();
    }
    
  }

  function remover(item){
    if(!Network.haveInternet){
      Network.alertOffline(() => {});
      return;
    }
    if(Credencial.isAdimin(Credencial.loggedCred)){
      const users = firebase.database().ref().child('users');
      users.child(item.key).child('Credencial').set(99).then(() => {
        Alert.alert("Sucesso:","Usuário removido!");
      }).catch(() => {
        Alert.alert("Falha:","Não foi possivel remover este usuário no momento!");
      });
    }
    else{
      Credencial.accessDenied();
      navigation.goBack();
    }
  }

  return (
    <SafeAreaView style={Styles.page}>
      <LinearGradient
        start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal,Colors.Secondary.Normal]}
        style={{flex:1, alignSelf:"stretch", paddingTop:30,alignItems:"center"}}>
        <Text style={[Styles.lblSubtitle, {fontSize:24,textAlignVertical:"center"}]}>CONTROLE DE ACESSO</Text>
      </LinearGradient>
      <View style={{flex:6, alignSelf:"stretch"}}>
        <View style={[Styles.lbAnexos, { marginHorizontal:15, paddingBottom:22}]}>
          <View style={Styles.btngroupAnexo}>
            <Text style={Styles.lblAnexo}>Libere ou não o acesso para estes usuários:</Text>
          </View>
            <ScrollView style={[Styles.scrollAnexos, {paddingHorizontal:0}]}>
              <SwipeListView
                data={lista}
                renderItem={({item})=><ItemControle data={item}/>}
                renderHiddenItem={({item,index})=><ItemControleSwipe onDelete={() => { remover(item)}} onConfirm={() => {confirmar(item)}}/>}
                leftOpenValue={65}
                rightOpenValue={-65}
              />
            </ScrollView>
          </View>
          <TouchableHighlight style={[Styles.btnPrimary, {}]}
            underlayColor={Colors.Primary.White}
            onPress={() => { navigation.goBack();}}>
            <Text style={[Styles.btnTextPrimary, {}]}>VOLTAR</Text>
          </TouchableHighlight>
        </View>
    </SafeAreaView>
    
  );
}

export default Controle;