import{db} from '../../services/firebase';

export default{
    setDataEdit(rg, callback){
        
        let query = db().ref("infratores").orderByChild("Rg").equalTo(rg);
        query.once("value", function (snapshot) {
          if (snapshot.val() != null) {
            snapshot.forEach(function (child) {
              if (child.val()) {
                callback(child.key);
              }
            });
          }
        });
    }
}