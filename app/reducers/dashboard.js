import {HIDE_DASHBOARD_NAVIGATIONBAR} from '../actions/dashboard'

// This is the default state of the app i.e. when the app starts for the first time
const initialState = {
  counter: false
}

// This is a reducer which listens to actions and modifies the state
 export default function hideReducer(state = initialState, action){
  // A switch is used since if more actions are added in the future, it will be easy
  // to be able to handle this in the reducer since we just add another 'case'.
  switch (action.type) {
    case HIDE_DASHBOARD_NAVIGATIONBAR:
        return {
            ...state,
            isHideDashboardNavigationbar: !state.isHideDashboardNavigationbar
        }
    default: return state
  }
}