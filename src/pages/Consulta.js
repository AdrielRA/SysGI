import React from 'react';
import { View, Text, Button } from 'react-native';

function Consulta({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Consulta</Text>
      <Button title="VOLTAR" onPress={() =>  navigation.goBack() } />
    </View>
  );
}

export default Consulta;Consulta