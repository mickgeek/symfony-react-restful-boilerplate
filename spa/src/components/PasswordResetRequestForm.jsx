// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { Dispatch } from 'redux';

import { URL_APP_PASSWORD_RESET } from '../constants/callConstants';
import userActionCreators from '../actions/userActionCreators';

import type { UserState, RootState } from '../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../actions/actionCreatorTypes.js.flow';

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = MappedState & MappedDispatch;

type State = {|
  isTouched: boolean,
  isSubmitted: boolean,
  values: {| email: string |},
  errors: { email: string },
|};

function getDefaultState(): State {
  return {
    isTouched: false,
    isSubmitted: false,
    values: { email: '' },
    errors: { email: '' },
  };
}

class PasswordResetRequestForm extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.validate = this.validate.bind(this);
  }

  state = getDefaultState();

  componentWillReceiveProps(nextProps: Props): void {
    const nextErrors = nextProps.user.passwordResetRequestForm.errors;
    if (Object.keys(nextErrors).length > 0) {
      const errors = this.state.errors;
      Object.keys(nextErrors).forEach((item) => {
        errors[item] = nextErrors[item][0];
      });
      this.setState({ isSubmitted: false, errors });
    }

    if (nextProps.user.passwordResetRequestForm.reset) {
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
      passwordReset: {
        email: this.state.values.email,
        appURL: URL_APP_PASSWORD_RESET,
      },
    };
    this.props.userMethods.requestPasswordReset(data);
    this.setState({ isSubmitted: true });
  }

  validate: Function;
  validate(form: HTMLFormElement): boolean {
    let isValid = true;
    const errors = this.state.errors;
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
    if (this.state.isTouched) {
      emailInput = React.cloneElement(
        emailInput,
        { className: this.state.errors.email !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
      );
    }

    return (
      <form onSubmit={this.handleSubmitting} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          {emailInput}
          <div className="invalid-feedback">{this.state.errors.email}</div>
        </div>
        <button className="btn btn-primary" disabled={this.state.isSubmitted}>Request password reset</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetRequestForm);
