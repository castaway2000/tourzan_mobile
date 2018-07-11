import { combineReducers } from 'redux'

import tour from './tour'
import user from './user'

export default combineReducers({
    tour,
    user
})