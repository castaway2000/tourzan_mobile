import { API } from "../constants";

//Store
import { store } from "../store/index";

function getChatList() {
  let storeState = store.getState();

  let url = API.SERVER + API.VERSION + "/chats/";

  console.log("Get Chat List API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + storeState.user.userdata.token,
        pragma: "no-cache",
        "Cache-Control": "no-cache"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Get Chat List API Success-->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Get Chat List API Error->", err);
        reject(err);
      });
  });
}

function sendChatMessage(params) {
  let storeState = store.getState();

  let url = API.SERVER + API.VERSION + "/chat_messages/send_message/?";

  let esc = encodeURIComponent;
  let query = Object.keys(params)
    .map(k => esc(k) + "=" + esc(params[k]))
    .join("&");

  url = url + query;

  console.log("Send Chat API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "JWT " + storeState.user.userdata.token
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Send Chat API Success->", data);
        resolve(data);
      })
      .catch(err => {
        reject(err);
        console.log("Send Chat API Error->", err);
      });
  });
}

function getChatListGuideRepresentation() {
  let storeState = store.getState();

  let url = API.SERVER + API.VERSION + "/chats/";

  console.log("Get Chat List API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + storeState.user.userdata.token,
        pragma: "no-cache",
        "Cache-Control": "no-cache"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Get Chat List API Success-->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Get Chat List API Error->", err);
        reject(err);
      });
  });
}

function getChatListRepresentation() {
  let storeState = store.getState();

  let url = API.SERVER + API.VERSION + "/chats/";

  console.log("Get Chat List API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "JWT " + storeState.user.userdata.token,
        pragma: "no-cache",
        "Cache-Control": "no-cache"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Get Chat List API Success-->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Get Chat List API Error->", err);
        reject(err);
      });
  });
}

module.exports = {
  getChatList,
  sendChatMessage,
  getChatListGuideRepresentation,
  getChatListRepresentation
};
