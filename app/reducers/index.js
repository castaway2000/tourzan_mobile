import { combineReducers } from 'redux'

import tour from './tour'
import user from './user'
import location from './location'

export default combineReducers({
    tour,
    user,
    location
})