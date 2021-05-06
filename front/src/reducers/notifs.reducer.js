import { GET_NOTIFS } from "../actions/userFriend.actions";

const initialState = {};

export default function notifsReducer(state = initialState, action){
    switch(action.type){
        case GET_NOTIFS:
            return action.payload;
        default:
            return state;
    }
}