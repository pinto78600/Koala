import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { isEmpty } from '../Utils';

const SearchBar = () => {

    let usersData = useSelector(state => state.usersReducer);
    const userData = useSelector(state => state.userReducer);

    const [friend, setFriend] = useState('');
    const [persons, setPersons] = useState();
    const [filterDisplay, setFilterDisplay] = useState([]);


    const handleChange = e => {
        setFriend(e);
        let oldList = persons.map(person => {
            return { 
                pseudo : person.pseudo.toLowerCase(),
                picture : person.picture,
                id: person._id
            }
        });

        if(friend !== ""){
            let newList = [];

            newList = oldList.filter(person => person.pseudo.includes(friend.toLowerCase()))
            setFilterDisplay(newList);
        }else {
            setFilterDisplay(persons);
        }
    }

    useEffect(() => {
        if(!isEmpty(userData.blocked)){
            for(let i = 0 ; i < userData.blocked.length; i++){
                // eslint-disable-next-line react-hooks/exhaustive-deps
             usersData = usersData.filter(fil => fil._id !== userData.blocked[i] && 
                    fil._id !== userData._id)
                setPersons(usersData);
            }
        }else { 
            usersData = usersData.filter(fil => fil._id !== userData._id)
            setPersons(usersData);
        }
    }, [userData]) 

    

    return (
        <div className='container-search-bar'>
            <div>
                <h1>Retrouver vos amis</h1>
                <input value={friend} 
                onChange={e => handleChange(e.target.value)} 
                placeholder='Ecrire le pseudo...'
                />
            </div>
            <div>
            { filterDisplay.map((person, i) => (
                <NavLink to={{pathname:'/friendly',
                        id: person.id
                    }}>
                    <div key={i} > 
                        <li>
                            <span>{person.pseudo}</span>
                            <img src={person.picture} alt='userpic' />
                        </li>
                    </div>
                </NavLink>
            ) )   }

            </div>
        </div>
    );
};

export default SearchBar;