import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from 'react-native-elements';
import ItemInfração from '../components/ItemInfração'
import firebase from '../services/firebase';
import moment from 'moment';
import Styles from '../styles/styles';
import Colors from '../styles/colors';

function Consulta({navigation}) {
  const fire_user = firebase.auth().currentUser;
  const [TermoPesquisa, setTermoPesquisa] = useState('');
  const [Infrator, setInfrator] = useState(undefined);

  useEffect(() => {

    
  }, []);

  firebase.auth().onAuthStateChanged((user)=>{
    if(!user) {
      Alert.alert("Atenção:","Seu usuário foi desconectado!");
      navigation.navigate('Login');
    }
  });

  useEffect(() => {
    if(TermoPesquisa.length >= 8)
    {
      _consultarInfrator(TermoPesquisa);
    }
  }, [TermoPesquisa]);

  const maskTermo = (rg) =>{
    setTermoPesquisa(maskRG(rg));
  }
  const maskRG = (rg) =>{
    rg = rg.replace(/\D/g,"");
    if(rg.length == 9) rg=rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})$/,"$1.$2.$3-$4");
    if(rg.length == 8) rg=rg.replace(/(\d{1})(\d{3})(\d{3})(\d{1})$/,"$1.$2.$3-$4");

    return rg;
  }
  const maskCpf = (cpf) =>{
    cpf = cpf.replace(/\D/g,"");
    if(cpf.length == 11) cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/,"$1.$2.$3-$4");

    return cpf;
  }

  const _consultarInfrator = () => {
    let rg = TermoPesquisa.replace(/\D/g,"");
    if(fire_user){
      let infratores = firebase.database().ref("infratores");
      let query = infratores.orderByChild("Rg").equalTo(rg);
      query.once("value", function(snapshot) {
        if(snapshot.val() != null)
        {
          snapshot.forEach(function(child) {
            if(child.val()) {
              let infrator = child.val();
              infrator.Infrações = infrator.Infrações.filter(function (el) { return el != null; });
              setInfrator(infrator);
            }
          });
        }
        else { 
          setInfrator(undefined);
          Alert.alert("Infrator não Encontrado!", "Verifique o número do RG e tente novamente!");
        }
      });
    }
  };

  return (
    <View style={Styles.page}>
      <LinearGradient
        start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal,Colors.Secondary.Normal]}
        style={{flex:1, alignSelf:"stretch", paddingTop:30}}>
        <Text style={Styles.lblSubtitle}>CONSULTA</Text>
      </LinearGradient>
      <Text style={Styles.searchRG}>RG</Text>
      <SearchBar lightTheme placeholder="Pesquisar Infrator" placeholderTextColor={Colors.Secondary.Normal}
          containerStyle={Styles.searchContent}
          inputStyle={Styles.searchInput}
          round={true}
          inputContainerStyle={{backgroundColor:'transparent'}}
          searchIcon={{ iconStyle:{ color:Colors.Primary.Normal}}}
          clearIcon={{ iconStyle:{ color:Colors.Primary.Normal}}}
          value={TermoPesquisa}
          keyboardType="numeric"
          onChangeText={(termo) => maskTermo(termo) }
          onEndEditing={() => {_consultarInfrator(); }}
          ></SearchBar>
          {Infrator != undefined?(
            <View style={{flex:6, alignSelf:"stretch", marginTop:20}}>
              <View style={{alignSelf:"stretch", marginHorizontal:15, backgroundColor:Colors.Primary.Normal,
                    borderRadius:20, marginVertical:15,}}>
                <View style={{flexDirection:"row", alignSelf:"stretch"}}>
                  <View style={{flex:1, alignSelf:"stretch", alignItems:"center", paddingVertical:10}}>
                    <Text style={Styles.txtBoldWhite}>Ultima Infração</Text>
                    <Text style={Styles.txtRegularWhite}>{
                      moment(new Date(
                        Infrator.Infrações.sort(function (a, b) {
                          return  a.Data_ocorrência < b.Data_ocorrência ? 1 : 0;
                        })[0].Data_ocorrência
                      )).format('DD/MM/YYYY')                      
                    }</Text>
                  </View>
                  <View style={{backgroundColor:"#fff", width:2}}></View>
                  <View style={{flex:1, alignSelf:"stretch", alignItems:"center", paddingVertical:10}}>
                    <Text style={Styles.txtBoldWhite}>Status</Text>
                    <Text style={Styles.txtRegularWhite}>{Infrator.Infrações.length > 1 ? "Reincidente" :
                      Infrator.Infrações.length > 0 ? "Incidente" : "Sem Passagens"
                    }</Text>
                  </View>
                </View>
                <View style={{backgroundColor:Colors.Terciary.White, alignSelf:"stretch",
                    padding:15, borderRadius:20, flexDirection:"row"}}>
                  <View style={{flex:1}}>
                    <View style={{alignSelf:"stretch", flexDirection:"row"}}>
                      <Text style={Styles.txtBold}>Nome: </Text>
                      <Text style={Styles.txtRegular}>{Infrator.Nome}</Text>
                    </View>
                    <View style={{alignSelf:"stretch", flexDirection:"row"}}>
                      <Text style={Styles.txtBold}>CPF: </Text>
                      <Text style={Styles.txtRegular}>{maskCpf(Infrator.Cpf)}</Text>
                    </View>
                    <View style={{alignSelf:"stretch", flexDirection:"row"}}>
                      <Text style={Styles.txtBold}>RG: </Text>
                      <Text style={Styles.txtRegular}>{maskRG(Infrator.Rg)}</Text>
                    </View>
                    
                  </View>
                  <TouchableOpacity onPress={() => {
                      navigation.navigate("Cadastro",{Infrator:Infrator});
                    }}>
                    <Image style={{height:60, width:60, borderRadius:5}} source={require('../assets/images/edit-icon.png')} ></Image>
                  </TouchableOpacity>                  
                </View>
              </View>
              <View style={{flex:1, alignSelf:"stretch", marginHorizontal:15, borderRadius:20, backgroundColor:Colors.Primary.White, paddingVertical:20, marginBottom:15}}>
                  <ScrollView style={{flex:1, alignSelf:"stretch"}}>
                    {Infrator.Infrações.map((infração_, i) => {
                      return <ItemInfração key={i} infração={infração_}/>
                    })}
                  </ScrollView>
                </View>
            </View>
          ) : (<View style={{flex:6}}></View>)}
    </View>
    
  );
}

export default Consulta;