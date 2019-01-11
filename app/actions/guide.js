import { API } from "../constants";

//Store
import { store } from "../store/index";

function getGuideList() {
  let storeState = store.getState();

  let url = API.SERVER + API.VERSION + "/guides/";

  console.log("Get Guide List API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "JWT " + storeState.user.userdata.token
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Get Guide List API Success->", data);
        resolve(data);
      })
      .catch(err => {
        reject(err);
        console.log("Get Guide List API Error->", err);
      });
  });
}

function bookGuide(params) {
  let storeState = store.getState();

  var formData = new FormData();
  formData.append("token", params.token);
  formData.append("user_id", params.userid);
  formData.append("guides", params.guides);
  formData.append("latitude", params.latitude);
  formData.append("longitude", params.longitude);
  formData.append("time_limit", params.timelimit);
  formData.append("booking_type", params.bookingtype);

  let url = API.SERVER + API.VERSION + "/mobile/book_guide/";

  console.log("Booking Guide API URL-->", url);
  console.log("Booking Guide API PARAMS-->", formData);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "JWT " + storeState.user.userdata.token
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log("Booking Guide API Success->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Booking Guide API Error->", err);
        reject(err);
      });
  });
}

function previousGuideList() {
  let storeState = store.getState();

  let url = API.SERVER + API.VERSION + "/orders/";

  console.log("Previous Guide List API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "JWT " + storeState.user.userdata.token
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Previous Guide List API Success->", data);
        resolve(data);
      })
      .catch(err => {
        reject(err);
        console.log("Previous Guide List API Error->", err);
      });
  });
}

function getOrdersGuideRepresentation() {
  let storeState = store.getState();

  let url = API.SERVER + API.VERSION + "/orders/get_guide_representation/";

  console.log("Get Orders Guide Representation API URL-->", url);
  // console.log("Get Orders Guide Representation API PARAMS-->", formData);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "JWT " + storeState.user.userdata.token
      }
    })
      .then(res => res.json())
      .then(data => {
        // console.log("Get Orders Guide Representation API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Get Orders Guide Representation API Error", err);
        reject(err);
      });
  });
}

function getReviewGuideRepresentation() {
  let storeState = store.getState();

  let url = API.SERVER + API.VERSION + "/reviews/get_guide_representation/";

  console.log("Get Review Guide Representation API URL-->", url);
  // console.log("Get Review Guide Representation API PARAMS-->", formData);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "JWT " + storeState.user.userdata.token
      }
    })
      .then(res => res.json())
      .then(data => {
        // console.log("Get Review Guide Representation API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Get Review Guide Representation API Error", err);
        reject(err);
      });
  });
}

module.exports = {
  getGuideList,
  bookGuide,
  previousGuideList,
  getOrdersGuideRepresentation,
  getReviewGuideRepresentation
};
