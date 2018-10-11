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

module.exports = {
  getChatList
};
