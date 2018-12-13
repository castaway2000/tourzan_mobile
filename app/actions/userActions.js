import { UPDATE_USER, UPDATE_ORDER_LIST, UPDATE_CHAT } from "./actionTypes";

const updateuser = userdata => {
  return {
    type: UPDATE_USER,
    userdata: userdata
  };
};

const updateOrder = orderdata => {
  return {
    type: UPDATE_ORDER_LIST,
    orderdata: orderdata
  };
};

const updateChat = chats => {
  return {
    type: UPDATE_CHAT,
    chats: chats
  };
};

export { updateuser, updateOrder, updateChat };
