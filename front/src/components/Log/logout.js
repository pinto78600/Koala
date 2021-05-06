import React from 'react';
import axios from 'axios';
import cookie from 'js-cookie';
import ReactTooltip from 'react-tooltip';


const logout = () => {

    const removeCookie = (key) => {
        if(window !== 'undefined'){
            cookie.remove(key, { expires : 1 });
        }
    }

    const handleLogout = async () => {
        await axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}api/user/logout`,
            withCredentials: true,
        })
        .then(() => removeCookie('jwt'))
        .catch(err => console.log(err));

        window.location = "/";
    }

    return (
        <li onClick={handleLogout}>
            <img src='./img/icons/logout.svg' alt="logout" data-tip='Déconnexion' data-for='logout' />
            <ReactTooltip place='left' effect='solid' type='info' id='logout' />
        </li>
    );
};

export default logout;