import React, { useState } from 'react';
import { View, KeyboardAvoidingView , Text, TextInput,TouchableHighlight, Picker } from 'react-native';
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import { LinearGradient } from 'expo-linear-gradient';
import Styles from '../styles/styles';
import Colors from '../styles/colors';

function Signup({navigation}) {
  const mongoClient = Stitch.defaultAppClient;

  const [categoria, setCategoria] = useState(0);
  const CategoriaChanged = (categoria) => { setCategoria(categoria); };
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [confEmail, setConfEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confSenha, setConfSenha] = useState('');

  const _saveUser = (user) => {
    
    if(!mongoClient.auth.isLoggedIn){
      mongoClient.auth.loginWithCredential(new AnonymousCredential())
      .then(user_ => {
        console.log(`Successfully logged in as user ${user_.id}`);
        this.setState({ currentUserId: user_.id });
      })
      .catch(err => {
        console.log(`Failed to log in anonymously: ${err}`);
        this.setState({ currentUserId: undefined });
      });
    }

    if(mongoClient.auth.isLoggedIn){
      mongoClient.callFunction("add_user", [user]).then(salvar =>{
        console.log(`Resultado: ${salvar.msg}`);
        if(salvar.res){ navigation.goBack(); }
      });
    }
     
  };

  return (
    <LinearGradient
        start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal,Colors.Terciary.Normal]}
        style={Styles.page}>
      <Text style={Styles.lblSubtitle}>CADASTRO</Text>
      <KeyboardAvoidingView style={{flex:5, alignSelf:"stretch"}} behavior="padding" enabled   keyboardVerticalOffset={200}>
        <View style={Styles.pickerDiv}>
          <Picker
            style={Styles.picker}
            selectedValue={categoria}
            onValueChange={(itemValue, itemIndex) => CategoriaChanged(itemValue)}>
            <Picker.Item label="Categoria" value={null} />
            <Picker.Item label="Professor" value="1"/>
            <Picker.Item label="Advogado" value="2"/>
            <Picker.Item label="Policial" value="3"/>
            <Picker.Item label="Delegado" value="4"/>
            <Picker.Item label="Promotor" value="5"/>
            <Picker.Item label="Juiz" value="6"/>
          </Picker>
        </View>
        <TextInput
            placeholder="Nome de Usuário"
            placeholderTextColor={Colors.Terciary.White}
            style={Styles.campo}
            onChangeText={(nome_) => setNome(nome_)}
        />
        <TextInput
            placeholder="Telefone"
            placeholderTextColor={Colors.Terciary.White}
            keyboardType="phone-pad"
            style={Styles.campo}
            onChangeText={(telefone_) => setTelefone(telefone_)}
        />
        <TextInput
          placeholder="emai@email.com"
          placeholderTextColor={Colors.Terciary.White}
          keyboardType="email-address"
          style={Styles.campo}
          onChangeText={(email_) => setEmail(email_)}
        />
        <TextInput
          placeholder="emai.confirma@email.com"
          placeholderTextColor={Colors.Terciary.White}
          keyboardType="email-address"
          style={Styles.campo}
          onChangeText={(confEmail_) => setConfEmail(confEmail_)}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor={Colors.Terciary.White}
          secureTextEntry={true}
          style={Styles.campo}
          onChangeText={(senha_) => setSenha(senha_)}
        />
        <TextInput
          placeholder="Confirma Senha"
          placeholderTextColor={Colors.Terciary.White}
          secureTextEntry={true}
          style={Styles.campo}
          onChangeText={(confSenha_) => setConfSenha(confSenha_)}
        />
        <View style={{flexDirection: 'row', justifyContent:"center", alignItems:"center"}}>
          <TouchableHighlight style={Styles.btnTransparent}
            underlayColor={'transparent'}
            onPress={() => navigation.goBack()}>
            <Text style={Styles.btnTextTransparent}>VOLTAR</Text>
          </TouchableHighlight>
          <TouchableHighlight style={Styles.btnSecundary}
            underlayColor={Colors.Primary.White}
            onPress={() => _saveUser({Nome:nome, Email:email, Telefone:telefone, Credencial:Number(categoria), Passpassword:senha}) }>
            <Text style={Styles.btnTextSecundary}>SALVAR</Text>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView >
      <Text style={Styles.lblRodape}>Todos os Direitos Reservados - {new Date().getFullYear()}</Text>
    </LinearGradient>
  );
}

export default Signup;