// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { Dispatch } from 'redux';

import Loading from '../Loading';
import Error from '../Error';
import withErrorIfWrongRole from '../withErrorIfWrongRole';
import { BACKEND_ROUTE_USER_CREATION, BACKEND_ROUTE_USER_DETAILS } from '../../constants/routeConstants';
import { ROLE_SUPER_ADMIN } from '../../constants/userConstants';
import userActionCreators from '../../actions/userActionCreators';
import { getValueAlias } from '../../utils/userHelper';

import type { UserState, RootState } from '../../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../../actions/actionCreatorTypes.js.flow';

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = MappedState & MappedDispatch;

type State = {|
  isLoaded: boolean,
  items: {
    +id: number,
    +email: string,
    +role: number,
    +status: number,
  }[],
  error: string | null,
|};

class UserListPage extends React.Component<Props, State> {
  state = { isLoaded: false, items: [], error: null };

  componentDidMount(): void {
    this.props.userMethods.view();
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.user.list.updatedAt !== this.props.user.list.updatedAt) {
      const message = nextProps.user.list.message;
      if (message !== null) {
        this.setState({ isLoaded: true, error: message });
        return;
      }
      const items = nextProps.user.list.items;
      if (items.length > 0) {
        this.setState({ isLoaded: true, items: [...items] });
      }
    }
  }

  render(): React$Node {
    if (this.state.isLoaded) {
      const error = this.state.error;
      if (error !== null) {
        return <Error message={error} />;
      }

      const users = [];
      this.state.items.forEach((item) => {
        const user = (
          <tr key={item.id}>
            <th scope="row">{item.id}</th>
            <td><Link to={BACKEND_ROUTE_USER_DETAILS.replace(':id', String(item.id))}>{item.email}</Link></td>
            <td>{getValueAlias('role', item.role)}</td>
            <td>{getValueAlias('status', item.status)}</td>
          </tr>
        );
        users.push(user);
      });

      return (
        <main>
          <h1 className="mb-4">
            Users
            <sup><Link to={BACKEND_ROUTE_USER_CREATION} className="btn btn-secondary btn-sm ml-2">Create</Link></sup>
          </h1>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {users}
            </tbody>
          </table>
        </main>
      );
    }

    return <Loading />;
  }
}

function mapStateToProps(state: RootState): MappedState {
  return { user: state.user };
}

function mapDispatchToProps(dispatch: Dispatch<*>): MappedDispatch {
  return { userMethods: bindActionCreators(userActionCreators, dispatch) };
}

export default withErrorIfWrongRole(connect(mapStateToProps, mapDispatchToProps)(UserListPage), [ROLE_SUPER_ADMIN]);
