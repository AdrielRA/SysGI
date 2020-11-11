import { db, storage } from "../../services/firebase";

const refDbAnexos = db().ref().child("anexos");
const refStAnexos = storage().ref().child("anexos");

const getRefAnexo = (idInfrator, idInfracao) =>
  refDbAnexos.child(idInfrator).child(idInfracao);

const addAnexo = (data) => {};

const remAnexo = (id) => {};

const getAnexos = (idInfracao) => {};

const setAnexosFromInfracao = (snapshot, Uploader, infraKey, setLista) => {
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
    listUploading = Uploader.uploadQueue.filter((i) => i.infraKey == infraKey);

    results.map((r) => {
      listUploading = listUploading.filter((i) => i.key != r.key);
    });
  }

  setLista([...results, ...listUploading]);
};
const deleteAnexo = async (infratorKey, infraKey, key) => {
  await refStAnexos.child(infratorKey).child(infraKey).child(key).delete();
};
const removeAnexoBD = async (infratorKey, infraKey, key) => {
  await refDbAnexos.child(infratorKey).child(infraKey).child(key).remove();
};

const removeAllAnexosToInfrator = async (infratorKey) => {
  await db().ref().child("anexos").child(infratorKey).remove();
};
const removeOneAnexoToInfrator = async (infratorKey, infra_key) => {
  await db().ref().child("anexos").child(infratorKey).child(infra_key).remove();
};
const createRefFiles = async (path) => {
  await storage().ref().child("anexos").child(path).listAll();
};
const deleteOneFile = async (pathToFile, fileName) => {
  await storage().ref(pathToFile).child(fileName).delete();
};

export { setAnexosFromInfracao, deleteAnexo, removeAnexoBD };
