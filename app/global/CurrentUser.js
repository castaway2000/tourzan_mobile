

let currentuser = {
    "token": null,
    "user": {
        "street": null,
        "building_num": null,
        "email": null,
        "postcode": null,
        "country": null,
        "city": null,
        "username": null,
        "state": null,
        "flat_num": null,
        "phone": null,
        "guide_id": null,
        "user_id": null
    }
}

const token = () => {
  console.log('profile token is', currentuser.token);
};

const worker = {
  token,
  currentuser
};

module.exports = worker;
