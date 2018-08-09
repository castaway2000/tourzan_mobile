import { API } from '../constants'

//Store
import { store } from '../store/index'

function getTourList() {

    console.log('Update Clock In Out status API Params', 'null');

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/tours/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            },
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Get Tour List API Success->', data);
                resolve(data);
            })
            .catch(err => {
                console.log('Get Tour List API Error->', err);
                reject(err);
            });
    })
}

function updateClockInOutStatus(params) {

    console.log('Update Clock In Out status API Params', params);

    var formData = new FormData();

    formData.append('user_id', params.userid);
    formData.append('status', params.status); //clockin or clockout
    formData.append('latitude', params.latitude);
    formData.append('longitude', params.longitude);

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/mobile/update_trip/', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            },
            body: formData
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Update Clock In Out status API Success', data);
                resolve(data);
            })
            .catch(err => {
                console.log('Update Clock In Out status API Error', err);
                reject(err);
            });
    })
}

function endTrip(params) {

    console.log('END trip API Params', params);

    var formData = new FormData();

    formData.append('trip_id', params.tripid); //'guide'
    formData.append('status', params.status); //"ended"

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/mobile/update_trip/', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            },
            body: formData
        })
            .then((res) => res.json())
            .then(data => {
                console.log('END trip API Success', data);
                resolve(data);
            })
            .catch(err => {
                console.log('END trip  API Error', err);
                reject(err);
            });
    })
}

function cancelTrip(params) {

    console.log('Cancel trip API Params', params);

    var formData = new FormData();

    formData.append('user_id', params.userid); 
    formData.append('status', params.status);
    formData.append('type', params.type); 
    formData.append('trip_id', params.tripid); 

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/mobile/update_trip/', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            },
            body: formData
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Cancel trip API Success', data);
                resolve(data);
            })
            .catch(err => {
                console.log('Cancel trip  API Error', err);
                reject(err);
            });
    })
}

function declineTrip(params) {

    console.log('Decline trip API Params', params);

    var formData = new FormData();

    formData.append('type', params.type); //'guide'
    formData.append('user_id', params.userid); //13
    formData.append('status', params.status); //"isDeclined"
    formData.append('trip_id', params.tripid); //

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/mobile/update_trip/', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            },
            body: formData
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Decline trip API Success', data);
                resolve(data);
            })
            .catch(err => {
                console.log('Decline trip  API Error', err);
                reject(err);
            });
    })
}

function acceptTrip(params) {

    console.log('Accept trip API Params', params);

    var formData = new FormData();

    formData.append('type', params.type); //'guide'
    formData.append('user_id', params.userid); //13
    formData.append('status', params.status); //isAccepted
    formData.append('guide_id', params.guideid); //14

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/mobile/update_trip/', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            },
            body: formData
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Accept trip API Success', data);
                resolve(data);
            })
            .catch(err => {
                console.log('Accept trip  API Error', err);
                reject(err);
            });
    })
}

function updateTrip(params) {

    console.log('Update trip API Params', params);

    var formData = new FormData();

    formData.append('type', params.type); //'guide'
    formData.append('user_id', params.userid); //13
    formData.append('status', params.status); //update
    formData.append('latitude', params.guideid); //14.12340
    formData.append('longitude', params.guideid); //12.54321

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/mobile/update_trip/', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            },
            body: formData
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Update trip API Success', data);
                resolve(data);
            })
            .catch(err => {
                console.log('Update trip  API Error', err);
                reject(err);
            });
    })
}

function extendTime(params) {

    console.log('Extend trip API Params', params);

    var formData = new FormData();

    formData.append('trip_id', params.tripid); //''
    formData.append('add_time', params.addtime); //in seconds
    formData.append('requester_id', params.requesterid); //

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/mobile/extend_time/', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            },
            body: formData
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Extend trip API Success', data);
                resolve(data);
            })
            .catch(err => {
                console.log('Extend trip  API Error', err);
                reject(err);
            });
    })
}

function gettripstatus(params) {

    console.log('Get trip status trip API Params', params);

    var formData = new FormData();

    formData.append('tripid', params.type);

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/mobile/get_trip_status/', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            },
            body: formData
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Extend trip API Success', data);
                resolve(data);
            })
            .catch(err => {
                console.log('Extend trip  API Error', err);
                reject(err);
            });
    })
}

function getnearbyguides(params) {

    console.log('Get trip status trip API Params', params);

    var formData = new FormData();

    formData.append('user_id', params.userid);
    formData.append('latitude', params.latitude);
    formData.append('longitude', params.longitude);
    formData.append('units', params.units); //mi or km for miles or kilometers
    formData.append('range', params.range); //10

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/mobile/get_nearby_guides/', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            },
            body: formData
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Extend trip API Success', data);
                resolve(data);
            })
            .catch(err => {
                console.log('Extend trip  API Error', err);
                reject(err);
            });
    })
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
}