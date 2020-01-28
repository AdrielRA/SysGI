import React,{useState,useEffect} from 'react';
import { View,Text,SafeAreaView,TextInput,TouchableHighlight,FlatList,ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Styles from '../styles/styles';
import Colors from '../styles/colors';
import DatePicker from 'react-native-datepicker'
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import moment from 'moment'
import styled from 'styled-components/native'
import {SwipeListView} from 'react-native-swipe-list-view'
import ListaItem from '../components/ListaItem'
import ListaItemSwipe from '../components/ListaItemSwipe'
import { BSON } from 'mongodb-stitch-react-native-sdk';

function Cadastro({navigation})
{
  const mongoClient = Stitch.defaultAppClient;
  const[dateNasc,setDateNas]=useState(new Date());
  const[dateInfra,setDateInfra]=useState(moment(new Date()).format("DD/MM/YYYY"));
  const[nome,setNome] = useState('');
  const[rg,setRg] = useState('');
  const[cpf,setCpf] = useState('');
  const[sexo,setSexo] = useState('');
  const[nomeMãe,setNomeMae] = useState('');
  const[logradouro,setLogradouro] = useState('');
  const[bairro,setBairro] = useState('');
  const[cidade,setCidade] = useState('');
  const[uf,setUf] = useState('');
  const[numero,setNumero] = useState('');
  const[descricao,setDescricao] = useState('');
  const[infracoes,setInfracoes] = useState([]);
  const[infracoesBD,setInfracoesBD] = useState([]);
  let myObjectId = new BSON.ObjectId();
   
  const Infracao = {
    "_id":myObjectId,
    "Descrição":descricao,
    "Data ocorrência": dateInfra,
    "Data registro": moment(new Date()).format("DD/MM/YYYY"),
  }

  const saveInfrator = (infrator)=>{
       if(!mongoClient.auth.isLoggedIn){
       mongoClient.auth.loginWithCredential(new AnonymousCredential())
      .then(infrator_ => {
        console.log(`Successfully logged in as user ${infrator_.id}`);
        this.setState({ currentUserId: user_.id });
      })
      .catch(err => {
        console.log(`Failed to log in anonymously: ${err}`);
        this.setState({ currentUserId: undefined });
      });
    }

    if(mongoClient.auth.isLoggedIn){
      mongoClient.callFunction("add_infrator", [infrator,infracoesBD]).then(salvar =>{
        console.log(`Resultado: ${salvar.msg}`);
        if(salvar.res){ navigation.goBack(); }
      });
    }
  }
  
  const deleteItem = (index) =>{
      let items = [...infracoes];
      items = items.filter((it,i)=> i != index);
      setInfracoes(items);
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
                      onChangeText={(nome_) => setNome(nome_)}
                  />
                </View>
               
                <View style={{flexDirection:'row'}}>
                  <TextInput placeholder="RG"
                      placeholderTextColor={Colors.Secondary.Normal}
                      style={[Styles.campoCadastro,{marginEnd:3}]}
                      keyboardType='number-pad'
                      onChangeText={(rg_) => setRg(rg_)}
                  />
                  <TextInput placeholder="CPF"
                      placeholderTextColor={Colors.Secondary.Normal}
                      style={Styles.campoCadastro}
                      keyboardType='number-pad'
                      onChangeText={(cpf_) => setCpf(cpf_)}
                  />
                </View>
                <View style={{flexDirection:'row'}}>
                  <DatePicker
                      style={{flex:3.5,marginEnd:3,marginTop:5}}
                      format='DD/MM/YYYY'
                      date={dateNasc}
                      onDateChange={(dateNasc_) => setDateNas(dateNasc_)}
                      customStyles={{
                        dateIcon:{
                          width:0,
                          height:0,
                        },
                        dateInput: {
                          borderWidth:0,
                         },
                        dateTouchBody: { borderRadius:25,
                          borderColor:Colors.Secondary.Normal,
                          borderWidth:1,
                        }
                      }
                    }
                    />
                    <TextInput placeholder="Sexo"
                        placeholderTextColor={Colors.Secondary.Normal}
                        style={[Styles.campoCadastro,{flex:1.5}]}
                        onChangeText={(sexo_) => setSexo(sexo_)}
                    />
                </View>
                <View>
                  <TextInput placeholder="Nome da Mãe"
                        placeholderTextColor={Colors.Secondary.Normal}
                        style={Styles.campoCadastro}
                        onChangeText={(nomeMãe_) => setNomeMae(nomeMãe_)}
                    />
                </View>
                  
      
                <View style={{flexDirection:'row'}}>
                  <TextInput placeholder="Logradouro"
                      placeholderTextColor={Colors.Secondary.Normal}
                      style={[Styles.campoCadastro,{flex:1,marginEnd:3}] }
                      onChangeText={(logradouro_) => setLogradouro(logradouro_)}
                  />
                  <TextInput placeholder="Bairro"
                      placeholderTextColor={Colors.Secondary.Normal}
                      style={[Styles.campoCadastro,{flex:1}] }
                      onChangeText={(bairro_) => setBairro(bairro_)}
                  />
                </View>
                <View style={{flexDirection:'row'}}>
                  <TextInput placeholder="Cidade"
                      placeholderTextColor={Colors.Secondary.Normal}
                      style={[Styles.campoCadastro,{flex:1,marginEnd:3}] }
                      onChangeText={(cidade_) => setCidade(cidade_)}
                  />
                  <TextInput placeholder="UF"
                      placeholderTextColor={Colors.Secondary.Normal}
                      style={[Styles.campoCadastro,{flex:0.5,marginEnd:3}] }
                      onChangeText={(uf_) => setUf(uf_)}
                  />
                  <TextInput placeholder="N°"
                      placeholderTextColor={Colors.Secondary.Normal}
                      style={[Styles.campoCadastro,{flex:0.5}] }
                      keyboardType='number-pad'
                      onChangeText={(numero_)=>{setNumero(numero_)}}
                  />
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
                      onChangeText={(descricao_) => setDescricao(descricao_)}
                  />
                  </View>
  
                  <View style={{flexDirection:'row',justifyContent:"center"}}>
                  <DatePicker format="DD/MM/YYYY"
                      style={{flex:1,marginEnd:3,marginTop:7}}
                      date={dateInfra}
                      onDateChange={(dateInfra_) => setDateInfra(dateInfra_)}
                      customStyles={{
                        dateIcon:{
                          width:0,
                          height:0,
                        },
                        dateInput: {
                          borderWidth:0,
                        },
                        dateTouchBody: { borderRadius:25,
                          borderColor:Colors.Secondary.Normal,
                          borderWidth:1,
                          height:39
                        }
                      }
                    }
                  />
                    <TouchableHighlight style={[Styles.btnPrimary,{flex:1,marginHorizontal:0}]}
                      underlayColor={Colors.Primary.White}
                      onPress={() => {
                        var inf = dateInfra + " - " + descricao
                        setInfracoes([...infracoes,inf]);
                        setInfracoesBD([...infracoesBD,Infracao]);
                      }}>
                      <Text style={[Styles.btnTextSecundary,{color:Colors.Secondary.White,fontSize:13}]}>ADICIONAR</Text>
                    </TouchableHighlight>
                    
                  </View>
                  
                  <View style={{flex:1,alignSelf:'stretch',borderWidth:1,borderRadius:25,borderColor:Colors.Secondary.Normal,height:80,padding:10}}>
                    <SwipeListView
                      data={infracoes}
                      renderItem={({item})=><ListaItem data={item} />}
                      renderHiddenItem={({item,index})=><ListaItemSwipe onDelete={()=>{deleteItem(index)}}/>}
                      leftOpenValue={30}
                      disableLeftSwipe={true}
                    />
                  </View>
              </View>
              <TouchableHighlight style={[Styles.btnSecundary,{backgroundColor:"#800",marginHorizontal:0}]}
                      underlayColor={Colors.Primary.White}
                      onPress={() => saveInfrator({Nome:nome, Cpf:cpf, Rg:rg, Mãe:nomeMãe, Logradouro:logradouro,
                        Num_residência:numero, Bairro:bairro, Cidade:cidade, Uf:uf, Sexo:sexo, Data_nascimento:dateNasc,Data_registro:moment(new Date()).format("DD/MM/YYYY"),Infrações:infracoesBD                            
                      })}>
                <Text style={[Styles.btnTextSecundary,{color:"#FFF"}]}>SALVAR</Text>
              </TouchableHighlight>

          </LinearGradient>
        </ScrollView>
     </SafeAreaView>      
  );
}
export default Cadastro