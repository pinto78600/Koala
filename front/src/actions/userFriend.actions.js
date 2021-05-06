import axios from 'axios';
import { isEmpty } from '../components/Utils';

export const GET_USER_FRIEND = "GET_USER_FRIEND";
export const GET_ROOM_CHAT = "GET_ROOM_CHAT";
export const GET_NOTIFS = "GET_NOTIFS";
export const POST_NOTIFS = "POST_NOTIFS";
export const DELETE_NOTIFS = "DELETE_NOTIFS";


export const getUserFriend = uidFriend => {
    return (dispatch) => {
        return axios
            .get(`${process.env.REACT_APP_API_URL}api/user/${uidFriend}`)
            .then(res => {
                dispatch({ type : GET_USER_FRIEND, payload : res.data });
            })
            .catch((err) => console.log(err)); 
    }
};

export const getRoomChat = (uid, uidFriend, num) => {    return (dispatch) => {
        return axios({
            method: 'get',
            url:`${process.env.REACT_APP_API_URL}api/utils/friendly/${uid}/${uidFriend}`,
            withCredentials:true
        }).then(res => {
              const data = res.data;
              let dataRoom = ''
              if(!isEmpty(data)){
                  const dataLength = data[0].messages.length;
                  data[0].messages = data[0].messages.reverse().slice(0, num).reverse();
                  dataRoom = { data, dataLength }
              }else dataRoom = [];
            dispatch({ type : GET_ROOM_CHAT, payload : dataRoom });
          }).catch((err) => console.log(err)); 
    }
};

export const getNotifs = (id) => {
    return (dispatch) => {
        return axios
            .get(`${process.env.REACT_APP_API_URL}api/utils/${id}`)
            .then(res => {
                dispatch({ type : GET_NOTIFS, payload : res.data });
            })
            .catch((err) => console.log(err)); 
    }
};

export const postNotifs = (roomid, senderId) => {
    return () => {
        return axios({
            method:'post',
            url:`${process.env.REACT_APP_API_URL}api/utils/friendly/${roomid}`,
            data :  {senderId}
        }).then(res => {
            if(res.data.errors) console.log(res.data.errors);
            })
            .catch((err) => console.log(err)); 
    }
};

export const deleteNotifs = (id, senderId) => {
    return (dispatch) => {
        return axios ({
            method: 'patch',
            url:`${process.env.REACT_APP_API_URL}api/utils/${id}`,
            data: {senderId}
        }).then(res => {
            if(res.data.errors) console.log(res.data.errors);
        })
        .catch(err => console.log(err));
    }
}