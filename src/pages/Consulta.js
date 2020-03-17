import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Image, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import Credencial from '../controllers/credencial';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from 'react-native-elements';
import ItemInfração from '../components/ItemInfração'
import firebase from '../services/firebase';
import Network  from '../controllers/network';
import moment from 'moment';
import Styles from '../styles/styles';
import Colors from '../styles/colors';

function Consulta({navigation}) {
  const fire_user = firebase.auth().currentUser;
  const [TermoPesquisa, setTermoPesquisa] = useState('');
  const [termoAnterior, setTermoAnterior] = useState('');
  const[Filtro,setFiltro] = useState('');
  const [Infrator, setInfrator] = useState(undefined);
  const[infratorKey, setInfratorKey]=useState(undefined);
  const[searchType, setSearchType]=useState(1);
  const[searchPadding, setSearchPadding]=useState(55);
  const[observerQuery, setObserver]=useState(undefined);


  useEffect(() => {
    switch(searchType){
      case 1:setSearchPadding(55);
        break;
      case 2:setSearchPadding(95);
        break;
      case 3:setSearchPadding(75);
        break;
      default: break;
    }
    setTermoPesquisa('');
  }, [searchType]);

  firebase.auth().onAuthStateChanged((user)=>{
    if(!user) {
      Alert.alert("Atenção:","Seu usuário foi desconectado!");
      navigation.navigate('Login');
    }
  });

  useEffect(() => {
    if(TermoPesquisa !== termoAnterior){
      //console.log("Termo: "+ termoAnterior);
      //setTermoAnterior(TermoPesquisa);
      _consultarInfrator(TermoPesquisa);
    }
  }, [TermoPesquisa]);

  const maskTermo = (txt) =>{
    if(searchType < 2) setTermoPesquisa(maskRG(txt));
    else setTermoPesquisa(txt);
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

    if(TermoPesquisa === termoAnterior){
      return;
    }
    else{
      setTermoAnterior(TermoPesquisa);
    }

    if(!Network.haveInternet){
      Network.alertOffline(() => {});
      return;
    }    

    let termo = TermoPesquisa;
    let child_ = "Rg";

    switch(searchType){
      case 1: termo = termo.replace(/\D/g,"");
        break;
      case 2:child_ = "Nome";
        break;
      case 3:child_ = "Mãe";
        break;
      default: break;
    }

    if(observerQuery){
      observerQuery.off("value");
    }
    //console.log(observerQuery);
    if(fire_user){
      let infratores = firebase.database().ref("infratores");
      let query = infratores.orderByChild(child_).limitToFirst(1).equalTo(termo);
      setObserver(query);
      query.on("value", function(snapshot) {
        if(snapshot.val() != null)
        {
          snapshot.forEach(function(child) {
            if(child.val()) {
              setInfratorKey(child.key);
              let infrator = child.val();
              let infras = [];
              if(child.val().Infrações){
                infras = Object.values(child.val().Infrações);
              }
              infrator.Infrações = infras;
              setInfrator(infrator);
            }
          });
        }
        else { 
          setInfrator(undefined);
          query.off("value");
          setObserver(undefined);
          //Alert.alert("Infrator não Encontrado!", "Verifique o número do RG e tente novamente!");
        }
      });
    }
  };

  return (
    <SafeAreaView style={Styles.page}>
      <LinearGradient
        start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal,Colors.Secondary.Normal]}
        style={{flex:1, alignSelf:"stretch", paddingTop:30}}>
        <Text style={Styles.lblSubtitle}>CONSULTA</Text>
      </LinearGradient>
      <TouchableOpacity style={Styles.searchType} onPress={() => {
          setSearchType(searchType < 3 ? searchType + 1 : 1)
        }}>
          <Text style={Styles.searchText}>{searchType < 2 ? "RG" : searchType < 3 ? "Nome" : "Mãe"}</Text>
      </TouchableOpacity>
      
      <SearchBar lightTheme placeholder="Pesquisar Infrator" placeholderTextColor={Colors.Secondary.Normal}
          containerStyle={[Styles.searchContent, {left:searchPadding}]}
          inputStyle={Styles.searchInput}
          round={true}
          inputContainerStyle={{backgroundColor:'transparent'}}
          searchIcon={{ iconStyle:{ color:Colors.Primary.Normal}}}
          clearIcon={{ iconStyle:{ color:Colors.Primary.Normal}}}
          value={TermoPesquisa}
          keyboardType={searchType < 2 ? "numeric" : "default"}
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
                    <Text style={Styles.txtRegularWhite}>{Infrator.Infrações.length > 0?(

                      moment(new Date(
                        Infrator.Infrações.sort(function (a, b) {
                          return  new Date(b.Data_ocorrência) - new Date(a.Data_ocorrência);
                        })[0].Data_ocorrência
                      )).format('DD/MM/YYYY')    ) : "--/--/----"                  
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
                    if(!Network.haveInternet){
                      Network.alertOffline(() => {});
                      return;
                    }
                    if(Credencial.haveAccess(Credencial.loggedCred, Credencial.AccessToDetalhes))
                      navigation.navigate("Cadastro", {Infrator});
                    else Credencial.accessDenied();
                    }}>
                    <Image style={{height:60, width:60, borderRadius:5}} source={require('../assets/images/edit-icon.png')} ></Image>
                  </TouchableOpacity>                  
                </View>
              </View>
              <View style={{flex:1, alignSelf:"stretch", marginHorizontal:15, borderRadius:20, backgroundColor:Colors.Primary.White, paddingTop:10, paddingBottom:20, marginBottom:15}}>
                  <SearchBar lightTheme placeholder="Pesquisar Infração" placeholderTextColor={Colors.Secondary.Normal}
                    containerStyle={[Styles.searchContentFull, {}]}
                    inputStyle={Styles.searchInput}
                    round={true}
                    inputContainerStyle={{backgroundColor:'transparent'}}
                    searchIcon={{ iconStyle:{ color:Colors.Primary.Normal}}}
                    clearIcon={{ iconStyle:{ color:Colors.Primary.Normal}}}
                    value={Filtro}
                    keyboardType="default"
                    onChangeText={(filtro) => setFiltro(filtro)}
                    onEndEditing={(filtro) => {setFiltro(filtro); }}
                    >
                  </SearchBar>
                  <ScrollView style={{flex:1, alignSelf:"stretch"}}>
                    {Infrator.Infrações.map((infração_, i) => {
                      if(infração_.Reds.includes(Filtro))
                        return <ItemInfração key={i} infração={infração_} onClick={() =>{
                          if(!Network.haveInternet){
                            Network.alertOffline(() => {});
                            return;
                          }
                          if(Credencial.haveAccess(Credencial.loggedCred, Credencial.AccessToAnexar))
                            navigation.navigate("Anexo", { item: {...infração_, infratorKey} });
                          else Credencial.accessDenied();
                        }}/>
                    })}
                  </ScrollView>
                </View>
            </View>
          ) : (<View style={{flex:6}}>
            <Text style={[Styles.lblMENU, {paddingTop:0, color:Colors.Secondary.Normal}]}>{TermoPesquisa == "" ? "" : "Infrator não encontrado!"}</Text>
          </View>)}
    </SafeAreaView>
    
  );
}

export default Consulta;