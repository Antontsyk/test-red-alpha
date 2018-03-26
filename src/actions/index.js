import moment from 'moment';

export const SET_DATA = 'SET_DATA';
export const DELETE_DATA = 'DELETE_DATA';

export const set = value => ({
    type: SET_DATA,
    payload: value,
});

export const del = value => ({
    type: DELETE_DATA,
    payload: value,
});

export const actionTable = (val, method) => (dispatch, getState) => {
    const { dataCalls } = getState();
    if (method === 'add') {
        dataCalls.push(val);
        console.log(dataCalls.sort((a, b) => moment(a.time) > moment(b.time)));
        localStorage.setItem('myDat', JSON.stringify(dataCalls));

        dispatch(set(dataCalls));
    }
    if (method === 'del') {
        const index = dataCalls.map(x => x.name).indexOf(val);

        if (index !== -1) {
            dataCalls.splice(index, 1);
            console.log(dataCalls);
            localStorage.setItem('myDat', JSON.stringify(dataCalls));
        }
        dispatch(del(dataCalls));
    }
};

