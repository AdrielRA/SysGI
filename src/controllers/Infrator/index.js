import { db } from "../../services/firebase";

const refInfratores = db().ref("infratores");
const refUsers = db().ref("users");

const getInfratorById = (id) => {
  return new Promise((resolve, reject) => {
    refInfratores
      .child(id)
      .once("value")
      .then((snap) => resolve(snap.val()))
      .catch(reject);
  });
};

const getInfratorByRG = (rg) => {
  return new Promise((resolve, reject) => {
    if (!rg) resolve();
    refInfratores
      .orderByChild("Rg")
      .equalTo(rg)
      .once("value")
      .then((snap) => resolve(snap.val()))
      .catch(reject);
  });
};

const getInfratorByCPF = (cpf) => {
  return new Promise((resolve, reject) => {
    if (!cpf) resolve();
    refInfratores
      .orderByChild("Cpf")
      .equalTo(cpf)
      .once("value")
      .then((snap) => resolve(snap.val()))
      .catch(reject);
  });
};

const getIdInfratorByRg = (rg) => {
  return new Promise((resolve, reject) => {
    if (!rg) reject();
    refInfratores
      .orderByChild("Rg")
      .equalTo(rg)
      .once(
        "value",
        (snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((child) => {
              if (child.exists()) resolve(child.key);
            });
          } else reject();
        },
        reject
      );
  });
};

const validate = (infrator) => {
  return new Promise((resolve, reject) => {
    getInfratorByRG(infrator.Rg)
      .then((snapRG) => {
        if (!!snapRG)
          reject("RG fornecido já foi cadastrado em outro infrator!");
        else {
          getInfratorByCPF(infrator.Cpf)
            .then((snapCpf) => {
              if (!!snapCpf)
                reject("CPF fornecido já foi cadastrado em outro infrator!");
              else resolve();
            })
            .catch(reject);
        }
      })
      .catch(reject);
  });
};

const addInfrator = (infrator) => {
  return new Promise((resolve, reject) => {
    const key = refInfratores.push().key;
    refInfratores
      .child(key)
      .set(infrator)
      .then(() => resolve(key))
      .catch(reject);
  });
};

const updateInfrator = (id, updatedData) =>
  refInfratores.child(id).update(updatedData);

const remInfrator = (id) => refInfratores.child(id).remove();

const getFavorites = (uid) => {
  return new Promise((resolve, reject) => {
    refUsers
      .child(uid)
      .child("Infratores_favoritados")
      .once(
        "value",
        (snap) => {
          if (snap.exists) resolve(snap.val());
          else reject();
        },
        reject
      );
  });
};

const isFavorite = (uid, idInfrator) => {
  return new Promise((resolve, reject) => {
    getFavorites(uid)
      .then((favorites) => {
        resolve(!!favorites && favorites.includes(idInfrator));
      })
      .catch(reject);
  });
};

const addFavorite = (uid, idInfrator) => {
  return new Promise((resolve, reject) => {
    getFavorites(uid)
      .then((favorites) => {
        favorites = !!favorites ? favorites : [];
        if (!favorites.includes(idInfrator)) {
          favorites.push(idInfrator);
          refUsers
            .child(uid)
            .child("Infratores_favoritados")
            .set(favorites)
            .then(resolve)
            .catch(reject);
        }
      })
      .catch(reject);
  });
};

const remFavorite = (uid, idInfrator) => {
  return new Promise((resolve, reject) => {
    getFavorites(uid)
      .then((favorites) => {
        if (!!favorites && favorites.includes(idInfrator)) {
          favorites = favorites.filter((key) => idInfrator !== key);
          refUsers
            .child(uid)
            .child("Infratores_favoritados")
            .set(favorites)
            .then(resolve)
            .catch(reject);
        }
      })
      .catch(reject);
  });
};

const clearFavorites = (idInfracao) => {
  refUsers
    .orderByChild("Infratores_favoritados")
    .startAt("")
    .once("value", (snapshot) => {
      snapshot.forEach((user) => {
        user.ref.child("Infratores_favoritados").update({
          Infratores_favoritados: user
            .val()
            .Infratores_favoritados.filter((e) => e != idInfracao),
        });
      });
    });
};

export {
  addInfrator,
  remInfrator,
  getIdInfratorByRg,
  getInfratorByRG,
  getInfratorByCPF,
  getInfratorById,
  updateInfrator,
  clearFavorites,
  getFavorites,
  addFavorite,
  remFavorite,
  validate,
  isFavorite,
};
