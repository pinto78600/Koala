import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { GiThreeFriends } from 'react-icons/gi'
import { FaHome } from 'react-icons/fa'
import { IoRocketSharp } from 'react-icons/io5'
import { FaUser } from 'react-icons/fa'
import { isEmpty } from './Utils';
import { useDispatch, useSelector } from 'react-redux';
import useChat from './useChat';
import { getNotifs, postNotifs } from '../actions/userFriend.actions';
import NotifsChat from './Friend/NotifsChat';
import { UidContext } from './AppContext';
import useSound from 'use-sound';
import notif from '../sound/notif.mp3';

const LeftNav = () => {

    const { messages } = useChat('notification');
    const [play] = useSound(notif);
    
    const dispatch = useDispatch();

    const uid = useContext(UidContext);

    const notifsData = useSelector(state => state.notifsReducer);
    
    useEffect(() => {
        if(uid) dispatch(getNotifs(uid))
        
        let lastElement = messages[messages.length - 1]
        if(!isEmpty(lastElement) && lastElement.senderId === uid){
            dispatch(postNotifs(lastElement.roomId, lastElement.senderId))            
        } 
        !isEmpty(lastElement) && lastElement.senderId !== uid && play()

        
        return () => {
            if(uid) dispatch(getNotifs(uid));

        }
 
    },[messages, uid, dispatch, play])
    
    return (
       <div className='left-nav-container'>
           <div className='icons' >
                <div className='icons-bis' >
                    <NavLink to='/' exact activeClassName="active-left-nav" >
                        <FaHome size='3em'/>
                    </NavLink>
                    <br/>
                    <NavLink to='/trending' exact activeClassName="active-left-nav" >
                        <IoRocketSharp size='3em'/>
                    </NavLink >
                    <br/>
                    <NavLink to='/profil' exact activeClassName="active-left-nav" >
                        <FaUser size='3em'/>
                    </NavLink>
                    <br />
                    <NavLink to='/friendly' exact activeClassName="active-left-nav" >
                        <GiThreeFriends size='3em'/>
                    </NavLink>
                    <NotifsChat data={notifsData}/>
                </div>
           </div>

       </div>
    );
};

export default LeftNav;