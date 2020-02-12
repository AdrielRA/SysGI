import React,{useState,useEffect} from 'react';
import { View,Text,SafeAreaView,TextInput,TouchableHighlight,ScrollView, Alert, Image} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Styles from '../styles/styles';
import Colors from '../styles/colors';
import DatePicker from 'react-native-datepicker'
import moment from 'moment'
import Credencial from '../controllers/credencial';
import {SwipeListView} from 'react-native-swipe-list-view'
import ListaItem from '../components/ListaItem'
import ListaItemSwipe from '../components/ListaItemSwipe'
import firebase from '../services/firebase';
import Network  from '../controllers/network';

function Cadastro({navigation})
{
  const infrator_ = navigation.getParam("Infrator");
  const infratores = firebase.database().ref('infratores');

  const[infratorKey, setInfratorKey]=useState(undefined);
  const[isNew, setIsNew]=useState(true);
  const[fireInfrações, setFireInfrações]=useState({});
  const[favorito, setFavorito]=useState(undefined);
  const[dateNasc,setDateNas]=useState(new Date());
  const[dateInfra,setDateInfra]=useState(new Date());
  const[isSaved, setIsSaved]=useState(false);

  const [infrator, setInfrator]=useState({
    "Nome":"", "Cpf":"", "Rg":"", "Mãe":"", "Logradouro":"",
    "Num_residência":"", "Bairro":"", "Cidade":"", "Uf":"", "Sexo":"",
    "Data_nascimento":new Date().toISOString(), "Data_registro":"","Infrações":[]
  });
  const [infração, setInfração] = useState({
    "Descrição":"",
    "Data_ocorrência": new Date().toISOString(),
    "Data_registro": "",
  });
  
  
  useEffect(() => {
    if(infrator_){
      setInfrator(infrator_);
      setIsNew(false);
      setIsSaved(true);
      setDateNas(moment(new Date(infrator_.Data_nascimento)).format('DD/MM/YYYY'));

      let query = infratores.orderByChild("Rg").equalTo(infrator_.Rg);
      query.once("value", function(snapshot) {
        if(snapshot.val() != null)
        {
          snapshot.forEach(function(child) {
            if(child.val()) {
              setInfratorKey(child.key);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if(infratorKey){
      infratores.child(infratorKey).on("value", (snapshot) => {
        if(snapshot.val() != null)
        {
          let infrator = snapshot.val();
          let infras = [];
          setFireInfrações(snapshot.val().Infrações);
          if(snapshot.val().Infrações){
            infras = Object.values(snapshot.val().Infrações);
          }
          infrator.Infrações = infras;
          setInfrator(infrator);
        }
        else {
          infratores.child(infratorKey).off("value");
          Alert.alert("Infrator não Encontrado!", "Provavelmente ele foi removido por alguém!");
          navigation.goBack();
        }
      });
      setFavorito(null);
    }
  }, [infratorKey]);

  const camposOk = (infrator)=>{
    let msg = "";
    if(!infrator.Nome || infrator.Nome == "") msg = "Nome fornecido é inválido!";
    else if(!infrator.Rg || infrator.Rg == "") msg = "RG fornecido é inválido!";
    else if(!infrator.Cpf || infrator.Cpf == "") msg = "CPF fornecido é inválido!";
    else if(!infrator.Data_nascimento || infrator.Data_nascimento == "") msg = "Data de nascimento fornecida é inválida!";
    else if(!infrator.Sexo || infrator.Sexo == "") msg = "Sexo fornecido é inválido!";
    else if(!infrator.Mãe || infrator.Mãe == "") msg = "Nome da mãe fornecido é inválido!";
    else if(!infrator.Logradouro || infrator.Logradouro == "") msg = "Logradouro fornecido é inválido!";
    else if(!infrator.Bairro || infrator.Bairro == "") msg = "Bairro fornecido é inválido!";
    else if(!infrator.Cidade || infrator.Cidade == "") msg = "Cidade fornecida é inválida!";
    else if(!infrator.Uf || infrator.Uf == "") msg = "Estado fornecido é inválido!";
    else if(!infrator.Num_residência || infrator.Num_residência == "") msg = "Nº de residência fornecido é inválido!";

    if(msg != "") Alert.alert("Verifique os dados:", msg);
    return msg == "";
  }

  const dadosOk = async (infrator)=>{

    let res = false;

    let snapshot = await infratores.orderByChild('Rg').equalTo(infrator.Rg).once("value");
    if(snapshot.exists())
    {
      Alert.alert("Verifique os dados:", "RG fornecido já foi cadastrado em outro infrator!");
      res = false;
    } 
    else{
      snapshot =  await infratores.orderByChild('Cpf').equalTo(infrator.Cpf).once("value");
      if(snapshot.exists())
        Alert.alert("Verifique os dados:", "CPF fornecido já foi cadastrado em outro infrator!");
      res = !snapshot.exists();
    }

    return res;
  }


  const saveInfrator = (infrator)=>{
    if(!Network.haveInternet){
      Network.alertOffline(() => {});
      return;
    }

    
    if(!camposOk(infrator)) { return; }
    
    if(isNew){
      dadosOk(infrator).then((ok) => {
        if(!ok) return;
        else {
          if(Credencial.haveAccess(Credencial.loggedCred, Credencial.AccessToCadastro)){
            if(!infrator.Data_registro){
              setInfrator({...infrator, "Data_registro":new Date().toISOString()})
            }
            
            let key = infratores.push().key;
            infratores.child(key).set(infrator).then(() => {
              Alert.alert("Sucesso:", "Infrator salvo!");
              setInfratorKey(key);
              setIsNew(false);
              setIsSaved(true);
            })
            .catch((err) => {
              Alert.alert("Falha:", "Não foi possivel salvar o infrator!");
            });
          }
          else Credencial.accessDenied();
        }
      });
    }
    else {
      if(Credencial.haveAccess(Credencial.loggedCred, Credencial.AccessToEditar)){
        infratores.child(infratorKey).set(JSON.parse( JSON.stringify({...infrator, "Infrações":fireInfrações}))).then(() => {
          Alert.alert("Sucesso:", "Infrator atualizado!");
        })
        .catch((err) => {
          Alert.alert("Falha:", "Infrator não foi atualizado!");
        });
      }
    }
 }

  const saveInfração = () => {
    if(!Network.haveInternet){
      Network.alertOffline(() => {});
      return;
    }

    if(Credencial.haveAccess(Credencial.loggedCred, Credencial.AccessToInfração)){
      if(infração.Descrição == "") {
        Alert.alert("Atenção:", "Adicione uma descrição primeiro!");
        return;
      }
  
      const infrações = infratores.child(infratorKey).child('Infrações');
  
      let key = infrações.push().key;
      infrações.child(key).set({...infração})
      .then(() => {
        setInfração({...infração, "Descrição":""})
        Alert.alert("Sucesso:", "Infração adicionada!");
      })
      .catch((err) => {
        Alert.alert("Falha:", "Infração não foi adicionada!");
      });
    }
    else Credencial.accessDenied();
  }

  const excluirInfrator = () => {
    if(!Network.haveInternet){
      Network.alertOffline(() => {});
      return;
    }

    if(Credencial.haveAccess(Credencial.loggedCred, Credencial.AccessToDelete)){
      Alert.alert("Tem certeza?", "Os dados deste infrator serão perdidos para sempre!",
      [
        {
          text: 'Não',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'Sim', onPress: () => {
          infratores.child(infratorKey).remove().then(() => {
            removeAnexos("Sucesso:", "Infrator removido!", '', true);
            setFavorito(false);
            removeAllFavorites(infratorKey);
          }).catch((err) => {
            Alert.alert("Falha:", "Infrator não foi removido!");
          });
        }},
      ],
      {cancelable: false},
      );
    }
    else Credencial.accessDenied();
  }

  const favoritar = () => {
    if(!Network.haveInternet){
      Network.alertOffline(() => {});
      return;
    }
    setFavorito(!favorito);
  }

  const removeAllFavorites = (key) => {
    
    firebase.database().ref().child('users').orderByChild("Infratores_favoritados").startAt("")
    .once("value", (snapshot) => {
      snapshot.forEach(user => {
        user.ref.child("Infratores_favoritados").set(user.val().Infratores_favoritados.filter(e => e != key));
      });
    });
  }

  useEffect(() => {

    if(favorito === undefined) return;

    let userId = firebase.auth().currentUser.uid;
    let user = firebase.database().ref().child('users').child(userId);
    let favoritos = user.child('Infratores_favoritados');

    if(favorito === null){
      favoritos.once("value", (snapshot) => {
        let favs = [];
        if(snapshot.val()){ favs = snapshot.val(); }
        setFavorito(favs.includes(infratorKey.toString()));
      });
      return;
    }

    if(favorito){
      favoritos.once("value", (snapshot) => {
        let favs = [];
        if(snapshot.val()){ favs = snapshot.val(); }
        if(!favs.includes(infratorKey)) favs.push(infratorKey);
        favoritos.set(favs);
      });
    }
    else{
      favoritos.once("value", (snapshot) => {
        let favs = [];
        if(snapshot.val()){ favs = snapshot.val(); }
        if(favs.includes(infratorKey)) favs = favs.filter((infra_) => {infra_ != infratorKey});
        favoritos.set(favs);
      });
    }
  }, [favorito])
  
  const deleteItem = (item, index) =>{
    if(!Network.haveInternet){
      Network.alertOffline(() => {});
      return;
    }
    if(Credencial.haveAccess(Credencial.loggedCred, Credencial.AccessToInfração)){
      const infrações = infratores.child(infratorKey).child('Infrações');

      let query = infrações.orderByChild("Data_registro").equalTo(item.Data_registro);
      query.once("value", (snapshot) => {
        if(snapshot.val()){
          let infra_key = Object.keys(snapshot.val())[0];
  
          infrações.child(infra_key).remove().then(() => {
            removeAnexos("Sucesso:", "Infração removida!", infra_key, false);
          })
          .catch((err) => {
            Alert.alert("Falha:", "Infração não foi removida!");
          });
        }
      });
    }
    else Credencial.accessDenied();    
  }

  const removeAnexos = (title, msg, infra_key, del_all) => {
    if(del_all){
      firebase.database().ref().child('anexos').child(infratorKey)
      .remove().then(() => {
        deleteRecursiveFiles(infratorKey + "/");
      });
    }
    else{
      firebase.database().ref().child('anexos').child(infratorKey).child(infra_key)
      .remove().then(() => {
        deleteRecursiveFiles(infratorKey + "/" + infra_key);
      });
    }
  }

  const deleteRecursiveFiles = (path) => {
    const ref = firebase.storage().ref().child('anexos').child(path);
    ref.listAll()
      .then(dir => {
        dir.items.forEach(fileRef => {
          console.log("Files: " + fileRef.name);
          deleteFile(ref.fullPath, fileRef.name);
        });
        dir.prefixes.forEach(folderRef => {
          console.log("Folders: " + folderRef.fullPath);
          deleteRecursiveFiles(folderRef.fullPath.replace('anexos/', ''));
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  const deleteFile = (pathToFile, fileName) => {
    const ref = firebase.storage().ref(pathToFile);
    const childRef = ref.child(fileName);
    childRef.delete()
  }
  
  const NavigationToAttachment = (infração_) =>{
    if(isSaved){ 
      if(!Network.haveInternet){
        Network.alertOffline(() => {});
        return;
      }
      if(Credencial.haveAccess(Credencial.loggedCred, Credencial.AccessToAnexar))
        navigation.navigate('Anexo',{ item: {...infração_, infratorKey} });
      else Credencial.accessDenied();
    }
    else{ Alert.alert("Atenção:", "Salve suas alterações primeiro!"); }      
  }
  
  return (
    <SafeAreaView style={Styles.page}>
      
        <LinearGradient
          start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
          locations={[0, 1]}
          colors={[Colors.Primary.Normal,Colors.Terciary.Normal]}
          style={{ flex:1,alignSelf:'stretch',padding:30, paddingBottom:10}}>
          <Text style={[Styles.lblSubtitle,{fontSize:25, flex:0.75}]}>CADASTRO DE INFRATOR</Text>
          <View style={{flex:6}}>
            <View style={{backgroundColor:'#fff',flex:2,marginBottom:5,borderRadius:10,paddingHorizontal:10,paddingTop:5}}>
              <Text style={{color:'#800000',fontSize:18,marginStart:10,fontFamily:"CenturyGothicBold"}}>Informações pessoais</Text>
              <ScrollView>
                <View style={{flexDirection:"row"}}>
                  <TextInput placeholder="Nome"
                    autoCapitalize="words"
                    textContentType="name"
                    keyboardType="name-phone-pad"
                    returnKeyType="next"
                    autoCompleteType="name"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={Styles.campoCadastro}
                    value={infrator.Nome}
                    autoFocus={true}
                    maxLength={60}
                    onChangeText={(nome) => setInfrator({...infrator, "Nome":nome})}/>
                </View>
                <View style={{flexDirection:'row'}}>
                  <TextInput placeholder="RG"
                    placeholderTextColor={Colors.Secondary.Normal}
                    returnKeyType="next"
                    style={[Styles.campoCadastro,{marginEnd:3}]}
                    value={infrator.Rg}
                    maxLength={13}
                    editable={isNew}
                    keyboardType='number-pad'
                    onChangeText={(rg) => setInfrator({...infrator, "Rg":rg})}
                    onEndEditing={() => {}}/>
                  <TextInput placeholder="CPF"
                    placeholderTextColor={Colors.Secondary.Normal}
                    returnKeyType="next"
                    style={Styles.campoCadastro}
                    value={infrator.Cpf}
                    maxLength={11}
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
                      setInfrator({...infrator, "Data_nascimento":new Date(`${dt[2]}-${dt[1]}-${dt[0]}T10:00:00`).toISOString()})
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
                      returnKeyType="next"
                      style={[Styles.campoCadastro,{flex:1.5}]}
                      value={infrator.Sexo}
                      maxLength={1}
                      onChangeText={(sexo) => {
                        sexo = sexo.toUpperCase();
                        if(sexo != 'M' && sexo != 'F' && sexo != 'O'){ sexo = ''; }
                        setInfrator({...infrator, "Sexo":sexo})
                      }}/>
                </View>
                <View style={{flexDirection:"row"}}>
                  <TextInput placeholder="Nome da Mãe"
                    placeholderTextColor={Colors.Secondary.Normal}
                    returnKeyType="next"
                    autoCapitalize="words"
                    autoCompleteType="name"
                    style={Styles.campoCadastro}
                    value={infrator.Mãe}
                    maxLength={60}
                    onChangeText={(mãe) => setInfrator({...infrator, "Mãe":mãe})}/>
                </View>
                <View style={{flexDirection:'row'}}>
                  <TextInput placeholder="Logradouro"
                    placeholderTextColor={Colors.Secondary.Normal}
                    returnKeyType="next"
                    textContentType="fullStreetAddress"
                    autoCompleteType="street-address"
                    style={[Styles.campoCadastro,{flex:1,marginEnd:3}] }
                    value={infrator.Logradouro}
                    maxLength={120}
                    onChangeText={(logradouro) => setInfrator({...infrator, "Logradouro":logradouro})}/>
                  <TextInput placeholder="Bairro"
                    placeholderTextColor={Colors.Secondary.Normal}
                    returnKeyType="next"
                    autoCapitalize="words"
                    textContentType="sublocality"
                    style={[Styles.campoCadastro,{flex:1}] }
                    value={infrator.Bairro}
                    maxLength={60}
                    onChangeText={(bairro) => setInfrator({...infrator, "Bairro":bairro})}/>
                </View>
                <View style={{flexDirection:'row'}}>
                  <TextInput placeholder="Cidade"
                    placeholderTextColor={Colors.Secondary.Normal}
                    returnKeyType="next"
                    autoCapitalize="words"
                    textContentType="addressCity"
                    autoCompleteType="street-address"
                    style={[Styles.campoCadastro,{flex:1,marginEnd:3}] }
                    value={infrator.Cidade}
                    maxLength={50}
                    onChangeText={(cidade) => setInfrator({...infrator, "Cidade":cidade})}/>
                  <TextInput placeholder="UF"
                    placeholderTextColor={Colors.Secondary.Normal}
                    returnKeyType="next"
                    autoCapitalize="characters"
                    textContentType="addressState"
                    style={[Styles.campoCadastro,{flex:0.5,marginEnd:3}] }
                    value={infrator.Uf}
                    maxLength={2}
                    onChangeText={(uf) => setInfrator({...infrator, "Uf":uf.toUpperCase()})}/>
                  <TextInput placeholder="N°"
                    placeholderTextColor={Colors.Secondary.Normal}
                    style={[Styles.campoCadastro,{flex:0.5}] }
                    value={infrator.Num_residência}
                    keyboardType='number-pad'
                    maxLength={10}
                    onChangeText={(numero)=> setInfrator({...infrator, "Num_residência":numero})}/>
                </View>
              </ScrollView>              
              <View style={{flexDirection:"row", alignSelf:"stretch"}}>
                <TouchableHighlight style={[Styles.btnSecundary,{

                  paddingHorizontal: isSaved?"17%" : "36%", backgroundColor:"#800",marginHorizontal:0}]}
                  underlayColor={Colors.Primary.Normal}
                  onPress={() => saveInfrator(infrator)}>
                  <Text style={[Styles.btnTextSecundary,{color:"#FFF"}]}>SALVAR</Text>
                </TouchableHighlight>
                {isSaved ? (
                  <View style={{flexDirection:"row"}}>
                    <TouchableHighlight style={[Styles.btnSecundary,{backgroundColor:"#800",marginHorizontal:5, justifyContent:"center", paddingHorizontal:15}]}
                      underlayColor={Colors.Primary.Normal}
                      onPress={() => favoritar()}>
                      {favorito ? (<Image style={{height:20, width:20}} source={require('../assets/images/icon_favorite_on.png')} ></Image>) 
                      : (<Image style={{height:20, width:20}} source={require('../assets/images/icon_favorite_off.png')} ></Image>)}
                    </TouchableHighlight>
                    <TouchableHighlight style={[Styles.btnSecundary,{backgroundColor:"#800",marginHorizontal:0, justifyContent:"center", paddingHorizontal:15}]}
                      underlayColor={Colors.Primary.Normal}
                      onPress={() => excluirInfrator()}>
                      <Image style={{height:20, width:20}} source={require('../assets/images/icon_lixeira_white.png')} ></Image>
                    </TouchableHighlight>
                  </View>
                ) : (<></>)}
                
              </View>
            </View>
            {isSaved ? (<View style={{backgroundColor:'#fff',flex:1,borderRadius:10,padding:10}}>
              <Text style={{color:'#800000',fontSize:18,marginStart:10,fontFamily:"CenturyGothicBold"}}>Informações da infração</Text>
              <View style={{flexDirection:'row',marginTop:5}}>
                <TextInput 
                  placeholder="Descrição"
                  placeholderTextColor={Colors.Secondary.Normal}
                  style={[Styles.campoCadastro,{borderRadius:25,paddingTop:10,marginTop:0}] }
                  multiline={true}
                  value={infração.Descrição}
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
                    setInfração({...infração, "Data_ocorrência":new Date(`${dt[2]}-${dt[1]}-${dt[0]}T10:00:00`).toISOString()})
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
                    let infra = infração;
                    infra.Data_registro = new Date().toISOString();
                    setInfração(infra);
                    saveInfração();
                  }}>
                  <Text style={[Styles.btnTextSecundary,{color:Colors.Secondary.White,fontSize:13}]}>ADICIONAR</Text>
                </TouchableHighlight>
              </View>
              <View style={{alignSelf:'stretch',borderWidth:1,borderRadius:25,borderColor:'#DCDCDC',height:60,padding:10}}>
                <ScrollView style={{height:60, borderRadius:15}}>
                  <SwipeListView
                    data={infrator.Infrações}
                    renderItem={({item})=><ListaItem data={item} onLongPress={()=>{NavigationToAttachment(item)}}/>}
                    renderHiddenItem={({item,index})=><ListaItemSwipe onDelete={()=>{deleteItem(item, index)}}/>}
                    leftOpenValue={30}
                    disableLeftSwipe={true}/>
                </ScrollView>
                
              </View>
            </View>) : (<View style={{flex:1}}></View>)}
          </View>
        </LinearGradient>
    </SafeAreaView>      
  );
}
export default Cadastro;