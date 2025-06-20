import { API } from "../constants";

//Store
import { store } from "../store/index";

function emailLogin(params) {
  let storestate = store.getState();

  var formData = new FormData();

  formData.append("username", params.username);
  formData.append("password", params.password);

  let url = API.SERVER + API.VERSION + "/rest-auth/login/";

  console.log("Email Login API URL-->", url);
  console.log("Email Login API PARAMS-->", formData);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        pragma: "no-cache",
        "Cache-Control": "no-cache"
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log("Email Login API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Email Login API Error", err);
        reject(err);
      });
  });
}

function emailSignup(params) {
  //Get store data
  let storestate = store.getState();

  var formData = new FormData();
  formData.append("username", params.username);
  formData.append("email", params.email);
  formData.append("password1", params.password1);
  formData.append("password2", params.password2);

  let url = API.SERVER + API.VERSION + "/rest-auth/registration/";

  console.log("Email Signup API URL-->", url);
  console.log("Email Signup API PARAMS-->", formData);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        pragma: "no-cache",
        "Cache-Control": "no-cache"
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log("Email Signup API Success->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Email Signup API Error->", err);
        reject(err);
      });
  });
}

function profile(params) {
  let storeState = store.getState();

  var formData = new FormData();
  formData.append("user_id", params.userid);

  let url = API.SERVER + API.VERSION + "/user_profile/";

  console.log("Get Profile API URL-->", url);
  console.log("Get Profile API PARAMS-->", formData);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "JWT " + storeState.user.userdata.token,
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log("Get Profile API Success->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Get Profile API Error->", err);
        reject(err);
      });
  });
}

function usermixins(params) {
  let storeState = store.getState();

  var formData = new FormData();
  formData.append("id", params.id);
  formData.append("user_type", params.usertype);

  let url = API.SERVER + API.VERSION + "/user_mixins/";

  // console.log("Usermixins API URL-->", url);
  // console.log("Usermixins API PARAMS-->", formData);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "Cache-Control": "force-cache",
        "pragma": "force-cache",
        Authorization: "JWT " + storeState.user.userdata.token,
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        // console.log("Usermixins API Success->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Usermixins API Error->", err);
        reject(err);
      });
  });
}

function changePassword(params) {
  let storeState = store.getState();

  var formData = new FormData();
  formData.append("new_password1", params.passwordNew);
  formData.append("new_password2", params.passwordConfirm);

  let url = API.SERVER + API.VERSION + "/rest-auth/password/change/";

  console.log("Change Password API URL-->", url);
  console.log("Change Password API PARAMS-->", formData);

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
        console.log("Change Password API Success->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Change Password API Error->", err);
        reject(err);
      });
  });
}

function resetPassword(params) {
  var formData = new FormData();
  formData.append("email", params.email);

  let url = API.SERVER + API.VERSION + "/rest-auth/password/reset/";

  console.log("Reset Password API URL-->", url);
  console.log("Reset Password API PARAMS-->", formData);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        pragma: "no-cache",
        "Cache-Control": "no-cache"
        // 'Authorization': 'JWT ' + currentuser.token,
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log("Reset Password API Success->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Reset Password API Error->", err);
        reject(err);
      });
  });
}

function updateGuideProfile(params) {
  let storeState = store.getState();

  var url = API.SERVER + API.VERSION + "/edit_profile/edit_guide_profile/?";

  let esc = encodeURIComponent;
  let query = Object.keys(params)
    .map(k => esc(k) + "=" + esc(params[k]))
    .join("&");

  url = url + query;

  console.log("Update Guide Profile API URL-->", url);

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
        console.log("Update Guide Profile API Success->", data);
        resolve(data);
      })
      .catch(err => {
        reject(err);
        console.log("Update Guide Profile API Error->", err);
      });
  });
}

function updateTouristProfile(params) {
  let storeState = store.getState();

  var url = API.SERVER + API.VERSION + "/edit_profile/edit_profile/?";

  let esc = encodeURIComponent;
  let query = Object.keys(params)
    .map(k => esc(k) + "=" + esc(params[k]))
    .join("&");

  url = url + query;

  console.log("Update Tourist Profile API URL-->", url);

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
        console.log("Update Tourist Profile API Success->", data);
        resolve(data);
      })
      .catch(err => {
        reject(err);
        console.log("Update Tourist Profile API Error->", err);
      });
  });
}

