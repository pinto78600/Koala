import { GET_USER_FRIEND } from "../actions/userFriend.actions";

const initialState = {};

export default function userFriendReducer(state = initialState, action){
    switch(action.type){
        case GET_USER_FRIEND:
            return action.payload;
        default:
            return state;
    }
}