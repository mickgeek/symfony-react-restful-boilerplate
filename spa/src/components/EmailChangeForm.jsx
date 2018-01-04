// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { Dispatch } from 'redux';

import { URL_APP_EMAIL_CHANGE_CONFIRMATION } from '../constants/callConstants';
import userActionCreators from '../actions/userActionCreators';

import type { UserState, RootState } from '../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../actions/actionCreatorTypes.js.flow';

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = MappedState & MappedDispatch;

type State = {|
  isTouched: boolean,
  isSubmitted: boolean,
  values: {| newEmail: string |},
  errors: { newEmail: string },
|};

function getDefaultState(): State {
  return {
    isTouched: false,
    isSubmitted: false,
    values: { newEmail: '' },
    errors: { newEmail: '' },
  };
}

class EmailChangeForm extends React.Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.validate = this.validate.bind(this);
  }

  state = getDefaultState();

  componentWillReceiveProps(nextProps: Props): void {
    const nextErrors = nextProps.user.emailChangeForm.errors;
    if (Object.keys(nextErrors).length > 0) {
      const errors = this.state.errors;
      Object.keys(nextErrors).forEach((item) => {
        errors[item] = nextErrors[item][0];
      });
      this.setState({ isSubmitted: false, errors });
    }

    if (nextProps.user.emailChangeForm.reset) {
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
      emailChange: {
        newEmail: this.state.values.newEmail,
        appURL: URL_APP_EMAIL_CHANGE_CONFIRMATION,
      },
    };
    this.props.userMethods.changeEmail(data);
    this.setState({ isSubmitted: true });
  }

  validate: Function;
  validate(form: HTMLFormElement): boolean {
    let isValid = true;
    const errors = this.state.errors;
    [...form.elements].forEach((item) => {
      if (item.name === 'newEmail') {
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
    let newEmailInput = (
      <input
        name="newEmail"
        value={this.state.values.newEmail}
        className="form-control"
        onChange={this.handleChange}
        required
      />
    );
    if (this.state.isTouched) {
      newEmailInput = React.cloneElement(
        newEmailInput,
        { className: this.state.errors.newEmail !== '' ? 'form-control is-invalid' : 'form-control is-valid' },
      );
    }

    return (
      <form onSubmit={this.handleSubmitting} noValidate>
        <div className="form-group">
          <label htmlFor="newEmail">New email</label>
          {newEmailInput}
          <div className="invalid-feedback">{this.state.errors.newEmail}</div>
        </div>
        <button className="btn btn-primary" disabled={this.state.isSubmitted}>Change email</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(EmailChangeForm);
