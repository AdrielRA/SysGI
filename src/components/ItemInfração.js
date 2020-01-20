import React from 'react';
import { View, Image, Text } from 'react-native';
import Styles from '../styles/styles';
import Colors from '../styles/colors';

function ItemInfração({infração}){
  return(
    <View style={{flexDirection:"row", alignSelf:"stretch", borderBottomWidth:2, borderBottomColor: Colors.Secondary.White, padding:5, paddingHorizontal:10}}>
      <View style={{flex:1, alignItems:"center"}}>
        <View style={{alignSelf:"stretch", flexDirection:"row"}}>
          <Text style={Styles.txtBold}>Descrição: </Text>
          <Text style={Styles.txtRegular}>{infração.Descrição}</Text>
        </View>
        <View style={{alignSelf:"stretch", flexDirection:"row"}}>
          <Text style={Styles.txtBold}>Data: </Text>
          <Text style={Styles.txtRegular}>{infração.Data_ocorrência}</Text>
        </View>
      </View>
      <Image style={{width:40, height:40, borderRadius:5}} source={require('../assets/images/icon-mais.png')}></Image>
    </View> 
  );
}

export default ItemInfração;
