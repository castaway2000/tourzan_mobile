import { API } from '../constants'

function getTourList(){
    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/tours/' , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((res) => res.json())
        .then(data => {
            console.log('Get Tour List API Success->', data);
            resolve(data);
        })
        .catch(err => {
            console.log('Get Tour List API Error->', err);
        });
    })
}


module.exports = {
    getTourList,
}