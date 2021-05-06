import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dateParser, isEmpty } from '../Utils';
import FollowHandler from '../Profil/FollowHandler';
import LikeButton from './LikeButton';
import { updatePost } from '../../actions/post.actions';
import DeleteCard from './DeleteCard';
import CardComment from './CardComment';
import { NavLink } from 'react-router-dom';
import PostShare from './PostShare';

const Card = ({ post }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);
    const [textUpdated, setTextUpdated] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const usersData = useSelector(state => state.usersReducer);
    const userData = useSelector(state => state.userReducer);

    const dispatch = useDispatch();

    const updateItem =  () => {
        if(textUpdated){
            dispatch(updatePost(textUpdated, post._id));
        }
        setIsUpdated(false)
    }
    
    useEffect(() =>{
        !isEmpty(usersData[0]) && setIsLoading(false);
    }, [usersData])
    return (
       <li className='card-container' key={post._id} >
           {isLoading ? (
               <i className="fas fa-spinner fa-spin"></i>
           )
           : 
           (
            <>
                <div className='card-left'>

                    {userData && userData._id !== post.posterId ? (

                        <NavLink to={{pathname:'/friendly',
                        id: post.posterId
                        }}>
                            <img src={
                                !isEmpty(usersData[0]) && 
                                    usersData.map(user => {
                                    if(user._id === post.posterId )return user.picture;
                                    else return null  
                                    }
                                ).join('')
                            }
                            alt='usePic'
                            />
                        </NavLink>
                    )
                    :
                    (
                        <NavLink to={{pathname:'/profil'}}>
                            <img src={
                                !isEmpty(usersData[0]) && 
                                    usersData.map(user => {
                                    if(user._id === post.posterId )return user.picture;
                                    else return null  
                                    }
                                ).join('')
                            }
                            alt='usePic'
                            />
                        </NavLink>
                    )
                    }

                </div>
                <div className='card-right' >
                    <div className='card-header' >
                        <div  className='pseudo' >
                            <h3>
                                {
                                    !isEmpty(usersData[0]) && 
                                    usersData.map(user => {
                                    if(user._id === post.posterId )return user.pseudo;  
                                    else return null
                                    }
                                    ).join('')
                                }
                            </h3>
                            {post.posterId !== userData._id &&
                            <FollowHandler idToFollow={post.posterId} type='card' />
                            }
                        </div>
                        <span>{dateParser(post.createdAt)}</span>
                    </div>
                    {isUpdated === false && <p>{post.message}</p>}
                    {isUpdated &&(
                        <div className='update-post' >
                            <textarea defaultValue={post.message} onChange={e => setTextUpdated(e.target.value)} />
                            <div className='button-container' >
                                <button className='btn' onClick={updateItem}>
                                    Valider modification
                                </button>
                            </div>
                        </div>
                    ) }
                    { 
                        !isEmpty(post.share) && (
                        <div className='card-shared-container' >

                                        <div className='card-left-shared'>
                                            <NavLink to={{pathname:'/friendly',
                                                id: post.share[0].sharedId
                                            }}>
                                                    <img src={!isEmpty(usersData[0]) && 
                                                        usersData.map(user => {
                                                            if(user._id === post.share[0].sharedId ){
                                                                return user.picture
                                                            }else return null  
                                                        }
                                                        ).join('')} alt='userpic'/>
                                            </NavLink>
                                        </div>
                        <div className='card-right-shared'>
                                <div className='shared-right' >
                                    <div className='pseudo-share'>
                                        <h3>{!isEmpty(usersData[0]) && 
                                        usersData.map(user => {
                                            if(user._id === post.share[0].sharedId ){
                                                return user.pseudo
                                            }else return null  
                                        }
                                        ).join('')}</h3>
                                    </div>
                                    <span>{dateParser(post.share[0].timestamp)}</span>
                                </div>
                                <p>{post.share[0].sharedMessage}</p>
                                {post.share[0].sharedPicture !== "" && <img src={post.share[0].sharedPicture} alt='post-pic' className='card-shared-pic' />}
                                {post.share[0].sharedVideo !== "" && (
                                        <iframe
                                        width='450'
                                        height='300'
                                        src={post.share[0].sharedVideo}
                                        frameBorder='0'
                                        allow="accelerometer; autoplay ; clipboard-write
                                            encrypted-media ; gyroscope ; picture-in-picture" 
                                        title={post.share[0]._id}
                                    ></iframe>
                                )}
                            </div>
                        </div> 
                    ) 
                
                    }

                    {post.picture && <img src={post.picture} alt="card-pic" className='card-pic'/>}
                    {post.video && (
                        <iframe
                            width='500'
                            height='300'
                            src={post.video}
                            frameBorder='0'
                            allow="accelerometer; autoplay ; clipboard-write
                                encrypted-media ; gyroscope ; picture-in-picture" 
                            title={post._id}
                        ></iframe>
                    )}
                    {userData._id === post.posterId && (
                        <div className='button-container' >
                            <div onClick={() => { setIsUpdated(!isUpdated) }}>
                                <img src='./img/icons/edit.svg' alt='editPost' />
                            </div>
                            <DeleteCard id={post._id} />
                        </div>
                    )}
                    <div className='card-footer' >
                        <div className='comment-icon'>
                            <img onClick={() => setShowComments(!showComments)} src="./img/icons/message1.svg" alt='comment' />
                            <span>{post.comments.length}</span>
                        </div>
                        <LikeButton post={post} />
                        {isEmpty(post.share) && userData._id !== post.posterId && <PostShare id={post._id} /> }
                    </div>
                    {showComments && <CardComment post={post} />}
                </div>
            </>
           )
           }
       </li>
    );
};

export default Card;