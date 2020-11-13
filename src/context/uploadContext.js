import React, { useState, createContext, useContext } from "react";
import { storage } from "../services/firebase";

const refStAnexos = storage().ref().child("anexos");

const Interface = {
  queue: Array,
  upload: Function,
};

const Context = createContext({
  uploads: Interface,
});

const useUploader = () => {
  const [queue, setQueue] = useState([]);

  enqueue = (item) => {
    const index = queue.findIndex((i) => i.key === item.key);
    if (index >= 0) {
      let q = queue;
      q.splice(index, 1, item);
      setQueue([...q]);
    } else setQueue([...queue, item]);
  };

  dequeue = (key) => setQueue(queue.filter((i) => i.key !== key));

  const upload = (data, idInfrator) => {
    const refAnexo = refStAnexos
      .child(idInfrator)
      .child(data.idInfracao)
      .child(data.key);

    return new Promise((resolve, reject) => {
      fetch(data.uri).then((res) => {
        res.blob().then((blob) => {
          const unsubscribe = refAnexo.put(blob).on(
            "state_changed",
            (snap) => {
              data.progress = Math.floor(
                (snap.bytesTransferred / snap.totalBytes) * 100
              );

              enqueue(data);

              if (data.progress >= 100) {
                blob.close();
              }
            },
            reject,
            () => {
              refAnexo.getDownloadURL().then((uri) => {
                unsubscribe();
                dequeue(data.key);
                delete data.key;
                delete data.progress;
                delete data.idInfracao;
                resolve({ ...data, uri });
              });
            }
          );
        });
      });
    });
  };

  return { queue, upload };
};

export default ({ children }) => {
  const uploads = useUploader();

  return (
    <Context.Provider
      value={{
        uploads,
      }}
    >
      {children}
    </Context.Provider>
  );
};

const useUploadContext = () => useContext(Context);

export { useUploadContext };
