import { API } from '../constants'

//Store
import configureStore from '../configureStore'
const store = configureStore();


function getChatList() {

    let storeState = store.getState()

    console.log('Token is:', 'JWT ' + storeState.user.userdata.token)

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/chats/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + storeState.user.userdata.token,
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