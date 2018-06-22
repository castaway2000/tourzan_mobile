import { API } from '../constants'
import { currentuser } from '../global/CurrentUser';


function getChatList() {
    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/chats/' , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + currentuser.token
            },
        })
        .then((res) => res.json())
        .then(data => {
            console.log('Get Chat List API Success->', data);
            resolve(data);
        })
        .catch(err => {
            console.log('Get Chat List API Error->', err);
        });
    })
}

module.exports = {
    getChatList,
}