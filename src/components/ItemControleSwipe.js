import React from 'react'
import styled from 'styled-components/native'
import {Image } from 'react-native'

const ItemControleSwipe = styled.TouchableHighlight`
  width:100%;
  height:100px;
  margin-bottom:5px;
  padding-top:7.5px;
  padding-left:7.5px;
  background-color:#fff;
  align-items:flex-start;
 `;
 const Lixeira = styled.TouchableHighlight`
  margin:auto;
  margin-left:5%;
`;
const Confirma = styled.TouchableHighlight`
 margin:auto;
 margin-right:7%;
`;
 const ItemView = styled.View`
  width:100%;
  height:100%;
  align-items:center;
  flex-direction:row;
`;
 const Icon = styled.Image`
   width:20px;
   height:20px;
 `;
 
 
export default (props)=>{
    return(
        <ItemControleSwipe  >
          <ItemView>
            <Lixeira underlayColor={"#ffeded"} onPress={props.onDelete}>
              <Icon source={require('../assets/images/icon_lixeira_cor.png')}></Icon>
            </Lixeira>
            <Confirma underlayColor={"#ffeded"} onPress={props.onConfirm}>
              <Icon source={require('../assets/images/icon_check.png')}></Icon>
            </Confirma>
          
            
          </ItemView>
        </ItemControleSwipe>
    );
}