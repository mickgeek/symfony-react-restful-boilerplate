// @flow

import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';

import type { Dispatch } from 'redux';

import Error401Page from './Error401Page';
import Error403Page from './Error403Page';
import Error404Page from './Error404Page';
import BackendHeader from './backend/Header';
import BackendFooter from './backend/Footer';
import BackendSidebar from './backend/Sidebar';
import BackendDashboardPage from './backend/DashboardPage';
import BackendUserListPage from './backend/UserListPage';
import BackendUserCreationPage from './backend/UserCreationPage';
import BackendUserDetailsPage from './backend/UserDetailsPage';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import AccountActivationConfirmationPage from './AccountActivationConfirmationPage';
import PasswordResetRequestPage from './PasswordResetRequestPage';
import PasswordResetPage from './PasswordResetPage';
import SettingsPage from './SettingsPage';
import EmailChangeConfirmationPage from './EmailChangeConfirmationPage';
import UserListPage from './UserListPage';
import UserDetailsPage from './UserDetailsPage';
import withError404 from './withError404';
import {
  ROUTE_HOME,
  ROUTE_LOGIN,
  ROUTE_PASSWORD_RESET_REQUEST,
  ROUTE_PASSWORD_RESET,
  ROUTE_REGISTRATION,
  ROUTE_ACCOUNT_ACTIVATION_CONFIRMATION,
  ROUTE_SETTINGS,
  ROUTE_EMAIL_CHANGE_CONFIRMATION,
  ROUTE_USER_LIST,
  ROUTE_USER_DETAILS,
  BACKEND_ROUTE_DASHBOARD,
  BACKEND_ROUTE_USER_LIST,
  BACKEND_ROUTE_USER_CREATION,
  BACKEND_ROUTE_USER_DETAILS,
} from '../constants/routeConstants';
import appActionCreators from '../actions/appActionCreators';

import type { AppState, RootState } from '../reducers/reducerTypes.js.flow';
import type { AppActionCreators } from '../actions/actionCreatorTypes.js.flow';

type Router = {| +location: Object |};

type MappedState = {| +app: AppState |};

type MappedDispatch = {| +appMethods: AppActionCreators |};

type Props = Router & MappedState & MappedDispatch;

class App extends React.Component<Props> {
  constructor(props: Props): void {
    super(props);
    this.getAlerts = this.getAlerts.bind(this);
  }

  getAlerts: Function;
  getAlerts(): React$Node {
    const alerts = [];
    this.props.app.notifications.forEach((item, index) => {
      if (!item.redirect) {
        const alert = (
          <div key={Symbol(index).toString()} className={`alert alert-${item.tag} fade show`}>
            <button type="button" className="close" onClick={this.handleAlertClosing} data-index={index}>
              <span aria-hidden="true">&times;</span>
            </button>
            {item.message}
          </div>
        );
        alerts.push(alert);
      }
    });

    return alerts.length > 0 ? alerts : null;
  }

  handleAlertClosing = (event: SyntheticEvent<HTMLButtonElement>): void => {
    const index = Number(event.currentTarget.dataset.index);
    this.props.appMethods.removeNotification(index);
  }

  render(): React$Node {
    if (this.props.app.errorCode === 401) {
      return <Error401Page />;
    }
    if (this.props.app.errorCode === 403) {
      return <Error403Page />;
    }
    if (this.props.app.errorCode === 404) {
      return <Error404Page />;
    }

    const alerts:React$Element<'div'> = (
      <div className="fixed-top w-50 mt-4 mr-4 ml-auto">
        {this.getAlerts()}
      </div>
    );

    if (this.props.location.pathname.substring(0, 6) === BACKEND_ROUTE_DASHBOARD) {
      return (
        <div>
          {alerts.props.children !== null ? alerts : null}
          <BackendHeader />
          <div className="container">
            <div className="row">
              <div className="col col-md-2">
                <BackendSidebar />
              </div>
              <div className="col col-md-10">
                <Switch>
                  <Route exact path={BACKEND_ROUTE_DASHBOARD} component={BackendDashboardPage} />
                  <Route exact path={BACKEND_ROUTE_USER_LIST} component={BackendUserListPage} />
                  <Route exact path={BACKEND_ROUTE_USER_CREATION} component={BackendUserCreationPage} />
                  <Route exact path={BACKEND_ROUTE_USER_DETAILS} component={BackendUserDetailsPage} />
                  <Route component={withError404(() => (null))} />
                </Switch>
              </div>
            </div>
            <BackendFooter />
          </div>
        </div>
      );
    }

    return (
      <div>
        {alerts.props.children !== null ? alerts : null}
        <Header />
        <div className="container">
          <Switch>
            <Route exact path={ROUTE_HOME} component={HomePage} />
            <Route exact path={ROUTE_LOGIN} component={LoginPage} />
            <Route exact path={ROUTE_REGISTRATION} component={RegistrationPage} />
            <Route exact path={ROUTE_ACCOUNT_ACTIVATION_CONFIRMATION} component={AccountActivationConfirmationPage} />
            <Route exact path={ROUTE_PASSWORD_RESET_REQUEST} component={PasswordResetRequestPage} />
            <Route exact path={ROUTE_PASSWORD_RESET} component={PasswordResetPage} />
            <Route exact path={ROUTE_SETTINGS} component={SettingsPage} />
            <Route exact path={ROUTE_EMAIL_CHANGE_CONFIRMATION} component={EmailChangeConfirmationPage} />
            <Route exact path={ROUTE_USER_LIST} component={UserListPage} />
            <Route exact path={ROUTE_USER_DETAILS} component={UserDetailsPage} />
            <Route component={withError404(() => (null))} />
          </Switch>
          <Footer />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState): MappedState {
  return { app: state.app };
}

function mapDispatchToProps(dispatch: Dispatch<*>): MappedDispatch {
  return { appMethods: bindActionCreators(appActionCreators, dispatch) };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
