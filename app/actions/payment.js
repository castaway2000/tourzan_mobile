import { API } from "../constants";

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

function createApplicant(params) {
  let storeState = store.getState();

  var formData = new FormData();
  formData.append("first_name", params.firstname);
  formData.append("last_name", params.lastname);

  let url = API.ONFIDO_CREATE_APPLICANTS;
  console.log("Braintree Create Applicant API URL-->", url);
  console.log("Braintree Create Applicant API PARAMS-->", formData);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "Token token=test_tLlvRsGwFHHBHZr_mw02f372SkQwFAb3"
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log("Braintree Create Applicant API Success->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Braintree Create Applicant API Error->", err);
        reject(err);
      });
  });
}

module.exports = {
  brainTreeToken,
  brainTreeSaveNonce,
  allPayments,
  setDefaultCard,
  deactiveteCard,
  createApplicant
};
