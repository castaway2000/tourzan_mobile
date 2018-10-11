import { API } from "../constants";

//Store
import { store } from "../store/index";

function getTourList() {
  let url = API.SERVER + API.VERSION + "/tours/";

  console.log("Get Tour List API URL-->", url);

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        pragma: "no-cache",
        "Cache-Control": "no-cache"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Get Tour List API Success->", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Get Tour List API Error->", err);
        reject(err);
      });
  });
}

function updateClockInOutStatus(params) {
  var formData = new FormData();

  formData.append("user_id", params.userid);
  formData.append("status", params.status); //clockin or clockout
  formData.append("latitude", params.latitude);
  formData.append("longitude", params.longitude);

  let url = API.SERVER + API.VERSION + "/mobile/update_trip/";

  console.log("Update Clock In Out status API URL-->", url);
  console.log("Update Clock In Out status API PARAMS-->", formData);

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
        console.log("Update Clock In Out status API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Update Clock In Out status API Error", err);
        reject(err);
      });
  });
}

function endTrip(params) {
  var formData = new FormData();

  formData.append("trip_id", params.tripid); //'guide'
  formData.append("status", params.status); //"ended"

  let url = API.SERVER + API.VERSION + "/mobile/update_trip/";

  console.log("END Trip API URL-->", url);
  console.log("END Trip API PARAMS-->", formData);

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
        console.log("END Trip API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("END Trip API Error", err);
        reject(err);
      });
  });
}

function cancelTrip(params) {
  var formData = new FormData();

  formData.append("user_id", params.userid);
  formData.append("status", params.status);
  formData.append("type", params.type);
  formData.append("trip_id", params.tripid);

  let url = API.SERVER + API.VERSION + "/mobile/update_trip/";

  console.log("Cancel Trip API URL-->", url);
  console.log("Cancel Trip API PARAMS-->", formData);

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
        console.log("Cancel Trip API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Cancel Trip API Error", err);
        reject(err);
      });
  });
}

function declineTrip(params) {
  var formData = new FormData();

  formData.append("type", params.type); //'guide'
  formData.append("user_id", params.userid); //13
  formData.append("status", params.status); //"isDeclined"
  formData.append("trip_id", params.tripid); //

  let url = API.SERVER + API.VERSION + "/mobile/update_trip/";

  console.log("Decline trip API URL-->", url);
  console.log("Decline trip API PARAMS-->", formData);

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
        console.log("Decline trip API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Decline trip API Error", err);
        reject(err);
      });
  });
}

function acceptTrip(params) {
  var formData = new FormData();

  formData.append("status", params.status); //isAccepted
  formData.append("user_id", params.userid); //13
  formData.append("guide_id", params.guideid); //14
  formData.append("type", params.type); //'automatic'
  formData.append("time", params.time); //'second'

  let url = API.SERVER + API.VERSION + "/mobile/update_trip/";

  console.log("Accept trip API URL-->", url);
  console.log("Accept trip API PARAMS-->", formData);

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
        console.log("Accept trip API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Accept trip  API Error", err);
        reject(err);
      });
  });
}

function updateTrip(params) {
  var formData = new FormData();

  formData.append("status", params.status); //update_trip
  formData.append("latitude", params.latitude);
  formData.append("longitude", params.longitude);
  formData.append("trip_id", params.tripid);

  let url = API.SERVER + API.VERSION + "/mobile/update_trip/";

  console.log("Update trip  API URL-->", url);
  console.log("Update trip  API PARAMS-->", formData);

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
        console.log("Update trip API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Update trip  API Error", err);
        reject(err);
      });
  });
}

function loginAndUpdateTrip(params) {
  var formData = new FormData();

  formData.append("status", params.status); //login
  formData.append("latitude", params.latitude);
  formData.append("longitude", params.longitude);
  formData.append("user_id", params.userid);
  formData.append("device_token", params.devicetoken);

  let url = API.SERVER + API.VERSION + "/mobile/update_trip/";

  console.log("Login and Update API URL-->", url);
  console.log("Login and Update API PARAMS-->", formData);

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
        console.log("Login and Update API Responce", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Login and Update API Error", err);
        reject(err);
      });
  });
}

function extendTime(params) {
  var formData = new FormData();

  formData.append("trip_id", params.tripid); //''
  formData.append("add_time", params.addtime); //in seconds
  formData.append("requester_id", params.requesterid); //

  let url = API.SERVER + API.VERSION + "/mobile/extend_time/";

  console.log("Extend Trip API URL-->", url);
  console.log("Extend Trip API PARAMS-->", formData);

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
        console.log("Extend Trip API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Extend Trip API Error", err);
        reject(err);
      });
  });
}

function gettripstatus(params) {
  var formData = new FormData();

  formData.append("trip_id", params.tripid);

  let url = API.SERVER + API.VERSION + "/mobile/get_trip_status/";

  console.log("Get Trip Status API URL-->", url);
  console.log("Get Trip Status API PARAMS-->", formData);

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
        console.log("Get Trip Status API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Get Trip Status API Error", err);
        reject(err);
      });
  });
}

function getnearbyguides(params) {
  var formData = new FormData();

  formData.append("user_id", params.userid);
  formData.append("latitude", params.latitude);
  formData.append("longitude", params.longitude);
  formData.append("units", params.units); //mi or km for miles or kilometers
  formData.append("range", params.range); //10

  let url = API.SERVER + API.VERSION + "/mobile/get_nearby_guides/";

  console.log("Get Nearby Guides API URL-->", url);
  console.log("Get Nearby Guides API PARAMS-->", formData);

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
        console.log("Get Nearby Guides API Success", data);
        resolve(data);
      })
      .catch(err => {
        console.log("Get Nearby Guides API Error", err);
        reject(err);
      });
  });
}

module.exports = {
  getTourList,
  updateClockInOutStatus,
  endTrip,
  cancelTrip,
  declineTrip,
  acceptTrip,
  updateTrip,
  extendTime,
  gettripstatus,
  getnearbyguides,
  loginAndUpdateTrip
};
