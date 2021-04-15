import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput as Input,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Styles from "../../styles";
import Colors from "../../styles/colors";
import { Credential, Network, Search, Infrator } from "../../controllers";
import { Itens } from "../../components";
import { Icon } from "@ui-kitten/components";
import { useUserContext } from "../../context";
import { FlatList } from "react-native-gesture-handler";
import moment from "moment";
import { mask } from "../../utils";
import { NavigationEvents } from "react-navigation";

export default ({ navigation }) => {
  const { accessDeniedAlert, haveAccess } = Credential;
  const { connected, alertOffline } = Network.useNetwork();
  const { user, userData } = useUserContext();
  const { findAll, findAllBy, findOneBy, clearListener, useSearch } = Search;
  const [infratores, setInfratores] = useState([]);
  const [idsInfratoresFavoritos, setIdsInfratoresFavoritos] = useState([]);
  const { search, setSearch, type, setType, filter, setFilter } = useSearch();

  useEffect(() => {
    setSearch();
    clearListener();
    setInfratores([]);
    setFilter("Rg");
  }, [type]);

  useEffect(() => {
    if (!search && type === "all") handleSearch();
  }, [search, type]);

  useEffect(() => {
    if (!!search) handleSearch();
  }, [filter]);

  /*useEffect(() => {
    Infrator.getFavorites(user.uid).then((favorites) => {
      setIdsInfratoresFavoritos(favorites);
    });
  }, []);*/

  useEffect(() => {
    if (type === "all") handleInfratores(infratores);
  }, [userData?.Infratores_favoritados]);

  const handleFilter = () => {
    setFilter(
      filter === "Rg"
        ? "Cpf"
        : filter === "Cpf"
        ? "Processo"
        : filter === "Processo"
        ? "Nome"
        : filter === "Nome"
        ? "Mãe"
        : "Rg"
    );
  };

  const sortInfratoresByFavorite = (infratoresData) => {
    const favIds = userData.Infratores_favoritados;
    if (!favIds || !infratoresData) return infratoresData;
    else
      return infratoresData
        .sort((a, b) => favIds.indexOf(a.id) < favIds.indexOf(b.id))
        .map((i) => ({ ...i, favorite: favIds.includes(i.id) }));
  };

  const sortInfratoresByName = (infratoresData) => {
    if (!infratoresData) return infratoresData;
    else return infratoresData.sort((a, b) => a.Nome < b.Nome);
  };

  const handleInfratores = (infratoresData) => {
    if (!userData.Comarca) setInfratores([]);
    else {
      let infratoresFilteredByComarca = infratoresData?.filter(
        (infrator) => !infrator.Comarca || infrator.Comarca === userData.Comarca
      );
      let sortedInfratores = sortInfratoresByName(infratoresFilteredByComarca);

      sortedInfratores = sortInfratoresByFavorite(sortedInfratores);
      setInfratores(sortedInfratores);
    }
  };

  const handleSearch = () => {
    switch (type) {
      case "all":
        if (!!search) findAllBy(filter, mask.Numeric(search), handleInfratores);
        else findAll(handleInfratores);
        break;
      case "one":
        if (!!search) findOneBy(filter, mask.Numeric(search), setInfratores);
        break;

      default:
        break;
    }
  };

  const handleSearchTerm = (term) => {
    switch (filter) {
      case "Rg":
        setSearch(mask.RG(term));
        break;
      case "Cpf":
        setSearch(mask.CPF(term));
        break;
      default:
        setSearch(term);
        break;
    }
  };

  const allResults = (
    <View
      style={{
        flex: 1,
      }}
    >
      <FlatList
        data={infratores}
        keyExtractor={(item) => item.value}
        renderItem={({ item, i }) => (
          <View
            style={{
              backgroundColor: "#fff",
              marginBottom: 5,
              borderRadius: 10,
              padding: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {item.favorite && (
              <View
                style={{
                  minHeight: 100,
                  minWidth: 3,
                  borderRadius: 3,
                  marginRight: 5,
                  backgroundColor: Colors.Secondary.Normal,
                }}
              ></View>
            )}
            <View
              style={{
                width: Dimensions.get("screen").width - 100,
              }}
            >
              <View style={{ flexDirection: "row", maxWidth: "80%" }}>
                <Text style={[Styles.txtBold]}>Nome: </Text>
                <Text numberOfLines={1} style={[Styles.txtNormal]}>
                  {item.Nome}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={[Styles.txtBold]}>CPF: </Text>
                <Text style={[Styles.txtNormal]}>
                  {item.Cpf ? mask.CPF(item.Cpf) : "Não consta"}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={[Styles.txtBold]}>RG: </Text>
                <Text style={[Styles.txtNormal]}>
                  {item.Rg ? mask.RG(item.Rg) : "Não consta"}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={[Styles.txtBold]}>Situação: </Text>
                <Text style={[Styles.txtNormal]}>
                  {!item.Infrações
                    ? "Sem passagem"
                    : item.Infrações.length === 1
                    ? "Incidente"
                    : "Reincidente"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                const { favorite, ...Infrator } = item;
                navigation.navigate("Infrator", { Infrator });
              }}
            >
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 5,
                }}
                source={require("../../assets/images/icon-mais.png")}
              ></Image>
            </TouchableOpacity>
          </View>
        )}
        nestedScrollEnabled={true}
      />
    </View>
  );

  const OneResult = () => {
    const Infrator = infratores[0];
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: Colors.Primary.Normal,
            borderRadius: 21,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <Text style={Styles.txtBoldWhite}>Ultima Infração</Text>
              <Text style={Styles.txtRegularWhite}>
                {Infrator.Infrações && Infrator.Infrações.length > 0
                  ? moment(
                      new Date(
                        Infrator.Infrações.sort(function (a, b) {
                          return (
                            new Date(b.Data_ocorrência) -
                            new Date(a.Data_ocorrência)
                          );
                        })[0].Data_ocorrência
                      )
                    ).format("DD/MM/YYYY")
                  : "--/--/----"}
              </Text>
            </View>
            <View style={{ backgroundColor: "#fff", width: 2 }}></View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <Text style={Styles.txtBoldWhite}>Status</Text>
              <Text style={Styles.txtRegularWhite}>
                {!Infrator.Infrações
                  ? "Sem Passagens"
                  : Infrator.Infrações.length === 1
                  ? "Incidente"
                  : "Reincidente"}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <View style={{ flexDirection: "row" }}>
                <Text style={Styles.txtBold}>Nome: </Text>
                <Text style={Styles.txtRegular}>
                  {Infrator.Nome ? Infrator.Nome : "Não consta"}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={Styles.txtBold}>CPF: </Text>
                <Text style={Styles.txtRegular}>
                  {Infrator.Cpf ? mask.CPF(Infrator.Cpf) : "Não consta"}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={Styles.txtBold}>RG: </Text>
                <Text style={Styles.txtRegular}>
                  {Infrator.Rg ? mask.RG(Infrator.Rg) : "Não consta"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (!connected) {
                  alertOffline();
                  return;
                }
                if (haveAccess(userData.Credencial, "AccessToDetalhes"))
                  navigation.navigate("Infrator", { Infrator });
                else accessDeniedAlert();
              }}
            >
              <Image
                style={{ height: 60, width: 60, borderRadius: 5 }}
                source={require("../../assets/images/edit-icon.png")}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          style={{
            width: "100%",
            marginTop: 15,
            backgroundColor: "#fff",
            borderRadius: 10,
          }}
          data={Infrator.Infrações ? Infrator.Infrações : []}
          keyExtractor={(item) => item.value}
          renderItem={({ item, i }) => (
            <Itens.Consulta
              key={i}
              infração={item}
              onClick={() => {
                if (!connected) {
                  alertOffline();
                  return;
                }
                if (haveAccess(userData.Credencial, "AccessToAnexar"))
                  navigation.navigate("Detalhes", {
                    idInfracao: item.id,
                    idInfrator: Infrator.id,
                  });
                else accessDeniedAlert();
              }}
            />
          )}
          nestedScrollEnabled={true}
        />
      </View>
    );
  };

  const emptyResult = (
    <View
      style={{
        justifyContent: "center",
        paddingTop: 40,
        height: "100%",
        alignItems: "center",
      }}
    >
      {(type === "all" || !!search) && (
        <>
          <Text
            style={[
              Styles.txtBold,
              {
                color: Colors.Secondary.Normal,
                fontSize: 28,
                textAlign: "center",
              },
            ]}
          >
            Nenhum infrator encontrado!
          </Text>
          <Image
            source={require("../../assets/images/searching.png")}
            style={{ width: 250, height: 232 }}
          />
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={Styles.page}>
      <NavigationEvents
        onDidBlur={(payload) => !payload.lastState && clearListener()}
      />
      <LinearGradient
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 1, y: 1.0 }}
        locations={[0, 1]}
        colors={[Colors.Primary.Normal, Colors.Terciary.Normal]}
        style={{
          width: "100%",
          height: 145,
          paddingHorizontal: 15,
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", height: 60 }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              source={require("../../assets/images/back.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <Text style={[Styles.txtBoldWhite, { fontSize: 25, marginLeft: 15 }]}>
            CONSULTA
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              width: "50%",
              height: 25,
              alignItems: "center",
              justifyContent: "center",
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 15,
              paddingVertical: 3,
              borderWidth: type === "all" ? 0 : 1,
              backgroundColor: type === "all" ? "#fff" : "transparent",
              borderColor: "#fff",
            }}
            onPress={() => setType("all")}
          >
            <Text
              style={[
                Styles.txtRegularWhite,
                {
                  color: type === "all" ? Colors.Secondary.Normal : "#fff",
                },
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "50%",
              height: 25,
              paddingVertical: 3,
              alignItems: "center",
              justifyContent: "center",
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
              borderColor: "#fff",
              borderWidth: type === "one" ? 0 : 1,
              backgroundColor: type === "one" ? "#fff" : "transparent",
            }}
            onPress={() => setType("one")}
          >
            <Text
              style={[
                Styles.txtRegularWhite,
                {
                  color: type === "one" ? Colors.Secondary.Normal : "#fff",
                },
              ]}
            >
              Individual
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 10,
            backgroundColor: "#fff",
            borderRadius: 30,
            height: 40,
            alignItems: "center",
            paddingHorizontal: 7,
            flexDirection: "row",
          }}
        >
          <Icon
            style={{ width: 20, height: 20 }}
            fill={Colors.Primary.Normal}
            name="search"
          />
          <Input
            style={[
              Styles.txtNormal,
              {
                marginHorizontal: 7,
                fontSize: 18,
                color: Colors.Primary.Normal,
                minWidth: "65%",
                maxWidth: "65%",
              },
            ]}
            maxLength={filter === "Cpf" ? 14 : filter === "Rg" ? 20 : 100}
            placeholder="Pesquise aqui..."
            placeholderTextColor={Colors.Secondary.Normal}
            keyboardType={
              filter === "Nome" || filter === "Mãe" ? "default" : "number-pad"
            }
            value={search}
            onChangeText={handleSearchTerm}
            onEndEditing={handleSearch}
          />
          <View
            style={{
              height: "100%",
              width: 1,
              backgroundColor: Colors.Terciary.White,
              marginRight: 7,
            }}
          ></View>
          <TouchableOpacity style={{ width: "22%" }} onPress={handleFilter}>
            <Text
              style={[
                Styles.txtBold,
                {
                  fontSize: 22,
                  color: Colors.Secondary.Normal,
                  textAlign: "center",
                },
              ]}
            >
              {filter.substr(0, 4).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View
        style={{
          width: Dimensions.get("screen").width - 30,
          flex: 1,
          marginVertical: 15,
        }}
      >
        {!infratores || infratores.length < 1 ? (
          emptyResult
        ) : type === "all" ? (
          allResults
        ) : (
          <OneResult />
        )}
      </View>
    </SafeAreaView>
  );
};
