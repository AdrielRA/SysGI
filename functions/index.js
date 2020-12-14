/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
const functions = require("firebase-functions");
var fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const { Expo } = require("expo-server-sdk");

const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

let expo = new Expo();

const getAllTokens = (ref) => {
  return new Promise((resolve, reject) => {
    let tokens = [];
    ref
      .once("value")
      .then((snap) => {
        snap.forEach((child) => {
          let token = child.val().Device;
          if (!Expo.isExpoPushToken(token))
            console.error(`Push token ${token} is not a valid Expo push token`);
          else tokens.push(token);
        });

        Promise.all(tokens).then(() => resolve(tokens));
      })
      .catch(() => resolve([]));
  });
};

const getTokensFromFavorite = (ref) => {
  return new Promise((resolve, reject) => {
    let tokens = [];
    ref
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((child) => {
          if (child.exists()) {
            child.ref
              .child("Infratores_favoritados")
              .once("value", (snapshot) => {
                if (snapshot.val()) {
                  if (snapshot.val().includes(id)) {
                    let token = child.val().Device;

                    if (!Expo.isExpoPushToken(token))
                      console.error(
                        `Push token ${token} is not a valid Expo push token`
                      );
                    else tokens.push(token);
                  }
                }
              });
          }
        });
        Promise.all(tokens).then(() => resolve(tokens));
      })
      .catch(() => resolve([]));
  });
};

const dispatchNotifications = (messages) => {
  return fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });
};

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  secureConnection: false,
  port: 587,
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: "sysgi@hotmail.com",
    pass: "@d1minL0gin1",
  },
});

exports.sendAddNotification = functions.database
  .ref("/infratores/{Id}")
  .onCreate((snapshot, context) => {
    const root = snapshot.ref.root;

    let messages = [];
    const title = "Informações adicionadas!";
    const body = "Um novo infrator foi adicionado!";

    getAllTokens(root.child("/users").ref).then((tokens) => {
      let promises = tokens.map((to) => {
        messages.push({
          to,
          title,
          body,
        });
      });

      Promise.all(promises).then(() => dispatchNotifications(messages));
    });
  });

exports.sendUpdateNotification = functions.database
  .ref("/infratores/{Id}")
  .onUpdate((change, context) => {
    const id = context.params.Id;
    const root = change.after.ref.root;

    let messages = [];

    getTokensFromFavorite(root.child("/users").ref).then((tokens) => {
      let promises = tokens.map((to) => {
        messages.push({
          to,
          title,
          body,
        });
      });

      Promise.all(promises).then(() => dispatchNotifications(messages));
    });
  });

exports.sendAddEmail = functions.database
  .ref("/infratores/{Id}")
  .onCreate((snapshot, context) => {
    const root = snapshot.ref.root;
    const nome = snapshot.val().Nome;

    const subject = "Informações adicionadas!";
    const html = `<h4>Um novo infrator foi adicionado!</h4><br/><p><strong>Nome: </strong>${nome}</p>`;

    const email = {
      from: "sysgi@hotmail.com",
      to: "elianelago@mpmg.mp.br",
      subject,
      text: "Não é necessário responder à este email.",
      html,
    };

    transporter.sendMail(email, (err, result) => {
      if (err) return console.log(err);
      console.log("Mensagem enviada!!!!" + result);
    });
  });
