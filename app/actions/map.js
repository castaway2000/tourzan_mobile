import * as types from './types'
// This is an action creator, it simply specifies the action.
// this is what we call to send an action.
export  function getBookedState()  {
  return {
    type: types.IS_BOOKED
  }
}