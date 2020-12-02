import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList} from 'react-native';
import { Dark, Light, Primary, Secondary } from '../../styles/colors';
import { Feather } from '@expo/vector-icons';

export default function Teste() {

    const [visible, setVisible] = useState(0);

    function handleVisibleList() {
        visible == 0 ? setVisible(1) : setVisible(0)
    }

    const ItemList  = ({item, index}) => (
        <View key={index}>
            <Text style={styles.itemList}>
                 {item}
            </Text>
        </View>
    )

   const[itens, setItens] =  useState([
       {
           label: "Teste1",
           value:"Teste1"
       },
       {
        label: "Teste2",
        value:"Teste2"
       },
       {
        label: "Teste3",
        value:"Teste3"
       },
       {
        label: "Teste4",
        value:"Teste4"
       },
       {
        label: "Teste5",
        value:"Teste5"
       },
       {
        label: "Teste6",
        value:"Teste6"
       },
    ])
    return (
        <View style={styles.container}>
            <View style={[ styles.pickerGlobal, visible == 0 ? styles.pickerListNotVisible: styles.pickerListVisible]}>
                <Text style={styles.placehoder}>Teste</Text>
                <Feather name="chevron-down"
                    size={24}
                    color={Secondary}
                    style={styles.icon}
                    onPress={() => handleVisibleList()}
                />
                <View style={[styles.list, { opacity: visible }]}>
                    <FlatList style={{width: "100%"}}
                            nestedScrollEnabled={true}
                            data={itens}
                            renderItem={({ item, index }) => (
                                <ItemList item={item.label} index={index}/>
                            )}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#dcdcdc"
    },
    pickerGlobal: {
        width: 250,
        height: 50,
        borderColor: Secondary,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingHorizontal: 20,
        position: "relative"
    },
    pickerListNotVisible:{
        borderRadius: 25,
    },
    pickerListVisible: {
      borderTopStartRadius:25,
      borderTopEndRadius:25
    },
    icon: {
        position: "absolute",
        right: 10
    },
    placehoder: {
        color: Secondary,
        fontSize: 16,
        fontFamily: "CenturyGothic"
    },
    list: {
        position: "absolute",
        width: 250,
        maxHeight: 150,
        backgroundColor: "#fff",
        bottom: -150,
        borderColor:Secondary,
        borderWidth:1,
        alignSelf:"center",
        padding:10, 
        zIndex:100
    },
    itemList:{
        width:250,
        fontSize: 16,
        fontFamily: "CenturyGothic",
        padding:5
    }
})