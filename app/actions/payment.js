import { API } from '../constants'

//Store
import { store } from '../store/index'

function brainTreeToken() {

    let storeState = store.getState()

    console.log(' storeState.user.userdata.token', storeState.user.userdata.token)

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/secret/payment-methods/get_braintree_token/', {
            method: 'GET',
            headers: {
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Authorization': 'JWT ' + storeState.user.userdata.token,
            },
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Braintree Server Token API Success->', data);
                resolve(data);
            })
            .catch(err => {
                reject(err)
                console.log('Braintree Server Token API Error->', err);
            });
    })
}

function brainTreeSaveNonce(params) {

    let storeState = store.getState()

    console.log(' storeState.user.userdata.token', storeState.user.userdata.token)

    let url = API.SERVER + 'v1/secret/payment-methods/create_payment_method/?payment_method_nonce=' + encodeURIComponent(params.paymentmethodnonce) + '&is_default=' + encodeURIComponent(params.isdefault)

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Authorization': 'JWT ' + storeState.user.userdata.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Braintree Save Token API Success->', data);
                resolve(data);
            })
            .catch(err => {
                reject(err)
                console.log('Braintree Save Token API Error->', err);
            });
    })
}

function brainTreeToken() {

    let storeState = store.getState()

    console.log(' storeState.user.userdata.token', storeState.user.userdata.token)

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/secret/payment-methods/get_braintree_token/', {
            method: 'GET',
            headers: {
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Authorization': 'JWT ' + storeState.user.userdata.token,
            },
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Braintree Server Token API Success->', data);
                resolve(data);
            })
            .catch(err => {
                reject(err)
                console.log('Braintree Server Token API Error->', err);
            });
    })
}

function allPayments() {

    let storeState = store.getState()

    console.log(' storeState.user.userdata.token', storeState.user.userdata.token)

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/secret/payment-methods/', {
            method: 'GET',
            headers: {
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Authorization': 'JWT ' + storeState.user.userdata.token,
            },
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Braintree Server Token API Success->', data);
                resolve(data);
            })
            .catch(err => {
                reject(err)
                console.log('Braintree Server Token API Error->', err);
            });
    })
}

function setDefaultCard(params) {

    let storeState = store.getState()

    console.log(' storeState.user.userdata.token', storeState.user.userdata.token)

    let url = API.SERVER + 'v1/secret/payment-methods/' + encodeURIComponent(params.paymentmethodid)  + '/set_as_default_payment_method/'

    http://localhost:8002/api/v1/secret/payment-methods/payment_method_id/set_as_default_payment_method


    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Authorization': 'JWT ' + storeState.user.userdata.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Braintree Save Token API Success->', data);
                resolve(data);
            })
            .catch(err => {
                reject(err)
                console.log('Braintree Save Token API Error->', err);
            });
    })
}

function deactiveteCard(params) {

    let storeState = store.getState()

    console.log(' storeState.user.userdata.token', storeState.user.userdata.token)

    let url = API.SERVER + 'v1/secret/payment-methods/' + encodeURIComponent(params.paymentmethodid)  + '/deactivate_payment_method/'

    console.log('deactivate url', url)
    
    http://localhost:8002/api/v1/secret/payment-methods/payment_method_id/set_as_default_payment_method


    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Authorization': 'JWT ' + storeState.user.userdata.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
            .then((res) => res.json())
            .then(data => {
                console.log('Braintree Save Token API Success->', data);
                resolve(data);
            })
            .catch(err => {
                reject(err)
                console.log('Braintree Save Token API Error->', err);
            });
    })
}


module.exports = {
    brainTreeToken,
    brainTreeSaveNonce,
    allPayments,
    setDefaultCard,
    deactiveteCard
}