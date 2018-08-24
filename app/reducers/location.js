import { UPDATE_CURRENT_LOCATION} from '../actions/actionTypes'

const initialState = {
    currentlocation: {
        lat: null,
        long: null,
    }
};

const update = (state, action) => {

    let currentlocation = action.currentlocation

    return { ...state, currentlocation: Object.assign({}, currentlocation) }
} 

const locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_CURRENT_LOCATION: return update(state, action);
        default: return state;
    }
};

export default locationReducer;