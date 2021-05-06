import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { UidContext } from '../AppContext';
import { isEmpty } from '../Utils';

const NotifsChat = ({data}) => {

    const [notifs, setNotifs] = useState([]);
    const [displayNotif , setDisplayNotif] = useState(true)
    
    const uid = useContext(UidContext);

    const usersData = useSelector(state => state.usersReducer);

    useEffect(() => {
        let arrayNotifs = []
        let arrayLength = [];
        if(!isEmpty(data[0])){ 
            data.map(notif => 
                !isEmpty(notif.notifications) && arrayLength.push(notif.notifications))
                if(isEmpty(arrayLength)) setDisplayNotif(false)
                else{
                    setDisplayNotif(true);
                    for(let i = 0; i < arrayLength.length; i++){                    
                        const arr =  arrayLength[i].map(notif =>  
                            notif.senderId
                            ).filter(fil => { return fil !== uid } );
                            
                            arrayNotifs[i] = usersData.filter(user => {
                                if(user._id === arr[0] ) return user
                                else return null
                            })
                            
                            if(!isEmpty(arr)) arrayNotifs[i].push(arr.length);
                            
                            setNotifs(arrayNotifs)
                        }
                }
        }
    },[data, displayNotif, uid, usersData])    
            
    return (
        <div className='nav-notifs-container' >
            {
                !isEmpty(notifs[0]) && displayNotif ? (
                    notifs.map(notif => {
                    return (
                        <div className='nav-notifs-img'>
                            <NavLink to={{pathname:'/friendly',
                                id: notif[0]._id
                            }}>
                                <div className='number-notifs'>{notif[1]}</div>
                                <img src={notif[0].picture} alt='user-pic' />
                            </NavLink>
                        </div> 
                        ) 
                    })
                )
                :
                (
                    null
                )
            }
        </div>
    );
};

export default NotifsChat;