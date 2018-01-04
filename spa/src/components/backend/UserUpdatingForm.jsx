// @flow

import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { Dispatch } from 'redux';

import {
  ROLE_USER,
  ROLE_SUPER_ADMIN,
  STATUS_INACTIVE,
  STATUS_CLOSED,
  STATUS_BLOCKED,
  STATUS_ACTIVE,
} from '../../constants/userConstants';
import userActionCreators from '../../actions/userActionCreators';
import { getValueAlias } from '../../utils/userHelper';

import type { UserState, RootState } from '../../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../../actions/actionCreatorTypes.js.flow';

type Router = {| +match: Object |};

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = Router & MappedState & MappedDispatch;

type State = {|
  isTouched: boolean,
  isSubmitted: boolean,
  values: {|
    email: string,
    password: string,
    passwordRepeat: string,
    role: number | string,
    status: number | string,
  |},
  errors: { email: string, password: string, passwordRepeat: string, role: string, status: string },
|};

class UserUpdatingForm extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      isTouched: false,
      isSubmitted: false,
      values: {
        email: props.user.details.attributes.email || '',
        password: '',
        passwordRepeat: '',
        role: props.user.details.attributes.role || '',
        status: props.user.details.attributes.status || '',
      },
      errors: { email: '', password: '', passwordRepeat: '', role: '', status: '' },
    };
    this.validate = this.validate.bind(this);
  }

  componentWillReceiveProps(nextProps: Props): void {
    const nextErrors = nextProps.user.backendUserUpdatingForm.errors;
    if (Object.keys(nextErrors).length > 0) {
      const errors = this.state.errors;
      Object.keys(nextErrors).forEach((item) => {
        errors[item] = nextErrors[item][0];
      });
      this.setState({ isSubmitted: false, errors });
    }
  }

  handleChange = (event: SyntheticEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const values = this.state.values;
    values[event.currentTarget.name] = event.currentTarget.value;
    this.setState({ values });
  }

  handleSubmitting = (event: SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    this.setState({ isTouched: true });
    if (!this.validate(event.currentTarget)) {
      return;
    }

    const data = {
      email: this.state.values.email,
      password: this.state.values.password,
      role: this.state.values.role,
      status: this.state.values.status,
    };
    this.props.userMethods.backendUpdate(this.props.match.params.id, data);
    this.setState({ isSubmitted: true });
  }

  validate: Function;
  validate(form: HTMLFormElement): boolean {
    let isValid = true;
    const errors = this.state.errors;
    let password = '';
    [...form.elements].forEach((item) => {
      if (item.name === 'email') {
        if (!(item instanceof HTMLInputElement)) {
          throw new TypeError('Invalid instance type.');
        }

        let error = '';
        if (item.value === '') {
          error = 'Please enter a value.';
          isValid = false;
        } else if (!/^.+@\S+\.\S+$/.test(item.value)) {
          error = 'Incorrect email address.';
          isValid = false;
        }
        errors[item.name] = error;
      }
      if (item.name === 'password') {
        if (!(item instanceof HTMLInputElement)) {
          throw new TypeError('Invalid instance type.');
        }

        password = item.value;
      }
      if (item.name === 'passwordRepeat') {
        if (!(item instanceof HTMLInputElement)) {
          throw new TypeError('Invalid instance type.');
        }

        let error = '';
        if (item.value !== password) {
          error = 'Passwords are not the same.';
          isValid = false;
        }
        errors[item.name] = error;
      }
    });
    this.setState({ errors });

    return isValid;
  }

  render(): React$Node {
    let emailInput = (
      <input
        name="email"
        value={this.state.values.email}
        className="form-control"
        onChange={this.handleChange}
        required
      />
    );
    let passwordInput = (
      <input
        type="password"
        name="password"
        value={this.state.values.password}
        className="form-control"
        onChange={this.handleChange}
        required
      />
    );
    let passwordRepeatInput = (
      <input
        type="password"
        name="passwordRepeat"
        value={this.state.values.passwordRepeat}
        className="form-control"
        onChange={this.handleChange}
        required
      />
    );
    let roleSelect = (
      <select name="role" value={this.state.values.role} className="form-control" onChange={this.handleChange}>
        <option value={ROLE_USER}>{getValueAlias('role', ROLE_USER)}</option>
        <option value={ROLE_SUPER_ADMIN}>{getValueAlias('role', ROLE_SUPER_ADMIN)}</option>
      </select>
    );
    let statusSelect = (
      <select name="status" value={this.state.values.status} className="form-control" onChange={this.handleChange}>
        <option value={STATUS_INACTIVE}>{getValueAlias('status', STATUS_INACTIVE)}</option>
        <option value={STATUS_CLOSED}>{getValueAlias('status', STATUS_CLOSED)}</option>
        <option value={STATUS_BLOCKED}>{getValueAlias('status', STATUS_BLOCKED)}</option>
        <option value={STATUS_ACTIVE}>{getValueAlias('status', STATUS_ACTIVE)}</option>
      </select>
    );
    if (this.state.isTouched) {
      emailInput = React.cloneElement(
        emailInput,
        { className: this.state.errors.email !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
      );
      passwordInput = React.cloneElement(
        passwordInput,
        { className: this.state.errors.password !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
      );
      passwordRepeatInput = React.cloneElement(
        passwordRepeatInput,
        { className: this.state.errors.passwordRepeat !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
      );
      roleSelect = React.cloneElement(
        roleSelect,
        { className: this.state.errors.role !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
      );
      statusSelect = React.cloneElement(
        statusSelect,
        { className: this.state.errors.status !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
      );
    }

    return (
      <form onSubmit={this.handleSubmitting} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          {emailInput}
          <div className="invalid-feedback">{this.state.errors.email}</div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          {passwordInput}
          <small className="form-text text-muted">Leave blank to not change.</small>
          <div className="invalid-feedback">{this.state.errors.password}</div>
        </div>
        <div className="form-group">
          <label htmlFor="passwordRepeat">Repeat password</label>
          {passwordRepeatInput}
          <div className="invalid-feedback">{this.state.errors.passwordRepeat}</div>
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          {roleSelect}
          <div className="invalid-feedback">{this.state.errors.role}</div>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          {statusSelect}
          <div className="invalid-feedback">{this.state.errors.status}</div>
        </div>
        <button className="btn btn-primary" disabled={this.state.isSubmitted}>Save</button>
      </form>
    );
  }
}

function mapStateToProps(state: RootState): MappedState {
  return { user: state.user };
}

function mapDispatchToProps(dispatch: Dispatch<*>): MappedDispatch {
  return { userMethods: bindActionCreators(userActionCreators, dispatch) };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserUpdatingForm));
