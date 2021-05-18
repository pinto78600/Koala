import React, { useEffect, useState } from 'react';
import LeftNav from '../LeftNav';
import { useDispatch, useSelector } from "react-redux";
import UploadImg from './UploadImg';
import { updateBio } from '../../actions/user.actions';
import { dateParser, isEmpty } from '../Utils';
import FollowHandler from './FollowHandler';
import { getPostUser } from '../../actions/post.actions';
import Card from '../Post/Card';

const UpdateProfil = () => {
    const [bio, setBio] = useState('');
    const [updateForm, setUpdateForm] = useState(false);
    const [followingPopup, setFollowingPopup] = useState(false);
    const [followersPopup, setFollowersPopup] = useState(false);
    const userData = useSelector(state => state.userReducer)
    const usersData = useSelector(state => state.usersReducer)
    const postUser = useSelector(state => state.postReducer);
    const dispatch = useDispatch();
    
    const handleUpdate = () => {
        dispatch(updateBio(userData._id, bio));
        setUpdateForm(false);
    }

    useEffect(() => {
        if(userData) dispatch(getPostUser(userData._id))
    },[userData, dispatch])

    return (
        <div className='profile-container'>
            <LeftNav/>
            <h1>Profil de {userData.pseudo} </h1>
            <div className='update-container' >
                <div className='left-part' >
                    <h3>Photo de profil</h3>
                    <img src={userData.picture} alt="picUser" />
                    <UploadImg/>
                </div>
                <div className='right-part'>
                    <div className='bio-update'>
                        <h3>Bio</h3>
                        {!updateForm ? (
                            <>
                                <p onClick={() => setUpdateForm(!updateForm)} >{userData.bio}</p>
                                <button onClick={() => setUpdateForm(!updateForm)} >Modifier bio</button>
                            </>
                        )
                        :
                        (
                            <>
                                <textarea type='text' defaultValue={userData.bio} 
                                onChange={e => setBio(e.target.value)}
                                ></textarea>
                                <button onClick={handleUpdate}>Valider modification</button>
                                
                            </>
                        )
                        }
                    </div>
                    <h4>Membre depuis le : { dateParser(userData.createdAt) }</h4>
                    <h5 onClick={() => setFollowingPopup(true)} >Abonnements : {userData.following ? userData.following.length : ""}</h5>
                    <h5 onClick={() => setFollowersPopup(true)} >Abonnés : {userData.followers ?  userData.followers.length : "" } </h5>
                </div>
            </div>
            {followingPopup && (
                <div className="popup-profil-container">
                    <div className='modal' >
                        <h3>Abonnements</h3>
                        <span onClick={() => setFollowingPopup(false)} className='cross'>&#10005;</span>
                        <ul>
                            {
                                usersData.map(user => {
                                    for(let i = 0; i < userData.following.length ; i++){
                                        if(user._id === userData.following[i]){
                                            return(
                                                <li key={user._id}>
                                                <img src={user.picture} alt="picUser" />
                                                <h4>{user.pseudo}</h4>
                                                <div className='follow-handler' >
                                                    <FollowHandler idToFollow={user._id} type='suggestion'/>
                                                </div>
                                            </li>
                                            )
                                        }
                                    }
                                    return null
                                })
                            }
                        </ul>
                    </div>
                </div>
            )}
            {followersPopup && (
                <div className="popup-profil-container">
                    <div className='modal' >
                        <h3>Abonnés</h3>
                        <span onClick={() => setFollowersPopup(false)} className='cross'>&#10005;</span>
                        <ul>
                            {
                                usersData.map(user => {
                                    for(let i = 0; i < userData.followers.length ; i++){
                                        if(user._id === userData.followers[i]){
                                            return(
                                                <li key={user._id}>
                                                <img src={user.picture} alt="picUser" />
                                                <h4>{user.pseudo}</h4>
                                                <div className='follow-handler' >
                                                    <FollowHandler idToFollow={user._id} type='suggestion'/>
                                                </div>
                                            </li>
                                            )
                                        }
                                    }
                                    return null
                                })
                            }
                        </ul>
                    </div>
                </div>
            )}
            <div className='post-profil-user'>
                <ul>
                {!isEmpty(postUser[0]) && 
                                postUser.map(post => {
                                    return  <Card post={post} key={post._id}/>
                                })
                            }
                </ul>
            </div>
        </div>
    );
};

export default UpdateProfil;