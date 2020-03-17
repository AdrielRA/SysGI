import React,{useState, useEffect} from 'react';
import{SafeAreaView,TouchableHighlight,Text,View, ScrollView, Alert, Linking}from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DialogInput from 'react-native-dialog-input';
import Styles from '../styles/styles';
import Colors from '../styles/colors';
import moment from 'moment';
import firebase from '../services/firebase';
import Credencial from '../controllers/credencial';
import Network  from '../controllers/network';
import * as DocumentPicker from 'expo-document-picker';
import {SwipeListView} from 'react-native-swipe-list-view';
import ItemAnexo from '../components/ItemAnexo';
import ItemAnexoSwipe from '../components/ItemAnexoSwipe';

function Anexo({navigation}) {
   const infração = navigation.getParam("item");
   const[infraKey, setInfraKey] = useState(undefined);
   const[fireList, setFireList] = useState({});
   const[lista,setLista]=useState([]);
   const[nomeAnexo,setNomeAnexo]=useState('');
   const[Anexo,setAnexo]=useState(undefined);
   const[showDialogNovoNome,setShowDiagNomeAnexo]=useState(false);

   const anexos_db = firebase.database().ref().child('anexos');
   const anexos_st = firebase.storage().ref().child('anexos');


   useEffect(() => {
      //console.log(infração.infratorKey);
      const infrações = firebase.database().ref('infratores').child(infração.infratorKey).child('Infrações');

      let query = infrações.orderByChild("Data_registro").equalTo(infração.Data_registro);
      query.once("value", (snapshot) => {
         if(snapshot.val()){
            setInfraKey(Object.keys(snapshot.val())[0]);
         }
      });
   }, [infração]);

   useEffect(() => {
      if(infraKey){
         let anexos = anexos_db.child(infração.infratorKey).child(infraKey);

         anexos.on("value", (snapshot) => {
            let results = [];
            if(snapshot.val()){
               //setFireList(Object.values(snapshot.val()));
               
               
               snapshot.forEach(function(child) {
                  if(child.val()) {
                     results.push({...child.val(), "key":child.key, "uri":'', "progress":100})
                  }
               });
            }
            setLista(results);
         });
      }
      

   }, [infraKey])


   useEffect(()=>{
      const index = lista.length - 1;
      if(index >= 0 && lista[index].status == "") upload(lista[index]);

   }, [lista]);

   useEffect(()=>{
      if(Anexo) changeNomeAnexo(Anexo);
   }, [Anexo]);

   async function upload(item){
      let anexos = anexos_db.child(infração.infratorKey).child(infraKey);
      let key = anexos.push().key;
      //console.log("KEY: " + key);
      let anexo = anexos_st.child(infração.infratorKey).child(infraKey).child(key);
      let index = lista.indexOf(item);

      try {
         const fetchResponse = await fetch(item.uri);
         const blob = await fetchResponse.blob();

         lista[index].key = key;
         lista[index].status = "up";

         anexo.put(blob)
         .on('state_changed', (snapshot) => {

            let prog = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

            if(index >= 0){
               lista[index].progress = prog;
               setLista([...lista]);
               if(lista[index].progress >= 100) { blob.close(); }
            }
         }, (error) => {console.log(error.code)
         }, () => {
            anexo.getDownloadURL().then((url) => {
            lista[index].status = url;
            setLista([...lista]);
            console.log("URL: " + lista[index].status);

            let data = {"fileName":item.fileName, "status":url};
            anexos.child(key).set(data)
            .then(() => {
               console.log("Anexado...");
            })
            .catch((err) => {
               console.log(err);
            });
         });
       })}
       catch (error) {
         console.log('ERR: ' + error.message);
       }
   }

   const getAnexo = async() => {
      if(!Network.haveInternet){
         Network.alertOffline(() => {});
         return;
       }
      if(Credencial.haveAccess(Credencial.loggedCred, Credencial.AccessToAnexar)){
         let file = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: false, type:"application/pdf"});
         if (file.type === 'cancel') { return; }
         setAnexo(file);
      }
      else Credencial.accessDenied();
   }

   function changeNomeAnexo(anexo){
      let fileName = anexo.name.toString();
      setNomeAnexo(fileName);
      Alert.alert("Opção:", "Deseja alterar o nome do anexo?", 
      [
         {
           text: 'Não',
           onPress: () => {
              addAnexo(fileName);
            },
           style: 'cancel',
         },
         {text: 'Sim', onPress: () => {
            setShowDiagNomeAnexo(true);
         }},
       ],
       {cancelable: false},)
   }

   async function addAnexo(fileName){
      fileName = maskFileName(fileName);
      let item = {"key":"", fileName, "uri":Anexo.uri.replace('file://', ''), "progress":0, "status":""};
      setLista([...lista, item]);
   }

   function maskFileName(fileName){
      fileName = fileName.replace(".pdf",'');
      if(fileName.length >= 30){
         let str = fileName.substring(0, 25);
         fileName = str + "..." + fileName.substring(fileName.length - 3, fileName.length);
      }
      return fileName + ".pdf";
   }

   function removeAnexo(item) {
      if(!Network.haveInternet){
         Network.alertOffline(() => {});
         return;
       }
      const index = lista.indexOf(item);
      console.log("KEY[" + index + "]: " + item.key);
      if (index > -1) {
         let anexo = anexos_st.child(infração.infratorKey).child(infraKey).child(item.key);
         anexo.delete().then(() =>{
            anexos_db.child(infração.infratorKey).child(infraKey).child(item.key).remove()
            .catch((err) => {
               console.log(err);
            });

            //lista.splice(index, 1);
            //setLista([...lista]);

         }).catch((err) => {console.log(err);});
      }
   }

   function openAnexo(url){
      try { Linking.openURL(url); }
      catch{Alert.alert("Falha no anexo:","Não foi possivel abri-lo no momento!")}
   }
   
   return(
      <SafeAreaView style={Styles.page}>
         <DialogInput isDialogVisible={showDialogNovoNome}
            title={"Alterar Nome do Anexo"}
            message={"Digite o novo nome:"}
            hintInput ={"Novo nome aqui"}
            submitInput={ (nome) => {setShowDiagNomeAnexo(false); setNomeAnexo(nome); addAnexo(nome)} }
            submitText={"Concluir"}
            cancelText={"Cancelar"}
            closeDialog={ () => {setShowDiagNomeAnexo(false); addAnexo(nomeAnexo)}}>
         </DialogInput>
         <LinearGradient
            start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
            locations={[0, 1]}
            colors={[Colors.Primary.Normal,Colors.Terciary.Normal]}
            style={[Styles.page, {alignSelf:"stretch", paddingTop:30}]}>
            <Text style={{textAlign:"center",color:'#fff',fontSize:25,fontFamily:'CenturyGothicBold'}}>DETALHES DA INFRAÇÃO</Text>
         </LinearGradient>
         <View style={{flex:5,alignSelf:'stretch',backgroundColor:'#fff',margin:10, marginHorizontal:15, borderRadius:10}}>
            <View style={{flexDirection:'row'}}>
               <Text style={{fontSize:18,fontFamily:'CenturyGothicBold',marginStart:11,marginTop:10,color:Colors.Secondary.Normal,flex:1}}>Registrado:</Text>
               <Text style={{fontSize:18,fontFamily:'CenturyGothicBold',marginStart:15,marginTop:10,color:Colors.Secondary.Normal,flex:1}}>Ocorrido:</Text>
            </View>
            <View style={{flexDirection:'row'}}>
               <Text style={Styles.TextAnexo}>{ moment(new Date(infração.Data_registro)).format('DD/MM/YYYY') }</Text>
               <Text style={Styles.TextAnexo}>{ moment(new Date(infração.Data_ocorrência)).format('DD/MM/YYYY') }</Text>
            </View>
            <View style={{flexDirection:"row"}}>
               <Text style={Styles.DescAnexo}>{infração.Descrição}</Text>
            </View>
            <View style={{flexDirection:"row"}}>
               <Text style={Styles.DescAnexo}>{infração.Reds}</Text>
            </View>

            
            <View style={Styles.lbAnexos}>
               <View style={Styles.btngroupAnexo}>
                  <Text style={Styles.lblAnexo}>ANEXOS</Text>
                  <TouchableHighlight style={[Styles.btnPrimary, {flex:1}]}
                     underlayColor={Colors.Primary.White}
                     onPress={getAnexo}>
                     <Text style={[Styles.btnTextPrimary, {fontSize:16}]}>ADICIONAR</Text>
                  </TouchableHighlight>
               </View>
               <ScrollView style={Styles.scrollAnexos}>
                  <SwipeListView
                     data={lista}
                     renderItem={({item})=><ItemAnexo data={{fileName:item.fileName, progress:`${item.progress}%`}} onLongPress={()=>{ openAnexo(item.status); }}/>}
                     renderHiddenItem={({item,index})=><ItemAnexoSwipe onDelete={() => removeAnexo(item)}/>}
                     leftOpenValue={40}
                     disableLeftSwipe={true}
                  />
               </ScrollView>

            </View>
            
         </View>         
      </SafeAreaView>
   );


}
export default Anexo;