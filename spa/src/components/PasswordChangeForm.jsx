// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { Dispatch } from 'redux';

import userActionCreators from '../actions/userActionCreators';

import type { UserState, RootState } from '../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../actions/actionCreatorTypes.js.flow';

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = MappedState & MappedDispatch;

type State = {|
  isTouched: boolean,
  isSubmitted: boolean,
  values: {| currentPassword: string, newPassword: string, newPasswordRepeat: string |},
  errors: { currentPassword: string, newPassword: string, newPasswordRepeat: string },
|};

function getDefaultState(): State {
  return {
    isTouched: false,
    isSubmitted: false,
    values: { currentPassword: '', newPassword: '', newPasswordRepeat: '' },
    errors: { currentPassword: '', newPassword: '', newPasswordRepeat: '' },
  };
}

class PasswordChangeForm extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.validate = this.validate.bind(this);
  }

  state = getDefaultState();

  componentWillReceiveProps(nextProps: Props): void {
    const nextErrors = nextProps.user.passwordChangeForm.errors;
    if (Object.keys(nextErrors).length > 0) {
      const errors = this.state.errors;
      Object.keys(nextErrors).forEach((item) => {
        errors[item] = nextErrors[item][0];
      });
      this.setState({ isSubmitted: false, errors });
    }

    if (nextProps.user.passwordChangeForm.reset) {
      this.setState(getDefaultState());
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

    const data = {
      passwordChange: {
        currentPassword: this.state.values.currentPassword,
        newPassword: this.state.values.newPassword,
      },
    };
    this.props.userMethods.changePassword(data);
    this.setState({ isSubmitted: true });
  }

  validate: Function;
  validate(form: HTMLFormElement): boolean {
    let isValid = true;
    const errors = this.state.errors;
    let newPassword = '';
    [...form.elements].forEach((item) => {
      if (item.name === 'currentPassword') {
        if (!(item instanceof HTMLInputElement)) {
          throw new TypeError('Invalid instance type.');
        }

        let error = '';
        if (item.value === '') {
          error = 'Please enter a value.';
          isValid = false;
        }
        errors[item.name] = error;
      }
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
    let currentPasswordInput = (
      <input
        type="password"
        name="currentPassword"
        value={this.state.values.currentPassword}
        className="form-control"
        onChange={this.handleChange}
        required
      />
    );
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
      currentPasswordInput = React.cloneElement(
        currentPasswordInput,
        { className: this.state.errors.currentPassword !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
      );
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
          <label htmlFor="currentPassword">Current password</label>
          {currentPasswordInput}
          <div className="invalid-feedback">{this.state.errors.currentPassword}</div>
        </div>
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
        <button className="btn btn-primary" disabled={this.state.isSubmitted}>Change password</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(PasswordChangeForm);
