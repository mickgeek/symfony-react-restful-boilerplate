// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { Dispatch } from 'redux';

import { BACKEND_ROUTE_DASHBOARD } from '../../constants/routeConstants';
import userActionCreators from '../../actions/userActionCreators';

import type { UserState, RootState } from '../../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../../actions/actionCreatorTypes.js.flow';

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = MappedState & MappedDispatch;

class Header extends React.Component<Props> {
  handleLogout = (event: SyntheticEvent<HTMLLinkElement>): void => {
    event.preventDefault();
    this.props.userMethods.logOut();
  }

  render(): React$Node {
    const logoutLink = (
      <span
        tabIndex="0"
        role="button"
        className="nav-link"
        style={{ cursor: 'pointer' }}
        onClick={this.handleLogout}
      >Log out</span>
    );

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary mb-4">
        <div className="container">
          <Link to={BACKEND_ROUTE_DASHBOARD} className="navbar-brand" >RESTful Boilerplate. Admin Panel</Link>
          <button
            type="button"
            className="navbar-toggler"
            data-toggle="collapse"
            data-target="#main-nav"
            aria-controls="main-nav"
            aria-expanded="false"
          ><span className="navbar-toggler-icon" /></button>
          <div id="main-nav" className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              {this.props.user.identity.id !== null ? logoutLink : null}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state: RootState): MappedState {
  return { user: state.user };
}

function mapDispatchToProps(dispatch: Dispatch<*>): MappedDispatch {
  return { userMethods: bindActionCreators(userActionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
