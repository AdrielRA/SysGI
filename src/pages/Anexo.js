import React,{useState} from 'react'
import{SafeAreaView,TouchableHighlight,Text,View}from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import Styles from '../styles/styles'
import Colors from '../styles/colors'
import DatePicker from 'react-native-datepicker'
import { TextInput } from 'react-native-gesture-handler';
function Anexo({navigation}) {
   const[date,setdate]=useState('');
   const item = navigation.getParam("item");
   return(
      <SafeAreaView style={Styles.page}>
           <LinearGradient
               start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
               locations={[0, 1]}
               colors={[Colors.Primary.Normal,Colors.Terciary.Normal]}
               style={{ flex:1,alignSelf:'stretch',paddingTop:20,justifyContent:"center"}}>
               <Text style={{textAlign:"center",color:'#fff',fontSize:25,fontFamily:'CenturyGothicBold'}}>DETALHES DA INFRAÇÃO</Text>
            </LinearGradient>
           
            <View style={{flex:5,alignSelf:'stretch',backgroundColor:'#fff',margin:10}}>
                  <View style={{flexDirection:'row'}}>
                     <Text style={{fontSize:18,fontFamily:'CenturyGothicBold',marginStart:11,marginTop:10,color:Colors.Secondary.Normal,flex:1}}>Data registro</Text>
                     <Text style={{fontSize:18,fontFamily:'CenturyGothicBold',marginStart:15,marginTop:10,color:Colors.Secondary.Normal,flex:1}}>Data da Infração</Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                      <TextInput
                          placeholder="00/00/00"
                          placeholderTextColor={Colors.Secondary.Normal}
                          style={Styles.TextInputAnexo}
                          value={item.Data_registro}
                     />  
                       <TextInput
                          placeholder="00/00/00"
                          placeholderTextColor={Colors.Secondary.Normal}
                          style={Styles.TextInputAnexo}
                          value={item.Data_ocorrência}
                      />  
                  </View>
                  <View style={{flexDirection:'row'}}>
                     <TextInput placeholder="Descrição da infração"
                     placeholderTextColor={Colors.Secondary.Normal}
                     style={Styles.DescAnexo}
                     multiline={true}
                     textAlignVertical='top'
                     fontSize={15}
                     value={item.Descrição}
                     />
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <TouchableHighlight style={Styles.BtnAnexo}
                        underlayColor={Colors.Primary.White}
                        onPress={() => {
                           navigation.navigate('')
                        }}>
                        <Text style={[Styles.btnTextSecundary,{color:Colors.Secondary.White,fontSize:13}]}>ADICIONAR</Text>
                    </TouchableHighlight>

                     <TouchableHighlight style={Styles.BtnAnexo}
                        underlayColor={Colors.Primary.White}
                        onPress={() => {
                        navigation.navigate('')
                        }}>
                        <Text style={[Styles.btnTextSecundary,{color:Colors.Secondary.White,fontSize:13}]}>REMOVER</Text>
                     </TouchableHighlight>
                  </View>

                  <View style={{flexDirection:'row'}}>
                     <TextInput placeholder="Anexos"
                        placeholderTextColor={Colors.Secondary.Normal}
                        style={Styles.DescAnexo}
                        multiline={true}
                        textAlignVertical='top'
                     />
                  </View>
              </View>  
         
      </SafeAreaView>
   );


}
export default Anexo;