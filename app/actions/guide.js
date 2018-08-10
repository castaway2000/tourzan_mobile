import { API } from '../constants'

//Store
import {store} from '../store/index'

function getGuideList() {

    let storeState = store.getState()

    console.log(' storeState.user.userdata.token', storeState.user.userdata.token)
    

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/guides/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Authorization': 'JWT ' + storeState.user.userdata.token,
            },
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Get Guide List API Success->', data);
                resolve(data);
            })
            .catch(err => {
                reject(err)
                console.log('Get Guide List API Error->', err);
            });
    })
}

function bookGuide(params) {

    console.log(params)

    var formData = new FormData();
    formData.append('token', params.token)
    formData.append('user_id', params.userid)
    formData.append('guides', params.guides)
    formData.append('latitude', params.latitude)
    formData.append('longitude', params.longitude)
    formData.append('time_limit', params.timelimit)
    formData.append('booking_type', params.bookingtype)

    console.log('bookGuide param:', formData)

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/mobile/book_guide/', {
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
                console.log('Booking Guide API Success->', data);
                resolve(data);
            })
            .catch(err => {
                console.log('Booking Guide API Error->', err);
                reject(err);
            });
    })
}

module.exports = {
    getGuideList,
    bookGuide
}