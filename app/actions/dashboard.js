// We speciify the name of the action as a variable
export const HIDE_DASHBOARD_NAVIGATIONBAR = 'HIDE_DASHBOARD_NAVIGATIONBAR'

// This is an action creator, it simply specifies the action.
// this is what we call to send an action.
export  function hideOrShowDashboardNavigationbar()  {
  return {
    type: HIDE_DASHBOARD_NAVIGATIONBAR
  }
}