import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getPosts, addPost, removeErrors } from '../../actions/post.actions';
import { isEmpty, timestampParser } from '../Utils';
import { FaHandPointer } from 'react-icons/fa';

const NewPostForm = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage]= useState('');
    const [video, setVideo] = useState('');
    const [loadPost, setLoadPost] = useState(false);
    const [file, setFile] = useState();
    const [ dataPicture, setDataPicture] = useState();
    const [previewSource, setPreviewSource] = useState(null);
    const [link, setLink] = useState('');


    const userData = useSelector(state => state.userReducer);
    let error = useSelector(state => state.errorReducer.postErrors);
    
    const dispatch = useDispatch()

    const handlePicture = e => {
        const sendDataPicture = e.target.files[0];
        previewFile(sendDataPicture);
        setFile(e.target.files[0]);
        setVideo('');
        setDataPicture({ size : sendDataPicture.size, format : sendDataPicture.type});
    };

        const previewFile = (file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPreviewSource(reader.result);
            };
        };

    const handlePost = async () => {
        if(message || previewSource || video) {;
            setLoadPost(true);
            let data = ''
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = async () => {
                    data = { posterId : userData._id, message, video, link, picture : reader.result,  dataPicture}
                    await dispatch(addPost(data));
                };
            }else {
                 data = { posterId : userData._id, message, video, link }
                 await dispatch(addPost(data));
            }
           
            cancelPost();
        }else {
            alert('Veuillez entrer un message')
        }
    };
        
    const cancelPost = () => {
        setMessage('');
        setVideo('');
        setFile('');                    
        setPreviewSource('');
    };
    
    useEffect(() => {
        if(!isEmpty(userData)) setIsLoading(false);
        const handleVideo = () => {
            let findLink = message.split(" ");
                    for(let i = 0; i < findLink.length; i++ ){
                if(
                    findLink[i].includes("https://www.yout") || 
                    findLink[i].includes("https://yout") 
                ) {
                    setLink('');
                    let embed = findLink[i].replace("watch?v=", "embed/");
                    setVideo(embed.split("&")[0]);
                    findLink.splice(i, 1);
                    setMessage(findLink.join(" "));
                    setPreviewSource('');
                }
            }
        };

        const handleLink = () => {
            let findLink = message.split(" ");
                    for(let i = 0; i < findLink.length; i++ ){
                        if( findLink[i].includes("http://") || 
                        findLink[i].includes("https://") ){
                            const theLink = findLink[i];
                            setLink(theLink.split(' ')[0])
                            findLink.splice(i, 1);
                        }
                    }
        
        }
        handleLink()
        handleVideo()
    }, [userData, message, video])

    useEffect(() => {
         if(error === 'No error') {
            dispatch(getPosts());
            setLoadPost(false);
            dispatch(removeErrors());
        } 

       (!isEmpty(error.format) || !isEmpty(error.maxSize)) && setLoadPost(false);
       
        message === '' && setLink('');

     },[loadPost, error, dispatch, message])

    return (
        <div className='post-container'>
            {isLoading ? (
                <i className='fas fa-spinner fa-pulse'></i>
            )
            :
            (
                <>
                    <div className='data'>
                        <p>
                            <span>{userData.following ? userData.following.length : 0 }</span> Abonnement{ userData.following && userData.following.length > 1 ? 's' : null }
                        </p>
                        <p>
                            <span>{userData.followers ? userData.followers.length : 0 }</span> Abonné{ userData.followers && userData.followers.length > 1 ? 's' : null }
                        </p>      
                    </div>
                    <NavLink exact to='/profil'>
                        <div className='user-info' >
                            <img src={userData.picture} alt="user-img" />
                        </div>
                    </NavLink>
                    <div className='post-form'>
                        <textarea 
                            name='message' id='message' placeholder='Quoi de neuf ?' 
                            onChange={e => setMessage(e.target.value)} value={message} /> 
                        {message || previewSource || video.length > 20 ? (
                           <li className='card-container' >
                               <div className='card-left' >
                                    <img src={userData.picture} alt='userPic' />
                               </div>
                               <div className='card-right' >
                                    <div className='card-header' >
                                        <div className="pseudo" >
                                            <h3>{userData.pseudo}</h3>
                                        </div>
                                        <span>{timestampParser(Date.now())}</span>
                                    </div>
                                    <div className='content' >
                                        <p>{message}</p>
                                        {link && (
                                            <div className='link-post' >
                                                <a href={link} target='_blank' rel="noreferrer">{link}</a>
                                                <FaHandPointer size='1em' />
                                            </div>
                                        )}
                                        {previewSource && <img src={previewSource} alt="postPic" />} 
                                        {video && (
                                             <iframe
                                             src={video}
                                             frameBorder='0'
                                             allow="accelerometer; autoplay ; clipboard-write
                                                 encrypted-media ; gyroscope ; picture-in-picture"
                                            allowFullScreen 
                                             title={video}
                                         ></iframe>
                                        )}
                                    </div>
                               </div>
                           </li>     
                        )
                        : null 
                        }
                        <div className='footer-form' >
                            <div className='icon' >
                            {isEmpty(video) && (
                                <>
                                    <img src='./img/icons/picture.svg' alt="img" />
                                    <input type='file' id="file-upload" name='file' accept='.jpg, .jpeg, .png ' onChange={e => handlePicture(e)} />
                                </>
                            )}
                            {video && (
                               <button onClick={() => setVideo('')}>Supprimer video</button> 
                            )}
                            </div>
                            {!isEmpty(error.format) && <p>{error.format}</p> }
                            {!isEmpty(error.maxSize) && <p>{error.maxSize}</p> }
                            <div className='btn-send' >
                                {message || previewSource || video.length > 20 ? (
                                    <button className='cancel' onClick={cancelPost} >Annuler message</button>

                                )
                                : null
                                }
                                {loadPost ? (
                                    <div className='icon' >
                                        <i className='fas fa-spinner fa-pulse'></i>
                                    </div>
                                )
                                :
                                (
                                    <button className='send' onClick={handlePost}>Envoyer</button>                                    
                                )
                                }
                            </div>
                        </div>
                    </div>
                </>
            )
            }
        </div>
    );
};

export default NewPostForm;