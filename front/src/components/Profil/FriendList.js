import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { isEmpty } from '../Utils';
import FollowHandler from './FollowHandler';

const FriendList = () => {
    const [isLoading, setIsLoading]  = useState(true);
    const [playOnce, setPlayOnce]  = useState(true);
    const [friendsHint, setFriendsHint] = useState([]);
    const userData = useSelector(state => state.userReducer)
    let usersData = useSelector(state => state.usersReducer)

    
    useEffect(() => {
        const notFriendsList = () => {
            let array = [];
            // if(!isEmpty(userData.blocked)){
            //     for(let i = 0; i < userData.blocked.length; i++){
            //         usersData = usersData.filter(fil => fil._id !== userData.blocked[i])
            //     }
            // }

            usersData.map(user => {
                if(user._id !== userData._id && 
                    !user.followers.includes(userData._id)){
                        return array.push(user._id);
                    }
                else return usersData
            });
            array.sort(() => 0.5 - Math.random());
            if(window.innerHeight > 780) {
                array.length = 5;
            }else if (window.innerHeight > 720){
                array.length = 4;
            }else if (window.innerHeight > 615){
                array.length = 3;
            }else if (window.innerHeight > 540){
                array.length = 1;
            }else {
                array.length = 0;
            }
            setFriendsHint(array);
        }
        if(playOnce && !isEmpty(usersData[0]) && !isEmpty(userData._id)){
            notFriendsList();
            setIsLoading(false);
            setPlayOnce(false);
        }
    }, [usersData, userData, playOnce])

    return (
        <div className='get-friends-container'>
            <h4>Suggestions</h4>
            {isLoading ? (
                <div className='icon' >
                    <i className='fas fa-spinner fa-pulse'></i>
                </div>
            )
            :
            (
                <ul>
                    {friendsHint && friendsHint.map(user => {
                        for(let i = 0 ; i < usersData.length; i++){
                            if(user === usersData[i]._id) {
                                return (
                                    <li key={usersData[i]._id} className='user-hint'>
                                        <NavLink to={{pathname:'/friendly', id:usersData[i]._id}}>
                                            <img src={usersData[i].picture} alt='user-pic' />
                                        </NavLink>
                                        <p >{usersData[i].pseudo}</p>
                                        <FollowHandler idToFollow={usersData[i]._id} type={'suggestion'} />
                                    </li>
                                )
                            }
                        }return usersData
                    })}
                </ul>
            )
            }
        </div>
    );
};

export default FriendList;