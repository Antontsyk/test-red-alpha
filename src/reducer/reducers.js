import { SET_DATA, DELETE_DATA } from '../actions';

const dataCalls = (state = JSON.parse(localStorage.getItem('myDat')), action) => {
    switch (action.type) {
        case SET_DATA:
            return action.payload;
        case DELETE_DATA:
            return state;
        default:
            return state;
    }
};

export default dataCalls;
