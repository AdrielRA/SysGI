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
function Cadastro({navigation})
{
<<<<<<< HEAD
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
 
  const saveInfrator = (infrator)=>{
    console.log(dateNasc);
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
      mongoClient.callFunction("add_infrator", [infrator]).then(salvar =>{
        console.log(`Resultado: ${salvar.msg}`);
        if(salvar.res){ navigation.goBack(); }
      });
    }
=======
  constructor(props){
    super(props);
    this.state={
      date:'',
      date1:'',
      Infrator:this.props.navigation.getParam("Infrator")
    };
  }
  
componentDidMount(){
  const _show = () => {
    
    console.log(this.state.Infrator.Nome);
  }
  _show();
}

  selectDate = (date)=>{
    this.setState({date: date});
>>>>>>> 10ccf74ab5ef4ad8cd492ca33b3cca8fc6b39a75
  }
  const deleteItem = (index) =>{
      let items = [...infracoes];
      items = items.filter((it,i)=>i != index);
      setInfracoes(items);
  }
<<<<<<< HEAD
  return (
     <SafeAreaView style={[Styles.page,{backgroundColor:'#dcdcdc'}]}>
=======
  render(){
    if(this.state.Infrator === undefined){
      this.state.Infrator = {
        Nome:"", Cpf:"", Rg:"", Mãe:"", Logradouro:"",
        Num_residência:"", Bairro:"", Cidade:"",
        Uf:"", Sexo:undefined, Data_nascimento:undefined,
        Data_registro:undefined, Infrações:[]
      }
    }

    return (
       <SafeAreaView style={[Styles.page,{backgroundColor:'#dcdcdc'}]}>
>>>>>>> 10ccf74ab5ef4ad8cd492ca33b3cca8fc6b39a75
        <ScrollView style={{alignSelf:"stretch"}}>
        <LinearGradient
            start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
            locations={[0, 1]}
            colors={[Colors.Primary.Normal,Colors.Terciary.Normal]}
            style={{ flex:1,alignSelf:'stretch',paddingTop:30}}>
          <Text style={[Styles.lblSubtitle,{fontSize:25}]}>CADASTRO DE INFRATOR</Text>
        </LinearGradient>
      
          <View style={{flex:1,alignSelf:'stretch',margin:15}}>
            <View style={{backgroundColor:'#fff',flex:3,marginVertical:8,borderRadius:10,paddingHorizontal:10,paddingTop:5}}>
              
              <Text style={{color:'#800000',fontSize:18,marginStart:8,fontFamily:"CenturyGothic"}}>Informações pessoais</Text>
              <TextInput placeholder="Nome"
                  placeholderTextColor={Colors.Secondary.Normal}
                  style={[Styles.campoCadastro] }
<<<<<<< HEAD
                  onChangeText={(nome_) => setNome(nome_)}
=======
                  value={this.state.Infrator.Nome}
>>>>>>> 10ccf74ab5ef4ad8cd492ca33b3cca8fc6b39a75
              />
              <View style={{width:300,height:53,flexDirection:'row'}}>
                <TextInput placeholder="RG"
                    placeholderTextColor={Colors.Secondary.Normal}
<<<<<<< HEAD
                    style={[Styles.campoCadastro,{flex:1,marginEnd:5}]}
                    keyboardType='number-pad'
                    onChangeText={(rg_) => setRg(rg_)}
=======
                    style={[Styles.campoCadastro,{flex:1,marginEnd:5}] }
                    value={this.state.Infrator.Rg}
>>>>>>> 10ccf74ab5ef4ad8cd492ca33b3cca8fc6b39a75
                />
                <TextInput placeholder="CPF"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{flex:1}] }
<<<<<<< HEAD
                    keyboardType='number-pad'
                    onChangeText={(cpf_) => setCpf(cpf_)}
=======
                    value={this.state.Infrator.Cpf}
>>>>>>> 10ccf74ab5ef4ad8cd492ca33b3cca8fc6b39a75
                />
              </View>
              <View style={{width:300,flexDirection:'row',marginTop:2}}>
                <DatePicker
                    format='DD/MM/YYYY'
                    style={{flex:1}}
                    date={new Date(dateNasc)}
                    onDateChange={(dateNasc_) => setDateNas(dateNasc_)}
                    mode='datetime'
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
                      style={[Styles.campoCadastro,{flex:0.5,marginTop:0,marginStart:5}] }
<<<<<<< HEAD
                      onChangeText={(sexo_) => setSexo(sexo_)}
=======
                      value={this.state.Infrator.Sexo}
>>>>>>> 10ccf74ab5ef4ad8cd492ca33b3cca8fc6b39a75
                  />
                </View>
    
                <TextInput placeholder="Nome da Mãe"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{marginTop:0}]}
