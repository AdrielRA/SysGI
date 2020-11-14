import * as DocumentPicker from "expo-document-picker";
import { db, storage } from "../../services/firebase";

const refDbAnexos = db().ref().child("anexos");
const refStAnexos = storage().ref().child("anexos");

const openAnexo = (type) => {
  return new Promise((resolve) => {
    DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
      type,
    })
      .then((file) => {
        if (file.type === "cancel") {
          resolve();
        } else resolve(file);
      })
      .catch(resolve);
  });
};

const formatMetadata = (file) => {
  let metadata = {};

  metadata.ext = file.name.match(/\.[0-9a-z]+$/i)[0];
  metadata.name = file.name.replace(/\.[^/.]+$/, "");
  metadata.size = file.size;
  metadata.uri = file.uri;

  return metadata;
};

const getRefAnexo = (idInfrator, idInfracao) =>
  refDbAnexos.child(idInfrator).child(idInfracao);

const addAnexo = (metaData, idInfrator, idInfracao, upload) => {
  const refDb = getRefAnexo(idInfrator, idInfracao);
  const key = refDb.push().key;

  upload({ ...metaData, idInfracao, key }, idInfrator).then((snap) =>
    refDb.child(key).set(snap)
  );
};

const renameAnexo = (name, idInfrator, idInfracao, idAnexo) =>
  getRefAnexo(idInfrator, idInfracao).child(idAnexo).update({ name });

let listener;
const listenAnexos = (idInfrator, idInfracao, callback) => {
  clearListener();
  return new Promise((resolve, reject) => {
    listener = getRefAnexo(idInfrator, idInfracao);
    listener.on(
      "value",
      (snap) => {
        if (snap.exists()) {
          callback(
            Object.entries(snap.val()).map(([key, obj]) => {
              return { key, ...obj };
            })
          );
        } else callback([]);
      },
      reject
    );
  });
};

const clearListener = () => {
  if (!!listener) listener.off("value");
};

const remAnexo = (idInfrator, idInfracao, key) => {
  return new Promise((resolve, reject) => {
    getRefAnexo(idInfrator, idInfracao)
      .child(key)
      .remove()
      .then(() => {
        deleteFromStorage(idInfrator, idInfracao, key)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
};

const deleteFromStorage = (idInfrator, idInfracao, key) => {
  return new Promise((resolve, reject) => {
    refStAnexos
      .child(idInfrator)
      .child(idInfracao)
      .child(key)
      .delete()
      .then(resolve)
      .catch(reject);
  });
};

const removeAllAnexosFromInfrator = (idInfrator) => {
  return new Promise((resolve, reject) => {
    refDbAnexos
      .child(idInfrator)
      .remove()
      .then(() =>
        deleteRecursiveFiles(`anexos/${idInfrator}`).then(resolve).catch(reject)
      )
      .catch(reject);
  });
};

const removeAllAnexosFromInfracao = async (idInfrator, idInfracao) => {
  return new Promise((resolve, reject) => {
    refDbAnexos
      .child(idInfrator)
      .child(idInfracao)
      .remove()
      .then(() =>
        deleteRecursiveFiles(`anexos/${idInfrator}/${idInfracao}`)
          .then(resolve)
          .catch(resolve)
      )
      .catch(reject);
  });
};

const getListFiles = (path) => storage().ref().child(path).listAll();

const deleteOneStorageFile = (pathToFile) => storage().ref(pathToFile).delete();

const deleteRecursiveFiles = (path) => {
  getListFiles(path).then((dir) => {
    dir.items.forEach(async (dirRef) => {
      await deleteOneStorageFile(dirRef.fullPath);
    });
    dir.prefixes.forEach(async (subDir) => {
      await deleteRecursiveFiles(subDir.fullPath);
    });
  });
};

export {
  addAnexo,
  renameAnexo,
  openAnexo,
  formatMetadata,
  listenAnexos,
  clearListener,
  remAnexo,
  removeAllAnexosFromInfrator,
  removeAllAnexosFromInfracao,
};
