import React,{useState,useEffect} from 'react';
import { View,Text,SafeAreaView,TextInput,TouchableHighlight,ScrollView, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Styles from '../styles/styles';
import Colors from '../styles/colors';
import DatePicker from 'react-native-datepicker'
//import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import moment from 'moment'
import styled from 'styled-components/native'
import {SwipeListView} from 'react-native-swipe-list-view'
import ListaItem from '../components/ListaItem'
import ListaItemSwipe from '../components/ListaItemSwipe'
import firebase from '../services/firebase';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
//import { BSON } from 'mongodb-stitch-react-native-sdk';
import uuid from 'uuid/v4'
function Cadastro({navigation})
{
  const [infrator, setInfrator]=useState({
    "Nome":"", "Cpf":"", "Rg":"", "Mãe":"", "Logradouro":"",
    "Num_residência":"", "Bairro":"", "Cidade":"", "Uf":"", "Sexo":"",
    "Data_nascimento":"", "Data_registro":"","Infrações":[]
  });

  const [infração, setInfração] = useState({
    "_id":uuid(),
    "Descrição":"",
    "Data_ocorrência": "",
    "Data_registro": "",
  });

  const[dateNasc,setDateNas]=useState(new Date());
  const[dateInfra,setDateInfra]=useState(new Date());

  const[isSaved, setIsSaved]=useEffect(false);
  
  useEffect(() =>{
    //console.log(infrator.Infrações);

  }, [infrator]);

  useEffect(() =>{

  }, [infração]);

  const saveInfrator = (infrator)=>{
    
    let infratores = firebase.database().ref('infratores');//selecionando nó
    let key = infratores.push().key; //pegar chave
    infratores.child(key).set(infrator).then(() => {
      Alert.alert("Sucesso:", "Infrator salvo!");
      setIsSaved(true);
    })
    .catch((err) => {
      Alert.alert("Falha:", "Não foi possivel salvar o infrator!");
    });
  }
  
  const deleteItem = (index) =>{
      let items = [...infrator.Infrações];
      items = items.filter((it,i)=> i != index);
      setInfrator({...infrator, "Infrações":items});
  }
  const NavigationToAttachment = (item) =>{
    if(isSaved){ navigation.navigate('Anexo',{item}); }
    else{ Alert.alert("Atenção:", "Salve suas alterações primeiro!"); }      
  }
  return (
    <SafeAreaView style={Styles.page}>
      <ScrollView style={{alignSelf:"stretch"}}>
        <LinearGradient
          start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
          locations={[0, 1]}
          colors={[Colors.Primary.Normal,Colors.Terciary.Normal]}
          style={{ flex:1,alignSelf:'stretch',padding:30}}>
          <Text style={[Styles.lblSubtitle,{fontSize:25}]}>CADASTRO DE INFRATOR</Text>
          <View style={{backgroundColor:'#fff',flex:3,marginVertical:8,borderRadius:10,paddingHorizontal:10,paddingTop:5}}>
            <Text style={{color:'#800000',fontSize:18,marginStart:8,fontFamily:"CenturyGothic"}}>Informações pessoais</Text>
            <View>
              <TextInput placeholder="Nome"
                placeholderTextColor={Colors.Secondary.Normal}
                style={Styles.campoCadastro}
                onChangeText={(nome) => setInfrator({...infrator, "Nome":nome})}/>
            </View>
            <View style={{flexDirection:'row'}}>
              <TextInput placeholder="RG"
                placeholderTextColor={Colors.Secondary.Normal}
                style={[Styles.campoCadastro,{marginEnd:3}]}
                keyboardType='number-pad'
                onChangeText={(rg) => setInfrator({...infrator, "Rg":rg})}/>
              <TextInput placeholder="CPF"
                placeholderTextColor={Colors.Secondary.Normal}
                style={Styles.campoCadastro}
                keyboardType='number-pad'
                onChangeText={(cpf) => setInfrator({...infrator, "Cpf":cpf})}/>
            </View>
            <View style={{flexDirection:'row'}}>
              <DatePicker
                style={{flex:3.5,marginEnd:3,marginTop:5}}
                format='DD/MM/YYYY'
                date={dateNasc}
                onDateChange={(dateNasc) => {
                  setDateNas(dateNasc);
                  var dt =dateNasc.split('/');
                  setInfrator({...infrator, "Data_nascimento":new Date(`${dt[2]}-${dt[1]}-${dt[0]}`)})
                }}
                customStyles={{
                  dateIcon:{
                    width:0,
                    height:0,
                  },
                  dateInput: {
                    borderWidth:0,
                    },
                  dateTouchBody: { borderRadius:25,
                    borderColor:'#DCDCDC',
                    borderWidth:1,
                  }
                }
              }/>
              <TextInput placeholder="Sexo"
                  placeholderTextColor={Colors.Secondary.Normal}
                  style={[Styles.campoCadastro,{flex:1.5}]}
                  onChangeText={(sexo) => setInfrator({...infrator, "Sexo":sexo})}/>
            </View>
            <View>
              <TextInput placeholder="Nome da Mãe"
                placeholderTextColor={Colors.Secondary.Normal}
                style={Styles.campoCadastro}
                onChangeText={(mãe) => setInfrator({...infrator, "Mãe":mãe})}/>
            </View>
            <View style={{flexDirection:'row'}}>
              <TextInput placeholder="Logradouro"
                placeholderTextColor={Colors.Secondary.Normal}
                style={[Styles.campoCadastro,{flex:1,marginEnd:3}] }
                onChangeText={(logradouro) => setInfrator({...infrator, "Logradouro":logradouro})}/>
              <TextInput placeholder="Bairro"
                placeholderTextColor={Colors.Secondary.Normal}
                style={[Styles.campoCadastro,{flex:1}] }
                onChangeText={(bairro) => setInfrator({...infrator, "Bairro":bairro})}/>
            </View>
            <View style={{flexDirection:'row'}}>
              <TextInput placeholder="Cidade"
                placeholderTextColor={Colors.Secondary.Normal}
                style={[Styles.campoCadastro,{flex:1,marginEnd:3}] }
                onChangeText={(cidade) => setInfrator({...infrator, "Cidade":cidade})}/>
              <TextInput placeholder="UF"
                placeholderTextColor={Colors.Secondary.Normal}
                style={[Styles.campoCadastro,{flex:0.5,marginEnd:3}] }
                onChangeText={(uf) => setInfrator({...infrator, "Uf":uf})}/>
              <TextInput placeholder="N°"
                placeholderTextColor={Colors.Secondary.Normal}
                style={[Styles.campoCadastro,{flex:0.5}] }
                keyboardType='number-pad'
                onChangeText={(numero)=> setInfrator({...infrator, "Num_residência":numero})}/>
            </View>
          </View>
          <View style={{backgroundColor:'#fff',flex:1,borderRadius:10,padding:10}}>
            <Text style={{color:'#800000',fontSize:18,marginStart:8,fontFamily:"CenturyGothic"}}>Informações da infração</Text>
            <View style={{flexDirection:'row',marginTop:5}}>
              <TextInput 
                placeholder="Descrição"
                placeholderTextColor={Colors.Secondary.Normal}
                style={[Styles.campoCadastro,{height:80,width:150,borderRadius:25,paddingTop:10,marginTop:0,marginStart:5}] }
                multiline={true}
                textAlignVertical='top'
                onChangeText={(descrição) => setInfração({...infração, "Descrição":descrição})}/>
            </View>
            <View style={{flexDirection:'row',justifyContent:"center"}}>
              <DatePicker format="DD/MM/YYYY"
                style={{flex:1,marginEnd:3,marginTop:7}}
                date={dateInfra}
                onDateChange={(dataOcorrencia) => { 
                  setDateInfra(dataOcorrencia);
                  var dt = dataOcorrencia.split('/');
                  setInfração({...infração, "Data_ocorrência":new Date(`${dt[2]}-${dt[1]}-${dt[0]}`)})
                }}
                customStyles={{
                  dateIcon:{
                    width:0,
                    height:0,
                  },
                  dateInput: {
                    borderWidth:0,
                  },
                  dateTouchBody: { borderRadius:25,
                    borderColor:'#DCDCDC',
                    borderWidth:1,
                    height:39
                  }
                }
              }/>
              <TouchableHighlight style={[Styles.btnPrimary,{flex:1,marginHorizontal:0}]}
                underlayColor={Colors.Primary.White}
                onPress={() => {
                  setInfração({...infração, "Data_registro":new Date().toISOString()});
                  setInfrator({...infrator, "Infrações":[...infrator.Infrações, {...infração}]});
                }}>
                <Text style={[Styles.btnTextSecundary,{color:Colors.Secondary.White,fontSize:13}]}>ADICIONAR</Text>
              </TouchableHighlight>
            </View>
            <View style={{flex:1,alignSelf:'stretch',borderWidth:1,borderRadius:25,borderColor:'#DCDCDC',height:80,padding:10}}>
              <SwipeListView
                data={infrator.Infrações}
                renderItem={({item})=><ListaItem data={item} onLongPress={()=>{NavigationToAttachment(item)}}/>}
                renderHiddenItem={({item,index})=><ListaItemSwipe onDelete={()=>{deleteItem(index)}}/>}
                leftOpenValue={30}
                disableLeftSwipe={true}/>
            </View>
          </View>
          <TouchableHighlight style={[Styles.btnSecundary,{backgroundColor:"#800",marginHorizontal:0}]}
            underlayColor={Colors.Primary.White}
            onPress={() => saveInfrator(infrator)}>
            <Text style={[Styles.btnTextSecundary,{color:"#FFF"}]}>SALVAR</Text>
          </TouchableHighlight>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>      
  );
}
export default Cadastro