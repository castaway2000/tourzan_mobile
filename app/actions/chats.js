import { API } from '../constants'
import { currentuser } from '../global/CurrentUser';


function getChatList() {
    
    console.log('Token is:', 'JWT '+ currentuser.token)

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/chats/' , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT '+ currentuser.token,
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            },
        })
        .then((res) => res.json())
        .then(data => {
            console.log('Get Chat List API Success-->', data);
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