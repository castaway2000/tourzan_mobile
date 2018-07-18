import { UPDATE_BOOKING } from '../actions/actionTypes'

const initialState = {
    bookingdata: {
        isbooked: false,
        isAutomatic: true,
        timeLimit: 18000,
        lat: 0.0,
        long: 0.0
    },
};

const update = (state, action) => {
    return { ...state, bookingdata: state.bookingdata }
}

const tourReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_BOOKING: return update(state, action);
        default: return state;
    }
};

export default tourReducer;