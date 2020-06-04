import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { register } from "../../actions/auth";
import { createMessage } from "../../actions/messages";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import { faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons";
var Logo = require("../../assets/vaultlogoAO.png");

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  postEmail,
  postPhone,
  postAuth,
  postProfile
} from "../../actions/regvalidate";

import DatePicker from "react-datepicker2";
import Spinner from "react-bootstrap/Spinner";

export class Register extends Component {
  state = {
    step: 1,
    redirect: false,
    phone_number: "",
    fullname: "",
    gender: "male",
    incomeRange: "",
    employmentStatus: "",
    relationshipStatus: "",
    birthday: "",
    email: "",
    authcode: "",
    password: "",
    password2: "",
    finalPageHeader: "Okay, its eMail time 🙄",
    resend: "Resend",
    phone_numberError: false,
    fullnameError: false,
    incomeRangeError: false,
    employmentStatusError: false,
    relationshipStatusError: false,
    birthdayError: false,
    hideResend: true,
    hideConfirmInput: true,
    disableNextButton: true,
    emailReadonlyMode: false,
    hideValidateButton: false,
    hideVerifyButton: true,
    disableVerifyButton: false,
    hideSpinner: true,
    hideSpinner2: true,
    hidePasswordForm: true,
    finalPageInitialButtonText: "Validate",
    finalPageInitialButton2Text: "Verify",
    emailError: false,
    authcodeError: false,
    passwordError: false,
    password2Error: false
  };

