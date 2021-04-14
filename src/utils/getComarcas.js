import axios from 'axios';
export const getComarcas = async () => {
    const response = await axios.get("https://www8.tjmg.jus.br/juridico/comarcas.html");
    
    let res = await response.data
    
    res = res.split("script")
    res = res.filter(item => item.includes("linkAndamento") && item);
    res = res.map(item => item.split('"')[4])
    res = res.filter(item => item != "0");

    let comarcasFormatted = res.map(item => ({
        label: item,
        value: item
    }))

    return comarcasFormatted;
}