<<<<<<< HEAD
                    onChangeText={(nomeMãe_) => setNomeMae(nomeMãe_)}
=======
                    value={this.state.Infrator.Mãe}
>>>>>>> 10ccf74ab5ef4ad8cd492ca33b3cca8fc6b39a75
                />
    
              <View style={{width:300,height:53,flexDirection:'row'}}>
                <TextInput placeholder="Logradouro"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{flex:1,marginEnd:5}] }
<<<<<<< HEAD
                    onChangeText={(logradouro_) => setLogradouro(logradouro_)}
=======
                    value={this.state.Infrator.Logradouro}
>>>>>>> 10ccf74ab5ef4ad8cd492ca33b3cca8fc6b39a75
                />
                <TextInput placeholder="Bairro"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{flex:1}] }
<<<<<<< HEAD
                    onChangeText={(bairro_) => setBairro(bairro_)}
=======
                    value={this.state.Infrator.Bairro}
>>>>>>> 10ccf74ab5ef4ad8cd492ca33b3cca8fc6b39a75
                />
              </View>
              <View style={{width:300,height:53,flexDirection:'row'}}>
                <TextInput placeholder="Cidade"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{flex:1,marginEnd:5}] }
<<<<<<< HEAD
                    onChangeText={(cidade_) => setCidade(cidade_)}
=======
                    value={this.state.Infrator.Cidade}
>>>>>>> 10ccf74ab5ef4ad8cd492ca33b3cca8fc6b39a75
                />
                <TextInput placeholder="UF"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{flex:0.5,marginEnd:5}] }
<<<<<<< HEAD
                    onChangeText={(uf_) => setUf(uf_)}
=======
                    value={this.state.Infrator.Uf}
>>>>>>> 10ccf74ab5ef4ad8cd492ca33b3cca8fc6b39a75
                />
                <TextInput placeholder="N°"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{flex:0.5}] }
<<<<<<< HEAD
                    keyboardType='number-pad'
                    onChangeText={(numero_)=>{setNumero(numero_)}}
=======
                    value={this.state.Infrator.Num_residência}
>>>>>>> 10ccf74ab5ef4ad8cd492ca33b3cca8fc6b39a75
                />
              </View>
            </View>
            
            <View style={{backgroundColor:'#fff',flex:1,borderRadius:10,padding:10}}>
            <Text style={{color:'#800000',fontSize:18,marginStart:8,fontFamily:"CenturyGothic"}}>Informações da infração</Text>
              <View style={{flexDirection:'row',marginTop:5}}>
                <DatePicker format="DD/MM/YYYY"
                    style={{width:150}}
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
                      }
                    }
                  }
                />
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
                  <TouchableHighlight style={[Styles.btnPrimary,{flex:1,marginHorizontal:0}]}
                    underlayColor={Colors.Primary.White}
                    onPress={() => {
                      var inf = dateInfra + " - " + descricao
                      setInfracoes([...infracoes,inf]);
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
                      Num_residência:numero, Bairro:bairro, Cidade:cidade, Uf:uf, Sexo:sexo, Data_nascimento:dateNasc                               
                    })}>
              <Text style={[Styles.btnTextSecundary,{color:"#FFF"}]}>SALVAR</Text>
            </TouchableHighlight>
            
          </View>
        </ScrollView>
     
     </SafeAreaView>      
  );
}
export default Cadastro