const initialTourState = {
    list: []
};

function tour(state = initialTourState, action){
    switch(action.type){
        case 'settour':
            return{
                ...state,
                list: action.data
            };
        default: 
            return state;
    }
}