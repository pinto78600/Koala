import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, getPost, getPosts } from '../../actions/post.actions';
import { dateParser, isEmpty, timestampParser } from '../Utils';
import Modal from 'react-modal';
import { NavLink } from 'react-router-dom';

const PostShare = ({id}) => {

    const customStyles = {
        content : {
          top                   : '50%',
          left                  : '50%',
          right                 : 'auto',
          bottom                : 'auto',
          marginRight           : '-50%',
          transform             : 'translate(-50%, -50%)',
          width : '700px'
        }
      };

    const [modalIsOpen,setIsOpen] = useState(false);
    const [message, setMessage] = useState('');


    const dispatch = useDispatch();

    const userData = useSelector(state => state.userReducer);
    const usersData = useSelector(state => state.usersReducer);
    const userPost = useSelector(state => state.shareReducer);

    const handlePost = async () => {
        const data = new FormData();
        data.append('message', message);
        data.append('posterId', userData._id);
        data.append('sharedId', userPost.posterId);
        data.append('sharedMessage', userPost.message);
        data.append('sharedPicture', userPost.picture);
        data.append('sharedVideo', userPost.video);
        data.append('date', userPost.createdAt);
    
        await dispatch(addPost(data));
        dispatch(getPosts());
        setMessage('');
        closeModal();
       
                
    }

    const openModal = async () => {
        setIsOpen(true);
        await dispatch(getPost(id))
        
    }

    const closeModal = () =>{
    setMessage('');
    setIsOpen(false);
    }

    return (
        <div>
                <button onClick={openModal}>
                    <img src='./img/icons/share.svg' alt='share' />    
                </button>
                <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >
                  {isEmpty(userData) && isEmpty(userPost) ? (
                    <div className='icon' >
                        <i className='fas fa-spinner fa-pulse'></i>
                    </div>
                  )
                  :
                  (
                    <>
                    <div className='card-share-container' >
                        <div className='card-share-left' >
                            <a href="/profil" >
                                    <img src={userData.picture} alt='userpic'/>
                            </a>
                        </div>
                            <div className='card-share-right'>
                                <div className='share-right'>
                                    <div className='pseudo' >
                                        <h3>{userData.pseudo}</h3>
                                    </div>
                                        <span>{timestampParser(Date.now())}</span>
                                </div>
                                <textarea 
                                    name='message' id='message' placeholder='Mon message...' 
                                    onChange={e => setMessage(e.target.value)} value={message} /> 
                                    <div className='card-shared-container' >

                                        <div className='card-left-shared'>
                                            <NavLink to={{pathname:'/friendly',
                                                id: userPost.posterId
                                            }}>
                                                    <img src={!isEmpty(usersData[0]) && 
                                                        usersData.map(user => {
                                                            if(user._id === userPost.posterId ){
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
                                                        if(user._id === userPost.posterId ){
                                                            return user.pseudo
                                                        }else return null  
                                                    }
                                                    ).join('')}</h3>
                                                </div>
                                                <span>{dateParser(userPost.createdAt)}</span>
                                            </div>
                                            <p>{userPost.message}</p>
                                            {userPost.picture !== "" && <img src={userPost.picture} alt='post-pic' className='card-shared-pic' />}
                                            {userPost.video !== "" && (
                                                 <iframe
                                                 width='450'
                                                 height='300'
                                                 src={userPost.video}
                                                 frameBorder='0'
                                                 allow="accelerometer; autoplay ; clipboard-write
                                                     encrypted-media ; gyroscope ; picture-in-picture" 
                                                 title={userPost._id}
                                             ></iframe>
                                            )}
                                        </div> 
                                    </div>

                            </div>
                    </div>

                    </>
                  ) }
                <div className='footer-btn-modal'>
                    <button onClick={closeModal}>Annuler</button>
                    <button className='send' onClick={handlePost}>Partager</button>
                </div>
            </Modal>
        </div>
    );
};

export default PostShare;