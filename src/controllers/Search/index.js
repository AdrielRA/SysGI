import { db, auth } from '../../services/firebase';

export default {
    onAuthStateChanged(callback) {
        auth().onAuthStateChanged((user) => {
            callback(user)
        });
    },
    getSearchInfrator(child, termo){
        return db()
        .ref("infratores")
        .orderByChild(child)
        .limitToFirst(1)
        .equalTo(termo);
    },
    setFoundInfrator(snapshot, setInfratorKey, setInfrator){
        snapshot.forEach((child) =>{

            if (child.val()) {

              setInfratorKey(child.key);

              let infrator = child.val();
              let infras = [];

              if (child.val().Infrações) {
                infras = Object.values(child.val().Infrações);
              }

              infrator.Infrações = infras;
              setInfrator(infrator);

            }

          });
    }

}