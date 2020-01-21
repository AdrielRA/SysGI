import React,{useState} from 'react'
import{SafeAreaView,TouchableHighlight,Text,View}from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import Styles from '../styles/styles'
import Colors from '../styles/colors'
import DatePicker from 'react-native-datepicker'
function Anexo({navigation}) {
   const[date,setdate]=useState('');
   return(
      <SafeAreaView style={Styles.page}>
        <LinearGradient
            start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
            locations={[0, 1]}
            colors={[Colors.Primary.Normal,Colors.Terciary.Normal]}
            style={{alignSelf:'stretch'}}>
           

        </LinearGradient>
      </SafeAreaView>
   );


}
export default Anexo;