import axios from "axios";

const BASE_URL = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";

const getEstados = () => {
  return new Promise((resolve) => {
    axios
      .get(BASE_URL)
      .then((response) => {
        let responseUfs = response.data.map((uf) => {
          return {
            label: uf.sigla,
            value: uf.sigla,
          };
        });
        resolve(responseUfs.sort((a, b) => a.label > b.label));
      })
      .catch(resolve);
  });
};

const getCidades = (uf) => {
  return new Promise((resolve) => {
    axios
      .get(`${BASE_URL}/${uf}/municipios`)
      .then((response) => {
        let responseCities = response.data.map((city) => {
          return {
            label: city.nome,
            value: city.nome,
          };
        });
        resolve(responseCities);
      })
      .catch(resolve);
  });
};

export { getCidades, getEstados };
