import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPicture } from '../../actions/user.actions';
import { isEmpty } from '../Utils';

const UploadImg = () => {
    const [fileInputState, setFileInputState] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [loadPost, setLoadPost] = useState(false);
    const [dataPicture, setDataPicture] = useState();
    const dispatch = useDispatch();
    let error = useSelector(state => state.errorReducer.userErrors);

    
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setFileInputState(e.target.value);
        setDataPicture({ size : file.size, format : file.type});
    };

    const userData = useSelector(state => state.userReducer);

    const handleSubmitFile = (e) => {
        e.preventDefault();
        if (!selectedFile) return;
        setLoadPost(true);
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            uploadImage(reader.result);
        };
    };

    const uploadImage = async (base64EncodedImage) => {
        const dataUser = { id : userData._id, pseudo : userData.pseudo };
        dispatch(uploadPicture(base64EncodedImage, dataUser, dataPicture))  
    };
    
    useEffect(() => {
        if(error === 'No error') {
            document.location.reload();
        } 
        
       if(!isEmpty(error.format) || !isEmpty(error.maxSize)){
            setLoadPost(false);
       }
     },[loadPost, error, dispatch, userData._id])


    return (
        <div>
            <form onSubmit={handleSubmitFile} className="form">
                <label htmlFor="file">Changer d'image</label>
                <input
                    id="file"
                    type="file"
                    name="file"
                    onChange={handleFileInputChange}
                    value={fileInputState}
                    accept='.jpg, .jpeg, .png'
                />
                <br/>
                {loadPost ? (
                <div className='icon' >
                    <i className='fas fa-spinner fa-pulse'></i>
                </div>
                )
                :
                (
                    <input type='submit' value='Envoyer' />
                )}
            </form>
            { !isEmpty(error.maxSize) && <p>{error.maxSize}</p>}
            { !isEmpty(error.format) &&  <p>{error.format}</p>}
        </div>
    );
}
export default UploadImg;
