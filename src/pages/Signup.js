import React, { useState } from 'react';
import { View, KeyboardAvoidingView , Text, TextInput,TouchableHighlight, Picker } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Styles from '../styles/styles';
import Colors from '../styles/colors';

function Signup({navigation}) {
  const [categoria, setCategoria] = useState(null);
  const CategoriaChanged = (categoria) => { setCategoria(categoria); };

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
            <Picker.Item label="Professor" value="Professor"/>
            <Picker.Item label="Advogado" value="Advogado"/>
            <Picker.Item label="Policial" value="Policial"/>
            <Picker.Item label="Delegado" value="Delegado"/>
            <Picker.Item label="Promotor" value="Promotor"/>
            <Picker.Item label="Juiz" value="Juiz"/>
          </Picker>
        </View>
        <TextInput
            placeholder="Nome de Usuário"
            placeholderTextColor={Colors.Terciary.White}
            style={Styles.campo}
        />
        <TextInput
            placeholder="Telefone"
            placeholderTextColor={Colors.Terciary.White}
            keyboardType="phone-pad"
            style={Styles.campo}
        />
        <TextInput
          placeholder="emai@email.com"
          placeholderTextColor={Colors.Terciary.White}
          keyboardType="email-address"
          style={Styles.campo}
        />
        <TextInput
          placeholder="emai.confirma@email.com"
          placeholderTextColor={Colors.Terciary.White}
          keyboardType="email-address"
          style={Styles.campo}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor={Colors.Terciary.White}
          secureTextEntry={true}
          style={Styles.campo}
        />
        <TextInput
          placeholder="Confirma Senha"
          placeholderTextColor={Colors.Terciary.White}
          secureTextEntry={true}
          style={Styles.campo}
        />
        <View style={{flexDirection: 'row', justifyContent:"center", alignItems:"center"}}>
          <TouchableHighlight style={Styles.btnTransparent}
            underlayColor={'transparent'}
            onPress={() =>  navigation.goBack()}>
            <Text style={Styles.btnTextTransparent}>VOLTAR</Text>
          </TouchableHighlight>
          <TouchableHighlight style={Styles.btnSecundary}
            underlayColor={Colors.Primary.White}
            onPress={() =>  navigation.goBack()}>
            <Text style={Styles.btnTextSecundary}>SALVAR</Text>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView >
      <Text style={Styles.lblRodape}>Todos os Direitos Reservados - {new Date().getFullYear()}</Text>
    </LinearGradient>
  );
}
export default Signup;