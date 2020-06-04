import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

var Logo = require("../../assets/vaultlogoAO.png");

export class Login extends Component {
  state = {
    phone_number: "",
    password: ""
  };

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };
  onSubmit = e => {
    e.preventDefault();
    this.props.login(this.state.phone_number, this.state.password);
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    const { phone_number, password } = this.state;

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
              <strong>Login</strong>
            </h2>
            <br />
            <br />
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <input
                  placeholder="Phone Number"
                  type="text"
                  className="form-control"
                  name="phone_number"
                  onChange={this.onChange}
                  value={phone_number}
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Password"
                  type="password"
                  className="form-control"
                  name="password"
                  onChange={this.onChange}
                  value={password}
                />
              </div>
              <div className="form-group text-center">
                <button type="submit" className="btn btn-primary btn-block">
                  Login
                </button>
              </div>
              <p className="text-center">
                Don't have an account?{" "}
                <Link className="app-link" to="/register">
                  Register
                </Link>
              </p>
              <p className="text-center">
                <Link className="app-link" to="/register">
                  Forgot Password?{" "}
                </Link>
              </p>
            </form>
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

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
