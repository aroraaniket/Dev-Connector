import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//if you are authenticated u cannot go to main page
const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  return (
    <div className='opp'>
      <section className='landing'>
        <div className='dark-overlay'>
          <div className='landing-inner'>
            <h1 className='x-large'>Developer Connector</h1>
            <p className='lead'>
              Create a developer profile/portfolio, share posts and get help
              from other developers
            </p>
            <div className='buttons'>
              <Link to='./register' className='btn btn-primary'>
                Sign Up
              </Link>
              <Link to='./login' className='btn btn-light'>
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className='footer'>
        <div class='foot'>
          <p>
            ANIKET ARORA <span class='highlight'>©2020</span>
          </p>
        </div>
      </section>
    </div>
  );
};
Landing.propTypes = {
  isAuthenticate: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps)(Landing);
