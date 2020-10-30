import { db, auth, storage} from '../../services/firebase';
import { Alert } from 'react-native'
export default {
    setDataEdit(rg, callback) {

        let query = db().ref("infratores").orderByChild("Rg").equalTo(rg);
        query.once("value", function (snapshot) {
            if (snapshot.val() != null) {
                snapshot.forEach(function (child) {
                    if (child.val()) {
                        callback(child.key);
                    }
                });
            }
        });
    },
    setDataInfracoes(infratorKey, setFireInfrações, setInfrator, setFavorito) {
        db().ref("infratores").child(infratorKey).on("value", (snapshot) => {
            if (snapshot.val() != null) {
                let infrator = snapshot.val();
                let infras = [];

                setFireInfrações(snapshot.val().Infrações);

                if (snapshot.val().Infrações) {
                    infras = Object.values(snapshot.val().Infrações);
                }

                infrator.Infrações = infras;

                setInfrator(infrator);
            } else {

                if (!favorito) {
                    return navigation.goBack();
                }
                else {
                    db().ref("infratores").child(infratorKey).off("value");
                    Alert.alert(
                        "Infrator não Encontrado!",
                        "Provavelmente ele foi removido por alguém!"
                    );
                    navigation.goBack();
                }
            }
        });
        setFavorito(null);
    },
    async getRGInfratorWithKey(rg) {
        return await
            db()
                .ref("infratores")
                .orderByChild("Rg")
                .equalTo(rg)
                .once("value");
    },
    async getCPFInfratorWithKey(cpf) {
        return await
            db()
                .ref("infratores")
                .orderByChild("Cpf")
                .equalTo(cpf)
                .once("value");
    },
    async saveInfrator(infrator) {
        let key = db().ref("infratores").push().key;
        return db()
            .ref("infratores")
            .child(key)
            .set(infrator)
            .then(() => {
                return key;
            })
    },
    async saveDataToEdit(infratorKey, infrator, fireInfracoes) {
        await infratores
            .child(infratorKey)
            .set(
                JSON.parse(
                    JSON.stringify({ ...infrator, Infrações: fireInfracoes })
                )
            )
    },
    getRefInfracoes(infratorKey) {
        return db()
            .ref("infratores")
            .child(infratorKey)
            .child("Infrações")
    },
    async saveInfracao(infratorKey, infracao) {

        const infracoes = this.getRefInfracoes(infratorKey);

        let key = infracoes.push().key;

        await infracoes
            .child(key)
            .set({ ...infracao })
    },
    async deleteInfrator(infratorKey) {
        await db()
            .ref("infratores")
            .child(infratorKey)
            .remove()
    },
    async removeAllFavorites() {
        db()
            .ref()
            .child("users")
            .orderByChild("Infratores_favoritados")
            .startAt("")
            .once("value", (snapshot) => {
                snapshot.forEach((user) => {
                    user.ref
                        .child("Infratores_favoritados")
                        .set(user.val().Infratores_favoritados.filter((e) => e != key));
                });
            });
    },
    getDataUser() {
        let userId = auth().currentUser.uid;
        let user = db().ref().child("users").child(userId);
        let favoritos = user.child("Infratores_favoritados");

        return favoritos;

    },
    setFavorites(favoritos, setFavorito, infratorKey) {
        favoritos
            .once("value", (snapshot) => {
                let favs = [];
                if (snapshot.val()) {
                    favs = snapshot.val();
                }
                setFavorito(favs.includes(infratorKey.toString()));
            });
    },
    setBDFavorites(favoritos, infratorKey) {
        favoritos.once("value", (snapshot) => {
            let favs = [];
            if (snapshot.val()) {
                favs = snapshot.val();
            }
            if (!favs.includes(infratorKey)) favs.push(infratorKey);
            favoritos.set(favs);
        });
    },
    verificUserToFavoriteInfrator(favoritos, infratorKey) {
        favoritos.once("value", (snapshot) => {
            let favs = [];
            if (snapshot.val()) {
                favs = snapshot.val();
            }
            if (favs.includes(infratorKey))
                favs = favs.filter((infra_) => {
                    infra_ != infratorKey;
                });
            favoritos.set(favs);
        });
    },
    filterInfracaoToUser(infracoes, dataRegistro) {
        return infracoes
            .orderByChild("Data_registro")
            .equalTo(dataRegistro);
    },
    async deleteInfracoes(query, infracoes) {
        return query.once("value", (snapshot) => {
            if (snapshot.val()) {
                let infra_key = Object.keys(snapshot.val())[0];
                
                infracoes
                .child(infra_key)
                .remove()
                .then(() =>{
                    return infra_key;
                })
            }
        });
    },
    async removeAllAnexosToInfrator(infratorKey){
        await db()
        .ref()
        .child("anexos")
        .child(infratorKey)
        .remove()
    },
    async removeOneAnexoToInfrator(infratorKey, infra_key){
        await db()
        .ref()
        .child("anexos")
        .child(infratorKey)
        .child(infra_key)
        .remove()
    },
    async createRefFiles(path){
       await storage()
       .ref()
       .child("anexos")
       .child(path)
       .listAll()
    },
    async deleteOneFile(pathToFile, fileName){
        await storage()
             .ref(pathToFile)
             .child(fileName)
             .delete();
    }
}
