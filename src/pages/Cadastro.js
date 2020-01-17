import React from 'react';
import { View, Text, Button } from 'react-native';

function Cadastro({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Cadastro</Text>
      <Button title="VOLTAR" onPress={() =>  navigation.goBack()} />
    </View>
  );
}

export default Cadastro;