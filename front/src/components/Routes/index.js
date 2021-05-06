import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import FriendPage from '../../pages/FriendPage';
import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import Trending from '../../pages/Trending';
import Navbar from '../Navbar';

const index = () => {
    return(
      <Router>
          <Navbar/>
          <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/profil" component={Profil} />
              <Route path="/trending" component={Trending} />
              <Route path="/friendly" component={FriendPage} />
              <Redirect to="/" />
          </Switch>
      </Router>
    );
};

export default index;