import { API, Paymentrails, OnfidoAPIKey } from "../constants";
var CryptoJS = require("crypto-js");

//Store
import { store } from "../store/index";

function brainTreeToken() {
  let storeState = store.getState();

  let url =
    API.SERVER + API.VERSION + "/secret/payment-methods/get_braintree_token/";

  console.log("GET Braintree Server Token API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "JWT " + storeState.user.userdata.token
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("GET Braintree Server Token API Success->", data);
        resolve(data);
      })
      .catch(err => {
        reject(err);
        console.log("GET Braintree Server Token API Error->", err);
      });
  });
}

function brainTreeSaveNonce(params) {
  let storeState = store.getState();

  let url =
    API.SERVER +
    API.VERSION +
    "/secret/payment-methods/create_payment_method/?payment_method_nonce=" +
    encodeURIComponent(params.paymentmethodnonce) +
    "&is_default=" +
    encodeURIComponent(params.isdefault);

  console.log("Braintree Save Nonce API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "JWT " + storeState.user.userdata.token,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Braintree Save Nonce API Success->", data);
        resolve(data);
      })
      .catch(err => {
        reject(err);
        console.log("Braintree Save Nonce API Error->", err);
      });
  });
}

function allPayments() {
  let storeState = store.getState();

  let url = API.SERVER + API.VERSION + "/secret/payment-methods/";

  console.log("All Braintree Payments Token API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "JWT " + storeState.user.userdata.token
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("All Braintree Payments Token API Success->", data);
        resolve(data);
      })
      .catch(err => {
        reject(err);
        console.log("All Braintree Payments Token API Error->", err);
      });
  });
}

function setDefaultCard(params) {
  let storeState = store.getState();

  let url =
    API.SERVER +
    API.VERSION +
    "/secret/payment-methods/" +
    encodeURIComponent(params.paymentmethodid) +
    "/set_as_default_payment_method/";

  console.log("Braintree Set Default Card API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "JWT " + storeState.user.userdata.token,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Braintree Set Default Card API Success->", data);
        resolve(data);
      })
      .catch(err => {
        reject(err);
        console.log("Braintree Set Default Card API Error->", err);
      });
  });
}

function deactiveteCard(params) {
  let storeState = store.getState();

  let url =
    API.SERVER +
    API.VERSION +
    "/secret/payment-methods/" +
    encodeURIComponent(params.paymentmethodid) +
    "/deactivate_payment_method/";

  console.log("raintree Deactivete Card API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "JWT " + storeState.user.userdata.token,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Braintree Deactivete Card API Success->", data);
        resolve(data);
      })
      .catch(err => {
        reject(err);
        console.log("Braintree Deactivete Card API Error->", err);
      });
  });
}

function createApplicantOnfido(params) {
  let storeState = store.getState();

  var formData = new FormData();
  formData.append("first_name", params.firstname);
  formData.append("last_name", params.lastname);

  let url = API.ONFIDO_CREATE_APPLICANTS;
  console.log("Onfido Create Applicant API URL-->", url);
  console.log("Onfido Create Applicant API PARAMS-->", formData);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "Token token=" + OnfidoAPIKey.key
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log("Onfido Create Applicant API Success->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Onfido Create Applicant API Error->", err);
        reject(err);
      });
  });
}

function generateAuthorization(timestamp, endPoint, method, body = "") {
  let apiSecret = Paymentrails.apiSecret;
  let apiKey = Paymentrails.apiKey;

  try {
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, apiSecret);

    hmac.update(`${timestamp}\n${method}\n${endPoint}\n${body}\n`);

    let hash = hmac.finalize();

    var signature = hash.toString(CryptoJS.enc.Hex);

    return `prsign ${apiKey}:${signature}`;
  } catch (typeError) {
    console.log(typeError);
    return "prsign 1:1";
  }
}

function createRecipientsPaymentrails(body) {
  let storeState = store.getState();

  let url = API.PAYMENTRAILS_RECIPIENT;

  const date = new Date();
  const timestamp = Math.round(date / 1000);

  let method = "POST";

  // var body = {
  //   type: "individual",
  //   firstName: "John",
  //   lastName: "Smith",
  //   email: "jsmith@example.com"
  // };

  let auth = generateAuthorization(
    timestamp,
    "/v1/recipients",
    method,
    JSON.stringify(body)
  );

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "X-PR-Timestamp": timestamp,
        Authorization: auth
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        console.log("Paymentrails Create RecipientsAPI Success->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Paymentrails Create Recipients API Error->", err);
        reject(err);
      });
  });
}

function paymentMethodTypes() {
  let storeState = store.getState();

  let url = API.SERVER + API.VERSION + "/secret/paymentmethodtypes/";

  console.log("Payment Method Types API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "JWT " + storeState.user.userdata.token,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Payment Method Types API Success->", data);
        resolve(data);
      })
      .catch(err => {
        reject(err);
        console.log("Payment Method Types API Error->", err);
      });
  });
}

module.exports = {
  brainTreeToken,
  brainTreeSaveNonce,
  allPayments,
  setDefaultCard,
  deactiveteCard,
  createApplicantOnfido,
  createRecipientsPaymentrails,
  paymentMethodTypes
};
