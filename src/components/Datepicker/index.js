import React, { useState, useEffect } from "react";
import { View } from "react-native";
import Colors from "../../styles/colors";
import { Datepicker, NativeDateService } from "@ui-kitten/components";

export const useDatepickerState = (initialDate = null) => {
  const [date, setDate] = React.useState(initialDate);
  return { date, onSelect: setDate };
};

export default (props) => {
  const langDate = {
    dayNames: {
      short: ["D", "S", "T", "Q", "Q", "S", "S"],
      long: [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
      ],
    },
    monthNames: {
      short: [
        "JAN",
        "FEV",
        "MAR",
        "ABR",
        "MAI",
        "JUN",
        "JUL",
        "AGO",
        "SET",
        "OUT",
        "NOV",
        "DEZ",
      ],
      long: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ],
    },
  };

  const dateConfig = new NativeDateService("ptBr", {
    i18n: langDate,
    startDayOfWeek: 0,
    format: "DD/MM/YYYY",
  });

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: Colors.Secondary.Normal,
        borderRadius: 30,
        maxHeight: 40,
        minWidth: "49.5%",
        marginEnd: 3,
      }}
    >
      <Datepicker
        status="basic"
        placeholder={props.placeholder}
        dateService={dateConfig}
        {...props.onStateChange}
      />
    </View>
  );
};
