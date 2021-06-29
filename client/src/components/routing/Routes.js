import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import Alert from '../layout/alert';
import Dashboard from '../dashboard/Dashboard';
import PrivateRoute from '../routing/PrivateRoute';
import CreateProfile from '../profile-forms/CreateProfile';
import EditProfile from '../profile-forms/EditProfile';
import Profiles from '../profiles/Profiles';
import AddExperience from '../profile-forms/AddExperience';
import AddEducation from '../profile-forms/AddEducation';
import Profile from '../profile/Profile';
import Posts from '../posts/Posts';
import Posting from '../posting/Posting';
import NotFound from '../layout/NotFound';

const Routes = () => {
  return (
    <section className='container'>
      <Alert />
      <Switch>
        <Route path='/login' exact component={Login} />
        <Route path='/register' exact component={Register} />
        <Route path='/profiles' exact component={Profiles} />
        <Route path='/profile/:id' exact component={Profile} />

        <PrivateRoute path='/dashboard' exact component={Dashboard} />
        <PrivateRoute exact path='/create-profile' component={CreateProfile} />
        <PrivateRoute exact path='/edit-profile' component={EditProfile} />
        <PrivateRoute exact path='/add-experience' component={AddExperience} />
        <PrivateRoute exact path='/add-education' component={AddEducation} />
        <PrivateRoute exact path='/posts' component={Posts} />
        <PrivateRoute exact path='/posts/:id' component={Posting} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
