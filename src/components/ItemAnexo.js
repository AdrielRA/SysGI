import React from 'react';
import styled from 'styled-components/native'
import Colors from '../styles/colors'

const Item = styled.TouchableHighlight`
    height:40px;
    margin-bottom:5px;
    background-color:#fff
`;
const ItemView = styled.View`
   align-items:center;
   align-self:flex-start;
   
 `;
 const ItemText = styled.Text`
   font-size:15px;
   text-align-vertical:center;
   font-weight:bold;
   align-self:flex-start;
   padding-left:5px;
 `;
 const ProgText = styled.Text`
   font-size:10px;
   text-align:left;
   padding-left:2%;
   padding-right:2%;
 `;
 const ProgressBar = styled.Text`
   height:5px;
   border-radius:5px;
   width:${props => props.value};
   background-color:${props => props.bgColor};
 `;
export default (props)=>{
    return(
        <Item onLongPress={props.onLongPress} underlayColor='#dcdcdc'>
            <ItemView>
                <ItemText style={{color:Colors.Secondary.Normal,marginVertical:0}}>{props.data.fileName}</ItemText>
                <ItemView style={{flexDirection:"row"}}>
                    <ProgText style={{color:Colors.Secondary.Normal}}>{`${props.data.progress.replace('%','')} %`}</ProgText>
                    <ProgressBar value={`${Number(props.data.progress.replace('%','')) * 0.85}%`} bgColor={Colors.Primary.Normal}></ProgressBar>
                </ItemView>
                
            </ItemView>
        </Item>
    );
}