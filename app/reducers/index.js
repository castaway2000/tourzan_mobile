import { combineReducers } from 'redux'

import tour from './tour'
import  map from './map'

const AppReducer = combineReducers({
    tour,
    map
})