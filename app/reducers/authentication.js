const initialState = {
  user_email: ""
}

const authentication = (state, action) => {

  if (typeof state === 'undefined') {
    return initialState
  }

  switch (action.type) {
    case 'LOGIN':
      return {
        user_email: action.user_email,
      };
    default:
      return state;
  }
};
export default authentication;
