import React, { useState, useEffect } from "react";
import { db } from "../../services/firebase";

const refInfratores = db().ref("infratores");

let listener = undefined;

const findOneBy = (child, value, callback) => {
  clearListener();
  return new Promise((resolve, reject) => {
    listener = refInfratores.orderByChild(child).limitToFirst(1).equalTo(value);
    listener.on(
      "value",
      (snap) => {
        if (snap.exists()) {
          parseToModel(snap, true).then(callback);
        } else callback([]);
      },
      reject
    );
  });
};

const findAllBy = (child, value, callback) => {
  clearListener();
  return new Promise((resolve, reject) => {
    listener = refInfratores
      .orderByChild(child)
      .startAt(value)
      .endAt(value + "\uf8ff");
    listener.on(
      "value",
      (snap) => {
        if (snap.exists()) {
          parseToModel(snap).then((infratores) => callback(infratores));
        } else callback([]);
      },
      reject
    );
  });
};

const findAll = (callback) => {
  clearListener();
  return new Promise((resolve, reject) => {
    listener = refInfratores;
    listener.on(
      "value",
      (snap) => {
        if (snap.exists()) {
          parseToModel(snap).then((infratores) => {
            callback(infratores);
          });
        } else callback([]);
      },
      reject
    );
  });
};

const parseToModel = (snap, isOne) => {
  return new Promise((resolve, reject) => {
    let res = Object.entries(snap.val()).map(([k, v]) => {
      return { id: k, ...v };
    });
    if (isOne) {
      res = res[0];
      if (!!res.Infrações) {
        res.Infrações = Object.entries(res.Infrações).map(([k, v]) => {
          return { id: k, ...v };
        });
      }
      resolve([res]);
    } else {
      const promises = res.map((inf) => {
        if (!!inf.Infrações)
          inf.Infrações = inf.Infrações = Object.entries(inf.Infrações).map(
            ([k, v]) => {
              return { id: k, ...v };
            }
          );
        return inf;
      });

      Promise.all(promises).then(resolve);
    }
  });
};

const clearListener = () => {
  if (!!listener) listener.off("value");
};

const useSearch = () => {
  const [search, setSearch] = useState();
  const [type, setType] = useState("one");
  const [filter, setFilter] = useState("Rg");

  return { search, setSearch, type, setType, filter, setFilter };
};

export { clearListener, findAll, findAllBy, findOneBy, useSearch };

export default {
  getSearchInfrator(child, termo) {
    return db()
      .ref("infratores")
      .orderByChild(child)
      .limitToFirst(1)
      .equalTo(termo);
  },
  setFoundInfrator(snapshot, setInfratorKey, setInfrator) {
    snapshot.forEach((child) => {
      if (child.val()) {
        setInfratorKey(child.key);

        let infrator = child.val();
        let infras = [];

        if (child.val().Infrações) {
          infras = Object.values(child.val().Infrações);
        }

        infrator.Infrações = infras;
        setInfrator({ ...infrator, id: child.key });
      }
    });
  },
};