function searchInterest(params) {
  let storeState = store.getState();

  var url = API.SEARCH_INTERESTS;

  let esc = encodeURIComponent;
  let query = Object.keys(params)
    .map(k => esc(k) + "=" + esc(params[k]))
    .join("&");

  url = url + query;

  console.log("Get Nearby Guides API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "JWT " + storeState.user.userdata.token,
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Search Interest API Success->", data);
        resolve(data);
      })
      .catch(err => {
        reject(err);
        console.log("Search Interest API Error->", err);
      });
  });
}

function addReview(params) {
  let storeState = store.getState();

  var url = API.SERVER + API.VERSION + "/reviews/create_review/?";

  let esc = encodeURIComponent;
  let query = Object.keys(params)
    .map(k => esc(k) + "=" + esc(params[k]))
    .join("&");

  url = url + query;

  console.log("Add Review API URL-->", url);

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
        console.log("Add Review API Success->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Add Review API Error->", err);
        reject(err);
      });
  });
}

function languageSearch(params) {
  let storeState = store.getState();

  var url = API.SEARCH_LANGUAGES;

  let esc = encodeURIComponent;
  let query = Object.keys(params)
    .map(k => esc(k) + "=" + esc(params[k]))
    .join("&");

  url = url + query;

  console.log("Language Search API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "JWT " + storeState.user.userdata.token,
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Language Search API Success->", data);
        resolve(data);
      })
      .catch(err => {
        reject(err);
        console.log("Language Search API Error->", err);
      });
  });
}

function verifyToken() {
  let storeState = store.getState();

  var formData = new FormData();
  formData.append("token", storeState.user.userdata.token);

  let url = API.SERVER + API.VERSION + "/api-token-verify/";

  console.log("Verify Token API URL-->", url);
  console.log("Verify Token API PARAMS-->", formData);

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
        console.log("Verify Token API Success->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Verify Token API Error->", err);
        reject(err);
      });
  });
}

function uploadProfilePicture(param) {
  let storeState = store.getState();

  var formData = new FormData();
  formData.append("user_type", param.user_type);
  formData.append("image", param.image);

  let url = API.SERVER + API.VERSION + "/upload_profile_image/";

  console.log("Upload Profile API URL-->", url);
  console.log("Upload Profile API PARAMS-->", formData);

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
        console.log("Upload Profile API Success->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Upload Profile API Error->", err);
        reject(err);
      });
  });
}

function getOrdersTouristRepresentation() {
  let storeState = store.getState();

  let url = API.SERVER + API.VERSION + "/orders/get_tourist_representation/";

  console.log("Get Orders Tourist Representation API URL-->", url);
  // console.log("Get Orders Tourist Representation API PARAMS-->", formData);

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
        // console.log("Get Orders Tourist Representation API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Get Orders Tourist Representation API Error", err);
        reject(err);
      });
  });
}

function getOrderbyid(orderid) {
  let storeState = store.getState();

  //https://testing.tourzan.com/api/v1/orders/483
  let url = API.SERVER + API.VERSION + "/orders/" + orderid;

  console.log("Get Orders By ID API URL-->", url);

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
        // console.log("Get Orders By ID API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Get Orders By ID API Error", err);
        reject(err);
      });
  });
}

function getReviewTouristRepresentation() {
  let storeState = store.getState();

  let url = API.SERVER + API.VERSION + "/reviews/get_tourist_representation/";

  console.log("Get Review Tourist Representation API URL-->", url);
  // console.log("Get Review Tourist Representation API PARAMS-->", formData);

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
        // console.log("Get Review Tourist Representation API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Get Review Tourist Representation API Error", err);
        reject(err);
      });
  });
}

function getUserProfileAllData() {
  let storeState = store.getState();

  let url = API.SERVER + API.VERSION + "/get_my_profile_info/";

  console.log("Get My Profile info API URL-->", url);
  // console.log("Get My Profile info API PARAMS-->", formData);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pragma: "no-cache",
        "Cache-Control": "no-cache",
        Authorization: "JWT " + storeState.user.userdata.token
      }
    })
      .then(res => res.json())
      .then(data => {
        //console.log("Get My Profile info API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Get My Profile info  API Error", err);
        reject(err);
      });
  });
}

module.exports = {
  emailLogin,
  emailSignup,
  profile,
  changePassword,
  resetPassword,
  usermixins,
  updateGuideProfile,
  updateTouristProfile,
  searchInterest,
  addReview,
  languageSearch,
  verifyToken,
  uploadProfilePicture,
  getOrdersTouristRepresentation,
  getOrderbyid,
  getReviewTouristRepresentation,
  getUserProfileAllData
};
