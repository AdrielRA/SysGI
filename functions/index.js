const functions = require('firebase-functions');
var fetch = require('node-fetch');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendPushNotification = functions.database.ref('/infratores/{Id}').onCreate((snapshot, context) => {

    const id = context.params.Id;
    const root = snapshot.ref.root;

    let messages = [];

    return root.child('/users').once('value').then(function (snapshot) {

        snapshot.forEach(function (child) {

            let expoToken = child.val().Device;

            if (expoToken) {

                messages.push({
                    "to": expoToken,
                    "title":"Informações adicionadas!",
                    "body": "Um novo infrator foi adicionado!"
                });
            }
        });

        return Promise.all(messages);

    }).then(messages => {

        fetch('https://exp.host/--/api/v2/push/send', {

            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messages)
        });
    });
})

exports.sendUpdateNotification = functions.database.ref('/infratores/{Id}').onUpdate((change, context) => {

    const id = context.params.Id;
    const root = change.after.ref.root;

    let messages = [];

    return root.child('/users').once('value').then(function (snapshot) {

        let promisses = [];
        snapshot.forEach(function (child) {

            if(child.val()){
                promisses.push(
                    child.ref.child('Infratores_favoritados').once("value", (snapshot) => {
                        if(snapshot.val()){

                            if(snapshot.val().includes(id)){
                                let expoToken = child.val().Device;
                
                                if (expoToken) {
                    
                                    messages.push({
                                        "to": expoToken,
                                        "title":"Atualização dos dados!",
                                        "body": "Um infrator favoritado foi atualizado!"
                                    });
                                }
                            }
                        }
                    })
                );
            }
        });

        return Promise.all(promisses);

    }).then(() => {

        fetch('https://exp.host/--/api/v2/push/send', {

            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messages)
        });
    });
});