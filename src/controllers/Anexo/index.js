
import { db, storage } from '../../services/firebase';

export default {
    getRefInfracao(key, dataRegister) {
        return db()
            .ref("infratores")
            .child(key)
            .child("Infrações")
            .orderByChild("Data_registro")
            .equalTo(dataRegister)
    },
    getRefAnexo(keyInfrator, keyInfracao) {
        return db()
            .ref()
            .child("anexos")
            .child(keyInfrator)
            .child(keyInfracao)
    },
    setAnexosFromInfracao(snapshot, Uploader, infraKey, setLista) {
        let results = [];
        if (snapshot.val()) {

            snapshot.forEach(function (child) {

                if (child.val()) {
                    results.push({
                        ...child.val(),
                        key: child.key,
                        uri: "",
                        progress: 100,
                    });
                }

            });
        }

        let listUploading = [];

        if (Uploader.uploadQueue.length > 0) {

            listUploading = Uploader.uploadQueue.filter(
                (i) => i.infraKey == infraKey
            );

            results.map((r) => {
                listUploading = listUploading.filter((i) => i.key != r.key);
            });

        }

        setLista([...results, ...listUploading]);
    },
    async deleteAnexo(infratorKey, infraKey, key) {
        await storage()
            .ref()
            .child("anexos")
            .child(infratorKey)
            .child(infraKey)
            .child(key)
            .delete()
    },
    async removeAnexoBD(infratorKey, infraKey, key) {
        await db()
            .ref()
            .child("anexos")
            .child(infratorKey)
            .child(infraKey)
            .child(key)
            .remove()
    }
}