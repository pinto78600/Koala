import React, { useContext } from 'react';
import { UidContext } from '../components/AppContext';
import Log from '../components/Log';
import ProfilFriend from '../components/Friend/ProfilFriend';

const FriendPage = (props) => {
    const uidFriend = props.location.id;
    const uid = useContext(UidContext);

    return (
        <div className='profil-page' >
            {uid ? (
                <ProfilFriend  uidFriend={uidFriend} />
            )
            :
            (
                <div className='log-container' >
                    <Log signin={false} signup={true} />
                <div className='img-container'>
                    <img src='./img/log.svg' alt='login'/>
                </div>

                </div>
            )
            }
        </div>
    );
};

export default FriendPage;