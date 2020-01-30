import React from 'react';
import styled from 'styled-components/native'
import Colors from '../styles/colors'

const Item = styled.TouchableHighlight`
    height:24px;
    padding-left:10px;
    background-color:#fff
`;
 const ItemText = styled.Text`
   font-size:15px;
   flex:1;
 `;
export default (props)=>{
    return(
        <Item onLongPress={props.onLongPress} underlayColor='#dcdcdc'>
           <ItemText style={{color:Colors.Secondary.Normal,marginVertical:0}}>{props.data.Data_registro} - {props.data.Descrição}</ItemText>
        </Item>
    );
}