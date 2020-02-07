import React, { useState } from 'react';
import { View, SafeAreaView, KeyboardAvoidingView , Text, TextInput,TouchableHighlight, Picker, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Network  from '../controllers/network';
import firebase from '../services/firebase';
import Styles from '../styles/styles';
import Colors from '../styles/colors';

function Signup({navigation}) {

  const [categoria, setCategoria] = useState(0);
  const CategoriaChanged = (categoria) => { setCategoria(categoria); };
  const [nome, setNome] = useState('');
  const [inscrição, setInscrição] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [confEmail, setConfEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confSenha, setConfSenha] = useState('');


  const _camposOk = () => {
    if(categoria === "0"){
      Alert.alert("Atenção:", "Selecione uma categoria!")
      return false;
    }
    else if(!nome || nome === ''){
      Alert.alert("Atenção:", "Nome informado é inválido!")
      return false;
    }
    else if(!inscrição || inscrição === ''){
      Alert.alert("Atenção:", "Informe Matricula/Inscrição que seja válida!")
      return false;
    }
    else if(!telefone || telefone.length < 11){
      Alert.alert("Atenção:", "Verifique o número de telefone!")
      return false;
    }
    else if(email != confEmail){
      Alert.alert("Atenção:", "Os emails divergem entre si!")
      return false;
    }
    else if(senha != confSenha){
      Alert.alert("Atenção:", "Senhas estão divergentes!")
      return false;
    }
    else return true;
  }

  const _saveUser = (user) => {

    if(!Network.haveInternet){
      Network.alertOffline(() => {});
      return;
    }

    firebase.auth().signOut();

    if(!_camposOk()) return;

    firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then(() => {
      if(firebase.auth().currentUser){
        let fire_user = firebase.auth().currentUser;
        firebase.database().ref('users').child(fire_user.uid).set(user);
        firebase.database().ref('users').child(fire_user.uid).once('value')
        .then((snapshot)=>{
          if(!fire_user.emailVerified){            
            fire_user.sendEmailVerification()
            .then(()=>{
              Alert.alert("Sucesso!",`Em breve receberá um e-mail de verificação, ${snapshot.val().Nome}!`);
            })
            .catch((err) => {Alert.alert("Falha: " + err.code, err.message);});
          }
        });
        navigation.goBack();
      }
      else{
        Alert.alert("Falha!","Não foi possivel completar seu cadastro!");
      }
      firebase.auth().signOut();
    })
    .catch((e) =>{
      switch(e.code){
        case 'auth/invalid-email':
          Alert.alert("Atenção:", "Email informado é inválido!");
          break;
        case 'auth/weak-password':
          Alert.alert("Atenção:", "Senha deve conter ao menos 6 caracteres!");
          break;
        case 'auth/email-already-in-use':
          Alert.alert("Email inválido!", "Ele já está em uso.");
          break;
        case 'auth/network-request-failed':
          Alert.alert("Sem internet:", "Verifique sua conexão e tente novamente!");
          break;
        default:
          Alert.alert("Algo deu errado...", "Por favor tente novamente mais tarde!");
          //Alert.alert(`ERROR: ${e.code}`, e.message);
          break;
      }
    });     
  };

  return (
    <SafeAreaView style={Styles.page}>
    <LinearGradient
        start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal,Colors.Terciary.Normal]}
        style={[Styles.page, {alignSelf:"stretch"}]}>
      <Text style={[Styles.lblSubtitle, {flex:0.75, paddingTop:30}]}>CADASTRO</Text>
      <KeyboardAvoidingView style={{flex:5, alignSelf:"stretch"}} behavior="padding"   keyboardVerticalOffset={25}>
        <ScrollView>
          <View style={Styles.pickerDiv}>
            <Picker
              style={Styles.picker}
              selectedValue={categoria}
              onValueChange={(itemValue, itemIndex) => CategoriaChanged(itemValue)}>
              <Picker.Item label="Categoria" value="0" />
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
              placeholder="Matricula/Inscrição"
              placeholderTextColor={Colors.Terciary.White}
              style={Styles.campo}
              onChangeText={(inscrição_) => setInscrição(inscrição_)}
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
        </ScrollView>
        
        <View style={{flexDirection: 'row', justifyContent:"center", alignItems:"center"}}>
          <TouchableHighlight style={Styles.btnTransparent}
            underlayColor={'transparent'}
            onPress={() => navigation.goBack()}>
            <Text style={Styles.btnTextTransparent}>VOLTAR</Text>
          </TouchableHighlight>
          <TouchableHighlight style={Styles.btnSecundary}
            underlayColor={Colors.Primary.White}
            onPress={() => _saveUser({Nome:nome, Inscrição:inscrição, Telefone:telefone, Credencial:(Number(categoria) * -1)}) }>
            <Text style={Styles.btnTextSecundary}>SALVAR</Text>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView >
      <Text style={Styles.lblRodape}>Todos os Direitos Reservados - {new Date().getFullYear()}</Text>
    </LinearGradient>
    </SafeAreaView>
  );
}
export default Signup;