import { API } from '../constants'

//Store
import configureStore from '../configureStore'
const store = configureStore();

function getGuideList() {
    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/guides/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            },
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Get Guide List API Success->', data);
                resolve(data);
            })
            .catch(err => {
                console.log('Get Guide List API Error->', err);
            });
    })
}

function bookGuide(params) {

    console.log(params)

    var formData = new FormData();
    formData.append('token', params.token)
    formData.append('user_id', params.userid)
    formData.append('guide_id', params.guideid)
    formData.append('latitude', params.latitude)
    formData.append('longitude', params.longitude)
    formData.append('time_limit', params.timelimit)
    formData.append('booking_type', params.bookingtype)

    console.log('bookGuide param:', params)

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
            });
    })
}

module.exports = {
    getGuideList,
    bookGuide
}