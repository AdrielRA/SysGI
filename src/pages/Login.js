import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Text, TextInput, TouchableHighlight, Alert } from 'react-native';
import { Stitch } from "mongodb-stitch-react-native-sdk";
import { LinearGradient } from 'expo-linear-gradient';
import { CheckBox } from 'react-native-elements';
import Styles from '../styles/styles';
import Colors from '../styles/colors';
import firebase from '../services/firebase';

function Login({navigation}) {
  
  const [keepLogin, setLoginState] = useState(false);
  const [Email, setEmail] = useState('');
  const [Liberar, setLiberar] = useState(undefined);
  const [Senha, setSenha] = useState('');
  const mongoClient = Stitch.defaultAppClient;

  const KeepLoginChange = () => { setLoginState(!keepLogin); };
  const _logar = () => {
    firebase.auth().signOut();

    firebase.auth().signInWithEmailAndPassword(Email, Senha)
    .then(() => {
      let fire_user = firebase.auth().currentUser;
      if(fire_user.emailVerified){
        firebase.database().ref("users").child(fire_user.uid).once('value')
        .then((snapshot) => {
          if(snapshot.val().Credencial > 0){
            let userName = snapshot.val().Nome;
            navigation.navigate('MENU', { userLogged: userName});
          }
          else{
            Alert.alert("Não liberado! ", "Seu acesso ainda está sob análise!");
          }          
        });
      }
      else{ Alert.alert("Atenção: ", "Verifique seu e-mail primeiro!"); }     
      
    })
    .catch((error)=>{
      switch(error.code){
        case 'auth/invalid-email':
          Alert.alert("Atenção:", "Email informado é inválido!");
          break;
        case 'auth/user-not-found':
          Alert.alert("Atenção:", "Usuário não cadastrado!");
          break;
        case 'auth/wrong-password':
          Alert.alert("Atenção:", "Senha incorreta!");
          break;
        case 'auth/network-request-failed':
          Alert.alert("Sem internet:", "Verifique sua conexão e tente novamente!");
          break;
        default:
          //Alert.alert("Algo deu errado...", "Por favor tente novamente mais tarde!");
          Alert.alert("Falha: " + error.code, "Ocorreu um erro!");
        break;
      }
    });


    /*mongoClient.callFunction("logar", [user]).then(liberar =>{
      console.log(`Resultado: ${liberar}`);
      setLiberar(liberar);
      if(liberar){ navigation.navigate('MENU', {userLogged: user}); }
    })*/
  };
  const _retryLogin = () => {
    setLiberar(undefined);
  }

  return (
    <LinearGradient
        start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal,Colors.Terciary.Normal]}
        style={Styles.page}>
        <Text style={Styles.lblTitle}>SysGI</Text>
        <KeyboardAvoidingView style={{flex:3, alignSelf:"stretch"}} behavior="padding" enabled   keyboardVerticalOffset={100}>
          <TextInput
            placeholder="seuemail@email.com"
            placeholderTextColor={Colors.Terciary.White}
            keyboardType={"email-address"}
            style={Styles.campo}
            onChangeText={(email) => { setEmail(email);}}
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor={Colors.Terciary.White}
            secureTextEntry={true}
            style={Styles.campo}
            onChangeText={(senha) => { setSenha(senha);}}
          />
          <CheckBox
              center
              title='Manter-se conectado!'
              checkedIcon='check-square'
              uncheckedIcon='square'
              uncheckedColor={Colors.Primary.White}
              checkedColor={Colors.Primary.White}
              containerStyle={Styles.checkbox}
              textStyle={{color:Colors.Primary.White}}
              checked={keepLogin}
              onPress={KeepLoginChange}
            />
          <TouchableHighlight style={Styles.btnSecundary}
            underlayColor={Colors.Primary.White}
            onPress={() => { _logar() }}>
            <Text style={Styles.btnTextSecundary}>LOGAR</Text>
          </TouchableHighlight>
          <TouchableHighlight style={Styles.btnTransparent}
            underlayColor={"transparent"}
            onPress={() =>  navigation.navigate('Signup')}>
            <Text style={Styles.btnTextTransparent}>Solicitar acesso!</Text>
          </TouchableHighlight>
        </KeyboardAvoidingView>
      <Text style={Styles.lblRodape}>Todos os Direitos Reservados - {new Date().getFullYear()}</Text>
    </LinearGradient>
  );
}

export default Login;