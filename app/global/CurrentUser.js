
let currentuser = {
    "token": null,
    "user": {
        "pk": null,
        "username": null,
        "email": null,
        "guide_id": null,
        "guide_profile_image": null,
        "tourist_profile_image": null,
        "general_profile": {
            "phone": null,
            "phone_is_validated": null,
            "registration_country": null,
            "registration_state": null,
            "registration_city": null,
            "registration_street": null,
            "registration_building_nmb": null,
            "registration_flat_nmb": null,
            "registration_postcode": null
        },
        "interests": [
            {
                "id": null,
                "interest": {
                    "id": null,
                    "name": null,
                    "created": null,
                    "updated": null
                },
                "user": null
            }
        ]
    }
}

const isGuide = () => {
    if (currentuser.user.guide_id) {
        return true
    } else {
        return false
    }
};

const userid = () => {
    if (currentuser.user.guide_id) {
        return currentuser.user.pk
    } else {
        return currentuser.user.pk
    }
};

const profilePictureUrl = () => {
    let url = ''
    if (currentuser.user.guide_id) {
        url = currentuser.user.guide_profile_image
    } else {
        url = currentuser.user.tourist_profile_image
    }

    if (url) {
        return url
    } else {
        return require("../assets/images/person1.png")
    }
};

const UserData = {
    currentuser,
    isGuide,
    userid,
    profilePictureUrl
};

module.exports = UserData;
