import {
  UPDATE_USER,
  UPDATE_ORDER_LIST,
  UPDATE_CHAT
} from "../actions/actionTypes";

const initialState = {
  userdata: {
    token: null,
    user: {
      pk: null,
      username: null,
      email: null,
      guide_id: null,
      guide_profile_image: null,
      tourist_profile_image: null,
      isClockedIn: false,
      general_profile: {
        phone: null,
        phone_is_validated: null,
        registration_country: null,
        registration_state: null,
        registration_city: null,
        registration_street: null,
        registration_building_nmb: null,
        registration_flat_nmb: null,
        registration_postcode: null
      },
      interests: [
        {
          id: null,
          interest: {
            id: null,
            name: null,
            created: null,
            updated: null
          },
          user: null
        }
      ]
    }
  },
  orderList: [],
  chats: []
};

const getProfilePictureUrl = userdata => {
  if (!userdata.user || !userdata.user.isLoggedInAsGuide) {
    return require("../assets/images/defaultavatar.png");
  }

  let url = "";
  if (userdata.user.isLoggedInAsGuide === true) {
    url = userdata.user.guide_profile_image;
  } else {
    url = userdata.user.tourist_profile_image;
  }

  if (url && url.length > 4) {
    return { uri: url };
  } else {
    return require("../assets/images/defaultavatar.png");
  }
};

const isGuide = userdata => {
  if (userdata.user.guide_id) {
    return true;
  } else {
    return false;
  }
};

const getUserId = userdata => {
  if (userdata.user.guide_id) {
    return userdata.user.pk;
  } else {
    return userdata.user.pk;
  }
};

const updateUser = (state, action) => {
  let ud = action.userdata;

  if (!ud || !ud.user) {
    return state;
  }

  ud.user.profilepicture = getProfilePictureUrl(ud);

  ud.user.isGuide = isGuide(ud);

  ud.user.userid = getUserId(ud);

  return { ...state, userdata: Object.assign({}, ud) };
};

const updateOrder = (state, action) => {
  let ud = action.orderdata;
  return { ...state, orderList: ud };
};

const updateChat = (state, action) => {
  let ud = action.chats;
  return { ...state, chats:  Object.assign([], ud) };
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return updateUser(state, action);
    case UPDATE_CHAT:
      return updateChat(state, action);
    case UPDATE_ORDER_LIST:
      return updateOrder(state, action);
    default:
      return state;
  }
};

export default userReducer;
