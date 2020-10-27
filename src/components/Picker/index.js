import React from "react";
import DropDownPicker from 'react-native-dropdown-picker';

export default function Picker({ name, data, setSelected }) {
  return (
    <DropDownPicker
      items={data ? data : [{}]}
      placeholder={name}
      placeholderStyle={{color:"white"}}
      onChangeItem={item => setSelected(item.value)}
      style={{
        height: 40,
        backgroundColor: "transparent",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
      }}
      labelStyle={{ fontFamily: "CenturyGothic", color: "#000" }}
      itemStyle={{
        justifyContent: 'flex-start',
      }}
      dropDownStyle={{borderColor: "#f00"}}
      arrowColor="white"
    />
  )

}
