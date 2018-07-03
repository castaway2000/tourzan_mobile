import { API } from '../constants'
import { currentuser } from '../global/CurrentUser';

function getTourList(){
    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/tours/' , {
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
        });
    })
}


module.exports = {
    getTourList,
}