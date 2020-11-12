import { db } from "../../services/firebase";

const refInfratores = db().ref("infratores");

const refInfracoesByInfratorId = (id) =>
  refInfratores.child(id).child("Infrações");

const addInfracao = (idInfrator, infracao) => {
  const ref = refInfracoesByInfratorId(idInfrator);
  let key = ref.push().key;
  return ref.child(key).set(JSON.parse(JSON.stringify(infracao)));
};

const updateInfracao = (idInfrator, idInfracao, updatedData) =>
  refInfracoesByInfratorId(idInfrator)
    .child(idInfracao)
    .update(JSON.parse(JSON.stringify(updatedData)));

const remInfracao = (idInfrator, idInfracao) =>
  refInfracoesByInfratorId(idInfrator).child(idInfracao).remove();

const getInfracoesByRegDate = (idInfrator, date) =>
  refInfracoesByInfratorId(idInfrator)
    .orderByChild("Data_registro")
    .equalTo(date);

const getInfracoesByIdInfrator = (idInfrator) => {
  return new Promise((resolve, reject) => {
    refInfracoesByInfratorId(idInfrator)
      .once("value")
      .then((snap) => {
        if (snap.exists()) {
          resolve(
            Object.entries(snap.val()).map(([key, obj]) => {
              return { id: key, ...obj };
            })
          );
        } else {
          resolve([]);
        }
      })
      .catch(reject);
  });
};

const listenAll = (idInfrator, callback) => {
  clearListener(listenerAll);
  return new Promise((resolve, reject) => {
    listenerAll = refInfracoesByInfratorId(idInfrator);
    listenerAll.on(
      "value",
      (snap) => {
        if (snap.exists()) {
          callback(
            Object.entries(snap.val()).map(([key, obj]) => {
              return { id: key, ...obj };
            })
          );
        } else callback([]);
      },
      reject
    );
  });
};

const listenOne = (idInfrator, idInfracao, callback) => {
  clearListener(listenerOne);
  return new Promise((resolve, reject) => {
    listenerOne = refInfracoesByInfratorId(idInfrator).child(idInfracao);
    listenerOne.on(
      "value",
      (snap) => {
        if (snap.exists()) {
          callback({ ...snap.val(), id: snap.key });
        } else callback(null);
      },
      reject
    );
  });
};

let listenerAll;
let listenerOne;

const clearListener = (listener) => {
  if (!!listener) listener.off("value");
};

export {
  addInfracao,
  remInfracao,
  listenAll,
  listenOne,
  updateInfracao,
  getInfracoesByRegDate,
  getInfracoesByIdInfrator,
};
