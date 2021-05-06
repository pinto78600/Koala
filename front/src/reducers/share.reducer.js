import { GET_POST } from "../actions/post.actions";

const initialState = {};

export default function shareReducer (state = initialState, action){
    switch (action.type){
        case GET_POST:
            return action.payload;
        default:
            return state
    }
} 