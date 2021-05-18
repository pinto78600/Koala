import React, { useContext } from 'react';
import { UidContext } from '../components/AppContext';
import LeftNav from '../components/LeftNav';
import NewPostForm from '../components/Post/NewPostForm';
import Thread from '../components/Thread';
import Log from '../components/Log';
import Trends from '../components/Trends';
import FriendList from '../components/Profil/FriendList';
import { useSelector } from 'react-redux';
import { isEmpty } from '../components/Utils';

const Home = () => {


    const uid = useContext(UidContext);

    const posts = useSelector(state => state.allPostsReducer);

    return (
        <div className='home' >
            <LeftNav />
            <div className='main'>
                <div className='home-header' >
                    {
                        isEmpty(posts) ? (
                            <div className='icon' >
                                <i className='fas fa-spinner fa-pulse'></i>
                            </div>
                        )
                        :
                        (
                            uid ? <NewPostForm /> : <Log signin={true} signup={false} />

                        )

                    }
                    
                </div>
                <Thread/>
            </div>
            <div className='right-side'>
                <div className='right-side-container' >
                    <div className='wrapper'>
                        <Trends/>
                        {uid && <FriendList/>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;