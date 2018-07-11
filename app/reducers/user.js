import { UPDATE_USER } from '../actions/actionTypes'

const initialState = {
    userdata: {
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
    },
};

const getProfilePictureUrl = (userdata) => {

    let url = ''
    if (userdata.guide_id) {
        url = userdata.user.guide_profile_image
    } else {
        url = userdata.user.tourist_profile_image
    }

    if (url) {
        return url
    } else {
        return require("../assets/images/person1.png")
    }
};

const isGuide = (userdata) => {
    if (userdata.user.guide_id) {
        return true
    } else {
        return false
    }
};

const getUserId = (userdata) => {
    if (userdata.user.guide_id) {
        return userdata.user.pk
    } else {
        return userdata.user.pk
    }
};

const update = (state, action) => {

    state.userdata = action.userdata

    state.userdata.user.profilepicture = getProfilePictureUrl(state.userdata)

    state.userdata.user.isGuide = isGuide(state.userdata)

    state.userdata.user.userid = getUserId(state.userdata)

    return { ...state, userdata: state.userdata }
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER: return update(state, action);
        default: return state;
    }
};

export default userReducer;