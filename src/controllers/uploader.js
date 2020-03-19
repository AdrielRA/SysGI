import firebase from '../services/firebase';

class Uploader
{
  anexos_db = firebase.database().ref().child('anexos');
  anexos_st = firebase.storage().ref().child('anexos');

  uploadQueue = [];

  enqueue = (item) => {
    try{
      let index = -1;
      if(this.uploadQueue.length > 0){
        index = this.uploadQueue.findIndex(i => i.key == item.key);
        console.log("Index: " + index);
        if(index >= 0) { 
          this.uploadQueue[index] = item;
          return;
        }
      }
      this.uploadQueue.push(item);
      //console.log(this.uploadQueue);
    }
    catch(e){
      console.log(e.message);
    }
  }
  dequeue = (item) => {
    if(this.uploadQueue.length > 0){
      this.uploadQueue = this.uploadQueue.filter(i => i.key != item.key);
    }    
  }

  callback = undefined;

  upload = async (item_, infratorKey, infraKey) => {

    let anexos = this.anexos_db.child(infratorKey).child(infraKey);
    let key = anexos.push().key;
    let anexo = this.anexos_st.child(infratorKey).child(infraKey).child(key);

    try {
      const fetchResponse = await fetch(item_.uri);
      const blob = await fetchResponse.blob();

      let item = {...item_, key, "status":"up", infraKey};

      let unsubscribe = anexo.put(blob).on('state_changed', (snapshot) => {

          let prog = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

          item = {...item,"progress":prog};
          this.enqueue(item);

          if(this.callback != undefined){
            this.callback();
          }

          if(item.progress >= 100)
          {
            blob.close();
          }
        }, (error) => {
          this.dequeue(item);
          if(this.callback){
            this.callback();
          }
          console.log(error.code);
        }, () => {

          anexo.getDownloadURL().then((url) => {
          //item.status = url;
          //enqueue(item);

          let data = {"fileName":item.fileName, "status":url};
          anexos.child(item.key).set(data)
          .then(() => {
            this.dequeue(item);
            /*if(this.callback){
              this.callback();
            }*/
            unsubscribe();
          })
          .catch((err) => {
             console.log(err);
          });
        });
      });
    }
    catch (error) {
       console.log('ERR: ' + error.message);
    }
  }






}

export default new Uploader