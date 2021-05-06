import React, { useContext, useEffect, useState } from 'react';
import { UidContext } from '../AppContext';
import { useDispatch } from 'react-redux';
import { likePost } from '../../actions/post.actions';
import { unlikePost } from '../../actions/post.actions';
import ReactTooltip from 'react-tooltip';


const LikeButton = ({post}) => {
    const [liked, setLiked] = useState(false);
    const uid = useContext(UidContext);
    const dispatch = useDispatch();

    const like = async () => {
        await dispatch(likePost(post._id, uid))
        if(!post.likers.includes(uid)) post.likers.push(uid);
        setLiked(true);
    }
    
    const unlike = async () => {
        await dispatch(unlikePost(post._id, uid))
        if(post.likers.includes(uid)) post.likers = post.likers.filter(liker => liker !== uid);
        setLiked(false);
    }
    
    
    useEffect(() => {
        if(post.likers.includes(uid)) setLiked(true)
        else setLiked(false)
    }, [uid, post.likers, liked])

    return (
        <div className='like-container' >
            {uid === null &&(
                <>
                    <img src='./img/icons/heart.svg' alt="like" data-tip='Connectez-vous pour aimer un post !' data-for='like' />
                    <ReactTooltip place='bottom' effect='solid' type='error' id='like' />
                </>
            )}
            {uid && liked === false &&(
                <img src='./img/icons/heart.svg' onClick={like}  alt='like' />
            )}
            {uid && liked &&(
                <img src='./img/icons/heart-filled.svg' onClick={unlike}  alt='unlike' />
            )}
        <span>{post.likers.length}</span>
        </div>
    );
};

export default LikeButton;