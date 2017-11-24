import { API } from '../constants'

function emailLogin(params){
    var formData = new FormData();
    formData.append('username', params.username);
    formData.append('password', params.password);

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/api-token-auth/' , {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        })
        .then((res) => res.json())
        .then(data => {
            console.log('Email Login API Success', data);
            resolve(data);
        })
        .catch(err => {
            console.log('Email Login API Error', err);
        });
    })
}

function emailSignup(params){
    console.log(params)
    var formData = new FormData();
    formData.append('username', params.username)
    formData.append('email', params.email)
    formData.append('password1', params.password)
    formData.append('password2', params.confirm)

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/signup_user/' , {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        })
        .then((res) => res.json())
        .then(data => {
            console.log('Email Signup API Success->', data);
            resolve(data);
        })
        .catch(err => {
            console.log('Email Signup API Error->', err);
        });
    })
}


module.exports = {
    emailLogin,
    emailSignup
}