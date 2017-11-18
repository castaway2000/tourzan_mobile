import * as types from '../actions/types'

// This is the default state of the app i.e. when the app starts for the first time
const initialState = {
  // isbooked: false
}

// This is a reducer which listens to actions and modifies the state
 export default function getBookedState(state = initialState, action){
  // A switch is used since if more actions are added in the future, it will be easy
  // to be able to handle this in the reducer since we just add another 'case'.
  switch (action.type) {
    case types.IS_BOOKED:
        return {
            // ...state,
            isbooked: !state.isbooked
        } 
    default:
      return state
  }
}