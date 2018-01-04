// @flow

import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { Dispatch } from 'redux';

import userActionCreators from '../actions/userActionCreators';

import type { UserState, RootState } from '../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../actions/actionCreatorTypes.js.flow';

type Router = {| +match: Object |};

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = Router & MappedState & MappedDispatch;

type State = {|
  isTouched: boolean,
  isSubmitted: boolean,
  values: {| newPassword: string, newPasswordRepeat: string |},
  errors: { newPassword: string, newPasswordRepeat: string },
|};

class PasswordResetForm extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.validate = this.validate.bind(this);
  }

  state = {
    isTouched: false,
    isSubmitted: false,
    values: { newPassword: '', newPasswordRepeat: '' },
    errors: { newPassword: '', newPasswordRepeat: '' },
  };

  componentWillReceiveProps(nextProps: Props): void {
    const nextErrors = nextProps.user.passwordResetForm.errors;
    if (Object.keys(nextErrors).length > 0) {
      const errors = this.state.errors;
      Object.keys(nextErrors).forEach((item) => {
        errors[item] = nextErrors[item][0];
      });
      this.setState({ isSubmitted: false, errors });
    }
  }

  handleChange = (event: SyntheticEvent<HTMLInputElement>): void => {
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

    const data = { newPassword: this.state.values.newPassword };
    this.props.userMethods.resetPassword(this.props.match.params.token, data);
    this.setState({ isSubmitted: true });
  }

  validate: Function;
  validate(form: HTMLFormElement): boolean {
    let isValid = true;
    const errors = this.state.errors;
    let newPassword = '';
    [...form.elements].forEach((item) => {
      if (item.name === 'newPassword') {
        if (!(item instanceof HTMLInputElement)) {
          throw new TypeError('Invalid instance type.');
        }

        let error = '';
        if (item.value === '') {
          error = 'Please enter a value.';
          isValid = false;
        }
        newPassword = item.value;
        errors[item.name] = error;
      }
      if (item.name === 'newPasswordRepeat') {
        if (!(item instanceof HTMLInputElement)) {
          throw new TypeError('Invalid instance type.');
        }

        let error = '';
        if (item.value !== newPassword) {
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
    let newPasswordInput = (
      <input
        type="password"
        name="newPassword"
        value={this.state.values.newPassword}
        className="form-control"
        onChange={this.handleChange}
        required
      />
    );
    let newPasswordRepeatInput = (
      <input
        type="password"
        name="newPasswordRepeat"
        value={this.state.values.newPasswordRepeat}
        className="form-control"
        onChange={this.handleChange}
        required
      />
    );
    if (this.state.isTouched) {
      newPasswordInput = React.cloneElement(
        newPasswordInput,
        { className: this.state.errors.newPassword !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
      );
      newPasswordRepeatInput = React.cloneElement(
        newPasswordRepeatInput,
        { className: this.state.errors.newPasswordRepeat !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
      );
    }

    return (
      <form onSubmit={this.handleSubmitting} noValidate>
        <div className="form-group">
          <label htmlFor="newPassword">New password</label>
          {newPasswordInput}
          <div className="invalid-feedback">{this.state.errors.newPassword}</div>
        </div>
        <div className="form-group">
          <label htmlFor="newPasswordRepeat">Repeat new password</label>
          {newPasswordRepeatInput}
          <div className="invalid-feedback">{this.state.errors.newPasswordRepeat}</div>
        </div>
        <button className="btn btn-primary" disabled={this.state.isSubmitted}>Reset password</button>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PasswordResetForm));
