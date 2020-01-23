import React,{useState} from 'react';
import { View,Text, Button,SafeAreaView,TextInput,TouchableHighlight,ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Styles from '../styles/styles';
import Colors from '../styles/colors';
import DatePicker from 'react-native-datepicker'

export default class App extends React.Component 
{
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
  }
  selectDate1 = (date)=>{
    this.setState({date1: date});
  }
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
                  value={this.state.Infrator.Nome}
              />
              <View style={{width:300,height:53,flexDirection:'row'}}>
                <TextInput placeholder="RG"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{flex:1,marginEnd:5}] }
                    value={this.state.Infrator.Rg}
                />
                <TextInput placeholder="CPF"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{flex:1}] }
                    value={this.state.Infrator.Cpf}
                />
              </View>
              <View style={{width:300,flexDirection:'row',marginTop:2}}>
                <DatePicker format="DD/MM/YYYY"
                    style={{flex:1}}
                    date={this.state.date}
                    onDateChange={this.selectDate}
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
                      value={this.state.Infrator.Sexo}
                  />
                </View>
    
                <TextInput placeholder="Nome da Mãe"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{marginTop:0}]}
                    value={this.state.Infrator.Mãe}
                />
    
              <View style={{width:300,height:53,flexDirection:'row'}}>
                <TextInput placeholder="Logradouro"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{flex:1,marginEnd:5}] }
                    value={this.state.Infrator.Logradouro}
                />
                <TextInput placeholder="Bairro"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{flex:1}] }
                    value={this.state.Infrator.Bairro}
                />
              </View>
              <View style={{width:300,height:53,flexDirection:'row'}}>
                <TextInput placeholder="Cidade"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{flex:1,marginEnd:5}] }
                    value={this.state.Infrator.Cidade}
                />
                <TextInput placeholder="UF"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{flex:0.5,marginEnd:5}] }
                    value={this.state.Infrator.Uf}
                />
                <TextInput placeholder="N°"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{flex:0.5}] }
                    value={this.state.Infrator.Num_residência}
                />
              </View>
            </View>
            
            <View style={{backgroundColor:'#fff',flex:2,borderRadius:10,padding:10}}>
             <Text style={{color:'#800000',fontSize:18,marginStart:8,fontFamily:"CenturyGothic"}}>Informações da infração</Text>
              <View style={{flexDirection:'row',marginTop:5}}>
                <DatePicker format="DD/MM/YYYY"
                    style={{width:150}}
                    date={this.state.date1}
                    onDateChange={this.selectDate1}
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
                <TextInput placeholder="Descrição"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{height:80,width:150,borderRadius:25,paddingTop:10,marginTop:0,marginStart:5}] }
                    multiline={true}
                    textAlignVertical='top'
                />
                </View>

                <View style={{flexDirection:'row',justifyContent:"center"}}>
                  <TouchableHighlight style={[Styles.btnPrimary,{width:150,marginHorizontal:0,marginEnd:5}]}
                    underlayColor={Colors.Primary.White}
                    onPress={() => {
                      navigation.navigate('')
                    }}>
                    <Text style={[Styles.btnTextSecundary,{color:Colors.Secondary.White,fontSize:13}]}>ADICIONAR</Text>
                  </TouchableHighlight>
                  <TouchableHighlight style={[Styles.btnPrimary,{width:150,marginHorizontal:0}]}
                    underlayColor={Colors.Primary.White}
                    onPress={() => {
                      navigation.navigate('')
                    }}>
                    <Text style={[Styles.btnTextSecundary,{color:Colors.Secondary.White,fontSize:13}]}>REMOVER</Text>
                  </TouchableHighlight>
                </View>
                <TextInput style={[Styles.campoCadastro,{height:80,width:300,borderRadius:25,paddingTop:10}] }
                    multiline={true}
                    textAlignVertical='top'
                />
            </View>
            <TouchableHighlight style={[Styles.btnSecundary,{backgroundColor:"#800",marginHorizontal:0}]}
                    underlayColor={Colors.Primary.White}
                    onPress={() => {
                      navigation.navigate("Usuario Salvo")
                    }}>
              <Text style={[Styles.btnTextSecundary,{color:"#FFF"}]}>SALVAR</Text>
            </TouchableHighlight>
            
          </View>
        </ScrollView>
       
       </SafeAreaView>      
    );
  }
}