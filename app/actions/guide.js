import { API } from '../constants'

function getGuideList(){
    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/guides/' , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
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


module.exports = {
    getGuideList,
}