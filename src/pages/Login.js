import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Text, TextInput, TouchableHighlight } from 'react-native';
import { Stitch } from "mongodb-stitch-react-native-sdk";
import { LinearGradient } from 'expo-linear-gradient';
import { CheckBox } from 'react-native-elements';
import Styles from '../styles/styles';
import Colors from '../styles/colors';

function Login({navigation}) {
  
  const [keepLogin, setLoginState] = useState(false);
  const [NomeUsuario, setNomeUsuario] = useState('');
  const [Liberar, setLiberar] = useState(undefined);
  const [Senha, setSenha] = useState('');
  const mongoClient = Stitch.defaultAppClient;

  const KeepLoginChange = () => { setLoginState(!keepLogin); };
  const _logar = (user) => {
    mongoClient.callFunction("logar", [user]).then(liberar =>{
      console.log(`Resultado: ${liberar}`);
      setLiberar(liberar);
      if(liberar){ navigation.navigate('MENU', {userLogged: user}); }
    })
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
      { Liberar === false ? (
        <View style={Styles.popup}>
          <Text style={Styles.popTitle}>FALHA AO LOGAR!</Text>
          <Text style={Styles.popText}>Os dados do usuário não foram encontrados na base de dados!</Text>
          <Text style={Styles.popSoluction}>Tente novamente, ou entre em contato com o suporte!</Text>
          <TouchableHighlight style={Styles.btnPrimary}
            underlayColor={Colors.Secondary.Normal}
            onPress={() => { _retryLogin() }}>
            <Text style={Styles.btnTextPrimary}>TENTAR NOVAMENTE</Text>
          </TouchableHighlight>
        </View>
      ) : (
        <KeyboardAvoidingView style={{flex:3, alignSelf:"stretch"}} behavior="padding" enabled   keyboardVerticalOffset={100}>
          <TextInput
            placeholder="Nome de Usuário"
            placeholderTextColor={Colors.Terciary.White}
            style={Styles.campo}
            onChangeText={(nome) => { setNomeUsuario(nome);}}
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
            onPress={() => { _logar({NomeUsuario, Senha}) }}>
            <Text style={Styles.btnTextSecundary}>LOGAR</Text>
          </TouchableHighlight>
          <TouchableHighlight style={Styles.btnTransparent}
            underlayColor={"transparent"}
            onPress={() =>  navigation.navigate('Signup')}>
            <Text style={Styles.btnTextTransparent}>Solicitar acesso!</Text>
          </TouchableHighlight>
        </KeyboardAvoidingView>
      )}
      <Text style={Styles.lblRodape}>Todos os Direitos Reservados - {new Date().getFullYear()}</Text>
    </LinearGradient>
  );
}

export default Login;