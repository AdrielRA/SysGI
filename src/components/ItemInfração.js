import React from 'react';
import { View, Image, Text, Alert, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Styles from '../styles/styles';
import Colors from '../styles/colors';

function ItemInfração({infração, onClick}){
  return(
    <View style={{flexDirection:"row", alignSelf:"stretch", borderBottomWidth:2, borderBottomColor: Colors.Secondary.White, padding:5, paddingHorizontal:10}}>
      <View style={{flex:1, alignItems:"center"}}>
        <View style={{alignSelf:"stretch", flexDirection:"row"}}>
          <Text style={Styles.txtBold}>Descrição: </Text>
          <Text style={Styles.txtRegular}>{infração.Descrição}</Text>
        </View>
        <View style={{alignSelf:"stretch", flexDirection:"row"}}>
          <Text style={Styles.txtBold}>Data: </Text>
          <Text style={Styles.txtRegular}>
            { moment(new Date(infração.Data_ocorrência)).format('DD/MM/YYYY') }
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => { onClick(); }}>
        <Image style={{width:40, height:40, borderRadius:5}} source={require('../assets/images/icon-mais.png')}></Image>
      </TouchableOpacity> 
      
    </View> 
  );
}

export default ItemInfração;