  static propTypes = {
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    postEmail: PropTypes.func.isRequired,
    postPhone: PropTypes.func.isRequired,
    postAuth: PropTypes.func.isRequired,
    postProfile: PropTypes.func.isRequired
  };
  onSubmit = e => {
    e.preventDefault();
    const {
      phone_number,
      fullname,
      email,
      password,
      password2,
      gender,
      incomeRange,
      employmentStatus,
      relationshipStatus,
      birthday
    } = this.state;
    var reg = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^><&*-]).{8,}$"
    );
    if (
      password !== password2 ||
      password.match(reg) === null ||
      password2.match(reg) === null
    ) {
      if (password.match(reg) === null) {
        this.setState({
          passwordError: true
        });
      }
      if (password2.match(reg) === null) {
        this.setState({
          password2Error: true
        });
      }
      if (password !== password2) {
        this.props.createMessage({
          passwordsNotMatch: "Passwords do not match"
        });
      }
    } else {
      const newUser = {
        phone_number,
        fullname,
        email,
        password
      };
      this.props.register(newUser);
      setTimeout(() => {
        this.props.postProfile(
          email,
          phone_number,
          gender,
          incomeRange,
          employmentStatus,
          relationshipStatus,
          birthday
        );
      }, 10000);
    }
  };

  onChange = e =>
    this.setState({
      [e.target.name]: e.target.value,
      [e.target.name + "Error"]: false
    });

  handleDateChange = date => {
    const valueOfInput = date.format();
    this.setState({
      birthday: valueOfInput
    });
  };

  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };
  continue = () => {
    if (
      this.state.phone_number == "" ||
      this.state.fullname == "" ||
      parseInt(this.state.phone_number) === NaN ||
      this.state.phone_number.length !== 11 ||
      this.state.fullname.length < 10
    ) {
      if (
        this.state.phone_number == "" ||
        parseInt(this.state.phone_number) === NaN ||
        this.state.phone_number.length !== 11
      ) {
        this.setState({
          phone_numberError: true
        });
      }
      if (this.state.fullname == "" || this.state.fullname.length < 10) {
        this.setState({
          fullnameError: true
        });
      }
    } else {
      this.checkPhoneNumber();
    }
  };

  checkPhoneNumber = () => {
    this.props.postPhone(this.state.phone_number);
  };

  checkEmail = () => {
    var re = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (String(this.state.email).match(re) !== null) {
      this.setState({
        finalPageInitialButtonText: "Sending",
        hideSpinner: false
      });
      this.props.postEmail(this.state.email);
      setTimeout(
        () =>
          this.setState({
            hideResend: false
          }),
        10000
      );
    } else {
      this.setState({
        emailError: true
      });
    }
  };

  coninue2 = () => {
    if (
      this.state.incomeRange == "" ||
      this.state.employmentStatus == "" ||
      this.state.relationshipStatus == "" ||
      this.state.birthday == ""
    ) {
      if (this.state.incomeRange == "") {
        this.setState({
          incomeRangeError: true
        });
      }
      if (this.state.employmentStatus == "") {
        this.setState({
          employmentStatusError: true
        });
      }
      if (this.state.relationshipStatus == "") {
        this.setState({
          relationshipStatusError: true
        });
      }
      if (this.state.birthday == "") {
        this.setState({
          birthdayError: true
        });
      }
    } else {
      this.nextStep();
    }
  };

  continue3 = () => {
    if (
      this.state.authcode == "" ||
      this.state.authcode.length !== 5 ||
      parseInt(this.state.authcode) < 11233
    ) {
      this.setState({
        authcodeError: true
      });
    } else {
      this.setState({
        finalPageInitialButton2Text: "Verifying",
        hideSpinner2: false
      });
      this.props.postAuth(this.state.authcode, this.state.email);
    }
  };
  componentDidUpdate(prevProps) {
    const { phoneNumber, email, eauth, errors } = this.props;
    const response = { phoneNumber, email, eauth, errors };
    if (phoneNumber.length !== prevProps.phoneNumber.length) {
      if (phoneNumber[phoneNumber.length - 1]) {
        if (
          response.phoneNumber[response.phoneNumber.length - 1].status === "ok"
        ) {
          //this.props.nextStep();
          this.nextStep();
        }
      }
    }
    if (email.length !== prevProps.email.length) {
      if (email[email.length - 1]) {
        if (response.email[response.email.length - 1].status === "success") {
          this.setState({
            emailReadonlyMode: true,
            hideConfirmInput: false,
            hideValidateButton: true,
            hideSpinner: true,
            hideVerifyButton: false,
            finalPageHeader: "Now, check your email-inbox"
          });
        }
      }
    }
    if (errors !== prevProps.errors) {
      /**This will only work once; if a  user enters an already existing mail
       * twice, the user will be left hanging with a sending spinner/animation
       *
       * */
      if (response.errors === "failed") {
        this.setState({
          finalPageInitialButtonText: "Validate",
          hideSpinner: true
        });
      }
    }
    if (eauth.length !== prevProps.eauth.length) {
      if (eauth[eauth.length - 1]) {
        if (response.eauth[response.eauth.length - 1].status === "success") {
          this.setState({
            finalPageInitialButton2Text: "Verified",
            hideSpinner2: true,
            disableNextButton: false,
            disableVerifyButton: true,
            finalPageHeader: "Create password and click 'Done' 😎",
            hidePasswordForm: false
          });
        }
      }
    }
  }
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  //if this.props.isAuthenticated redirect to welcome instead on set Redirect
  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/welcome/addcard" />;
    }
    const { step } = this.state;
    const {
      phone_number,
      fullname,
      gender,
      incomeRange,
      employmentStatus,
      relationshipStatus,
      email,
      authcode,
      password,
      password2
    } = this.state;

    switch (step) {
      case 1:
        return (
          <Fragment>
            <div className="col-md-6 m-auto">
              <br />
              <div className="card card-body mt-5">
                <h2 className="text-center">
                  <img
                    className="vault-logo"
                    src={Logo}
                    alt="Vault24"
                    itemProp="logo"
                  />
                  <br /> <br />
                  <strong>Alright!... Let's know you</strong>
                </h2>
                <br />
                <br />
                <form>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="form-control"
                      name="phone_number"
                      onChange={this.onChange}
                      value={phone_number}
                    />
                    <div hidden={!this.state.phone_numberError}>
                      <p className="text-danger text-xs">
                        Input a valid phone number
                      </p>
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="form-control"
                      name="fullname"
                      onChange={this.onChange}
                      value={fullname}
                    />
                    <div hidden={!this.state.fullnameError}>
                      <p className="text-danger text-xs">
                        Name should be at least 10 characters
                      </p>
                    </div>
                  </div>
                  <div className="form-group">
                    <select
                      name="gender"
                      onChange={this.onChange}
                      value={gender}
                      className="form-control"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div className="form-group text-center">
                    <button
                      type="button"
                      onClick={() => this.continue()}
                      className="btn btn-primary btn-block"
                    >
                      Next <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </button>
                  </div>
                  <p className="text-center">
                    Already have an account?{" "}
                    <Link className="app-link" to="/login">
                      Login
                    </Link>
                  </p>
                </form>
                <div className="text-center">
                  <FontAwesomeIcon icon={faLock} /> Your data is secured
                </div>
              </div>
            </div>
            <footer>
              <b>
                Powered by{" "}
                <a
                  className="app-link"
                  target="_blank"
                  href="http://www.addosser.com/"
                >
                  Addoser Microfinance Bank
                </a>
              </b>
            </footer>
          </Fragment>
        );
      case 2:
        return (
          <Fragment>
            <div className="col-md-6 m-auto">
              <br />
              <div className="card card-body mt-5">
                <h2 className="text-center">
                  <img
                    className="vault-logo"
                    src={Logo}
                    alt="Vault24"
                    itemProp="logo"
                  />
                  <br /> <br />
                  <strong>Maybe a little more &#128522;</strong>
                </h2>
                <br />
                <br />
                <form>
                  <div className="form-group">
                    <select
                      name="incomeRange"
                      value={incomeRange}
                      onChange={this.onChange}
                      className="form-control"
                    >
                      <option value="">--Select Income range--</option>
                      <option value="below31k">Below ₦31,000 per month</option>
                      <option value="31-50k">
                        Between ₦31,000 and ₦50,0000
                      </option>
                      <option value="50-80k">
                        Between ₦50,000 and ₦80,0000
                      </option>
                      <option value="80-100k">
                        Between ₦80,000 and ₦100,0000
                      </option>
                      <option value="100-150k">
                        Between ₦100,000 and ₦150,000
                      </option>
                      <option value="250-500k">
                        Between ₦150,000 and ₦250,000
                      </option>
                      <option value="500-1m">
                        Between ₦250,000 and ₦500,000
                      </option>
                      <option>Between ₦500,000 and ₦1,000,000</option>
                      <option value="above1m">Above ₦1,000,000</option>
                    </select>
                    <div hidden={!this.state.incomeRangeError}>
                      <p className="text-danger text-xs">Select income range</p>
                    </div>
                  </div>
                  <div className="form-group">
                    <select
                      name="employmentStatus"
                      value={employmentStatus}
                      onChange={this.onChange}
                      className="form-control"
                    >
                      <option value="">--Select Employment status--</option>
                      <option value="employed">Employed</option>
                      <option value="selfEmployed">Self-employed</option>
                      <option value="retired">Retired</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="student">Student</option>
                    </select>
                    <div hidden={!this.state.employmentStatusError}>
                      <p className="text-danger text-xs">
                        Select employment status
                      </p>
                    </div>
                  </div>
                  <div className="form-group">
                    <select
                      name="relationshipStatus"
                      value={relationshipStatus}
                      onChange={this.onChange}
                      className="form-control"
                    >
                      <option value="">--Select Relationship status--</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                    </select>
                    <div hidden={!this.state.relationshipStatusError}>
                      <p className="text-danger text-xs">
                        Select relationship status
                      </p>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="text-center">
                      Let's celebrate you, select your Next Birthday
                    </label>
                    <DatePicker
                      inputReadOnly={true}
                      className="form-control"
                      isGregorian={true}
                      timePicker={false}
                      onChange={this.handleDateChange}
                    />
                    <div hidden={!this.state.birthdayError}>
                      <p className="text-danger text-xs">Select option</p>
                    </div>
                  </div>
                  <div className="form-group text-center">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => this.prevStep()}
                    >
                      <FontAwesomeIcon icon={faAngleDoubleLeft} /> Back
                    </button>
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => this.coninue2()}
                    >
                      Next <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </button>
                  </div>
                </form>
                <div className="text-center">
                  <FontAwesomeIcon icon={faLock} /> Your data is secured
                </div>
              </div>
            </div>
            <footer>
              <b>
                Powered by{" "}
                <a
                  className="app-link"
                  target="_blank"
                  href="http://www.addosser.com/"
                >
                  Addoser Microfinance Bank
                </a>
              </b>
            </footer>
          </Fragment>
        );
      case 3:
        return (
          <Fragment>
            <div className="col-md-6 m-auto">
              <br />
              <div className="card card-body mt-5">
                <h2 className="text-center">
                  <img
                    className="vault-logo"
                    src={Logo}
                    alt="Vault24"
                    itemProp="logo"
                  />
                  <br /> <br />
                  <strong>{this.state.finalPageHeader}</strong>
                </h2>
                <br />
                <br />
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <input
                      readOnly={this.state.emailReadonlyMode}
                      placeholder="Email address"
                      type="email"
                      className="form-control"
                      name="email"
                      onChange={this.onChange}
                      value={email}
                    />
                    <div hidden={!this.state.emailError}>
                      <p className="text-danger text-xs">
                        Enter a valid email address
                      </p>
                    </div>
                  </div>

                  <div
                    hidden={this.state.hideConfirmInput}
                    className="form-group"
                  >
                    <label>Enter Auth code sent to {this.state.email}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="authcode"
                      onChange={this.onChange}
                      value={authcode}
                    />
                    <div hidden={!this.state.authcodeError}>
                      <p className="text-danger text-xs">
                        Authcode format incorrect
                      </p>
                    </div>
                  </div>
                  <div hidden={this.state.hidePasswordForm}>
                    <div className="form-group">
                      <input
                        placeholder="Create password"
                        type="password"
                        className="form-control"
                        name="password"
                        onChange={this.onChange}
                        value={password}
                      />
                      <div hidden={!this.state.passwordError}>
                        <p className="text-danger text-xs">
                          At least one upper case letter, At least one lower
                          case letter. <br /> At least one digit, At least one
                          special character. Minimum eight in length.
                        </p>
                      </div>
                    </div>
                    <div className="form-group">
                      <input
                        placeholder="Confirm password"
                        type="password"
                        className="form-control"
                        name="password2"
                        onChange={this.onChange}
                        value={password2}
                      />
                      <div hidden={!this.state.password2Error}>
                        <p className="text-danger text-xs">
                          At least one upper case letter, At least one lower
                          case letter. <br /> At least one digit, At least one
                          special character. Minimum eight in length.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="form-group text-center">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => this.prevStep()}
                    >
                      <FontAwesomeIcon icon={faAngleDoubleLeft} /> Back
                    </button>
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <button
                      hidden={this.state.hideValidateButton}
                      type="button"
                      className="btn btn-primary"
                      onClick={() => this.checkEmail()}
                    >
                      <span hidden={this.state.hideSpinner}>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      </span>{" "}
                      {this.state.finalPageInitialButtonText}
                    </button>
                    <button
                      hidden={this.state.hideVerifyButton}
                      disabled={this.state.disableVerifyButton}
                      type="button"
                      className="btn btn-primary"
                      onClick={this.continue3}
                    >
                      <span hidden={this.state.hideSpinner2}>
                        <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      </span>{" "}
                      {this.state.finalPageInitialButton2Text}
                    </button>
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <button
                      disabled={this.state.disableNextButton}
                      type="submit"
                      className="btn btn-primary"
                    >
                      Done
                    </button>
                  </div>
                  <p hidden={this.state.hideResend} className="text-center">
                    <strong>Didn't receive auth code?</strong>{" "}
                    <a
                      color="success"
                      style={{ cursor: "pointer" }}
                      onClick={this.resendCode}
                    >
                      {this.state.resend}
                    </a>
                  </p>
                </form>
                <div className="text-center">
                  <FontAwesomeIcon icon={faLock} /> Your data is secured
                </div>
              </div>
            </div>
            <footer>
              <b>
                Powered by{" "}
                <a
                  className="app-link"
                  target="_blank"
                  href="http://www.addosser.com/"
                >
                  Addoser Microfinance Bank
                </a>
              </b>
            </footer>
          </Fragment>
        );
    }
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  phoneNumber: state.regvalidate.phone_number,
  email: state.regvalidate.email,
  eauth: state.regvalidate.eauth,
  errors: state.errors.msg.status
});

export default connect(
  mapStateToProps,
  { register, createMessage, postEmail, postPhone, postAuth, postProfile }
)(Register);
