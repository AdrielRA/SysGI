import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, Text, TouchableHighlight, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {SwipeListView} from 'react-native-swipe-list-view';
import ItemControle from '../components/ItemControle';
import ItemControleSwipe from '../components/ItemControleSwipe';
import firebase from '../services/firebase';
import Styles from '../styles/styles';
import Colors from '../styles/colors';

function Controle({navigation}) {
  const[lista,setLista]=useState([]);
  let logged_cred = 0;
  //const creds = ['Professor', 'Advogado', 'Policial', 'Delegado', 'Promotor', 'Juiz'];

useEffect(() => {

  const users = firebase.database().ref().child('users');
  const logged_user = users.child(firebase.auth().currentUser.uid);
  let user_key ='';
  logged_user.once('value', (snapshot) => {
    logged_cred = snapshot.val().Credencial;
  }).then(() => {
    if(logged_cred > 10) logged_cred = logged_cred -10;
    const credencial = logged_cred * -1;
    let query = users.orderByChild("Credencial").equalTo(credencial);
    query.on("value", function(snapshot) {
    if(snapshot.val() != null)
    {
      let users_res = [];
      snapshot.forEach(function(child) {
        user_key = child.key;
        let user = {...child.val(), "key":user_key}
        users_res = [...users_res, user]
      });

      setLista(users_res);
    }

  });
  });


}, []);

  function confirmar(item){
    const users = firebase.database().ref().child('users');
    users.child(item.key).child('Credencial').set(Math.abs(item.Credencial)).then(() => {
      Alert.alert("Sucesso:","Usuário confirmado!");
      let index = lista.indexOf(item);
      lista.splice(index, 1);
      setLista([...lista]);


    }).catch(() => {
      Alert.alert("Falha:","Não foi possivel liberar este usuário no momento!");
    });
  }

  function remover(item){
    const users = firebase.database().ref().child('users');
    users.child(item.key).child('Credencial').set(99).then(() => {
      Alert.alert("Sucesso:","Usuário removido!");
      let index = lista.indexOf(item);
      lista.splice(index, 1);
      setLista([...lista]);
    }).catch(() => {
      Alert.alert("Falha:","Não foi possivel remover este usuário no momento!");
    });
  }

  return (
    <View style={Styles.page}>
      <LinearGradient
        start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal,Colors.Secondary.Normal]}
        style={{flex:1, alignSelf:"stretch", paddingTop:30}}>
        <Text style={[Styles.lblSubtitle, {fontSize:24}]}>CONTROLE DE ACESSO</Text>
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
    </View>
    
  );
}

export default Controle;