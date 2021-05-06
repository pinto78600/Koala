import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import usersReducer from './users.reducer';
import postReducer from './post.reducer';
import errorReducer from './error.reducer';
import allPostsReducer from './allPosts.reducer';
import trendingReducer from './trending.reducer';
import userFriendReducer from './userFriend.reducer';
import chatReducer from './chat.reducer';
import notifsReducer from './notifs.reducer';
import shareReducer from './share.reducer'

export default combineReducers({
    userReducer,
    usersReducer,
    postReducer,
    errorReducer,
    allPostsReducer,
    trendingReducer,
    userFriendReducer,
    chatReducer,
    notifsReducer,
    shareReducer
});