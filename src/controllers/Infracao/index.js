import { db } from "../../services/firebase";

const refInfratores = db().ref("infratores");

const refInfracoesByInfratorId = (id) =>
  refInfratores.child(id).child("Infrações");

const addInfracao = (idInfrator, infracao) => {
  const ref = refInfracoesByInfratorId(idInfrator);
  let key = ref.push().key;
  return ref.child(key).set(infracao);
};

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
        resolve(snap.val());
      })
      .catch(reject);
  });
};

export {
  addInfracao,
  remInfracao,
  getInfracoesByRegDate,
  getInfracoesByIdInfrator,
};
