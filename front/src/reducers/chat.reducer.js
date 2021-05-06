import { GET_ROOM_CHAT } from "../actions/userFriend.actions";

const initialState = {};

export default function chatReducer(state = initialState, action){
    switch(action.type){
        case GET_ROOM_CHAT:
            return action.payload;
        default:
            return state;
    }
}