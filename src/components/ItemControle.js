import React, {useState} from 'react';
import styled from 'styled-components/native'
import Colors from '../styles/colors'

const ItemControle = styled.TouchableHighlight`
    height:80px;
    margin-bottom:5px;
    background-color:#fff;
    padding-left:4%;
    padding-right:4%;
    justify-content:center;
`;
const ItemView = styled.View`
   
   align-self:flex-start;
   
 `;
 const ItemText = styled.Text`
   font-size:15px;
   text-align-vertical:center;
   font-weight:bold;
   align-self:flex-start;
 `;
export default (props)=>{
    return(
        <ItemControle onLongPress={props.onLongPress} underlayColor='#dcdcdc'>
            <ItemView>
                <ItemText style={{color:Colors.Secondary.Normal,marginVertical:0}}>{props.data.Nome}</ItemText>
                <ItemText style={{color:Colors.Secondary.Normal,marginVertical:0}}>{props.data.Telefone}</ItemText>
                <ItemText style={{color:Colors.Secondary.Normal,marginVertical:0}}>
                {
                  props.data.Credencial < 0 ?
                  (props.data.Credencial == -1 ? 'Professor' :(
                    props.data.Credencial == -2 ? 'Advogado' :(
                      props.data.Credencial == -3 ? 'Policial' :(
                        props.data.Credencial == -4 ? 'Delegado' :(
                          props.data.Credencial == -5 ? 'Promotor' : 'Juiz'
                        )
                      )
                    )
                  ))
                  : "Inválido"
                }</ItemText>
            </ItemView>
        </ItemControle>
    );
}