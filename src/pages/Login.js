import React, { useState } from 'react';
import { KeyboardAvoidingView, Text, TextInput, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckBox } from 'react-native-elements';
import Styles from '../styles/styles';
import Colors from '../styles/colors';

function Login({navigation}) {
  
  const [keepLogin, setLoginState] = useState(false);
  const KeepLoginChange = () => { setLoginState(!keepLogin); };
  const [NomeUsuario, setNomeUsuario] = useState('');
  const [Senha, setSenha] = useState('');
  return (
    <LinearGradient
        start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal,Colors.Terciary.Normal]}
        style={Styles.page}>
        <Text style={Styles.lblTitle}>SysGI</Text>
      <KeyboardAvoidingView style={{flex:3}} behavior="padding" enabled   keyboardVerticalOffset={100}>
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
          onPress={() => {
            console.log(NomeUsuario);
            navigation.navigate('MENU')
          }}>
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