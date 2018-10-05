import { API } from '../constants'

//Store
import { store } from '../store/index'

function autocompleteCity(params) {

    let storeState = store.getState()

    var url = API.GOOGLE_PLACE_AUTOCOMPLETE

    let esc = encodeURIComponent
    let query = Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&')

    url = url + query

    console.log('Autocomplete City API URL-->', url);

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Autocomplete City API Success->', data);
                resolve(data);
            })
            .catch(err => {
                reject(err)
                console.log('Autocomplete City API Error->', err);
            });
    })
}

module.exports = {
    autocompleteCity,
}