import { StyleSheet } from 'react-native';
import Colors from './colors';


const Styles = StyleSheet.create({
  page:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  campo:{
    fontFamily:"CenturyGothic",
    backgroundColor:"transparent",
    color:Colors.Primary.White,
    width:300,
    paddingHorizontal:15,
    borderRadius:25,
    borderWidth:1,
    borderColor:Colors.Secondary.White,
    marginVertical:7.5,
    paddingVertical:5,
  },
 
  campoCadastro:{
    fontFamily:"CenturyGothic",
    backgroundColor:"transparent",
    color:Colors.Secondary.Normal,
    width:300,
    paddingHorizontal:15,
    borderRadius:25,
    borderWidth:1,
    borderColor:Colors.Secondary.Normal,
    marginVertical:5,
    paddingVertical:5,
  },
  
  picker:{
    fontFamily:"CenturyGothic",
    color:Colors.Primary.White,
    height:40,
  },
  pickerDiv:{
    paddingHorizontal:15,
    borderRadius:25,
    borderWidth:1,
    borderColor:Colors.Secondary.White,
    marginVertical:7.5,
  },
  btnPrimary:{
    backgroundColor:Colors.Secondary.Normal,
    borderRadius:25,
    paddingVertical:10,
    marginVertical:7.5,
    alignItems:"center"
  },
  btnTextPrimary:{
    fontFamily:"CenturyGothicBold",
    color:Colors.Secondary.White,
    fontSize:20,
    textAlign:"center"
    
  },
  btnSecundary:{
    backgroundColor:Colors.Primary.White,
    borderRadius:25,
    paddingVertical:10,
    marginVertical:7.5,
    paddingHorizontal:35,
    marginHorizontal:7.5,
    alignItems:"center"
  },
  btnTextSecundary:{
    fontFamily:"CenturyGothicBold",
    color:Colors.Secondary.Normal,
    fontSize:20,
    textAlign:"center"
    
  },
  btnTransparent:{
    backgroundColor:"transparent",
    marginVertical:7.5,
    paddingHorizontal:35,
    marginHorizontal:7.5,
    alignItems:"center"
  },
  btnTextTransparent:{
    fontFamily:"CenturyGothicBold",
    color:Colors.Primary.White,
    fontSize:15,
    textAlign:"center",        
  },
  checkbox:{
    backgroundColor:"transparent",
    borderWidth:0,
    marginVertical:7.5,
  },
  lblTitle:{
    fontFamily:"CenturyGothicBold",
    flex:2.5,
    fontSize:80,
    color:Colors.Primary.White,
    textAlign:"center",
    textAlignVertical:"center"
  },
  lblSubtitle:{
    fontFamily:"CenturyGothicBold",
    flex:2.5,
    fontSize:40,
    color:Colors.Primary.White,
    textAlign:"center",
    textAlignVertical:"center"
  },
  lblRodape:{
    fontFamily:"CenturyGothic",
    flex:0.5,
    fontSize:12,
    color:Colors.Primary.White,
    textAlign:"center",
    textAlignVertical:"center"
  },
  lblSmallR:{
    fontFamily:"CenturyGothic",
    flex:0.5,
    fontSize:12,
    textAlign:"right",
    color:Colors.Primary.White,
    textAlignVertical:"center"
  },
});

export default Styles;