import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { UidContext } from './AppContext';
import Logout from './Log/logout';
import ReactTooltip from 'react-tooltip';


const Navbar = () => {
    const uid = useContext(UidContext);
    const userData = useSelector(state => state.userReducer);

    return (
        <nav>
            <div className="nav-container" >
                <div className='logo' >
                    <NavLink exact to='/'>
                        <div className="logo" >
                            <img src="./img/koala.png" alt='icon' />
                            <h3>Koala</h3>
                        </div>
                    </NavLink>
                </div>
                <div>
                    {uid ? (
                        <ul>
                            <li></li>
                            <li className="welcome">
                                <NavLink exact to='/profil'>
                                    <img src={userData.picture} alt='userPic' style={{ width : '40px' , borderRadius : '50%' , maxHeight : '40px'}} />
                                </NavLink>
                            </li>
                            <Logout/>
                        </ul>
                    )
                    :
                    (
                        <ul>
                            <li></li>
                            <li>
                            <NavLink exact to='/profil'>
                                <img src='./img/icons/login.svg' alt="login" data-tip='Connexion' data-for='connection' />
                                <ReactTooltip place='left' effect='solid' type='info' id='connection' />
                            </NavLink>
                            </li>
                        </ul>
                    )
                    }

                </div>
            </div>
        </nav>
    );
};

export default Navbar;