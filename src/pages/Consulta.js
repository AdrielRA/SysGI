import React, { useState } from 'react';
import { View, Image, ScrollView, Text, TouchableHighlight } from 'react-native';
import { Stitch } from "mongodb-stitch-react-native-sdk";
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from 'react-native-elements';
import ItemInfração from '../components/ItemInfração'
import Styles from '../styles/styles';
import Colors from '../styles/colors';

function Consulta({navigation}) {
  const [TermoPesquisa, setTermoPesquisa] = useState('');

  return (
    <View style={Styles.page}>
      <LinearGradient
        start={{x: 0.0, y: 0.25}} end={{x: 1, y: 1.0}}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal,Colors.Secondary.Normal]}
        style={{flex:1, alignSelf:"stretch", paddingTop:30}}>
        <Text style={Styles.lblSubtitle}>CONSULTA</Text>
      </LinearGradient>
      <Text style={Styles.searchRG}>RG</Text>
      <SearchBar lightTheme placeholder="Pesquisar Infrator" placeholderTextColor={Colors.Secondary.Normal}
          containerStyle={Styles.searchContent}
          inputStyle={Styles.searchInput}
          round={true}
          inputContainerStyle={{backgroundColor:'transparent'}}
          searchIcon={{ iconStyle:{ color:Colors.Primary.Normal}}}
          clearIcon={{ iconStyle:{ color:Colors.Primary.Normal}}}
          value={TermoPesquisa}
          keyboardType="numeric"
          onChangeText={(termo) => setTermoPesquisa(termo)}
          ></SearchBar>
      <View style={{flex:6, alignSelf:"stretch", marginTop:20}}>
        <View style={{alignSelf:"stretch", marginHorizontal:15, backgroundColor:Colors.Primary.Normal,
              borderRadius:20, marginVertical:15,}}>
          <View style={{flexDirection:"row", alignSelf:"stretch"}}>
            <View style={{flex:1, alignSelf:"stretch", alignItems:"center", paddingVertical:10}}>
              <Text style={Styles.txtBoldWhite}>Ultima Infração</Text>
              <Text style={Styles.txtRegularWhite}>00/00/0000</Text>
            </View>
            <View style={{backgroundColor:"#fff", width:2}}></View>
            <View style={{flex:1, alignSelf:"stretch", alignItems:"center", paddingVertical:10}}>
              <Text style={Styles.txtBoldWhite}>Status</Text>
              <Text style={Styles.txtRegularWhite}>Reincidente</Text>
            </View>
          </View>
          <View style={{backgroundColor:Colors.Terciary.White, alignSelf:"stretch",
              padding:15, borderRadius:20, flexDirection:"row"}}>
            <View style={{flex:1}}>
              <View style={{alignSelf:"stretch", flexDirection:"row"}}>
                <Text style={Styles.txtBold}>Nome: </Text>
                <Text style={Styles.txtRegular}>Fulano da Silva</Text>
              </View>
              <View style={{alignSelf:"stretch", flexDirection:"row"}}>
                <Text style={Styles.txtBold}>CPF: </Text>
                <Text style={Styles.txtRegular}>000.000.000-00</Text>
              </View>
              <View style={{alignSelf:"stretch", flexDirection:"row"}}>
                <Text style={Styles.txtBold}>RG: </Text>
                <Text style={Styles.txtRegular}>00.000.000</Text>
              </View>
              
            </View>
            <Image style={{height:60, width:60, borderRadius:5}} source={require('../assets/images/edit-icon.png')}></Image>
          </View>
        </View>
        <View style={{flex:1, alignSelf:"stretch", marginHorizontal:15, borderRadius:20, backgroundColor:Colors.Primary.White, paddingVertical:20, marginBottom:15}}>
            <ScrollView style={{flex:1, alignSelf:"stretch"}}>
              <ItemInfração infração={{Descrição:"Descrição 1", Data_ocorrência:"00/00/0001"}}/>
              <ItemInfração infração={{Descrição:"Descrição 2", Data_ocorrência:"00/00/0002"}}/> 
              <ItemInfração infração={{Descrição:"Descrição 3", Data_ocorrência:"00/00/0003"}}/> 
              <ItemInfração infração={{Descrição:"Descrição 4", Data_ocorrência:"00/00/0004"}}/> 
              <ItemInfração infração={{Descrição:"Descrição 5", Data_ocorrência:"00/00/0005"}}/> 
              <ItemInfração infração={{Descrição:"Descrição 6", Data_ocorrência:"00/00/0006"}}/> 
              <ItemInfração infração={{Descrição:"Descrição 7", Data_ocorrência:"00/00/0007"}}/> 
            </ScrollView>
          </View>
      </View>
    </View>
    
  );
}

export default Consulta;