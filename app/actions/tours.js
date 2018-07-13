import { API } from '../constants'

//Store
import configureStore from '../configureStore'
const store = configureStore();

function getTourList() {
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

    var formData = new FormData();

    formData.append('type', params.type);
    formData.append('user_id', params.userid);
    formData.append('status', params.status);
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

    var formData = new FormData();

    formData.append('type', params.type); //'guide'
    formData.append('user_id', params.userid); //13
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

    var formData = new FormData();

    formData.append('type', params.type); //'guide'
    formData.append('user_id', params.userid); //13
    formData.append('status', params.status); //"isCancelled"

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

    var formData = new FormData();

    formData.append('type', params.type); //'guide'
    formData.append('user_id', params.userid); //13
    formData.append('status', params.status); //"isDeclined"

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

    var formData = new FormData();

    formData.append('token', params.type); //''
    formData.append('user_id', params.userid); //13
    formData.append('add_time', params.status); //in seconds

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

module.exports = {
    getTourList,
    updateClockInOutStatus,
    endTrip,
    cancelTrip,
    declineTrip,
    acceptTrip,
    updateTrip,
    extendTime
}