import React from "react";
import DropDownPicker from '../DropDownPicker';

export default function Picker({ width, heigth, color, name, data, auxData, setSelected }) {

  const [medidaSE, setMedidaSE] = React.useState("");

  React.useEffect(() => {
   
      if (auxData.MedidaSE === true) {
        setMedidaSE("SIM");
      }

      else if (auxData.MedidaSE === false) {
        setMedidaSE("NÂO");
      }
}, [auxData])
  return (
    <DropDownPicker
      items={data ? data : [{}]}
      placeholder={medidaSE != "" ? medidaSE : name}
      placeholderStyle={{ color: color }}
      onChangeItem={item => {
        if (name == "Categoria") {
          setSelected(item.value)

        }
        else if (name == "MedidaSE") {
          setSelected({ ...auxData, "MedidaSE": item.value })
        }
      }}
      style={{
        width: width,
        maxHeight: heigth,
        marginTop: name == "MedidaSE" ? 7 : 0,
        borderColor: color,
        backgroundColor: "transparent",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
      }}
      labelStyle={{ fontFamily: "CenturyGothic", color: name != "Categoria" ? color : "#000" }}
      itemStyle={{
        justifyContent: 'flex-start',
      }}
      dropDownStyle={{ borderColor: color }}
      arrowColor={color}
    />
  )

}
