import { API } from '../constants'
import { currentuser } from '../global/CurrentUser';

function emailLogin(params) {
    
    var formData = new FormData();

    formData.append('username', params.username);
    formData.append('password', params.password);

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/rest-auth/login/' , {
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
                'Content-Type': 'multipart/form-data',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache'
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

function profile(params){
    console.log(params)
    var formData = new FormData();
    formData.append('user_id', params.userid)

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/user_profile/' , {
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
            console.log('Profile API Success->', data);
            resolve(data);
        })
        .catch(err => {
            console.log('Profile API Error->', err);
        });
    })
}

function changePassword(params){
    console.log(params)
    var formData = new FormData();
    formData.append('new_password1', params.passwordNew)
    formData.append('new_password2', params.passwordConfirm)

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/rest-auth/password/change/' , {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Authorization': 'JWT '+ currentuser.token,
            },
            body: formData
        })
        .then((res) => res.json())
        .then(data => {
            console.log('Change Password API Success->', data);
            resolve(data);
        })
        .catch(err => {
            console.log('Change Password API Error->', err);
        });
    })
}

function resetPassword(params){
    console.log(params)
    var formData = new FormData();
    formData.append('email', params.email)

    return new Promise((resolve, reject) => {
        fetch(API.SERVER + 'v1/rest-auth/password/reset/' , {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                // 'Authorization': 'JWT ' + currentuser.token,
            },
            body: formData
        })
        .then((res) => res.json())
        .then(data => {
            console.log('Reset Password API Success->', data);
            resolve(data);
        })
        .catch(err => {
            console.log('Reset Password API Error->', err);
        });
    })
}

module.exports = {
    emailLogin,
    emailSignup,
    profile,
    changePassword,
    resetPassword
}